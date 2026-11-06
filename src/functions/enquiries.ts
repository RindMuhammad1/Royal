import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db, checkDbConnection } from "../db";
import { enquiries } from "../db/schema";
import { verifyAdminToken } from "../lib/auth";

// ============================================================================
// Public: submit contact form
// ============================================================================

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email.").max(255),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[0-9+()\-\s]*$/, "Phone number can only contain digits, spaces and + ( ) -")
    .optional()
    .or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  pickupDate: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(3000),
  // Honeypot: real users never see/fill this field.
  website: z.string().max(200).optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;

const submitAttempts = new Map<string, number[]>();
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;
const SUBMIT_MAX_PER_WINDOW = 5;

function tooManySubmissions(ip: string): boolean {
  const now = Date.now();
  const recent = (submitAttempts.get(ip) || []).filter((t) => now - t < SUBMIT_WINDOW_MS);
  if (recent.length >= SUBMIT_MAX_PER_WINDOW) {
    submitAttempts.set(ip, recent);
    return true;
  }
  recent.push(now);
  submitAttempts.set(ip, recent);
  if (submitAttempts.size > 5000) submitAttempts.clear();
  return false;
}

export const submitEnquiryFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const parsed = enquirySchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false as const, error: parsed.error.issues[0]?.message || "Invalid form data." };
    }
    return { ok: true as const, value: parsed.data };
  })
  .handler(async ({ data }) => {
    if (!data.ok) return { success: false, error: data.error };
    const v = data.value;

    // Silently accept bot submissions without storing them.
    if (v.website) return { success: true };

    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    let ip = "unknown";
    let ua = "";
    try {
      ip = getRequestIP({ xForwardedFor: true }) || "unknown";
      ua = getRequestHeader("user-agent") || "";
    } catch {
      // ignore
    }

    if (tooManySubmissions(ip)) {
      return {
        success: false,
        error: "Too many enquiries from your connection. Please contact us on WhatsApp instead.",
      };
    }

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      return {
        success: false,
        error: "We couldn't send your enquiry right now. Please contact us on WhatsApp.",
      };
    }

    try {
      await db.insert(enquiries).values({
        name: v.name,
        email: v.email,
        phone: v.phone || null,
        service: v.service || null,
        pickupDate: v.pickupDate || null,
        message: v.message,
        ipAddress: ip.slice(0, 64),
        userAgent: ua.slice(0, 255),
      });
      return { success: true };
    } catch (err) {
      console.error("Enquiry insert error:", err);
      return {
        success: false,
        error: "We couldn't send your enquiry right now. Please contact us on WhatsApp.",
      };
    }
  });

// ============================================================================
// Admin: list / update / delete enquiries
// ============================================================================

const STATUSES = ["new", "contacted", "closed"] as const;
type EnquiryStatus = (typeof STATUSES)[number];

async function requireAdmin(token: unknown) {
  const session = await verifyAdminToken(typeof token === "string" ? token : "");
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const getEnquiriesFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; status?: string; search?: string }) => ({
    token: String(input?.token || ""),
    status: STATUSES.includes(input?.status as EnquiryStatus) ? (input.status as EnquiryStatus) : undefined,
    search: typeof input?.search === "string" ? input.search.trim().slice(0, 100) : "",
  }))
  .handler(async ({ data }) => {
    await requireAdmin(data.token);

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      return { enquiries: [], counts: { new: 0, contacted: 0, closed: 0 }, error: "Database unavailable." };
    }

    try {
      const conditions = [];
      if (data.status) conditions.push(eq(enquiries.status, data.status));
      if (data.search) {
        const q = `%${data.search}%`;
        conditions.push(
          or(like(enquiries.name, q), like(enquiries.email, q), like(enquiries.phone, q), like(enquiries.message, q))
        );
      }

      const rows = await db
        .select({
          id: enquiries.id,
          name: enquiries.name,
          email: enquiries.email,
          phone: enquiries.phone,
          service: enquiries.service,
          pickupDate: enquiries.pickupDate,
          message: enquiries.message,
          status: enquiries.status,
          createdAt: enquiries.createdAt,
        })
        .from(enquiries)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(enquiries.createdAt))
        .limit(500);

      const countRows = await db
        .select({ status: enquiries.status, count: sql<number>`count(*)` })
        .from(enquiries)
        .groupBy(enquiries.status);
      const counts = { new: 0, contacted: 0, closed: 0 };
      for (const r of countRows) counts[r.status] = Number(r.count);

      return { enquiries: rows, counts };
    } catch (err) {
      console.error("Get enquiries error:", err);
      const msg = err instanceof Error ? err.message : "";
      return {
        enquiries: [],
        counts: { new: 0, contacted: 0, closed: 0 },
        error: /doesn't exist|ER_NO_SUCH_TABLE/i.test(msg)
          ? "The enquiries table is missing. Run drizzle/0001_enquiries.sql in phpMyAdmin."
          : "Failed to load enquiries.",
      };
    }
  });

export const updateEnquiryStatusFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; id: number; status: string }) => {
    if (!STATUSES.includes(input?.status as EnquiryStatus)) throw new Error("Invalid status");
    return { token: String(input.token || ""), id: Number(input.id), status: input.status as EnquiryStatus };
  })
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    if (!Number.isInteger(data.id) || data.id <= 0) return { success: false, error: "Invalid id" };
    try {
      await db.update(enquiries).set({ status: data.status }).where(eq(enquiries.id, data.id));
      return { success: true };
    } catch (err) {
      console.error("Update enquiry error:", err);
      return { success: false, error: "Failed to update enquiry." };
    }
  });

export const deleteEnquiryFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; id: number }) => ({
    token: String(input?.token || ""),
    id: Number(input?.id),
  }))
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    if (!Number.isInteger(data.id) || data.id <= 0) return { success: false, error: "Invalid id" };
    try {
      await db.delete(enquiries).where(eq(enquiries.id, data.id));
      return { success: true };
    } catch (err) {
      console.error("Delete enquiry error:", err);
      return { success: false, error: "Failed to delete enquiry." };
    }
  });

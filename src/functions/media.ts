import { createServerFn } from "@tanstack/react-start";
import { eq, desc, like } from "drizzle-orm";
import { db, checkDbConnection } from "../db";
import { mediaFiles } from "../db/schema";
import { verifyAdminToken } from "../lib/auth";

export const PRESET_ASSETS = [
  {
    name: "Dubai Skyline Sunset",
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    category: "Dubai",
  },
  {
    name: "Executive Chauffeur Greeting",
    url: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=80",
    category: "Chauffeur",
  },
  {
    name: "Sheikh Zayed Grand Mosque Abu Dhabi",
    url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=80",
    category: "Itinerary",
  },
  {
    name: "Mercedes-Benz Luxury Sedan",
    url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
    category: "Fleet",
  },
  {
    name: "Cadillac Escalade Luxury SUV",
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
    category: "Fleet",
  },
  {
    name: "Dubai Marina Night Drive",
    url: "https://images.unsplash.com/photo-1578895101407-a36c1b6973e2?auto=format&fit=crop&w=1600&q=80",
    category: "Dubai",
  },
  {
    name: "Sheikh Zayed Road Highway",
    url: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1600&q=80",
    category: "Dubai",
  },
];

export const uploadImageFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      token: string;
      filename: string;
      mimeType: string;
      base64Data: string;
      altText?: string;
    }) => input
  )
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const fs = await import("node:fs");
    const path = await import("node:path");

    const uploadDir = path.resolve(process.cwd(), "public/uploads/blog");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const { filename, mimeType, base64Data, altText } = data;

    // Extension is derived from the validated MIME type, never from the user's filename
    // (otherwise "x.html" / "x.svg" with mimeType image/png = stored XSS on our origin).
    const EXT_BY_MIME: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif",
      "image/gif": ".gif",
    };
    const ext = EXT_BY_MIME[String(mimeType || "").toLowerCase()];
    if (!ext) {
      return { success: false, error: "Only JPG, PNG, WebP, AVIF, and GIF files are allowed." };
    }

    const base64PrefixMatch = String(base64Data || "").match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const rawBase64 = base64PrefixMatch ? base64PrefixMatch[2] : String(base64Data || "");
    if (rawBase64.length > 12 * 1024 * 1024) {
      return { success: false, error: "Image size exceeds 8MB limit." };
    }
    const buffer = Buffer.from(rawBase64, "base64");

    if (buffer.length > 8 * 1024 * 1024) {
      return { success: false, error: "Image size exceeds 8MB limit." };
    }

    // Verify magic bytes actually match an image format.
    const hex = buffer.subarray(0, 12).toString("hex");
    const ascii = buffer.subarray(0, 12).toString("latin1");
    const looksLikeImage =
      hex.startsWith("ffd8ff") || // JPEG
      hex.startsWith("89504e470d0a1a0a") || // PNG
      ascii.startsWith("GIF87a") ||
      ascii.startsWith("GIF89a") ||
      (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") ||
      ascii.slice(4, 12).startsWith("ftypavi"); // AVIF
    if (!looksLikeImage) {
      return { success: false, error: "File content is not a valid image." };
    }

    const cleanBasename = path
      .basename(String(filename || "image"))
      .replace(/\.[^.]*$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40) || "image";
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanBasename}${ext}`;
    const targetPath = path.join(uploadDir, uniqueFilename);
    const publicUrl = `/uploads/blog/${uniqueFilename}`;

    await fs.promises.writeFile(targetPath, buffer);

    let recordId = 0;
    const dbStatus = await checkDbConnection();
    if (dbStatus.ok) {
      try {
        const [insertRes] = await db.insert(mediaFiles).values({
          filename: uniqueFilename,
          originalName: String(filename).slice(0, 255),
          filePath: publicUrl,
          mimeType,
          fileSize: buffer.length,
          altText: (altText || cleanBasename).slice(0, 255),
          uploaderId: session.adminId,
        });
        recordId = insertRes.insertId;
      } catch (err) {
        console.error("Failed to record media file in database:", err);
      }
    }

    return {
      success: true,
      url: publicUrl,
      id: recordId,
      filename: uniqueFilename,
    };
  });

export const getMediaFilesFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; search?: string }) => input)
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const fs = await import("node:fs");
    const path = await import("node:path");
    const uploadDir = path.resolve(process.cwd(), "public/uploads/blog");

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      try {
        if (!fs.existsSync(uploadDir)) {
          return { files: [], presets: PRESET_ASSETS };
        }
        const diskFiles = await fs.promises.readdir(uploadDir);
        const imageFiles = diskFiles
          .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
          .map((f, i) => ({
            id: i + 1,
            filename: f,
            originalName: f,
            filePath: `/uploads/blog/${f}`,
            mimeType: "image/jpeg",
            fileSize: 100000,
            altText: f,
            createdAt: new Date(),
          }));
        return { files: imageFiles, presets: PRESET_ASSETS };
      } catch {
        return { files: [], presets: PRESET_ASSETS };
      }
    }

    try {
      const condition = data.search ? like(mediaFiles.filename, `%${data.search}%`) : undefined;
      const files = await db
        .select()
        .from(mediaFiles)
        .where(condition)
        .orderBy(desc(mediaFiles.createdAt));

      return { files, presets: PRESET_ASSETS };
    } catch (err) {
      console.error("Error fetching media files:", err);
      return { files: [], presets: PRESET_ASSETS };
    }
  });

export const deleteMediaFileFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; id: number; filePath: string }) => input)
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const fs = await import("node:fs");
    const path = await import("node:path");
    const uploadDir = path.resolve(process.cwd(), "public/uploads/blog");

    try {
      const basename = path.basename(data.filePath);
      const fullPath = path.join(uploadDir, basename);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (err) {
      console.error("Failed to delete file from disk:", err);
    }

    const dbStatus = await checkDbConnection();
    if (dbStatus.ok && data.id) {
      try {
        await db.delete(mediaFiles).where(eq(mediaFiles.id, data.id));
      } catch (err) {
        console.error("Failed to delete media record:", err);
      }
    }

    return { success: true };
  });

import { loadEnv } from "./load-env";
import { webcrypto } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// No hardcoded fallback: a public default secret would let anyone forge admin tokens.
// Node 18 (common on cPanel) has no global `crypto`, which jose needs for signing.
function ensureWebCrypto() {
  if (!(globalThis as { crypto?: unknown }).crypto) {
    Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true, writable: true });
  }
}

function getJwtSecret(): Uint8Array {
  ensureWebCrypto();
  loadEnv();
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_JWT_SECRET is missing or shorter than 32 characters. Set it in .env or cPanel environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  adminId: number;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ["HS256"] });
    return {
      adminId: Number(payload.adminId),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch (err) {
    console.warn("[Auth Warning] JWT verification failed:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

import { createFileRoute } from "@tanstack/react-router";

// Deployment diagnostics for shared hosting. Shows only booleans / error codes — never secrets.
// Visit /api/health after deploying to confirm the new build is live and the DB works.
const BUILD_ID = "2026-11-06-v4";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const { loadEnv } = await import("../lib/load-env");
        loadEnv();
        const fs = await import("node:fs");
        const path = await import("node:path");

        const report: Record<string, unknown> = {
          build: BUILD_ID,
          node: process.version,
          nodeOk: Number(process.versions.node.split(".")[0]) >= 20,
          webCrypto: typeof (globalThis as { crypto?: { subtle?: unknown } }).crypto?.subtle === "object",
          cwd: process.cwd(),
          envFileInCwd: fs.existsSync(path.join(process.cwd(), ".env")),
          dbConfigLoaded: Boolean(process.env.DB_USER && process.env.DB_NAME) || Boolean(process.env.DATABASE_URL),
          jwtSecretOk: (process.env.ADMIN_JWT_SECRET || "").length >= 32,
        };

        try {
          const { pool } = await import("../db");
          const [rows] = await pool.query("SELECT COUNT(*) AS n FROM admins");
          report.db = "ok";
          report.adminCount = Number((rows as Array<{ n: number }>)[0]?.n ?? 0);
          const [cols] = await pool.query("SHOW COLUMNS FROM admins");
          report.adminColumns = (cols as Array<{ Field: string }>).map((c) => c.Field);
          const [hash] = await pool.query("SELECT LEFT(password_hash, 4) AS p, LENGTH(password_hash) AS l FROM admins LIMIT 1");
          const h = (hash as Array<{ p: string; l: number }>)[0];
          report.adminHashLooksBcrypt = h ? /^\$2[aby]\$/.test(h.p) && h.l === 60 : null;
          try {
            await pool.query("SELECT 1 FROM enquiries LIMIT 1");
            report.enquiriesTable = "ok";
          } catch (e) {
            report.enquiriesTable = String((e as { code?: string }).code || "missing");
          }
        } catch (e) {
          report.db = "error";
          report.dbErrorCode = String((e as { code?: string }).code || (e as Error).name || "UNKNOWN");
        }

        try {
          const { signAdminToken } = await import("../lib/auth");
          await signAdminToken({ adminId: 0, email: "x", name: "x", role: "test" });
          report.jwtSign = "ok";
        } catch (e) {
          report.jwtSign = "error: " + String((e as Error).message).slice(0, 80);
        }

        try {
          const bcrypt = (await import("bcryptjs")).default;
          report.bcrypt = (await bcrypt.compare("a", await bcrypt.hash("a", 4))) ? "ok" : "mismatch";
        } catch (e) {
          report.bcrypt = "error: " + String((e as Error).message).slice(0, 80);
        }

        return new Response(JSON.stringify(report, null, 2), {
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      },
    },
  },
});

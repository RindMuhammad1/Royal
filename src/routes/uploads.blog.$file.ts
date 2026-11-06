import { createFileRoute } from "@tanstack/react-router";

// Serves admin-uploaded images from <app root>/public/uploads/blog.
// The production server only serves the build-time .output/public folder, so files
// uploaded at runtime would otherwise 404 on shared hosting.
const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export const Route = createFileRoute("/uploads/blog/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fs = await import("node:fs");
        const path = await import("node:path");

        const name = path.basename(String(params.file || ""));
        const ext = path.extname(name).toLowerCase();
        const mime = MIME_BY_EXT[ext];
        if (!mime || name !== params.file || name.startsWith(".")) {
          return new Response("Not found", { status: 404 });
        }

        const filePath = path.join(process.cwd(), "public", "uploads", "blog", name);
        try {
          const buf = await fs.promises.readFile(filePath);
          return new Response(buf, {
            status: 200,
            headers: {
              "content-type": mime,
              "cache-control": "public, max-age=31536000, immutable",
              "x-content-type-options": "nosniff",
              "content-security-policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});

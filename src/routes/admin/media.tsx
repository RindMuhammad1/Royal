import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  UploadCloud,
  Copy,
  Trash2,
  Check,
  Search,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  uploadImageFn,
  getMediaFilesFn,
  deleteMediaFileFn,
  PRESET_ASSETS,
} from "@/functions/media";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [{ title: "Media Library | Royal Chauffeur Admin" }],
  }),
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFiles = () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";
    getMediaFilesFn({ data: { token, search } })
      .then((res) => {
        setFiles(res.files || []);
      })
      .catch((err) => {
        console.error("Failed to load media files:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";

      try {
        const res = await uploadImageFn({
          data: {
            token,
            filename: file.name,
            mimeType: file.type || "image/jpeg",
            base64Data,
          },
        });

        if (res.success && res.url) {
          toast.success("Image uploaded successfully!");
          fetchFiles();
        } else {
          toast.error(res.error || "Upload failed.");
        }
      } catch {
        toast.error("Upload failed.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (url: string) => {
    if (typeof window !== "undefined") {
      const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(url);
      toast.success("Image URL copied to clipboard!");
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const handleDelete = async (id: number, filePath: string) => {
    if (!confirm("Are you sure you want to delete this media file?")) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";

    try {
      const res = await deleteMediaFileFn({ data: { token, id, filePath } });
      if (res.success) {
        toast.success("File deleted.");
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        toast.error("Failed to delete file.");
      }
    } catch {
      toast.error("Error deleting file.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Media Library
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage high-resolution photography for blog articles and vehicle showcases.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="rounded-3xl border-2 border-dashed border-border bg-card p-8 sm:p-12 text-center relative overflow-hidden shadow-sm hover:border-brand/80 transition group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center text-brand mb-4 group-hover:scale-110 transition">
            <UploadCloud className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {uploading ? "Uploading Image to Server..." : "Upload New Photography"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop images here or browse from your computer (JPG, PNG, WebP, AVIF up to 8MB).
          </p>
        </div>
      </div>

      {/* Uploaded Files Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Uploaded Media ({files.length})
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchFiles();
            }}
            className="relative flex items-center w-64"
          >
            <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search filename..."
              className="w-full rounded-xl border border-border bg-card pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
            />
          </form>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card text-xs text-muted-foreground">
            No uploaded images found. Upload your first photo above!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--ink)]">
                  <img
                    src={file.filePath}
                    alt={file.altText || ""}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-foreground truncate" title={file.filename}>
                    {file.originalName || file.filename}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {Math.round((file.fileSize || 0) / 1024)} KB
                  </div>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(file.filePath)}
                      title="Copy URL"
                      className="p-1 rounded text-muted-foreground hover:text-brand transition"
                    >
                      {copiedUrl === file.filePath ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={file.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Full Size"
                      className="p-1 rounded text-muted-foreground hover:text-brand transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(file.id, file.filePath)}
                      title="Delete File"
                      className="p-1 rounded text-muted-foreground hover:text-red-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Royal Chauffeur Preset Assets */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" /> Royal Chauffeur UAE Asset Gallery
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pre-curated luxury vehicles and UAE landmarks ready for instant use in articles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {PRESET_ASSETS.map((preset, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--ink)]">
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-brand font-medium">{preset.category}</div>
                </div>
                <button
                  onClick={() => handleCopy(preset.url)}
                  className="p-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition"
                  title="Copy Image URL"
                >
                  {copiedUrl === preset.url ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

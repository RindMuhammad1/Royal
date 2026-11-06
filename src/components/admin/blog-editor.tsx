import { useState, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { marked } from "marked";
import {
  Save,
  Eye,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Car,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  UploadCloud,
  Check,
  Search,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { saveBlogPostFn, getBlogCategoriesFn } from "@/functions/blog";
import { uploadImageFn, getMediaFilesFn, PRESET_ASSETS } from "@/functions/media";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BlogEditorProps {
  initialData?: {
    id?: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    categoryId?: number | null;
    status: "draft" | "published" | "archived";
    featured?: boolean;
    keyTakeaways?: string | null;
    faqs?: Array<{ question: string; answer: string }> | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  };
  categories: Array<{ id: number; name: string; slug: string }>;
}

export function BlogEditor({ initialData, categories }: BlogEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.categoryId || null);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(
    initialData?.content ||
      `## Introduction\n\nDubai is renowned for its world-class luxury standards. Traveling in a chauffeured vehicle ensures your journey is relaxing, punctual, and distinguished.\n\n## Why Choose Royal Chauffeur UAE\n\n- **Punctuality**: Guaranteed on-time arrival.\n- **Luxury Fleet**: Mercedes-Benz, BMW, and Cadillac Escalade.\n- **Discretion**: Certified professional drivers.\n`
  );
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    initialData?.status || "draft"
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");

  // Key takeaways state
  const [takeaways, setTakeaways] = useState<string[]>(() => {
    if (!initialData?.keyTakeaways) return [""];
    try {
      const parsed = JSON.parse(initialData.keyTakeaways);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch {
      return initialData.keyTakeaways.split("\n").filter(Boolean);
    }
  });

  // FAQs state
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    initialData?.faqs && Array.isArray(initialData.faqs) && initialData.faqs.length > 0
      ? initialData.faqs
      : [{ question: "", answer: "" }]
  );

  // Tab & Editor modes
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [saving, setSaving] = useState(false);

  // Media Library Dialog State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalMode, setMediaModalMode] = useState<"cover" | "insert">("cover");
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");

  // Slug auto-generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData?.id && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Open Media Library Modal
  const openMediaModal = (mode: "cover" | "insert") => {
    setMediaModalMode(mode);
    setMediaModalOpen(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";
    getMediaFilesFn({ data: { token } })
      .then((res) => {
        setMediaFiles(res.files || []);
      })
      .catch(console.error);
  };

  // Upload file handler
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
          if (mediaModalMode === "cover") {
            setCoverImage(res.url);
          } else {
            insertTextAtCursor(`\n![${file.name}](${res.url})\n`);
          }
          setMediaModalOpen(false);
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

  // Insert markdown helper
  const insertTextAtCursor = (textToInsert: string) => {
    setContent((prev) => prev + textToInsert);
  };

  // Save handler
  const handleSave = async (targetStatus?: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Please provide an article title.");
      return;
    }

    const currentStatus = targetStatus || status;
    setSaving(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";

    const cleanTakeaways = takeaways.map((t) => t.trim()).filter(Boolean);
    const cleanFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());

    try {
      const res = await saveBlogPostFn({
        data: {
          token,
          id: initialData?.id,
          post: {
            title,
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            excerpt,
            content,
            coverImage,
            categoryId,
            status: currentStatus,
            featured,
            keyTakeaways: cleanTakeaways.length > 0 ? JSON.stringify(cleanTakeaways) : undefined,
            faqs: cleanFaqs.length > 0 ? cleanFaqs : undefined,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt,
            metaKeywords,
          },
        },
      });

      if (res.success) {
        toast.success(
          currentStatus === "published"
            ? "Article published successfully!"
            : "Draft saved successfully!"
        );
        router.navigate({ to: "/admin/blogs" });
      } else {
        toast.error(res.error || "Failed to save article.");
      }
    } catch {
      toast.error("An error occurred while saving the article.");
    } finally {
      setSaving(false);
    }
  };

  const previewHtml = useMemo(() => marked.parse(content || "") as string, [content]);

  return (
    <div className="space-y-8 pb-20">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {initialData?.id ? "Edit Article" : "Write New Article"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Compose rich markdown stories, embed luxury fleet photos, and preview SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="rounded-xl bg-brand text-[var(--ink)] font-bold text-xs px-5 py-2.5 hover:bg-brand/90 transition shadow-sm inline-flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" /> Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Main Form & Markdown Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Dubai Airport Chauffeur Transfers: Complete VIP Guide"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-display text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                URL Slug
              </label>
              <div className="flex items-center rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-mono text-muted-foreground">
                <span>/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug"
                  className="w-full bg-transparent pl-1 font-mono text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Excerpt (Summary)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief 1-2 sentence teaser for cards and search results..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Editor Toolbar */}
            <div className="p-3 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("**bold**")}
                  title="Bold"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("*italic*")}
                  title="Italic"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <span className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("\n## Heading 2\n")}
                  title="Heading 2"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("\n### Heading 3\n")}
                  title="Heading 3"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Heading3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("\n> Blockquote\n")}
                  title="Quote"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("\n- List item\n")}
                  title="Bullet List"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <List className="h-4 w-4" />
                </button>
                <span className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => openMediaModal("insert")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted text-xs font-semibold text-foreground hover:text-brand"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-brand" /> Insert Image
                </button>
              </div>

              {/* Mode Switcher: Edit vs Live Preview */}
              <div className="flex items-center rounded-xl bg-muted p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("editor")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
                    activeTab === "editor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
                    activeTab === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Live Preview
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            {activeTab === "editor" ? (
              <textarea
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article in Markdown..."
                className="w-full p-5 font-mono text-xs sm:text-sm text-foreground bg-background placeholder:text-muted-foreground/40 focus:outline-none resize-y min-h-[380px]"
              />
            ) : (
              <div
                className="p-8 prose prose-neutral dark:prose-invert max-w-none min-h-[380px] bg-background
                  prose-headings:font-display prose-headings:text-foreground
                  prose-h2:text-2xl prose-h3:text-xl
                  prose-blockquote:border-l-brand prose-blockquote:border-l-4 prose-blockquote:italic
                  prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>

          {/* Key Takeaways Builder */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand" /> Key Takeaways (Executive Summary)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quick summary bullets highlighted at the top of the article.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTakeaways([...takeaways, ""])}
                className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground hover:text-brand"
              >
                <Plus className="h-3.5 w-3.5" /> Add Point
              </button>
            </div>

            <div className="space-y-2.5">
              {takeaways.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const updated = [...takeaways];
                      updated[idx] = e.target.value;
                      setTakeaways(updated);
                    }}
                    placeholder={`Key takeaway #${idx + 1}...`}
                    className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-brand focus:outline-none"
                  />
                  {takeaways.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTakeaways(takeaways.filter((_, i) => i !== idx))}
                      className="p-2 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Items Builder */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-brand" /> FAQ Accordion (with Google Schema)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Questions and answers automatically formatted into Google FAQPage rich snippets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground hover:text-brand"
              >
                <Plus className="h-3.5 w-3.5" /> Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Question {idx + 1}</span>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-red-500 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].question = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="e.g. How far in advance should I book my Dubai airport chauffeur?"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-brand focus:outline-none font-medium"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Clear, authoritative answer..."
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:border-brand focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Publishing Settings & Media Pickers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publish Controls */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">Publishing Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
              >
                <option value="draft">Draft (Hidden from public)</option>
                <option value="published">Published (Live on site)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Category
              </label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold text-foreground focus:border-brand focus:outline-none"
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-foreground">Feature on Homepage</span>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded text-brand focus:ring-brand"
              />
            </div>
          </div>

          {/* Cover Image Selector */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">Cover Image</h3>

            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-border aspect-[16/9] bg-[var(--ink)]">
                <img src={coverImage} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/90 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => openMediaModal("cover")}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-brand hover:bg-muted/40 transition"
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-60" />
                <div className="text-xs font-bold text-foreground">Choose Cover Image</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Upload custom photo or pick from presets
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => openMediaModal("cover")}
              className="w-full rounded-xl border border-border bg-muted/60 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition flex items-center justify-center gap-1.5"
            >
              <ImageIcon className="h-3.5 w-3.5 text-brand" /> Browse Media & Presets
            </button>
          </div>

          {/* Google & WhatsApp SEO Simulator */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">SEO Snippet Preview</h3>

            {/* Google Search Simulator */}
            <div className="rounded-xl border border-border/80 bg-white p-4 text-left shadow-sm space-y-1">
              <div className="text-[11px] text-[#202124] flex items-center gap-1 truncate">
                <span className="font-medium">royalchauffeur.ae</span>
                <span>›</span>
                <span className="text-[#5f6368]">blog › {slug || "article"}</span>
              </div>
              <div className="text-sm font-semibold text-[#1a0dab] line-clamp-1">
                {metaTitle || title || "Article Headline — Royal Chauffeur UAE"}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || "Article description preview snippet for search engines..."}
              </div>
            </div>

            {/* SEO Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title}
                  className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt}
                  className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-brand focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Dialog */}
      <Dialog open={mediaModalOpen} onOpenChange={setMediaModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {mediaModalMode === "cover" ? "Select Cover Image" : "Insert Image into Article"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Direct Upload Box */}
            <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center bg-muted/20 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud className="h-8 w-8 text-brand mx-auto mb-2" />
              <div className="text-xs font-bold text-foreground">
                {uploading ? "Uploading..." : "Click or Drag & Drop Image Here"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Supports JPG, PNG, WebP up to 8MB
              </div>
            </div>

            {/* Presets and Uploaded Gallery */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Royal Fleet & Dubai Presets
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_ASSETS.map((preset, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (mediaModalMode === "cover") {
                        setCoverImage(preset.url);
                      } else {
                        insertTextAtCursor(`\n![${preset.name}](${preset.url})\n`);
                      }
                      setMediaModalOpen(false);
                    }}
                    className="group relative rounded-xl overflow-hidden aspect-[16/10] bg-[var(--ink)] cursor-pointer border border-border hover:border-brand shadow-sm"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[11px] font-semibold text-white truncate">
                        {preset.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

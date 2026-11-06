import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { marked } from "marked";
import {
  Clock,
  Calendar,
  User,
  Share2,
  Check,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Car,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getBlogPostBySlugFn, incrementBlogPostViewsFn } from "@/functions/blog";
import { SiteHeader, SiteFooter, FloatingWhatsApp } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const WHATSAPP = "https://wa.me/971551988793";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const res = await getBlogPostBySlugFn({ data: { slug: params.slug } });
    if (!res || !res.post) {
      throw notFound();
    }
    return res;
  },
  head: ({ loaderData }) => {
    if (!loaderData || !loaderData.post) {
      return {
        meta: [
          { title: "Article Not Found | Royal Chauffeur UAE" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { post } = loaderData;
    const title = post.metaTitle || `${post.title} — Royal Chauffeur UAE`;
    const desc = post.metaDescription || post.excerpt || "";
    const cover = post.coverImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c";

    // JSON-LD Structured Data
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: desc,
      image: [cover],
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      author: {
        "@type": "Organization",
        name: post.authorName || "Royal Chauffeur UAE",
        url: "https://royalchauffeur.ae",
      },
      publisher: {
        "@type": "Organization",
        name: "Royal Chauffeur UAE",
        logo: {
          "@type": "ImageObject",
          url: "https://royalchauffeur.ae/royal-chauffeur-logo.jpg",
        },
      },
    };

    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify(articleSchema),
      },
    ];

    if (post.faqs && Array.isArray(post.faqs) && post.faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(faqSchema),
      });
    }

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: cover },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: cover },
      ],
      scripts,
    };
  },
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { post, related } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Increment view counter once on load
  useEffect(() => {
    incrementBlogPostViewsFn({ data: { slug: post.slug } });
  }, [post.slug]);

  // Track scroll percentage for the reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse Markdown HTML
  const contentHtml = useMemo(() => {
    return marked.parse(post.content || "") as string;
  }, [post.content]);

  // Extract Table of Contents headings from markdown
  const tableOfContents = useMemo(() => {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const lines = (post.content || "").split("\n");

    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const text = h2Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        headings.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        headings.push({ id, text, level: 3 });
      }
    }
    return headings;
  }, [post.content]);

  // Parse Key Takeaways
  const parsedTakeaways: string[] = useMemo(() => {
    if (!post.keyTakeaways) return [];
    try {
      const parsed = JSON.parse(post.keyTakeaways);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Split by newlines if plain text bullets
      return post.keyTakeaways
        .split("\n")
        .map((s) => s.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean);
    }
    return [];
  }, [post.keyTakeaways]);

  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappShareText = encodeURIComponent(
    `Check out this article from Royal Chauffeur UAE: "${post.title}" - ${articleUrl}`
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-brand z-50 transition-all duration-75 ease-out shadow-[0_0_10px_var(--color-brand)]"
        style={{ width: `${scrollProgress}%` }}
      />

      <SiteHeader />

      {/* Breadcrumb Header */}
      <div className="border-b border-border bg-muted/40 py-3.5">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/" className="hover:text-brand transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link to="/blog" className="hover:text-brand transition-colors">
              Blog
            </Link>
            {post.categoryName && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span className="text-foreground font-medium truncate">{post.categoryName}</span>
              </>
            )}
          </div>
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
          </Link>
        </div>
      </div>

      {/* Article Hero */}
      <header className="relative bg-[var(--ink)] text-white pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {post.categoryName && (
              <span className="rounded-full bg-brand/20 border border-brand/40 px-3.5 py-1 font-bold text-brand uppercase tracking-wider">
                {post.categoryName}
              </span>
            )}
            <span className="flex items-center gap-1 text-white/70">
              <Clock className="h-3.5 w-3.5" /> {post.readTime || "5 min read"}
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1 text-white/70">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Published"}
            </span>
          </div>

          <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Author and Social Share Strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center text-brand font-bold text-sm">
                RC
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {post.authorName || "Royal Chauffeur UAE"}
                </div>
                <div className="text-[11px] text-white/60">Verified Luxury Travel Editorial</div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-110 transition"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs text-white transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.coverImage && (
        <div className="mx-auto max-w-5xl px-6 -mt-8 sm:-mt-12 relative z-20">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[16/9] max-h-[500px] bg-[var(--ink)]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body + Sticky Sidebar Layout */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <main className="lg:col-span-8 space-y-12">
            {/* Executive Summary / Key Takeaways Box */}
            {parsedTakeaways.length > 0 && (
              <div className="rounded-2xl border border-brand/40 bg-gradient-to-br from-amber-50/50 via-card to-card p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-brand mb-4">
                  <Sparkles className="h-4 w-4 text-brand" />
                  Executive Summary & Key Takeaways
                </div>
                <ul className="space-y-3">
                  {parsedTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="h-5 w-5 shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center font-bold text-xs mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Rendered Content */}
            <article
              className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none 
                prose-headings:font-display prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pt-4 prose-h2:border-t prose-h2:border-border/60
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:my-5
                prose-li:text-foreground/85 prose-li:my-1.5
                prose-strong:text-foreground prose-strong:font-bold
                prose-blockquote:border-l-brand prose-blockquote:border-l-4 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-foreground/90
                prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-border"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Contextual Luxury Chauffeur Booking Card */}
            <div className="rounded-2xl border border-brand/40 bg-[var(--ink)] text-white p-7 sm:p-9 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-brand/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand/20 border border-brand/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand mb-3">
                  <Car className="h-3.5 w-3.5 text-brand" />
                  Royal Chauffeur UAE
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Need a private luxury chauffeur for your trip?
                </h3>
                <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-xl">
                  Reserve your Mercedes S-Class, BMW 7 Series, or Cadillac Escalade with an RTA-certified driver. Punctual, discreet, and available 24/7 across Dubai, Abu Dhabi, and all Emirates.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={`${WHATSAPP}?text=Hello%20Royal%20Chauffeur,%20I%20am%20inquiry%20from%20your%20article:%20${encodeURIComponent(
                      post.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-xs font-bold hover:scale-105 active:scale-95 transition"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Book on WhatsApp
                  </a>
                  <Link
                    to="/"
                    hash="fleet"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
                  >
                    Explore Our Fleet
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            {post.faqs && Array.isArray(post.faqs) && post.faqs.length > 0 && (
              <section className="pt-8 border-t border-border">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {post.faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-border bg-card overflow-hidden transition"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:text-brand transition"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${
                              isOpen ? "rotate-180 text-brand" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Article Footer Share Strip */}
            <div className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                Enjoyed this guide? Share it with colleagues or travelers:
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${whatsappShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2 text-xs font-bold hover:scale-105 transition"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" /> Share on WhatsApp
                </a>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
                  {copied ? "Link Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          </main>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Table of Contents Widget */}
            {tableOfContents.length > 0 && (
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h4 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand" /> Table of Contents
                </h4>
                <nav className="space-y-2 text-xs">
                  {tableOfContents.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      className={`block py-1 text-muted-foreground hover:text-brand transition-colors ${
                        item.level === 3 ? "pl-4 text-[11px]" : "font-medium"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand text-[var(--ink)] font-bold text-xs py-3 hover:bg-brand/90 transition shadow-sm"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Quick Inquiry on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Articles Section */}
        {related && related.length > 0 && (
          <section className="mt-24 pt-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand font-bold">Recommended</span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-1">Related Articles</h3>
              </div>
              <Link to="/blog" className="text-xs font-bold text-brand hover:underline">
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel) => (
                <article
                  key={rel.id}
                  className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative h-44 overflow-hidden bg-[var(--ink)]">
                    <img
                      src={rel.coverImage || "https://images.unsplash.com/photo-1546412414-e1885259563a"}
                      alt={rel.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[11px] font-semibold text-brand uppercase tracking-wider mb-2">
                      {rel.categoryName || "Travel"}
                    </div>
                    <h4 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-brand transition-colors line-clamp-2">
                      <Link to="/blog/$slug" params={{ slug: rel.slug }}>
                        {rel.title}
                      </Link>
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}

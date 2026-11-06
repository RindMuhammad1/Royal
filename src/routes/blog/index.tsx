import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Clock, Calendar, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { getPublishedBlogPostsFn, getBlogCategoriesFn } from "@/functions/blog";
import { SiteHeader, SiteFooter, FloatingWhatsApp } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const WHATSAPP = "https://wa.me/971551988793";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const [postsRes, categoriesRes] = await Promise.all([
      getPublishedBlogPostsFn({ data: {} }),
      getBlogCategoriesFn(),
    ]);
    return {
      posts: postsRes.posts,
      categories: categoriesRes.categories,
      isFallback: postsRes.isFallback,
    };
  },
  head: () => {
    const title = "Luxury Chauffeur & Dubai Travel Journal | Royal Chauffeur UAE";
    const desc =
      "Expert insights on VIP chauffeur services, airport transfers (DXB/DWC), executive travel, and luxury itineraries across Dubai and the UAE.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { posts, categories } = Route.useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.categorySlug === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return filteredPosts.find((p) => p.featured) || filteredPosts[0];
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--ink)] text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[var(--ink)] to-[var(--ink)]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-black/40 backdrop-blur px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-brand font-bold mb-6">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            The Royal Journal
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight max-w-3xl leading-[1.08]">
            Luxury Travel, Fleet Insights & <br />
            <span className="text-brand italic">Dubai Chauffeur Guides</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
            Curated articles on executive travel standards, airport logistics, bespoke itineraries, and the art of luxury private chauffeur service across the United Arab Emirates.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles (e.g., Airport Transfer, Mercedes S-Class, Abu Dhabi)..."
                className="w-full rounded-full border border-white/20 bg-white/10 backdrop-blur pl-12 pr-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs text-white/50 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Pills */}
      <section className="sticky top-20 z-30 bg-background/95 backdrop-blur border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-[var(--ink)] text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              All Articles ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-brand text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat.name} ({cat.postCount || 0})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-border p-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl text-foreground font-semibold">No articles found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try selecting another category or clearing your search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand/90 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post Card */}
            {featuredPost && (
              <article className="group relative rounded-3xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[var(--ink)]">
                    <img
                      src={featuredPost.coverImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80"}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)]/85 backdrop-blur px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand border border-brand/30">
                      <Sparkles className="h-3 w-3" />
                      Featured Story
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-block font-semibold text-brand uppercase tracking-wider">
                          {featuredPost.categoryName || "Travel Guide"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredPost.readTime || "5 min read"}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-2xl sm:text-3xl text-foreground font-bold tracking-tight leading-snug group-hover:text-brand transition-colors">
                        <Link to="/blog/$slug" params={{ slug: featuredPost.slug }}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        By {featuredPost.authorName || "Royal Chauffeur UAE"}
                      </span>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: featuredPost.slug }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand group-hover:translate-x-1 transition-transform"
                      >
                        Read Full Article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Grid of Other Articles */}
            {gridPosts.length > 0 && (
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-8">
                  {selectedCategory === "all" ? "Latest Articles" : "More in this Category"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-56 overflow-hidden bg-[var(--ink)]">
                        <img
                          src={post.coverImage || "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {post.categoryName && (
                          <div className="absolute top-3 left-3 rounded-full bg-[var(--ink)]/85 backdrop-blur px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand border border-brand/30">
                            {post.categoryName}
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Recent"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime || "5 min read"}
                            </span>
                          </div>

                          <h4 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-brand transition-colors line-clamp-2">
                            <Link to="/blog/$slug" params={{ slug: post.slug }}>
                              {post.title}
                            </Link>
                          </h4>

                          <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">
                            {post.authorName || "Royal Chauffeur"}
                          </span>
                          <Link
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand group-hover:translate-x-0.5 transition-transform"
                          >
                            Read Article <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* High-Conversion WhatsApp Booking Banner */}
        <section className="mt-24 rounded-3xl bg-[var(--ink)] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-brand/30">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl">
            <span className="text-xs uppercase tracking-[0.28em] text-brand font-bold">
              Private Executive Chauffeur
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Experience Dubai with a Dedicated Private Chauffeur
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed">
              Arrive at meetings in an immaculate Mercedes S-Class, explore Dubai and Abu Dhabi in a Cadillac Escalade, or arrange stress-free airport transfers with flight tracking.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] text-white px-7 py-3.5 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Book via WhatsApp
              </a>
              <Link
                to="/"
                hash="fleet"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition"
              >
                View Vehicle Fleet
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}

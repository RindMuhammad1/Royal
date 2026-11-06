import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  FolderTree,
  PlusCircle,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getAdminDashboardStatsFn } from "@/functions/blog";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Royal Chauffeur UAE" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalCategories: number;
    recentPosts: Array<{
      id: number;
      title: string;
      slug: string;
      status: string;
      viewsCount: number;
      createdAt: string | Date;
      categoryName?: string | null;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";
    if (!token) {
      setLoading(false);
      return;
    }

    getAdminDashboardStatsFn({ data: { token } })
      .then((res) => {
        setStats(res);
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats:", err);
        if (String(err).includes("Unauthorized")) {
          localStorage.removeItem("royal_admin_token");
          window.location.href = "/admin/login";
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Articles",
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Published",
      value: stats?.publishedPosts || 0,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Drafts",
      value: stats?.draftPosts || 0,
      icon: Clock,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Article Reads",
      value: stats?.totalViews || 0,
      icon: Eye,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Categories",
      value: stats?.totalCategories || 0,
      icon: FolderTree,
      color: "text-brand bg-brand/10 border-brand/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            CMS Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage articles, media assets, and SEO performance for Royal Chauffeur UAE.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand text-[var(--ink)] font-bold text-xs px-5 py-3 hover:bg-brand/90 transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" /> New Article
          </Link>
          <Link
            to="/admin/media"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <ImageIcon className="h-4 w-4 text-brand" /> Media
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{card.title}</span>
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 font-display text-2xl sm:text-3xl font-bold text-foreground">
                {card.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Posts Table */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">Recent Articles</h2>
            <Link
              to="/admin/blogs"
              className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border overflow-x-auto">
            {stats?.recentPosts && stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-muted/40 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {post.status}
                      </span>
                      {post.categoryName && (
                        <span className="text-xs text-muted-foreground truncate">
                          • {post.categoryName}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-sm font-semibold text-foreground truncate">
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" /> {post.viewsCount || 0}
                    </span>
                    <Link
                      to="/admin/blogs/$id"
                      params={{ id: String(post.id) }}
                      className="rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-brand hover:text-brand transition"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No articles found. Click "New Article" to create your first post!
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-brand/40 bg-[var(--ink)] text-white p-6 shadow-md relative overflow-hidden">
            <span className="text-[11px] uppercase tracking-widest text-brand font-bold">
              Content Marketing
            </span>
            <h3 className="font-display text-xl font-bold mt-2">Publish Chauffeur Story</h3>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Write luxury fleet spotlights or airport travel guides with rich media, SEO schema, and WhatsApp conversion prompts.
            </p>
            <Link
              to="/admin/blogs/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand text-[var(--ink)] font-bold text-xs px-5 py-2.5 hover:bg-brand/90 transition shadow-sm"
            >
              Start Writing <PlusCircle className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-foreground">Media Management</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Upload custom photography or pick from high-res Mercedes, Cadillac, and Dubai skyline presets.
            </p>
            <Link
              to="/admin/media"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
            >
              Open Media Library →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminBlogPostsFn, deleteBlogPostFn } from "@/functions/blog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/blogs/")({
  head: () => ({
    meta: [{ title: "Manage Articles | Royal Chauffeur Admin" }],
  }),
  component: AdminBlogsListPage,
});

function AdminBlogsListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const fetchPosts = () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";
    getAdminBlogPostsFn({ data: { token, status: statusFilter, search } })
      .then((res) => {
        setPosts(res.posts || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load articles.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";

    try {
      const res = await deleteBlogPostFn({ data: { token, id: deleteTarget.id } });
      if (res.success) {
        toast.success(`"${deleteTarget.title}" deleted.`);
        setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      } else {
        toast.error("Failed to delete post.");
      }
    } catch {
      toast.error("Error deleting post.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Blog Articles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, preview, and organize articles published to the Royal Journal.
          </p>
        </div>

        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand text-[var(--ink)] font-bold text-xs px-5 py-3 hover:bg-brand/90 transition shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Create New Article
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "published", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition ${
                statusFilter === tab
                  ? "bg-[var(--ink)] text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All Articles" : `${tab}s`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center min-w-[280px]">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-xl border border-border bg-muted/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
          />
        </form>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-sm text-muted-foreground">
            No articles match the current filter. Click "Create New Article" to write one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 pl-6">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reads</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            post.coverImage ||
                            "https://images.unsplash.com/photo-1546412414-e1885259563a?w=100"
                          }
                          alt=""
                          className="h-12 w-16 rounded-lg object-cover bg-[var(--ink)] shrink-0 border border-border"
                        />
                        <div className="min-w-0 max-w-md">
                          <div className="font-semibold text-foreground text-sm truncate flex items-center gap-2">
                            {post.featured && (
                              <span className="text-brand shrink-0" title="Featured Post">
                                <Sparkles className="h-3.5 w-3.5" />
                              </span>
                            )}
                            {post.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                            /blog/{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-foreground whitespace-nowrap">
                      {post.categoryName || "Uncategorized"}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap font-medium text-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        {post.viewsCount || 0}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-muted-foreground">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Draft"}
                    </td>

                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.status === "published" && (
                          <Link
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            target="_blank"
                            title="View Live Article"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-muted transition"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          to="/admin/blogs/$id"
                          params={{ id: String(post.id) }}
                          title="Edit Article"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-muted transition"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: post.id, title: post.title })}
                          title="Delete Article"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the article{" "}
              <strong className="text-foreground">"{deleteTarget?.title}"</strong> and remove it from
              the public website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Delete Article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

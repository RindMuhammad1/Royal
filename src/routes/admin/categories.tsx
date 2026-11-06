import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FolderTree, Plus, Edit, Trash2, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { getBlogCategoriesFn, manageCategoriesFn } from "@/functions/blog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Manage Categories | Royal Chauffeur Admin" }],
  }),
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    getBlogCategoriesFn()
      .then((res) => {
        setCategories(res.categories || []);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";

    try {
      const res = await manageCategoriesFn({
        data: {
          token,
          action: editingCategory ? "update" : "create",
          data: {
            id: editingCategory?.id,
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description,
          },
        },
      });

      if (res.success) {
        toast.success(editingCategory ? "Category updated." : "Category created.");
        setModalOpen(false);
        fetchCategories();
      } else {
        toast.error(res.error || "Operation failed.");
      }
    } catch {
      toast.error("Failed to process category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: any) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";

    try {
      const res = await manageCategoriesFn({
        data: {
          token,
          action: "delete",
          data: { id: cat.id },
        },
      });

      if (res.success) {
        toast.success("Category deleted.");
        fetchCategories();
      } else {
        toast.error(res.error || "Failed to delete category.");
      }
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize articles into thematic hubs (Dubai Itineraries, Luxury Fleet, Corporate, Airport).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-brand text-[var(--ink)] font-bold text-xs px-5 py-3 hover:bg-brand/90 transition shadow-sm self-start sm:self-auto"
        >
          <FolderPlus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-sm text-muted-foreground">
            No categories found. Click "Add Category" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 pl-6">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Articles</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition">
                    <td className="p-4 pl-6 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <FolderTree className="h-4 w-4 text-brand shrink-0" />
                        <span>{cat.name}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-muted-foreground">{cat.slug}</td>

                    <td className="p-4 text-muted-foreground max-w-xs truncate">
                      {cat.description || "—"}
                    </td>

                    <td className="p-4 whitespace-nowrap font-medium text-foreground">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold">
                        {cat.postCount || 0}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          title="Edit Category"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-muted transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          title="Delete Category"
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

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                placeholder="e.g. VIP Airport Transfers"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="vip-airport-transfers"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-mono text-foreground focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what articles belong in this category..."
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-brand focus:outline-none resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-border bg-muted/60 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-brand text-[var(--ink)] px-5 py-2 text-xs font-bold hover:bg-brand/90 transition shadow-sm"
              >
                {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

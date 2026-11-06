import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BlogEditor } from "@/components/admin/blog-editor";
import { getAdminBlogPostByIdFn, getBlogCategoriesFn } from "@/functions/blog";

export const Route = createFileRoute("/admin/blogs/$id")({
  loader: async () => {
    const categoriesRes = await getBlogCategoriesFn();
    return { categories: categoriesRes.categories || [] };
  },
  head: () => ({
    meta: [{ title: "Edit Article | Royal Chauffeur Admin" }],
  }),
  component: EditBlogArticlePage,
});

function EditBlogArticlePage() {
  const { id } = Route.useParams();
  const { categories } = Route.useLoaderData();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";
    getAdminBlogPostByIdFn({ data: { token, id: Number(id) } })
      .then((res) => {
        setPost(res.post);
      })
      .catch((err) => {
        console.error("Failed to load post by id:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Article not found or you do not have permission to view it.
      </div>
    );
  }

  return <BlogEditor initialData={post} categories={categories} />;
}

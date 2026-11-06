import { createFileRoute } from "@tanstack/react-router";
import { BlogEditor } from "@/components/admin/blog-editor";
import { getBlogCategoriesFn } from "@/functions/blog";

export const Route = createFileRoute("/admin/blogs/new")({
  loader: async () => {
    const categoriesRes = await getBlogCategoriesFn();
    return { categories: categoriesRes.categories || [] };
  },
  head: () => ({
    meta: [{ title: "Write New Article | Royal Chauffeur Admin" }],
  }),
  component: NewBlogArticlePage,
});

function NewBlogArticlePage() {
  const { categories } = Route.useLoaderData();
  return <BlogEditor categories={categories} />;
}

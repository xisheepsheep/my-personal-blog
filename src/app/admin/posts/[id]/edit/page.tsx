import { notFound, redirect } from "next/navigation";

import { PostForm } from "@/components/blog/post-form";
import { getCategories, getPostById, getTags } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase";

export const metadata = { title: "编辑文章" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) redirect(`/admin/login?reason=${admin.status}`);
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([getPostById(id), getCategories(), getTags()]);
  if (!post) notFound();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">编辑文章</h1>
      <PostForm categories={categories} post={post} tags={tags} />
    </div>
  );
}

import { redirect } from "next/navigation";

import { PostForm } from "@/components/blog/post-form";
import { getCategories, getTags } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase";

export const metadata = { title: "新建文章" };
export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect(`/admin/login?reason=${admin.status}`);
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">新建文章</h1>
      <PostForm categories={categories} tags={tags} />
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPosts } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "文章管理" };
export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect(`/admin/login?reason=${admin.status}`);
  const { posts } = await getPosts({ status: "all", pageSize: 100 });
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">文章管理</h1>
        <LinkButton href="/admin/posts/new">新建文章</LinkButton>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" key={post.id}>
            <div>
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-slate-500">{post.status} · {formatDate(post.updated_at)}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link className="text-cyan-600" href={`/admin/posts/${post.id}/edit`}>编辑</Link>
              <form action={`/api/admin/posts/${post.id}`} method="post">
                <input name="_method" type="hidden" value="DELETE" />
                <button className="text-red-600" type="submit">删除</button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getComments } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "评论管理" };
export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect(`/admin/login?reason=${admin.status}`);
  const comments = await getComments(undefined, false);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">评论管理</h1>
      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold">{comment.author_name} <span className="text-sm font-normal text-slate-500">{comment.author_email}</span></p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{comment.content}</p>
                <p className="mt-2 text-xs text-slate-500">{comment.status} · {formatDate(comment.created_at)}</p>
              </div>
              <form action={`/api/admin/comments/${comment.id}`} className="flex gap-3" method="post">
                <button className="text-sm text-cyan-600" name="status" type="submit" value="approved">通过</button>
                <button className="text-sm text-amber-600" name="status" type="submit" value="rejected">拒绝</button>
                <button className="text-sm text-red-600" name="_method" type="submit" value="DELETE">删除</button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

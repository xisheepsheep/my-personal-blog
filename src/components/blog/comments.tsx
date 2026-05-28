"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import type { Comment } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function Comments({ postId, comments }: { postId: string; comments: Comment[] }) {
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setMessage("");
    const response = await fetch("/api/comments", { method: "POST", body: formData });
    setMessage(response.ok ? "评论已提交，审核通过后会显示。" : "提交失败，请稍后再试。");
  }

  return (
    <section className="mt-12 space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight">评论</h2>
      <div className="space-y-3">
        {comments.length ? comments.map((comment) => (
          <Card key={comment.id}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <strong>{comment.author_name}</strong>
              <span className="text-slate-500">{formatDate(comment.created_at)}</span>
            </div>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{comment.content}</p>
          </Card>
        )) : <p className="text-sm text-slate-500">还没有评论，来写下第一条想法。</p>}
      </div>
      <form action={submit} className="space-y-3">
        <input name="post_id" type="hidden" value={postId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="author_name" placeholder="昵称" required />
          <Input name="author_email" placeholder="邮箱" required type="email" />
        </div>
        <Textarea name="content" placeholder="写下你的评论" required />
        <Button className="gap-2" type="submit">
          <Send className="h-4 w-4" />
          提交评论
        </Button>
        {message ? <p className="text-sm text-cyan-600">{message}</p> : null}
      </form>
    </section>
  );
}

import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getAdminDb } from "@/lib/admin-api";

async function resolveCoverUrl(formData: FormData, db: SupabaseClient) {
  const file = formData.get("cover_file");
  if (file instanceof File && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from("covers").upload(path, file, { upsert: false });
    if (error) throw error;
    return db.storage.from("covers").getPublicUrl(path).data.publicUrl;
  }
  return String(formData.get("cover_url") || "") || null;
}

async function postPayload(formData: FormData, db: SupabaseClient) {
  const now = new Date().toISOString();
  const status = String(formData.get("status") || "draft");
  return {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    content: String(formData.get("content") || ""),
    cover_url: await resolveCoverUrl(formData, db),
    category_id: String(formData.get("category_id") || "") || null,
    status,
    featured: formData.get("featured") === "on",
    published_at: status === "published" ? now : null,
    updated_at: now,
  };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { db, error } = await getAdminDb();
  if (error) return error;
  const { id } = await params;
  const formData = await request.formData();
  const { error: updateError } = await db.from("posts").update(await postPayload(formData, db)).eq("id", id);
  if (updateError) return new NextResponse(updateError.message, { status: 400 });
  await db.from("post_tags").delete().eq("post_id", id);
  const tagIds = formData.getAll("tag_ids").map(String);
  if (tagIds.length) await db.from("post_tags").insert(tagIds.map((tag_id) => ({ post_id: id, tag_id })));
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const formData = await request.formData();
  if (formData.get("_method") === "DELETE") return DELETE(request, context);
  return PATCH(request, context);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { db, error } = await getAdminDb();
  if (error) return error;
  const { id } = await params;
  const { error: deleteError } = await db.from("posts").delete().eq("id", id);
  if (deleteError) return new NextResponse(deleteError.message, { status: 400 });
  return NextResponse.redirect(new URL("/admin/posts", request.url));
}

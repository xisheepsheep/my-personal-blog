import { NextRequest, NextResponse } from "next/server";

import { getAdminDb } from "@/lib/admin-api";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (request.nextUrl.searchParams.get("_method") === "DELETE") return DELETE(request, context);
  return PATCH(request, context);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { db, error } = await getAdminDb();
  if (error) return error;
  const { id } = await params;
  const formData = await request.formData();
  const { error: updateError } = await db.from("tags").update({
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
  }).eq("id", id);
  if (updateError) return new NextResponse(updateError.message, { status: 400 });
  return NextResponse.redirect(new URL("/admin/taxonomy", request.url));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { db, error } = await getAdminDb();
  if (error) return error;
  const { id } = await params;
  const { error: deleteError } = await db.from("tags").delete().eq("id", id);
  if (deleteError) return new NextResponse(deleteError.message, { status: 400 });
  return NextResponse.redirect(new URL("/admin/taxonomy", request.url));
}

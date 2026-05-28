import { NextRequest, NextResponse } from "next/server";

import { getAdminDb } from "@/lib/admin-api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { db, error } = await getAdminDb();
  if (error) return error;
  const { id } = await params;
  const formData = await request.formData();
  if (formData.get("_method") === "DELETE") {
    const { error: deleteError } = await db.from("comments").delete().eq("id", id);
    if (deleteError) return new NextResponse(deleteError.message, { status: 400 });
  } else {
    const { error: updateError } = await db.from("comments").update({ status: String(formData.get("status")) }).eq("id", id);
    if (updateError) return new NextResponse(updateError.message, { status: 400 });
  }
  return NextResponse.redirect(new URL("/admin/comments", request.url));
}

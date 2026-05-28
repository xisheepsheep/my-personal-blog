import { NextRequest, NextResponse } from "next/server";

import { getAdminDb } from "@/lib/admin-api";

export async function POST(request: NextRequest) {
  const { db, error } = await getAdminDb();
  if (error) return error;
  const formData = await request.formData();
  const { error: insertError } = await db.from("categories").insert({
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || "") || null,
  });
  if (insertError) return new NextResponse(insertError.message, { status: 400 });
  return NextResponse.redirect(new URL("/admin/taxonomy", request.url));
}

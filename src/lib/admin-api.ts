import { NextResponse } from "next/server";

import { createSupabaseAdminClient, requireAdmin } from "@/lib/supabase";

export async function getAdminDb() {
  const admin = await requireAdmin();
  if (!admin.ok) return { error: new NextResponse("Unauthorized", { status: admin.status }) };
  try {
    return { db: createSupabaseAdminClient() };
  } catch (error) {
    return { error: new NextResponse(error instanceof Error ? error.message : "Supabase is not configured", { status: 503 }) };
  }
}

export function redirectBack(path: string) {
  return NextResponse.redirect(new URL(path, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}

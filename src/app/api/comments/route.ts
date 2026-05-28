import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

const schema = z.object({
  post_id: z.string().min(1),
  author_name: z.string().min(1).max(80),
  author_email: z.string().email().max(160),
  content: z.string().min(2).max(2000),
});

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, preview: true });
  const formData = await request.formData();
  const payload = schema.parse(Object.fromEntries(formData));
  const { error } = await createSupabaseAdminClient().from("comments").insert({ ...payload, status: "pending" });
  if (error) return new NextResponse(error.message, { status: 400 });
  return NextResponse.json({ ok: true });
}

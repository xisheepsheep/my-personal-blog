"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export function createSupabaseBrowserClient() {
  if (!url || !anonKey) throw new Error("Supabase public env vars are missing.");
  return createBrowserClient(url, anonKey);
}

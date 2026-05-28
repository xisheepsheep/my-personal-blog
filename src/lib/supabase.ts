import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

export async function createSupabaseServerClient() {
  if (!url || !anonKey) throw new Error("Supabase public env vars are missing.");
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; Route Handlers can.
        }
      },
    },
  });
}

export function createSupabaseAdminClient() {
  if (!url || !serviceKey) throw new Error("Supabase admin env vars are missing.");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) return { ok: false as const, status: 503, email: null };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email || null;
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!email) return { ok: false as const, status: 401, email };
  if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { ok: false as const, status: 403, email };
  }
  return { ok: true as const, status: 200, email };
}

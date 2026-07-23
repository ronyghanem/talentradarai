import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Use inside Client Components ("use client").
 * Reads the public anon key — safe to expose in the browser bundle;
 * Row Level Security protects the data.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
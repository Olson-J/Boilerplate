"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase client for use in Client Components.
 * 
 * This client is configured for browser environments and uses the
 * `createBrowserClient` from @supabase/ssr for proper cookie handling.
 * 
 * @returns A typed Supabase client instance
 * 
 * @example
 * ```typescript
 * 'use client'
 * 
 * import { createSupabaseClient } from '@/lib/supabase/client'
 * 
 * function MyComponent() {
 *   const supabase = createSupabaseClient()
 *   // Use supabase client...
 * }
 * ```
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

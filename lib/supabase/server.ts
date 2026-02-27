import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase client for use in Server Components.
 * 
 * This client is configured for server environments and uses Next.js cookies()
 * for session management. Must be used in async Server Components only.
 * 
 * @returns A typed Supabase client instance
 * 
 * @example
 * ```typescript
 * import { createSupabaseServerClient } from '@/lib/supabase/server'
 * 
 * export default async function ServerComponent() {
 *   const supabase = createSupabaseServerClient()
 *   const { data } = await supabase.from('profiles').select('*')
 *   // ...
 * }
 * ```
 */
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const cookieStore = await cookies();
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        const cookieStore = await cookies();
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

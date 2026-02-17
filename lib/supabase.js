// DEPRECATED: This file uses @supabase/supabase-js directly.
// Use lib/supabase/server.ts and lib/supabase/client.ts instead.
//
// These use @supabase/ssr which provides proper SSR support with cookie handling
// and automatic token refresh for Next.js applications.
//
// Migration:
// - For server components: import { createSupabaseServerClient } from '@/lib/supabase/server'
// - For client components: import { createSupabaseClient } from '@/lib/supabase/client'

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

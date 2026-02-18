import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Returns the current authenticated user (or null if unauthenticated).
 * Throws when Supabase returns an error.
 */
export async function getUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user ?? null;
}

/**
 * Ensures the request is authenticated. Throws if no user is present.
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
}

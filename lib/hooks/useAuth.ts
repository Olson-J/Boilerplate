"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabase/client";

type UseAuthState = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
};

/**
 * Client-side authentication hook.
 */
export function useAuth(): UseAuthState {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (userError) {
        setError(userError);
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }
      setLoading(false);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError);
      return;
    }
    setUser(null);
  };

  return { user, loading, error, signOut };
}

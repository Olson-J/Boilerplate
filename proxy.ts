import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Proxy handler for Supabase session refresh and token management.
 * 
 * This proxy:
 * 1. Reads the current session from cookies
 * 2. Refreshes the session if needed (30 seconds before expiration)
 * 3. Updates cookies with refreshed session tokens
 * 
 * This is the ONLY place where cookies can be modified in Next.js 13+ App Router.
 * Regular Server Components can only READ cookies, not modify them.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // This will refresh the session if needed (30 seconds before expiration)
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

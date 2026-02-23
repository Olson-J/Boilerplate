import Link from "next/link";
import { requireAuth } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/SignOutButton";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuth();
  const supabase = createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const avatarUrl = profile?.avatar_url ?? null;
  const displayName = profile?.full_name || user.email || "User";
  const avatarFallback = displayName.trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={`${displayName} avatar`}
                  className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
                  {avatarFallback}
                </div>
              )}
            </div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Profile
            </Link>
          </nav>
          <SignOutButton />
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}

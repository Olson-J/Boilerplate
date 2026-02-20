import Link from "next/link";
import { requireAuth } from "@/lib/auth/server";
import { SignOutButton } from "@/components/auth/SignOutButton";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-4">
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

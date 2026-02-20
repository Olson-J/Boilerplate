import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { requireAuth } from "@/lib/auth/server";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        </header>
        <Card title="Profile" description="Manage your account settings.">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            View profile
          </Link>
        </Card>
      </div>
    </main>
  );
}

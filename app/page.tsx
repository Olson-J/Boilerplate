import Link from "next/link";
import { getUser } from "@/lib/auth/server";

export default async function Home() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Starter kit
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Welcome to the Next.js + Supabase starter
          </h1>
          <p className="text-lg text-slate-600">
            Authenticate users, manage profiles, and ship quickly with a
            production-ready foundation.
          </p>
        </header>
        <div className="flex flex-col gap-3 sm:flex-row">
          {user ? (
            <>
              <p className="text-sm text-slate-600">
                Signed in as <span className="font-medium">{user.email}</span>
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Go to dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

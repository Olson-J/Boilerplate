"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Dashboard navigation with active tab highlighting.
 * Uses client-side pathname detection to highlight the current page.
 */
export const DashboardNav = () => {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const isProfile = pathname === "/profile";

  return (
    <>
      <Link
        href="/dashboard"
        className={isDashboard ? "text-sm font-semibold text-slate-900" : "text-sm font-medium text-slate-600 hover:text-slate-900"}
      >
        Dashboard
      </Link>
      <Link
        href="/profile"
        className={isProfile ? "text-sm font-semibold text-slate-900" : "text-sm font-medium text-slate-600 hover:text-slate-900"}
      >
        Profile
      </Link>
    </>
  );
};

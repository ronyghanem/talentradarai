import Link from "next/link";
import { Radar, LogOut, User, Briefcase, LayoutDashboard, Building2 } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/types/database";

export function Navbar({ profile }: { profile: Profile }) {
  const dashboardHref =
    profile.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/candidate";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-surface/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={dashboardHref} className="flex items-center gap-2 font-bold text-brand-600">
          <Radar className="h-6 w-6" />
          <span className="text-lg">TalentRadar AI</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href={dashboardHref}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Briefcase className="h-4 w-4" />
            Jobs
          </Link>
          {profile.role === "candidate" && (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          )}
          {profile.role === "recruiter" && (
            <Link
              href="/company"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Building2 className="h-4 w-4" />
              Company
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 sm:inline">{profile.full_name}</span>
          <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {profile.role}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

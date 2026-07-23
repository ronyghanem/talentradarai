import Link from "next/link";
import { FileText, PenLine, Sparkles, Search } from "lucide-react";
import { getCandidateProfile } from "@/lib/actions/profile";
import { getCandidateApplications } from "@/lib/actions/applications";
import { getMatchesForCandidate } from "@/lib/actions/matching";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<string, string> = {
  applied: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  shortlisted: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  hired: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function completeness(profile: Awaited<ReturnType<typeof getCandidateProfile>>) {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.headline),
    Boolean(profile.bio),
    (profile.skills?.length ?? 0) > 0,
    Boolean(profile.resume_url),
    Boolean(profile.desired_role),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export default async function CandidateDashboardPage() {
  const profile = await getCandidateProfile();
  const pct = completeness(profile);
  const applications = await getCandidateApplications();
  const matches = await getMatchesForCandidate();

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Candidate Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Track your applications and see roles the AI thinks fit you.
          </p>
        </div>
        <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">
          <Search className="h-4 w-4" /> Find open roles
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Profile completeness</h2>
          <span className="text-sm font-medium text-brand-600">{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link href="/profile/edit" className="btn-secondary inline-flex items-center gap-2">
            <PenLine className="h-4 w-4" /> Edit profile
          </Link>
          {profile?.resume_url && (
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" /> Resume on file
            </span>
          )}
        </div>

        {pct < 100 && (
          <p className="mt-3 text-xs text-gray-400">
            Complete your profile and upload a resume to be discoverable by recruiters and eligible
            for AI matching.
          </p>
        )}
      </div>

      {matches.length > 0 && (
        <div className="space-y-3">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-gray-500">
            <Sparkles className="h-3.5 w-3.5" /> Matches for you
          </h2>
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/jobs/${match.job_id}`}
              className="card flex items-center justify-between gap-2 transition hover:border-brand-400"
            >
              <span className="font-medium text-gray-900 dark:text-white">{match.job?.title}</span>
              <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {match.score}%
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          My applications ({applications.length})
        </h2>
        {applications.length === 0 ? (
          <div className="card text-center text-sm text-gray-500">
            No applications yet.{" "}
            <Link href="/jobs" className="text-brand-600 hover:underline">
              Browse open roles
            </Link>
            .
          </div>
        ) : (
          applications.map((app) => (
            <Link
              key={app.id}
              href={`/jobs/${app.job_id}`}
              className="card flex items-center justify-between gap-2 transition hover:border-brand-400"
            >
              <span className="font-medium text-gray-900 dark:text-white">{app.job?.title}</span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  statusStyles[app.status]
                )}
              >
                {app.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Plus, Building2, PenLine } from "lucide-react";
import { getRecruiterJobs } from "@/lib/actions/jobs";
import { getMyCompany } from "@/lib/actions/companies";
import { JobCard } from "@/components/jobs/JobCard";
import type { JobWithCompany } from "@/types/database";

function groupByStatus(jobs: JobWithCompany[]) {
  return {
    published: jobs.filter((j) => j.status === "published"),
    draft: jobs.filter((j) => j.status === "draft"),
    closed: jobs.filter((j) => j.status === "closed"),
  };
}

export default async function RecruiterDashboardPage() {
  const jobs = await getRecruiterJobs();
  const company = await getMyCompany();
  const grouped = groupByStatus(jobs);

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-matched candidate lists land here in a later phase.
          </p>
        </div>
        <Link href="/jobs/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Post a job
        </Link>
      </div>

      {!company ? (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-950">
          <div className="flex items-center gap-2 text-sm text-brand-800 dark:text-brand-200">
            <Building2 className="h-4 w-4" />
            Set up your company profile — it shows up on every job you post.
          </div>
          <Link href="/company" className="btn-secondary shrink-0">
            Set up now
          </Link>
        </div>
      ) : (
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt="" className="h-6 w-6 rounded object-cover" />
            ) : (
              <Building2 className="h-4 w-4 text-gray-400" />
            )}
            <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
          </div>
          <Link href="/company" className="btn-secondary inline-flex items-center gap-2 shrink-0">
            <PenLine className="h-4 w-4" /> Edit company profile
          </Link>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          You haven't posted any jobs yet.{" "}
          <Link href="/jobs/new" className="text-brand-600 hover:underline">
            Post your first one
          </Link>
          .
        </div>
      ) : (
        <>
          {grouped.published.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Published ({grouped.published.length})
              </h2>
              {grouped.published.map((job) => (
                <JobCard key={job.id} job={job} showStatus />
              ))}
            </section>
          )}

          {grouped.draft.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Drafts ({grouped.draft.length})
              </h2>
              {grouped.draft.map((job) => (
                <JobCard key={job.id} job={job} showStatus />
              ))}
            </section>
          )}

          {grouped.closed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Closed ({grouped.closed.length})
              </h2>
              {grouped.closed.map((job) => (
                <JobCard key={job.id} job={job} showStatus />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

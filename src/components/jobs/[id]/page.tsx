import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Sparkles, Building2 } from "lucide-react";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getJobById } from "@/lib/actions/jobs";
import {
  getApplicationsForJob,
  getMyApplicationForJob,
} from "@/lib/actions/applications";
import { JobStatusControls } from "@/components/jobs/JobStatusControls";
import { ApplyForm } from "@/components/jobs/ApplyForm";
import { CandidateCard } from "@/components/candidates/CandidateCard";

const employmentLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return null;
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  return `$${(min ?? max)!.toLocaleString()}+`;
}

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ published?: string }>;
}) {
  const { id } = await params;
  const { published } = await searchParams;
  const profile = await getCurrentProfile();
  const job = await getJobById(id);

  if (!job) notFound();

  const isOwner = profile?.id === job.recruiter_id;

  // Drafts are only visible to their owner. RLS already enforces this at the
  // query level, but guard here too so unauthenticated visitors get a clean 404.
  if (job.status === "draft" && !isOwner) notFound();

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {published && (
        <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Job published — it's now live on the public listing.
        </div>
      )}
      <div className="card">
        {job.company && (
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
            {job.company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.company.logo_url}
                alt=""
                className="h-6 w-6 rounded object-cover"
              />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            {job.company.name}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
          {job.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {job.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-4 w-4" /> {employmentLabels[job.employment_type]}
          </span>
          {salary && (
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> {salary}
            </span>
          )}
        </div>

        {job.skills_required?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills_required.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
          {job.description}
        </div>

        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">Responsibilities</h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">Requirements</h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isOwner && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <JobStatusControls job={job} />
            <Link
              href={`/jobs/${job.id}/matches`}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" /> AI Matches
            </Link>
          </div>
          <ApplicantsList jobId={job.id} />
        </>
      )}

      {!isOwner && profile?.role === "candidate" && job.status === "published" && (
        <CandidateApplySection jobId={job.id} />
      )}

      {!profile && (
        <div className="card">
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-brand-600 hover:underline">
              Log in
            </a>{" "}
            to apply to this job.
          </p>
        </div>
      )}
    </div>
  );
}

async function CandidateApplySection({ jobId }: { jobId: string }) {
  const existing = await getMyApplicationForJob(jobId);

  if (existing) {
    return (
      <div className="card">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          You applied to this job — status:{" "}
          <span className="font-medium capitalize">{existing.status}</span>
        </p>
      </div>
    );
  }

  return <ApplyForm jobId={jobId} />;
}

async function ApplicantsList({ jobId }: { jobId: string }) {
  const applications = await getApplicationsForJob(jobId);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Applicants ({applications.length})
      </h2>
      {applications.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">No applicants yet.</div>
      ) : (
        applications.map((app) => <CandidateCard key={app.id} application={app} />)
      )}
    </div>
  );
}

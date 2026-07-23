import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getJobById } from "@/lib/actions/jobs";
import { getMatchesForJob } from "@/lib/actions/matching";
import { FindMatchesButton } from "@/components/jobs/FindMatchesButton";
import { MatchCard } from "@/components/candidates/MatchCard";

export default async function JobMatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "recruiter") redirect("/dashboard/candidate");

  const job = await getJobById(id);
  if (!job) notFound();
  if (job.recruiter_id !== profile.id) redirect("/dashboard/recruiter");

  const matches = await getMatchesForJob(id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to job
      </Link>

      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Matches</h1>
          <p className="mt-1 text-sm text-gray-500">{job.title}</p>
        </div>
        <FindMatchesButton jobId={id} />
      </div>

      {matches.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No matches yet. Click "Find matches" to score open-to-work candidates against this job.
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

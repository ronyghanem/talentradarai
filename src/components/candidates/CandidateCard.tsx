import { MapPin, Briefcase } from "lucide-react";
import { ResumeLink } from "@/components/candidates/ResumeLink";
import { ApplicationActions } from "@/components/jobs/ApplicationActions";
import type { ApplicationWithCandidate } from "@/types/database";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<string, string> = {
  applied: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  shortlisted: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  hired: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function CandidateCard({ application }: { application: ApplicationWithCandidate }) {
  const candidate = application.candidate;
  const cp = candidate?.candidate_profiles;

  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{candidate?.full_name}</h3>
          {cp?.headline && <p className="text-sm text-gray-500">{cp.headline}</p>}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
            statusStyles[application.status]
          )}
        >
          {application.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        {cp?.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {cp.location}
          </span>
        )}
        {typeof cp?.years_experience === "number" && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" /> {cp.years_experience} yrs experience
          </span>
        )}
      </div>

      {cp?.skills && cp.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cp.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {application.cover_note && (
        <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {application.cover_note}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        {cp?.resume_url ? (
          <ResumeLink storagePath={cp.resume_url} />
        ) : (
          <span className="text-sm text-gray-400">No resume on file</span>
        )}
      </div>

      <ApplicationActions applicationId={application.id} currentStatus={application.status} />
    </div>
  );
}

import { MapPin, Briefcase } from "lucide-react";
import { ResumeLink } from "@/components/candidates/ResumeLink";
import type { MatchWithCandidate } from "@/types/database";
import { cn } from "@/lib/utils/cn";

function scoreColor(score: number) {
  if (score >= 75) return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  if (score >= 50) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
}

export function MatchCard({ match }: { match: MatchWithCandidate }) {
  const candidate = match.candidate;
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
            "shrink-0 rounded-full px-2.5 py-1 text-sm font-bold",
            scoreColor(match.score)
          )}
        >
          {match.score}%
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

      {match.reasoning && (
        <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {match.reasoning}
        </p>
      )}

      {cp?.resume_url && <ResumeLink storagePath={cp.resume_url} />}
    </div>
  );
}

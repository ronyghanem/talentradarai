import { redirect } from "next/navigation";
import Link from "next/link";
import {
  PenLine,
  FileText,
  MapPin,
  Briefcase,
  Clock,
  Link as LinkIcon,
  Github,
  Linkedin,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getCandidateProfile } from "@/lib/actions/profile";

const availabilityLabels: Record<string, string> = {
  immediate: "Available immediately",
  "2_weeks": "2 weeks notice",
  "1_month": "1 month notice",
  not_looking: "Not currently looking",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "candidate") {
    redirect("/dashboard/recruiter");
  }

  const candidateProfile = await getCandidateProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            This is what recruiters and the AI matcher see.
          </p>
        </div>
        <Link href="/profile/edit" className="btn-primary inline-flex items-center gap-2">
          <PenLine className="h-4 w-4" /> Edit profile
        </Link>
      </div>

      <div className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {candidateProfile?.headline || "No headline yet"}
          </h2>
          {candidateProfile?.bio && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{candidateProfile.bio}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {candidateProfile?.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {candidateProfile.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" /> {candidateProfile?.years_experience ?? 0} yrs
            experience
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />{" "}
            {availabilityLabels[candidateProfile?.availability ?? "immediate"]}
          </span>
        </div>

        {candidateProfile?.skills && candidateProfile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {candidateProfile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {candidateProfile?.desired_role && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">Looking for:</span>{" "}
            {candidateProfile.desired_role}
            {(candidateProfile.desired_salary_min || candidateProfile.desired_salary_max) && (
              <>
                {" "}
                (
                {candidateProfile.desired_salary_min &&
                  `$${candidateProfile.desired_salary_min.toLocaleString()}`}
                {candidateProfile.desired_salary_min && candidateProfile.desired_salary_max && " – "}
                {candidateProfile.desired_salary_max &&
                  `$${candidateProfile.desired_salary_max.toLocaleString()}`}
                )
              </>
            )}
          </p>
        )}

        {candidateProfile?.links &&
          (candidateProfile.links.linkedin ||
            candidateProfile.links.github ||
            candidateProfile.links.portfolio) && (
            <div className="flex flex-wrap gap-4 text-sm">
              {candidateProfile.links.linkedin && (
                <a
                  href={candidateProfile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {candidateProfile.links.github && (
                <a
                  href={candidateProfile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {candidateProfile.links.portfolio && (
                <a
                  href={candidateProfile.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
                >
                  <LinkIcon className="h-4 w-4" /> Portfolio
                </a>
              )}
            </div>
          )}

        <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
          {candidateProfile?.resume_url ? (
            <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <FileText className="h-4 w-4 text-brand-600" /> Resume on file
              {candidateProfile.resume_parsed_at &&
                ` — parsed ${new Date(candidateProfile.resume_parsed_at).toLocaleDateString()}`}
            </span>
          ) : (
            <span className="text-gray-400">No resume uploaded yet</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              candidateProfile?.is_open_to_work ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          {candidateProfile?.is_open_to_work
            ? "Open to work — visible to recruiters and eligible for AI matching"
            : "Not currently open to work"}
        </div>
      </div>
    </div>
  );
}

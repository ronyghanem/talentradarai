import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Building2 } from "lucide-react";
import type { JobWithCompany } from "@/types/database";
import { cn } from "@/lib/utils/cn";

const employmentLabels: Record<JobWithCompany["employment_type"], string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

const statusStyles: Record<JobWithCompany["status"], string> = {
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  published: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  closed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return null;
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  return `$${(min ?? max)!.toLocaleString()}+`;
}

export function JobCard({ job, showStatus = false }: { job: JobWithCompany; showStatus?: boolean }) {
  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="card block transition hover:border-brand-400 hover:shadow-sm"
    >
      {job.company && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
          {job.company.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.company.logo_url}
              alt=""
              className="h-4 w-4 rounded-sm object-cover"
            />
          ) : (
            <Building2 className="h-3.5 w-3.5" />
          )}
          {job.company.name}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
        {showStatus && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
              statusStyles[job.status]
            )}
          >
            {job.status}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" /> {employmentLabels[job.employment_type]}
        </span>
        {salary && (
          <span className="inline-flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" /> {salary}
          </span>
        )}
      </div>

      {job.skills_required?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills_required.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

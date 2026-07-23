"use client";

import { updateApplicationStatus } from "@/lib/actions/applications";
import type { ApplicationStatus } from "@/types/database";
import { cn } from "@/lib/utils/cn";

const options: { status: ApplicationStatus; label: string }[] = [
  { status: "reviewing", label: "Mark reviewing" },
  { status: "shortlisted", label: "Shortlist" },
  { status: "hired", label: "Hire" },
  { status: "rejected", label: "Reject" },
];

export function ApplicationActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <form key={opt.status} action={updateApplicationStatus.bind(null, applicationId, opt.status)}>
          <button
            type="submit"
            disabled={currentStatus === opt.status}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition",
              currentStatus === opt.status
                ? "cursor-default border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                : "border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300"
            )}
          >
            {opt.label}
          </button>
        </form>
      ))}
    </div>
  );
}

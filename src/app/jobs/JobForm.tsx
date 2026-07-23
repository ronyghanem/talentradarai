"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { JobFormState } from "@/lib/actions/jobs";
import type { Job } from "@/types/database";

const initialState: JobFormState = {};

export function JobForm({
  action,
  job,
  submitLabel = "Save",
  showPublishOption = false,
}: {
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  job?: Job | null;
  submitLabel?: string;
  showPublishOption?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card space-y-5">
      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4" /> Job saved.
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Job title</label>
        <input
          name="title"
          defaultValue={job?.title ?? ""}
          placeholder="Senior Backend Engineer"
          className="input-field"
          maxLength={150}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={job?.description ?? ""}
          rows={6}
          placeholder="What the role is, what the team does, why it matters."
          className="input-field"
          maxLength={8000}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <input
            name="location"
            defaultValue={job?.location ?? ""}
            placeholder="Beirut, Lebanon / Remote"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Employment type</label>
          <select
            name="employmentType"
            defaultValue={job?.employment_type ?? "full_time"}
            className="input-field"
          >
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Salary min</label>
          <input
            type="number"
            name="salaryMin"
            defaultValue={job?.salary_min ?? ""}
            min={0}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Salary max</label>
          <input
            type="number"
            name="salaryMax"
            defaultValue={job?.salary_max ?? ""}
            min={0}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Skills required</label>
        <input
          name="skillsRequired"
          defaultValue={job?.skills_required?.join(", ") ?? ""}
          placeholder="React, TypeScript, Node.js"
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-400">
          Comma-separated. This is what the AI matcher compares against candidate skills.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Requirements</label>
        <textarea
          name="requirements"
          defaultValue={job?.requirements?.join("\n") ?? ""}
          rows={4}
          placeholder={"5+ years of experience\nStrong communication skills"}
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-400">One per line.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Responsibilities</label>
        <textarea
          name="responsibilities"
          defaultValue={job?.responsibilities?.join("\n") ?? ""}
          rows={4}
          placeholder={"Own the API layer\nMentor junior engineers"}
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-400">One per line.</p>
      </div>

      {showPublishOption ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="intent"
            value="draft"
            disabled={isPending}
            className="btn-secondary"
          >
            {isPending ? "Saving..." : "Save as draft"}
          </button>
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? "Publishing..." : "Publish now"}
          </button>
        </div>
      ) : (
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Saving..." : submitLabel}
        </button>
      )}
    </form>
  );
}

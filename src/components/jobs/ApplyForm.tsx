"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { applyToJob, type ApplyState } from "@/lib/actions/applications";

const initialState: ApplyState = {};

export function ApplyForm({ jobId }: { jobId: string }) {
  const boundApply = applyToJob.bind(null, jobId);
  const [state, formAction, isPending] = useActionState(boundApply, initialState);

  if (state.success) {
    return (
      <div className="card flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
        <CheckCircle2 className="h-4 w-4" /> Application submitted. The recruiter can now see your
        profile.
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-3">
      <h2 className="font-semibold text-gray-900 dark:text-white">Apply to this job</h2>

      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      <textarea
        name="coverNote"
        rows={4}
        placeholder="Optional note to the recruiter — why you're a good fit."
        className="input-field"
        maxLength={3000}
      />

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Submitting..." : "Apply"}
      </button>
    </form>
  );
}

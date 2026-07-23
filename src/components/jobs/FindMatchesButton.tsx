"use client";

import { useFormStatus } from "react-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { computeMatchesForJob } from "@/lib/actions/matching";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary inline-flex items-center gap-2">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Scoring candidates...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" /> Find matches
        </>
      )}
    </button>
  );
}

export function FindMatchesButton({ jobId }: { jobId: string }) {
  return (
    <form action={computeMatchesForJob.bind(null, jobId)}>
      <SubmitButton />
    </form>
  );
}

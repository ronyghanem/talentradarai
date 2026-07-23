"use client";

import { useState } from "react";
import Link from "next/link";
import { PenLine, Trash2 } from "lucide-react";
import { publishJob, closeJob, deleteJob } from "@/lib/actions/jobs";
import type { Job } from "@/types/database";

export function JobStatusControls({ job }: { job: Job }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/jobs/${job.id}/edit`} className="btn-secondary inline-flex items-center gap-2">
        <PenLine className="h-4 w-4" /> Edit
      </Link>

      {job.status === "draft" && (
        <form action={publishJob.bind(null, job.id)}>
          <button type="submit" className="btn-primary">
            Publish
          </button>
        </form>
      )}

      {job.status === "published" && (
        <form action={closeJob.bind(null, job.id)}>
          <button type="submit" className="btn-secondary">
            Close listing
          </button>
        </form>
      )}

      {!confirmingDelete ? (
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Delete this job permanently?</span>
          <form action={deleteJob.bind(null, job.id)}>
            <button type="submit" className="font-medium text-red-600 hover:underline">
              Yes, delete
            </button>
          </form>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

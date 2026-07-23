"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-surface">
      <div className="card max-w-sm text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
        <h1 className="mt-4 font-display text-lg font-semibold text-gray-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          That page hit an unexpected error. Try again, or head back to the dashboard.
        </p>
        <button onClick={() => reset()} className="btn-primary mt-6 w-full">
          Try again
        </button>
      </div>
    </div>
  );
}

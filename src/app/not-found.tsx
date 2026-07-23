import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-surface">
      <div className="text-center">
        <span className="font-mono text-sm text-radar-sweep">404 / no signal</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 dark:text-white">
          Nothing on the radar here
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          This page doesn't exist, or you don't have access to it.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { getResumeSignedUrl } from "@/lib/actions/profile";

export function ResumeLink({ storagePath }: { storagePath: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const url = await getResumeSignedUrl(storagePath);
    setLoading(false);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
      {loading ? "Loading..." : "View resume"}
    </button>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { scoreCandidateForJob } from "@/lib/matching/score";
import type { CandidateProfile, MatchWithCandidate } from "@/types/database";

const MAX_CANDIDATES_PER_RUN = 50;

/**
 * Scores every open-to-work candidate against a job and writes the results
 * into the `matches` table. Only the job's owning recruiter can trigger this.
 * Uses the service-role client to write, since `matches` intentionally has
 * no insert policy for regular authenticated users.
 */
export async function computeMatchesForJob(jobId: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("recruiter_id", user.id)
    .single();

  if (!job) return; // not found, or caller doesn't own it

  const { data: candidates } = await supabase
    .from("candidate_profiles")
    .select("*, profile:profiles!inner(role)")
    .eq("is_open_to_work", true)
    .eq("profile.role", "candidate")
    .limit(MAX_CANDIDATES_PER_RUN);

  const scorable = (candidates ?? []).filter(
    (c: CandidateProfile) => (c.skills?.length ?? 0) > 0 || Boolean(c.resume_text)
  );

  if (scorable.length === 0) {
    revalidatePath(`/jobs/${jobId}/matches`);
    return;
  }

  const results = await Promise.all(
    scorable.map(async (candidate: CandidateProfile) => ({
      candidateId: candidate.id,
      ...(await scoreCandidateForJob(candidate, job)),
    }))
  );

  const serviceClient = createServiceRoleClient();

  await serviceClient.from("matches").upsert(
    results.map((r) => ({
      job_id: jobId,
      candidate_id: r.candidateId,
      score: r.score,
      reasoning: r.reasoning,
    })),
    { onConflict: "job_id,candidate_id" }
  );

  revalidatePath(`/jobs/${jobId}/matches`);
  revalidatePath("/dashboard/recruiter");
}

/** Ranked matches for a job, owner-only (enforced by RLS). */
export async function getMatchesForJob(jobId: string): Promise<MatchWithCandidate[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("matches")
    .select("*, candidate:profiles(*, candidate_profiles(*))")
    .eq("job_id", jobId)
    .order("score", { ascending: false });

  return (data as unknown as MatchWithCandidate[]) ?? [];
}

/** Jobs the AI thinks fit the logged-in candidate, ranked by score. */
export async function getMatchesForCandidate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("matches")
    .select("*, job:jobs(*)")
    .eq("candidate_id", user.id)
    .order("score", { ascending: false })
    .limit(20);

  return data ?? [];
}

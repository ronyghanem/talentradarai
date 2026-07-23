"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type {
  ApplicationStatus,
  ApplicationWithJob,
  ApplicationWithCandidate,
  Application,
} from "@/types/database";

export type ApplyState = { error?: string; success?: boolean };

const applySchema = z.object({
  coverNote: z.string().max(3000).optional().or(z.literal("")),
});

/** Candidate applies to a job. One application per (job, candidate) pair. */
export async function applyToJob(
  jobId: string,
  _prevState: ApplyState,
  formData: FormData
): Promise<ApplyState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const parsed = applySchema.safeParse({ coverNote: formData.get("coverNote") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    candidate_id: user.id,
    cover_note: parsed.data.coverNote || null,
    status: "applied",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already applied to this job." };
    }
    return { error: error.message };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/candidate");
  return { success: true };
}

/** Recruiter updates the status of an application on one of their jobs. */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  _formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // RLS already restricts updates to applications on jobs the caller owns,
  // but we still need the job_id to revalidate the right pages.
  const { data: application } = await supabase
    .from("applications")
    .select("job_id")
    .eq("id", applicationId)
    .single();

  await supabase.from("applications").update({ status }).eq("id", applicationId);

  if (application) {
    revalidatePath(`/jobs/${application.job_id}`);
  }
  revalidatePath("/dashboard/recruiter");
}

/** All applications the logged-in candidate has submitted, with job details. */
export async function getCandidateApplications(): Promise<ApplicationWithJob[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("applications")
    .select("*, job:jobs(*)")
    .eq("candidate_id", user.id)
    .order("created_at", { ascending: false });

  return (data as ApplicationWithJob[]) ?? [];
}

/** Whether (and how) the logged-in candidate has already applied to a given job. */
export async function getMyApplicationForJob(jobId: string): Promise<Application | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("job_id", jobId)
    .eq("candidate_id", user.id)
    .maybeSingle();

  return data;
}

/** All applicants for a job the logged-in recruiter owns, with candidate profile details. */
export async function getApplicationsForJob(jobId: string): Promise<ApplicationWithCandidate[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("applications")
    .select("*, candidate:profiles(*, candidate_profiles(*))")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  return (data as unknown as ApplicationWithCandidate[]) ?? [];
}

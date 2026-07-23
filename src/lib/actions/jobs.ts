"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { JobWithCompany } from "@/types/database";

const jobSchema = z.object({
  title: z.string().min(3, "Title is too short").max(150),
  description: z.string().min(20, "Description is too short").max(8000),
  location: z.string().max(150).optional().or(z.literal("")),
  employmentType: z.enum(["full_time", "part_time", "contract", "internship", "remote"]),
  skillsRequired: z.string().optional().or(z.literal("")), // comma-separated
  requirements: z.string().optional().or(z.literal("")), // newline-separated
  responsibilities: z.string().optional().or(z.literal("")), // newline-separated
  salaryMin: z.coerce.number().int().min(0).optional().or(z.literal("")),
  salaryMax: z.coerce.number().int().min(0).optional().or(z.literal("")),
});

export type JobFormState = { error?: string; success?: boolean };

function parseJobForm(formData: FormData) {
  return jobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    skillsRequired: formData.get("skillsRequired"),
    requirements: formData.get("requirements"),
    responsibilities: formData.get("responsibilities"),
    salaryMin: formData.get("salaryMin") || undefined,
    salaryMax: formData.get("salaryMax") || undefined,
  });
}

function toArray(value: string | undefined, splitOn: RegExp) {
  if (!value) return [];
  return value
    .split(splitOn)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Creates a new job. Saved as draft unless intent=publish is submitted. */
export async function createJob(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const parsed = parseJobForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const shouldPublish = formData.get("intent") === "publish";

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("recruiter_id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      recruiter_id: user.id,
      company_id: company?.id ?? null,
      title: d.title,
      description: d.description,
      location: d.location || null,
      employment_type: d.employmentType,
      skills_required: toArray(d.skillsRequired, /,/),
      requirements: toArray(d.requirements, /\n/),
      responsibilities: toArray(d.responsibilities, /\n/),
      salary_min: d.salaryMin || null,
      salary_max: d.salaryMax || null,
      status: shouldPublish ? "published" : "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create job." };
  }

  revalidatePath("/dashboard/recruiter");
  revalidatePath("/jobs");

  if (shouldPublish) {
    redirect(`/jobs/${data.id}?published=true`);
  }
  redirect(`/jobs/${data.id}/edit?created=true`);
}

/** Updates an existing job's fields (owner only, enforced by RLS). */
export async function updateJob(
  jobId: string,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const parsed = parseJobForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const d = parsed.data;

  const { error } = await supabase
    .from("jobs")
    .update({
      title: d.title,
      description: d.description,
      location: d.location || null,
      employment_type: d.employmentType,
      skills_required: toArray(d.skillsRequired, /,/),
      requirements: toArray(d.requirements, /\n/),
      responsibilities: toArray(d.responsibilities, /\n/),
      salary_min: d.salaryMin || null,
      salary_max: d.salaryMax || null,
    })
    .eq("id", jobId)
    .eq("recruiter_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/jobs/${jobId}/edit`);
  revalidatePath("/dashboard/recruiter");
  return { success: true };
}

/** Publishes a draft job, making it visible on the public /jobs listing. */
export async function publishJob(jobId: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("jobs")
    .update({ status: "published" })
    .eq("id", jobId)
    .eq("recruiter_id", user.id);

  revalidatePath("/dashboard/recruiter");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
}

/** Closes a published job — stops new applications, keeps it visible to the owner. */
export async function closeJob(jobId: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId)
    .eq("recruiter_id", user.id);

  revalidatePath("/dashboard/recruiter");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
}

/** Permanently deletes a job (cascades to applications/matches via FK). */
export async function deleteJob(jobId: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("jobs").delete().eq("id", jobId).eq("recruiter_id", user.id);

  revalidatePath("/dashboard/recruiter");
  redirect("/dashboard/recruiter");
}

/** All jobs owned by the logged-in recruiter, newest first. */
export async function getRecruiterJobs(): Promise<JobWithCompany[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("recruiter_id", user.id)
    .order("created_at", { ascending: false });

  return (data as unknown as JobWithCompany[]) ?? [];
}

/** Published jobs visible to candidates, newest first. Optional keyword filter on title. */
export async function getPublishedJobs(search?: string): Promise<JobWithCompany[]> {
  const supabase = await createClient();
  let query = supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data } = await query;
  return (data as unknown as JobWithCompany[]) ?? [];
}

/** A single job by id. RLS ensures drafts are only visible to their owner. */
export async function getJobById(id: string): Promise<JobWithCompany | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("id", id)
    .single();
  return data as unknown as JobWithCompany | null;
}

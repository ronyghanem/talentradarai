"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { CandidateProfile } from "@/types/database";

const profileSchema = z.object({
  headline: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  yearsExperience: z.coerce.number().int().min(0).max(60).default(0),
  skills: z.string().optional().or(z.literal("")), // comma-separated, parsed below
  desiredRole: z.string().max(120).optional().or(z.literal("")),
  desiredSalaryMin: z.coerce.number().int().min(0).optional().or(z.literal("")),
  desiredSalaryMax: z.coerce.number().int().min(0).optional().or(z.literal("")),
  availability: z.enum(["immediate", "2_weeks", "1_month", "not_looking"]),
  linkedin: z.string().max(300).optional().or(z.literal("")),
  github: z.string().max(300).optional().or(z.literal("")),
  portfolio: z.string().max(300).optional().or(z.literal("")),
  isOpenToWork: z.coerce.boolean().default(false),
});

export type ProfileState = { error?: string; success?: boolean };

/** Updates the editable fields on the candidate's profile. */
export async function updateCandidateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const parsed = profileSchema.safeParse({
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    yearsExperience: formData.get("yearsExperience"),
    skills: formData.get("skills"),
    desiredRole: formData.get("desiredRole"),
    desiredSalaryMin: formData.get("desiredSalaryMin") || undefined,
    desiredSalaryMax: formData.get("desiredSalaryMax") || undefined,
    availability: formData.get("availability"),
    linkedin: formData.get("linkedin"),
    github: formData.get("github"),
    portfolio: formData.get("portfolio"),
    isOpenToWork: formData.get("isOpenToWork") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const skills = d.skills
    ? d.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const links: Record<string, string> = {};
  if (d.linkedin) links.linkedin = d.linkedin;
  if (d.github) links.github = d.github;
  if (d.portfolio) links.portfolio = d.portfolio;

  const { error } = await supabase
    .from("candidate_profiles")
    .update({
      headline: d.headline || null,
      bio: d.bio || null,
      location: d.location || null,
      years_experience: d.yearsExperience,
      skills,
      desired_role: d.desiredRole || null,
      desired_salary_min: d.desiredSalaryMin || null,
      desired_salary_max: d.desiredSalaryMax || null,
      availability: d.availability,
      links,
      is_open_to_work: d.isOpenToWork,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard/candidate");
  return { success: true };
}

/**
 * Uploads a PDF resume to Supabase Storage, extracts its text server-side,
 * and stores both the storage path and extracted text on candidate_profiles.
 * The extracted text is what the matching engine reads later.
 */
export async function uploadResume(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const file = formData.get("resume") as File | null;

  if (!file || file.size === 0) {
    return { error: "Please choose a PDF file to upload." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are supported." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File is too large. Please keep it under 5MB." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract text server-side. pdf-parse is dynamically imported because it
  // has side effects at module load time that only work in a Node runtime.
  let resumeText = "";
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const parsed = await pdfParse(buffer);
    resumeText = parsed.text.slice(0, 20000); // cap length stored in DB
  } catch {
    return { error: "Couldn't read that PDF. Please check the file and try again." };
  }

  const storagePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: dbError } = await supabase
    .from("candidate_profiles")
    .update({
      resume_url: storagePath,
      resume_text: resumeText,
      resume_parsed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard/candidate");
  return { success: true };
}

/** Fetches the logged-in candidate's extended profile row. Null if not found/not a candidate. */
export async function getCandidateProfile(): Promise<CandidateProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

/** Generates a short-lived signed URL for viewing a private resume file. */
export async function getResumeSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(storagePath, 60 * 5); // 5 minutes

  if (error) return null;
  return data.signedUrl;
}

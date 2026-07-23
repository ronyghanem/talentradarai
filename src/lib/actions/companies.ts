"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types/database";

const companySchema = z.object({
  name: z.string().min(2, "Company name is too short").max(150),
  website: z.string().max(300).optional().or(z.literal("")),
  industry: z.string().max(100).optional().or(z.literal("")),
  companySize: z.string().max(50).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  logoUrl: z.string().max(500).optional().or(z.literal("")),
});

export type CompanyState = { error?: string; success?: boolean };

/** The logged-in recruiter's company, if they've created one. */
export async function getMyCompany(): Promise<Company | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("recruiter_id", user.id)
    .maybeSingle();

  return data;
}

/**
 * Creates or updates the recruiter's company. There's no DB-level unique
 * constraint on recruiter_id, so this checks for an existing row first
 * rather than relying on an upsert conflict target.
 */
export async function upsertCompany(
  _prevState: CompanyState,
  formData: FormData
): Promise<CompanyState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    companySize: formData.get("companySize"),
    description: formData.get("description"),
    logoUrl: formData.get("logoUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const payload = {
    name: d.name,
    website: d.website || null,
    industry: d.industry || null,
    company_size: d.companySize || null,
    description: d.description || null,
    logo_url: d.logoUrl || null,
  };

  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .eq("recruiter_id", user.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("companies").update(payload).eq("id", existing.id)
    : await supabase.from("companies").insert({ ...payload, recruiter_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/company");
  revalidatePath("/dashboard/recruiter");
  revalidatePath("/jobs");
  return { success: true };
}

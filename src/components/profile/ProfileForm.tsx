"use client";

import { useActionState, useRef } from "react";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import {
  updateCandidateProfile,
  uploadResume,
  type ProfileState,
} from "@/lib/actions/profile";
import type { CandidateProfile } from "@/types/database";
import { cn } from "@/lib/utils/cn";

const initialState: ProfileState = {};

export function ProfileDetailsForm({ profile }: { profile: CandidateProfile | null }) {
  const [state, formAction, isPending] = useActionState(updateCandidateProfile, initialState);

  return (
    <form action={formAction} className="card space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile details</h2>
        <p className="text-sm text-gray-500">
          This is what recruiters see, and what the AI matcher scores your fit against.
        </p>
      </div>

      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4" /> Profile saved.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Headline</label>
          <input
            name="headline"
            defaultValue={profile?.headline ?? ""}
            placeholder="Senior Frontend Engineer"
            className="input-field"
            maxLength={120}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            defaultValue={profile?.bio ?? ""}
            rows={4}
            placeholder="A few sentences about your background and what you're looking for."
            className="input-field"
            maxLength={2000}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <input
            name="location"
            defaultValue={profile?.location ?? ""}
            placeholder="Beirut, Lebanon"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Years of experience</label>
          <input
            type="number"
            name="yearsExperience"
            defaultValue={profile?.years_experience ?? 0}
            min={0}
            max={60}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Skills</label>
          <input
            name="skills"
            defaultValue={profile?.skills?.join(", ") ?? ""}
            placeholder="React, TypeScript, Node.js, PostgreSQL"
            className="input-field"
          />
          <p className="mt-1 text-xs text-gray-400">Comma-separated.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Desired role</label>
          <input
            name="desiredRole"
            defaultValue={profile?.desired_role ?? ""}
            placeholder="Staff Engineer"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Desired salary min</label>
          <input
            type="number"
            name="desiredSalaryMin"
            defaultValue={profile?.desired_salary_min ?? ""}
            min={0}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Desired salary max</label>
          <input
            type="number"
            name="desiredSalaryMax"
            defaultValue={profile?.desired_salary_max ?? ""}
            min={0}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Availability</label>
          <select
            name="availability"
            defaultValue={profile?.availability ?? "immediate"}
            className="input-field"
          >
            <option value="immediate">Immediate</option>
            <option value="2_weeks">2 weeks notice</option>
            <option value="1_month">1 month notice</option>
            <option value="not_looking">Not currently looking</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">LinkedIn</label>
          <input
            name="linkedin"
            defaultValue={profile?.links?.linkedin ?? ""}
            placeholder="https://linkedin.com/in/..."
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">GitHub</label>
          <input
            name="github"
            defaultValue={profile?.links?.github ?? ""}
            placeholder="https://github.com/..."
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Portfolio</label>
          <input
            name="portfolio"
            defaultValue={profile?.links?.portfolio ?? ""}
            placeholder="https://yoursite.com"
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="isOpenToWork"
            name="isOpenToWork"
            defaultChecked={profile?.is_open_to_work ?? true}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="isOpenToWork" className="text-sm font-medium">
            Open to work — visible to recruiters and eligible for AI matching
          </label>
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

const resumeInitialState: ProfileState = {};

export function ResumeUploadForm({ profile }: { profile: CandidateProfile | null }) {
  const [state, formAction, isPending] = useActionState(uploadResume, resumeInitialState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasResume = Boolean(profile?.resume_url);

  return (
    <form action={formAction} className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume</h2>
        <p className="text-sm text-gray-500">
          Upload a PDF. We extract the text so the AI matcher can compare it against job listings.
        </p>
      </div>

      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4" /> Resume uploaded and parsed.
        </div>
      )}

      {hasResume && (
        <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
          <FileText className="h-4 w-4 text-brand-600" />
          <span className="text-gray-700 dark:text-gray-300">
            A resume is on file
            {profile?.resume_parsed_at &&
              ` — parsed ${new Date(profile.resume_parsed_at).toLocaleDateString()}`}
            .
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700",
        )}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <Upload className="h-6 w-6 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click to choose a PDF file (max 5MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          name="resume"
          accept="application/pdf"
          className="hidden"
          required
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Uploading..." : hasResume ? "Replace resume" : "Upload resume"}
      </button>
    </form>
  );
}

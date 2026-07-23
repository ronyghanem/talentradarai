"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { upsertCompany, type CompanyState } from "@/lib/actions/companies";
import type { Company } from "@/types/database";

const initialState: CompanyState = {};

export function CompanyForm({ company }: { company: Company | null }) {
  const [state, formAction, isPending] = useActionState(upsertCompany, initialState);

  return (
    <form action={formAction} className="card space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company profile</h2>
        <p className="text-sm text-gray-500">
          This shows up on every job you post — candidates see it before they apply.
        </p>
      </div>

      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4" /> Company profile saved.
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Company name</label>
        <input
          name="name"
          defaultValue={company?.name ?? ""}
          placeholder="OUR EASY GAME LLC"
          className="input-field"
          maxLength={150}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Website</label>
          <input
            name="website"
            defaultValue={company?.website ?? ""}
            placeholder="https://yourcompany.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Industry</label>
          <input
            name="industry"
            defaultValue={company?.industry ?? ""}
            placeholder="Gaming, Fintech, Healthcare..."
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Company size</label>
          <select
            name="companySize"
            defaultValue={company?.company_size ?? ""}
            className="input-field"
          >
            <option value="">Select...</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201-500">201–500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Logo URL</label>
          <input
            name="logoUrl"
            defaultValue={company?.logo_url ?? ""}
            placeholder="https://yourcompany.com/logo.png"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">About the company</label>
        <textarea
          name="description"
          defaultValue={company?.description ?? ""}
          rows={4}
          placeholder="What you do, your mission, what makes working here worthwhile."
          className="input-field"
          maxLength={2000}
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Saving..." : "Save company profile"}
      </button>
    </form>
  );
}

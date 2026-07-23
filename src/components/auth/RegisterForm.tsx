"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Briefcase, User, Loader2 } from "lucide-react";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

const initialState: AuthState = {};

export function RegisterForm({ defaultRole }: { defaultRole: "candidate" | "recruiter" }) {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [role, setRole] = useState<"candidate" | "recruiter">(defaultRole);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("candidate")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition",
            role === "candidate"
              ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
              : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800"
          )}
        >
          <User className="h-5 w-5" />
          I am a candidate
        </button>
        <button
          type="button"
          onClick={() => setRole("recruiter")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition",
            role === "recruiter"
              ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
              : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800"
          )}
        >
          <Briefcase className="h-5 w-5" />
          I am hiring
        </button>
      </div>
      <input type="hidden" name="role" value={role} />

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Full name
        </label>
        <input id="fullName" name="fullName" type="text" required className="input-field" placeholder="Jane Doe" />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input-field" placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="input-field"
          placeholder="At least 8 characters"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

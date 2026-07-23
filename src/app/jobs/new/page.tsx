import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/auth";
import { createJob } from "@/lib/actions/jobs";
import { JobForm } from "@/components/jobs/JobForm";

export default async function NewJobPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "recruiter") redirect("/dashboard/candidate");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a job</h1>
        <p className="mt-1 text-sm text-gray-500">
          Saved as a draft first — you will publish it from the next screen.
        </p>
      </div>
      <JobForm action={createJob} submitLabel="Create draft" />
    </div>
  );
}

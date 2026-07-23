import { redirect, notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getJobById, updateJob } from "@/lib/actions/jobs";
import { JobForm } from "@/components/jobs/JobForm";
import { JobStatusControls } from "@/components/jobs/JobStatusControls";

export default async function EditJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "recruiter") redirect("/dashboard/candidate");

  const job = await getJobById(id);
  if (!job) notFound();
  if (job.recruiter_id !== profile.id) redirect("/dashboard/recruiter");

  const boundUpdate = updateJob.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit job</h1>
        {created && (
          <p className="mt-1 text-sm text-green-600">
            Draft created. Fill in the details below, then publish when ready.
          </p>
        )}
      </div>

      <JobStatusControls job={job} />
      <JobForm action={boundUpdate} job={job} submitLabel="Save changes" />
    </div>
  );
}

import { getPublishedJobs } from "@/lib/actions/jobs";
import { JobCard } from "@/components/jobs/JobCard";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const jobs = await getPublishedJobs(q);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Open roles</h1>
        <p className="mt-1 text-sm text-gray-500">{jobs.length} published job(s)</p>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by title..."
          className="input-field"
        />
        <button type="submit" className="btn-secondary shrink-0">
          Search
        </button>
      </form>

      {jobs.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No published jobs match yet. Check back soon.
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 flex gap-3">
            <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

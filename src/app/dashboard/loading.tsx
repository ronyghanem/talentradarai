export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

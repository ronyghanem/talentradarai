export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-surface">
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
        Loading...
      </div>
    </div>
  );
}

import Link from "next/link";
import { Radar } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-surface">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold text-brand-600">
          <Radar className="h-7 w-7" />
          <span className="text-xl">TalentRadar AI</span>
        </Link>
        <div className="card">{children}</div>
      </div>
    </div>
  );
}

import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-500">Log in to continue to your dashboard.</p>
      <LoginForm registered={params.registered === "true"} />
    </>
  );
}

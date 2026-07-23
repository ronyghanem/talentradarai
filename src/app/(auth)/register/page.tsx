import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const defaultRole = params.role === "recruiter" ? "recruiter" : "candidate";

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
      <p className="mb-6 text-sm text-gray-500">Choose how you will use TalentRadar AI.</p>
      <RegisterForm defaultRole={defaultRole} />
    </>
  );
}

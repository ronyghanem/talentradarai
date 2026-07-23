import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getMyCompany } from "@/lib/actions/companies";
import { CompanyForm } from "@/components/companies/CompanyForm";

export default async function CompanyPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "recruiter") redirect("/dashboard/candidate");

  const company = await getMyCompany();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your company</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set this up once — it is attached automatically to every job you post.
        </p>
      </div>
      <CompanyForm company={company} />
    </div>
  );
}

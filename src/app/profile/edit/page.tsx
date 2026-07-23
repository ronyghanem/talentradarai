import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getCandidateProfile } from "@/lib/actions/profile";
import { ProfileDetailsForm, ResumeUploadForm } from "@/components/profile/ProfileForm";

export default async function EditProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "candidate") {
    redirect("/dashboard/recruiter");
  }

  const candidateProfile = await getCandidateProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit your profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Keep this up to date — it is how recruiters and our AI matcher find you.
        </p>
      </div>

      <ResumeUploadForm profile={candidateProfile} />
      <ProfileDetailsForm profile={candidateProfile} />
    </div>
  );
}

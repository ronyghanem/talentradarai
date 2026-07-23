// Mirrors supabase/schema.sql.

export type UserRole = "candidate" | "recruiter";
export type JobStatus = "draft" | "published" | "closed";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "remote";
export type ApplicationStatus = "applied" | "reviewing" | "shortlisted" | "rejected" | "hired";
export type Availability = "immediate" | "2_weeks" | "1_month" | "not_looking";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateProfile {
  id: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  years_experience: number;
  skills: string[];
  desired_role: string | null;
  desired_salary_min: number | null;
  desired_salary_max: number | null;
  availability: Availability;
  links: { linkedin?: string; github?: string; portfolio?: string };
  resume_url: string | null;
  resume_text: string | null;
  resume_parsed_at: string | null;
  is_open_to_work: boolean;
  updated_at: string;
}

export interface Company {
  id: string;
  recruiter_id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  industry: string | null;
  company_size: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  recruiter_id: string;
  company_id: string | null;
  title: string;
  description: string;
  responsibilities: string[] | null;
  requirements: string[] | null;
  skills_required: string[];
  location: string | null;
  employment_type: EmploymentType;
  salary_min: number | null;
  salary_max: number | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  cover_note: string | null;
  match_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  job_id: string;
  candidate_id: string;
  score: number;
  reasoning: string | null;
  created_at: string;
}

// Joined shapes used throughout the UI
export type JobWithCompany = Job & { company: Company | null };
export type ApplicationWithJob = Application & { job: Job };
export type ApplicationWithCandidate = Application & {
  candidate: Profile & { candidate_profiles: CandidateProfile };
};
export type MatchWithCandidate = Match & {
  candidate: Profile & { candidate_profiles: CandidateProfile };
};

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      candidate_profiles: {
        Row: CandidateProfile;
        Insert: Partial<CandidateProfile>;
        Update: Partial<CandidateProfile>;
      };
      companies: { Row: Company; Insert: Partial<Company>; Update: Partial<Company> };
      jobs: { Row: Job; Insert: Partial<Job>; Update: Partial<Job> };
      applications: {
        Row: Application;
        Insert: Partial<Application>;
        Update: Partial<Application>;
      };
      matches: { Row: Match; Insert: Partial<Match>; Update: Partial<Match> };
    };
  };
}

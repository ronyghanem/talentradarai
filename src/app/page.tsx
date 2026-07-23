import Link from "next/link";
import { ArrowRight, UserCircle2, Briefcase, Sparkles } from "lucide-react";
import { RadarHero } from "@/components/landing/RadarHero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-radar-grid px-3 py-1 font-mono text-xs uppercase tracking-widest text-radar-ping">
              <Sparkles className="h-3 w-3" /> AI-powered matching
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Stop applying everywhere.
              <br />
              Let the right roles find you.
            </h1>
            <p className="mt-5 max-w-md text-base text-gray-400">
              Upload your profile once. Recruiters post what they need. Our matching engine scores
              the fit and surfaces it — no more sending the same resume into a hundred black holes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register?role=candidate" className="btn-primary">
                Find your match <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register?role=recruiter"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-gray-800"
              >
                Post a job
              </Link>
            </div>
          </div>

          <RadarHero />
        </div>
      </section>

      {/* How it works — numbered because it's a literal sequence */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          How it works
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Build one profile",
              body: "Skills, experience, resume. Fill it out once — it works for every job on the platform.",
            },
            {
              step: "02",
              title: "Recruiters post roles",
              body: "Companies list what they need: required skills, experience level, salary range.",
            },
            {
              step: "03",
              title: "AI scores the fit",
              body: "Every candidate gets matched against every open role, ranked by genuine fit — not keywords.",
            },
          ].map((item) => (
            <div key={item.step}>
              <span className="font-mono text-sm text-radar-sweep dark:text-radar-sweep">
                {item.step}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual audience CTA */}
      <section className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-2">
          <div className="card flex flex-col">
            <UserCircle2 className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 font-display text-xl font-semibold text-gray-900 dark:text-white">
              For candidates
            </h3>
            <p className="mt-2 flex-1 text-sm text-gray-500">
              One profile, real matches. Track every application in one place, and get surfaced to
              roles you would never have found by browsing alone.
            </p>
            <Link
              href="/register?role=candidate"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
            >
              Create your profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="card flex flex-col">
            <Briefcase className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 font-display text-xl font-semibold text-gray-900 dark:text-white">
              For recruiters
            </h3>
            <p className="mt-2 flex-1 text-sm text-gray-500">
              Post a role in minutes. Skip manual resume screening — see candidates ranked by AI
              fit score, with reasoning, from day one.
            </p>
            <Link
              href="/register?role=recruiter"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
            >
              Post your first job <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-gray-400">
        TalentRadar AI — built with Next.js and Supabase.
      </footer>
    </div>
  );
}

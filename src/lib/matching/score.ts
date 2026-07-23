import type { CandidateProfile, Job } from "@/types/database";

export interface MatchResult {
  score: number; // 0-100
  reasoning: string;
}

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Scores how well a candidate fits a job. Uses Gemini if GEMINI_API_KEY is
 * set; otherwise (or on any API error) falls back to a skill-overlap
 * heuristic so the feature always works, just with lower-quality reasoning.
 */
export async function scoreCandidateForJob(
  candidate: CandidateProfile,
  job: Job
): Promise<MatchResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await scoreWithGemini(candidate, job, apiKey);
    } catch (err) {
      console.error("Gemini scoring failed, falling back to heuristic:", err);
    }
  }

  return scoreWithHeuristic(candidate, job);
}

async function scoreWithGemini(
  candidate: CandidateProfile,
  job: Job,
  apiKey: string
): Promise<MatchResult> {
  const prompt = buildPrompt(candidate, job);

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned no content");
  }

  const parsed = JSON.parse(text) as { score: number; reasoning: string };

  return {
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
    reasoning: parsed.reasoning?.slice(0, 500) ?? "",
  };
}

function buildPrompt(candidate: CandidateProfile, job: Job): string {
  const candidateSummary = [
    candidate.headline && `Headline: ${candidate.headline}`,
    candidate.bio && `Bio: ${candidate.bio}`,
    candidate.skills?.length && `Skills: ${candidate.skills.join(", ")}`,
    `Years of experience: ${candidate.years_experience}`,
    candidate.desired_role && `Desired role: ${candidate.desired_role}`,
    candidate.resume_text && `Resume excerpt: ${candidate.resume_text.slice(0, 3000)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const jobSummary = [
    `Title: ${job.title}`,
    `Description: ${job.description}`,
    job.skills_required?.length && `Required skills: ${job.skills_required.join(", ")}`,
    job.requirements?.length && `Requirements: ${job.requirements.join("; ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are a recruiting assistant scoring how well a candidate fits a job opening.

JOB:
${jobSummary}

CANDIDATE:
${candidateSummary}

Score the fit from 0 to 100, where 100 is a perfect match. Consider skills overlap, relevant experience, and stated career direction. Respond with ONLY a JSON object in this exact shape, no markdown, no extra text:
{"score": <number 0-100>, "reasoning": "<one or two sentence explanation, under 40 words>"}`;
}

/** Free, no-API-key fallback: percentage of the job's required skills the candidate lists. */
function scoreWithHeuristic(candidate: CandidateProfile, job: Job): MatchResult {
  const required = (job.skills_required ?? []).map((s) => s.toLowerCase().trim());
  const owned = new Set((candidate.skills ?? []).map((s) => s.toLowerCase().trim()));

  if (required.length === 0) {
    return { score: 0, reasoning: "This job has no required skills listed to match against." };
  }

  const matched = required.filter((skill) => owned.has(skill));
  const score = Math.round((matched.length / required.length) * 100);

  const reasoning =
    matched.length > 0
      ? `Matches ${matched.length} of ${required.length} required skills: ${matched.join(", ")}.`
      : `No overlap with the ${required.length} required skill(s) for this role.`;

  return { score, reasoning };
}

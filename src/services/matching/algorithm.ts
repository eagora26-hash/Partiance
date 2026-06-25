/**
 * PARTIANCE MATCHING ALGORITHM (MATCHING_ENGINE.md)
 *
 * Deterministic, explainable compatibility scoring. Pure functions — no DB, no IO —
 * so it is fully unit-testable and reproducible. The matching engine is
 * "deterministic + AI-assisted, not AI-driven" (SYSTEM_INTEGRATION_MAP); AI may
 * later enrich `reasons`, but the score itself is computed here.
 *
 * Weights (must sum to 100):
 *   35 skills · 25 goals · 15 industry · 10 availability · 10 personality · 5 location
 *
 * Core insight: co-founders want COMPLEMENTARY skills but SHARED goals/industry/values.
 */

export const WEIGHTS = {
  skills: 35,
  goals: 25,
  industry: 15,
  availability: 10,
  personality: 10,
  location: 5,
} as const;

export type Dimension = keyof typeof WEIGHTS;

export type Personality = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  risk: number;
};

export type MatchCandidate = {
  skillIds: string[];
  goalIds: string[];
  industryIds: string[];
  availability: string | null;
  personality: Personality | null;
  city: string | null;
};

export type MatchBreakdown = Record<Dimension, number>; // each 0..100 (per-dimension fit)

export type MatchResult = {
  score: number; // 0..100 weighted overall
  breakdown: MatchBreakdown;
  /** i18n reason keys for the dimensions that contributed most (always explained). */
  reasons: string[];
};

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Skills: reward COMPLEMENTARY coverage, lightly penalise total overlap or no overlap. */
function skillScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let shared = 0;
  for (const x of setA) if (setB.has(x)) shared++;
  const union = new Set([...a, ...b]).size;
  const complementary = union - shared; // distinct skills the pair collectively brings
  const coverage = complementary / union; // breadth of combined skillset
  const someCommonGround = shared > 0 ? 1 : 0.7; // a little shared context helps
  return Math.round(Math.min(1, coverage * 0.85 + 0.15) * someCommonGround * 100);
}

/** Availability compatibility matrix (closer cadence = better). */
function availabilityScore(a: string | null, b: string | null): number {
  if (!a || !b) return 50;
  const rank: Record<string, number> = { FULL_TIME: 3, PART_TIME: 2, WEEKENDS: 1, OCCASIONAL: 0 };
  const diff = Math.abs((rank[a] ?? 0) - (rank[b] ?? 0));
  return [100, 80, 55, 30][diff] ?? 30;
}

/** Personality: complementary on risk/extraversion, aligned on conscientiousness. */
function personalityScore(a: Personality | null, b: Personality | null): number {
  if (!a || !b) return 50;
  const align = (x: number, y: number) => 100 - Math.abs(x - y); // similar is better
  const complement = (x: number, y: number) => {
    // moderate difference is ideal (not identical, not opposite)
    const d = Math.abs(x - y);
    return 100 - Math.abs(d - 40); // peak around a 40-pt difference
  };
  const score =
    align(a.conscientiousness, b.conscientiousness) * 0.35 +
    align(a.agreeableness, b.agreeableness) * 0.25 +
    complement(a.risk, b.risk) * 0.25 +
    complement(a.extraversion, b.extraversion) * 0.15;
  return Math.round(Math.max(0, Math.min(100, score)));
}

function locationScore(a: string | null, b: string | null): number {
  if (!a || !b) return 40;
  return a.trim().toLowerCase() === b.trim().toLowerCase() ? 100 : 35;
}

/**
 * Compute compatibility between two candidates.
 * Returns weighted 0..100 score, per-dimension breakdown, and explained reasons.
 */
export function computeMatch(a: MatchCandidate, b: MatchCandidate): MatchResult {
  const breakdown: MatchBreakdown = {
    skills: skillScore(a.skillIds, b.skillIds),
    goals: Math.round(jaccard(a.goalIds, b.goalIds) * 100),
    industry: Math.round(jaccard(a.industryIds, b.industryIds) * 100),
    availability: availabilityScore(a.availability, b.availability),
    personality: personalityScore(a.personality, b.personality),
    location: locationScore(a.city, b.city),
  };

  const score = Math.round(
    (Object.keys(WEIGHTS) as Dimension[]).reduce(
      (sum, dim) => sum + (breakdown[dim] * WEIGHTS[dim]) / 100,
      0
    )
  );

  // Explain: surface the strongest dimensions (>= 60 fit), highest first, max 5.
  const reasons = (Object.keys(WEIGHTS) as Dimension[])
    .filter((dim) => breakdown[dim] >= 60)
    .sort((x, y) => breakdown[y] - breakdown[x])
    .slice(0, 5)
    .map((dim) => `match.reason.${dim}`);

  // Never return zero reasons — always explain the best available signal.
  if (reasons.length === 0) {
    const best = (Object.keys(WEIGHTS) as Dimension[]).sort((x, y) => breakdown[y] - breakdown[x])[0];
    reasons.push(`match.reason.${best}`);
  }

  return { score, breakdown, reasons };
}

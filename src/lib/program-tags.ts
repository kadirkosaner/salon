/** Normalize free-form programs.tags into filter facets. */

export type ProgramLevel = "baslangic" | "orta" | "ileri";
export type ProgramGoal = "guc" | "hipertrofi" | "kilo";
export type ProgramEquipment = "barbell" | "dumbbell" | "makine" | "vucut";

export type ProgramFacets = {
  days: number | null;
  level: ProgramLevel | null;
  goals: ProgramGoal[];
  equipment: ProgramEquipment[];
  raw: string[];
};

const DAY_RE = /^(\d+)\s*gun$/i;

export function parseProgramTags(tags: string | null | undefined): ProgramFacets {
  const raw = (tags ?? "")
    .split(/[,;|]/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  let days: number | null = null;
  let level: ProgramLevel | null = null;
  const goals: ProgramGoal[] = [];
  const equipment: ProgramEquipment[] = [];

  for (const t of raw) {
    const dm = t.match(DAY_RE);
    if (dm) {
      days = Number(dm[1]);
      continue;
    }
    if (t === "3gun" || t === "3-gun") days = 3;
    if (t === "4gun" || t === "4-gun") days = 4;
    if (t === "5gun" || t === "5-gun") days = 5;
    if (t === "6gun" || t === "6-gun") days = 6;

    if (t === "baslangic" || t === "beginner") level = "baslangic";
    if (t === "orta" || t === "intermediate") level = "orta";
    if (t === "ileri" || t === "advanced") level = "ileri";

    if (t === "guc" || t === "güç" || t === "strength" || t === "power") {
      if (!goals.includes("guc")) goals.push("guc");
    }
    if (t === "hipertrofi" || t === "hypertrophy" || t === "kas") {
      if (!goals.includes("hipertrofi")) goals.push("hipertrofi");
    }
    if (t === "kilo" || t === "fatloss" || t === "zayiflama" || t === "weightloss") {
      if (!goals.includes("kilo")) goals.push("kilo");
    }

    if (t === "barbell" || t === "halter") {
      if (!equipment.includes("barbell")) equipment.push("barbell");
    }
    if (t === "dumbbell" || t === "dambıl" || t === "dambil") {
      if (!equipment.includes("dumbbell")) equipment.push("dumbbell");
    }
    if (t === "makine" || t === "machine" || t === "cable") {
      if (!equipment.includes("makine")) equipment.push("makine");
    }
    if (t === "vucut" || t === "bodyweight" || t === "bw") {
      if (!equipment.includes("vucut")) equipment.push("vucut");
    }
  }

  // Infer days from day_count if tags missing — caller may fill later
  return { days, level, goals, equipment, raw };
}

export type DiscoverFilters = {
  days: number | null;
  level: ProgramLevel | null;
  goal: ProgramGoal | null;
  equipment: ProgramEquipment | null;
};

export function emptyFilters(): DiscoverFilters {
  return { days: null, level: null, goal: null, equipment: null };
}

export function matchesFilters(
  tags: string | null | undefined,
  dayCount: number,
  f: DiscoverFilters,
): boolean {
  const p = parseProgramTags(tags);
  const days = p.days ?? dayCount;
  if (f.days != null && days !== f.days) return false;
  if (f.level != null && p.level !== f.level) return false;
  if (f.goal != null && !p.goals.includes(f.goal)) return false;
  if (f.equipment != null && !p.equipment.includes(f.equipment)) return false;
  return true;
}

export function hasActiveFilters(f: DiscoverFilters): boolean {
  return f.days != null || f.level != null || f.goal != null || f.equipment != null;
}

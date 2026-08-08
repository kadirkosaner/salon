import type { Sql } from "@/lib/db";
import { EXERCISE_LIBRARY } from "@/data/library";
import dataset from "@/data/exercises-dataset-slim.json";

type DatasetEx = {
  id: string;
  name: string;
  muscle: string;
  equipment?: string;
  target?: string;
  gif?: string | null;
  image?: string | null;
  note?: string | null;
};

const DATASET = dataset as DatasetEx[];

const STOP = new Set([
  "the",
  "and",
  "with",
  "for",
  "from",
  "a",
  "an",
  "of",
  "to",
  "on",
  "in",
  "sz",
  "v",
  "bar",
]);

function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/°/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map common program names → dataset search needles */
const ALIASES: Record<string, string[]> = {
  "Dumbbell Bench Press": ["dumbbell bench press"],
  "Incline Dumbbell Press": [
    "dumbbell incline bench press",
    "incline dumbbell press",
    "dumbbell incline press",
  ],
  "Seated Dumbbell Shoulder Press": [
    "dumbbell seated shoulder press",
    "dumbbell shoulder press",
  ],
  "Standing Dumbbell Shoulder Press": [
    "dumbbell standing overhead press",
    "dumbbell shoulder press",
  ],
  "Arnold Press": ["dumbbell arnold press", "arnold press"],
  "Incline Dumbbell Fly": ["dumbbell incline fly", "incline dumbbell fly"],
  "Cable Fly": ["cable fly", "cable standing fly", "cable mid fly"],
  "Lateral Raise": ["dumbbell lateral raise", "cable lateral raise"],
  "Rear Delt Fly": [
    "dumbbell rear delt raise",
    "rear delt fly",
    "dumbbell reverse fly",
  ],
  "Face Pull": [
    "cable rear delt row (stirrups)",
    "cable kneeling rear delt row",
    "cable rear delt row",
    "band standing rear delt row",
    "face pull",
  ],
  "Triceps Pushdown": [
    "cable pushdown",
    "triceps pushdown",
    "rope pushdown",
    "cable triceps pushdown",
  ],
  "Overhead Triceps Extension": [
    "dumbbell seated overhead triceps",
    "overhead triceps",
    "dumbbell standing overhead triceps",
  ],
  Dips: ["chest dip", "triceps dip", "dip"],
  "Barbell Bench Press": ["barbell bench press"],
  "Standing Barbell Overhead Press": [
    "barbell standing military press",
    "barbell overhead press",
  ],
  "Chest-Supported Row": [
    "chest supported",
    "lever seated row",
    "dumbbell incline row",
    "chest supported row",
  ],
  "Machine Row": ["lever seated row", "cable seated row", "seated row"],
  "Single-Arm Machine Row": [
    "cable one arm seated row",
    "dumbbell one arm row",
  ],
  "Barbell Row": ["barbell bent over row", "barbell reverse grip bent over row"],
  "T-Bar Row": ["barbell t-bar row", "t-bar row", "lever t-bar row"],
  "Dumbbell Row": ["dumbbell bent over row", "dumbbell one arm row"],
  "Lat Pulldown": [
    "cable lat pulldown",
    "lat pulldown",
    "cable wide grip lat",
    "wide grip lat pulldown",
  ],
  "Pull-up": ["pull-up", "pull up", "assisted pull-up"],
  "Straight-Arm Pulldown": ["cable straight arm pull", "straight arm pulldown"],
  "Dumbbell Shrug": ["dumbbell shrug"],
  "Barbell Shrug": ["barbell shrug"],
  "Biceps Curl": ["dumbbell biceps curl", "barbell curl", "dumbbell curl"],
  "Hammer Curl": ["dumbbell hammer curl", "hammer curl"],
  Deadlift: ["barbell deadlift", "deadlift"],
  "Romanian Deadlift": [
    "barbell romanian deadlift",
    "dumbbell romanian deadlift",
  ],
  "Leg Press": ["sled 45 leg press", "sled 45 leg press", "leg press"],
  "Squat Machine": ["lever squat", "hack squat", "sled hack squat"],
  Squat: ["barbell full squat", "barbell squat", "squat"],
  "Walking Lunge": ["dumbbell walking lunge", "walking lunge"],
  "Bulgarian Split Squat": [
    "dumbbell bulgarian split squat",
    "bulgarian split squat",
  ],
  "Hip Thrust": ["barbell hip thrust", "hip thrust"],
  "Leg Extension": ["lever leg extension", "leg extension"],
  "Leg Curl": ["lever lying leg curl", "seated leg curl", "leg curl"],
  "Standing Calf Raise": ["lever standing calf raise", "standing calf raise"],
  "Seated Calf Raise": ["lever seated calf raise", "seated calf raise"],
  "Leg Press Calf Raise": ["sled calf press", "leg press calf"],
  "Farmer's Walk": ["farmers walk", "farmer walk", "dumbbell farmers walk"],
  "Suitcase Carry": ["suitcase", "farmers walk"],
  Plank: ["plank"],
  Mekik: ["sit-up", "crunch", "3/4 sit-up"],
  "Topuklara Dokunma": ["heel touch", "alternate heel touchers"],
  Makas: ["flutter kicks", "scissor"],
  "Hanging Leg Raise": ["hanging leg raise", "captains chair leg raise"],
  "Kablo Crunch": ["cable crunch", "cable kneeling crunch"],
  "Pallof Press": ["pallof", "cable anti rotation"],
  "Ağırlıklı Side Bend": ["dumbbell side bend", "side bend"],
};

/** Alias lookup by normalized key (case-insensitive). */
function aliasNeedles(name: string): string[] {
  const exact = ALIASES[name];
  if (exact) return exact.map(norm);
  const n = norm(name);
  for (const [k, v] of Object.entries(ALIASES)) {
    if (norm(k) === n) return v.map(norm);
  }
  return [n];
}

export function findDataset(name: string): DatasetEx | undefined {
  const needles = aliasNeedles(name);
  // 1) exact name match against needles
  for (const n of needles) {
    const exact = DATASET.find((d) => norm(d.name) === n);
    if (exact) return exact;
  }
  // 2) includes either way
  for (const n of needles) {
    const hit = DATASET.find(
      (d) => norm(d.name).includes(n) || n.includes(norm(d.name)),
    );
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Best-effort resolve to a dataset row with media.
 * Uses aliases first, then exact, then token scoring.
 */
export function resolveDataset(name: string): DatasetEx | undefined {
  if (!name?.trim()) return undefined;
  const aliased = findDataset(name);
  if (aliased?.gif || aliased?.image) return aliased;
  if (aliased) return aliased;

  const nq = norm(name);
  if (nq.length < 2) return undefined;

  // exact
  const exact = DATASET.find((d) => norm(d.name) === nq);
  if (exact) return exact;

  // full substring
  const sub = DATASET.find(
    (d) => norm(d.name).includes(nq) || nq.includes(norm(d.name)),
  );
  if (sub && (nq.length >= 6 || norm(sub.name).split(" ").length <= 4)) {
    return sub;
  }

  const tokens = nq.split(" ").filter((t) => t.length > 2 && !STOP.has(t));
  if (tokens.length === 0) return undefined;

  let best: DatasetEx | undefined;
  let bestScore = -Infinity;
  for (const d of DATASET) {
    const xn = norm(d.name);
    let score = 0;
    let matched = 0;
    for (const t of tokens) {
      if (xn.includes(t)) {
        score += t.length >= 5 ? 3 : 2;
        matched += 1;
      }
    }
    if (matched === 0) continue;
    // all tokens covered is strong
    if (matched === tokens.length) score += 6;
    // prefer shorter names (less equipment junk)
    score -= Math.max(0, xn.split(" ").length - tokens.length) * 0.35;
    // slight boost if first token matches start
    if (xn.startsWith(tokens[0]!)) score += 1.5;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }

  // require at least half of tokens + min score
  const minMatched = Math.ceil(tokens.length * 0.6);
  if (!best) return undefined;
  // recompute matched for threshold
  const xn = norm(best.name);
  const matched = tokens.filter((t) => xn.includes(t)).length;
  if (matched < minMatched || bestScore < 4) return undefined;
  return best;
}

/** Search dataset by free text (for swap library expansion without full DB insert). */
export function searchDataset(q: string, limit = 40): DatasetEx[] {
  const nq = norm(q);
  if (!nq || nq.length < 1) return [];
  const hits: DatasetEx[] = [];
  const seen = new Set<string>();

  // Prefer strong resolve hit first
  const top = resolveDataset(q);
  if (top) {
    hits.push(top);
    seen.add(top.id);
  }

  // substring
  for (const d of DATASET) {
    if (seen.has(d.id)) continue;
    if (norm(d.name).includes(nq)) {
      hits.push(d);
      seen.add(d.id);
      if (hits.length >= limit) return hits;
    }
  }

  // token any-match fill
  if (hits.length < limit) {
    const tokens = nq.split(" ").filter((t) => t.length > 2 && !STOP.has(t));
    if (tokens.length) {
      for (const d of DATASET) {
        if (seen.has(d.id)) continue;
        const xn = norm(d.name);
        if (tokens.some((t) => xn.includes(t))) {
          hits.push(d);
          seen.add(d.id);
          if (hits.length >= limit) break;
        }
      }
    }
  }
  return hits;
}

/** Browse dataset by muscle group (full catalog browse, not just search). */
export function browseDatasetByMuscle(
  muscle: string | null | undefined,
  limit = 120,
  offset = 0,
): DatasetEx[] {
  const m = (muscle ?? "").trim();
  const rows = m
    ? DATASET.filter((d) => d.muscle === m)
    : DATASET;
  return rows.slice(offset, offset + limit);
}

export function datasetCount(muscle?: string | null): number {
  const m = (muscle ?? "").trim();
  if (!m) return DATASET.length;
  return DATASET.filter((d) => d.muscle === m).length;
}

let mediaColumnsReady: boolean | null = null;
async function hasMediaColumns(sql: Sql): Promise<boolean> {
  if (mediaColumnsReady != null) return mediaColumnsReady;
  try {
    await sql`select gif_url from exercises limit 0`;
    mediaColumnsReady = true;
  } catch {
    mediaColumnsReady = false;
  }
  return mediaColumnsReady;
}

/** Process-wide: library seed runs at most once per boot. */
const librarySeedGlobal = globalThis as typeof globalThis & {
  __exerciseLibrarySeed__?: Promise<void>;
};

/**
 * Core library only + GIF/media enrichment from exercises-dataset.
 * Idempotent and **O(1) round-trips after first fill** (process memo + count check).
 * Full 1324 list is available via searchDataset / ensureDatasetExercise (on demand).
 */
export async function ensureExerciseLibrary(sql: Sql): Promise<void> {
  if (librarySeedGlobal.__exerciseLibrarySeed__) {
    return librarySeedGlobal.__exerciseLibrarySeed__;
  }
  librarySeedGlobal.__exerciseLibrarySeed__ = (async () => {
    // Fast path: already have full core library → 1 query, done.
    const cnt = await sql<{ n: number }>`
      select count(*)::int as n from exercises where owner_id is null
    `;
    if ((cnt[0]?.n ?? 0) >= EXERCISE_LIBRARY.length) {
      return;
    }

    const media = await hasMediaColumns(sql);
    const existing = await sql<{ id: number; name: string; external_id: string | null }>`
      select id, name, external_id from exercises where owner_id is null
    `;
    const have = new Map(existing.map((e) => [e.name, e]));
    const usedExt = new Set(
      existing.map((e) => e.external_id).filter((x): x is string => !!x),
    );

    // Batch missing inserts (one statement per missing row is still bad —
    // use a single multi-row insert via sql.query when possible).
    const missing = EXERCISE_LIBRARY.filter((ex) => !have.has(ex.name));
    if (missing.length > 0) {
      // Chunk to keep params reasonable
      const CHUNK = 25;
      for (let i = 0; i < missing.length; i += CHUNK) {
        const chunk = missing.slice(i, i + CHUNK);
        if (media) {
          const values: unknown[] = [];
          const placeholders: string[] = [];
          let p = 1;
          for (const ex of chunk) {
            const ds = findDataset(ex.name);
            let ext: string | null = null;
            if (ds?.id && !usedExt.has(ds.id)) {
              ext = ds.id;
              usedExt.add(ds.id);
            }
            placeholders.push(
              `(null, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`,
            );
            values.push(
              ex.name,
              ex.detail ?? null,
              ex.unit ?? "kg",
              ex.muscle_group,
              ds?.note ?? null,
              ext,
              ds?.gif ?? null,
              ds?.image ?? null,
              ds?.note ?? null,
            );
          }
          await sql.query(
            `insert into exercises (
              owner_id, name, detail, unit, muscle_group, default_note,
              external_id, gif_url, image_url, form_cues
            ) values ${placeholders.join(", ")}`,
            values,
          );
        } else {
          const values: unknown[] = [];
          const placeholders: string[] = [];
          let p = 1;
          for (const ex of chunk) {
            placeholders.push(`(null, $${p++}, $${p++}, $${p++}, $${p++})`);
            values.push(
              ex.name,
              ex.detail ?? null,
              ex.unit ?? "kg",
              ex.muscle_group,
            );
          }
          await sql.query(
            `insert into exercises (owner_id, name, detail, unit, muscle_group)
             values ${placeholders.join(", ")}`,
            values,
          );
        }
      }
    }

    // One-shot media backfill for rows still missing gif (single UPDATE…FROM style)
    if (media) {
      // Only enrich names that exist but lack gif — still avoid per-row SELECT.
      // Build name→dataset map in memory, then 1 UPDATE per row that needs it
      // is still heavy; instead skip if most already have media.
      const need = await sql<{ id: number; name: string }>`
        select id, name from exercises
        where owner_id is null and gif_url is null
        limit 80
      `;
      if (need.length > 0 && need.length <= EXERCISE_LIBRARY.length) {
        // Batch CASE update would be ideal; do a single transaction with fewer
        // statements only for rows that map to dataset.
        for (const row of need) {
          const ds = findDataset(row.name);
          if (!ds) continue;
          await sql`
            update exercises set
              gif_url = coalesce(gif_url, ${ds.gif ?? null}),
              image_url = coalesce(image_url, ${ds.image ?? null}),
              form_cues = coalesce(form_cues, ${ds.note ?? null}),
              default_note = coalesce(default_note, ${ds.note ?? null}),
              external_id = coalesce(external_id, ${
                ds.id && !usedExt.has(ds.id) ? ds.id : null
              })
            where id = ${row.id}
          `;
          if (ds.id) usedExt.add(ds.id);
        }
      }
    }
  })().catch((err) => {
    librarySeedGlobal.__exerciseLibrarySeed__ = undefined;
    throw err;
  });
  return librarySeedGlobal.__exerciseLibrarySeed__;
}

/** Insert a dataset exercise into DB on demand (for full catalog pick). */
export async function ensureDatasetExercise(
  sql: Sql,
  externalId: string,
): Promise<number | null> {
  const ds = DATASET.find((d) => d.id === externalId);
  if (!ds) return null;

  const media = await hasMediaColumns(sql);

  // Prefer external_id match
  if (media) {
    const existing = await sql<{ id: number }>`
      select id from exercises where external_id = ${externalId} limit 1
    `;
    if (existing[0]) return existing[0].id;
  }

  const display = ds.name
    .split(" ")
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");

  const byName = await sql<{ id: number }>`
    select id from exercises where lower(name) = lower(${display}) and owner_id is null limit 1
  `;
  if (byName[0]) {
    if (media) {
      try {
        await sql`
          update exercises set
            external_id = coalesce(external_id, ${ds.id}),
            gif_url = coalesce(gif_url, ${ds.gif ?? null}),
            image_url = coalesce(image_url, ${ds.image ?? null}),
            form_cues = coalesce(form_cues, ${ds.note ?? null})
          where id = ${byName[0].id}
        `;
      } catch {
        /* ignore */
      }
    }
    return byName[0].id;
  }

  if (media) {
    try {
      const rows = await sql<{ id: number }>`
        insert into exercises (
          owner_id, name, detail, unit, muscle_group, default_note,
          external_id, gif_url, image_url, form_cues
        ) values (
          null, ${display}, ${ds.equipment ?? null}, 'kg', ${ds.muscle},
          ${ds.note ?? null}, ${ds.id}, ${ds.gif ?? null}, ${ds.image ?? null}, ${ds.note ?? null}
        )
        returning id
      `;
      return rows[0]?.id ?? null;
    } catch {
      /* fall through to bare insert */
    }
  }

  const bare = await sql<{ id: number }>`
    insert into exercises (owner_id, name, detail, unit, muscle_group, default_note)
    values (
      null, ${display}, ${ds.equipment ?? null}, 'kg', ${ds.muscle}, ${ds.note ?? null}
    )
    returning id
  `;
  return bare[0]?.id ?? null;
}

export async function ensureUserSeeded(sql: Sql, userId: string): Promise<void> {
  await ensureExerciseLibrary(sql);
  await sql`
    insert into user_onboarding (user_id) values (${userId})
    on conflict (user_id) do nothing
  `;
}

/**
 * Preview / local demo admin.
 * Email: admin@salon.app · Password: admin1234
 * Idempotent — re-seeds password on every process boot (PGLite is in-memory).
 */
const adminSeedGlobal = globalThis as typeof globalThis & {
  __ensureAdminUser__?: Promise<void>;
};

export async function ensureAdminUser(sql: Sql): Promise<void> {
  if (adminSeedGlobal.__ensureAdminUser__) return adminSeedGlobal.__ensureAdminUser__;
  adminSeedGlobal.__ensureAdminUser__ = (async () => {
    const email = "admin@salon.app";
    const password = "admin1234";
    const name = "Admin";

    const existing = await sql<{ id: string }>`
      select id from "user" where email = ${email} limit 1
    `;

    const { hashPassword } = await import("better-auth/crypto");
    const hashed = await hashPassword(password);
    const now = new Date().toISOString();

    if (existing[0]) {
      const uid = existing[0].id;
      const acc = await sql<{ id: string }>`
        select id from account
        where "userId" = ${uid} and "providerId" = 'credential'
        limit 1
      `;
      if (acc[0]) {
        await sql`
          update account set password = ${hashed}, "updatedAt" = ${now}
          where id = ${acc[0].id}
        `;
      } else {
        const accId = `admin-cred-${uid.slice(0, 12)}`;
        await sql`
          insert into account (
            id, "accountId", "providerId", "userId", password,
            "createdAt", "updatedAt"
          ) values (
            ${accId}, ${uid}, 'credential', ${uid}, ${hashed},
            ${now}, ${now}
          )
        `;
      }
      return;
    }

    const userId = `admin-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    const accId = `admin-acc-${userId.slice(0, 16)}`;
    await sql`
      insert into "user" (
        id, name, email, "emailVerified", image, "createdAt", "updatedAt"
      ) values (
        ${userId}, ${name}, ${email}, true, null, ${now}, ${now}
      )
    `;
    await sql`
      insert into account (
        id, "accountId", "providerId", "userId", password,
        "createdAt", "updatedAt"
      ) values (
        ${accId}, ${userId}, 'credential', ${userId}, ${hashed},
        ${now}, ${now}
      )
    `;
  })().catch((err) => {
    adminSeedGlobal.__ensureAdminUser__ = undefined;
    console.error("[seed] ensureAdminUser failed:", err);
  });
  return adminSeedGlobal.__ensureAdminUser__;
}

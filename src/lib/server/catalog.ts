import { withTransaction, type Sql } from "@/lib/db";
import {
  DEFAULT_PROGRAM,
  DEFAULT_PROGRAM_DESCRIPTION,
  DEFAULT_PROGRAM_NAME,
  type ProgramDaySeed,
} from "@/data/library";
import { ensureExerciseLibrary } from "./seed";

type CatalogProgram = {
  key: string;
  name: string;
  description: string;
  tags: string;
  share_code: string;
  days: ProgramDaySeed[];
};

const CATALOG: CatalogProgram[] = [
  {
    key: "fullsplit6",
    name: DEFAULT_PROGRAM_NAME,
    description: DEFAULT_PROGRAM_DESCRIPTION,
    tags: "katalog,fullsplit,6gun,ileri,guc,hipertrofi,barbell",
    share_code: "FULL6X",
    days: DEFAULT_PROGRAM,
  },
  {
    key: "full3",
    name: "Full Body (3 gün)",
    description:
      "Başlangıç ve yoğun tempo için. Pazartesi / Çarşamba / Cuma full body.",
    tags: "katalog,baslangic,fullbody,3gun,hipertrofi,kilo,dumbbell",
    share_code: "FULL3X",
    days: [
      {
        dow: 1,
        name: "FULL A",
        focus: "İtiş + bacak + core",
        exercises: [
          { exercise: "Squat", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 150, load_tag: "agir" },
          { exercise: "Dumbbell Bench Press", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 120, load_tag: "orta_agir" },
          { exercise: "Lat Pulldown", sets: 3, rep_lo: 8, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Seated Dumbbell Shoulder Press", sets: 2, rep_lo: 10, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Plank", sets: 3, rep_lo: 20, rep_hi: 40, rest_sec: 60, load_tag: "hafif" },
        ],
      },
      {
        dow: 3,
        name: "FULL B",
        focus: "Çekiş + hinge + kol",
        exercises: [
          { exercise: "Romanian Deadlift", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 150, load_tag: "agir" },
          { exercise: "Chest-Supported Row", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 120, load_tag: "orta_agir" },
          { exercise: "Incline Dumbbell Press", sets: 3, rep_lo: 8, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Biceps Curl", sets: 2, rep_lo: 10, rep_hi: 12, rest_sec: 60, load_tag: "orta" },
          { exercise: "Triceps Pushdown", sets: 2, rep_lo: 10, rep_hi: 12, rest_sec: 60, load_tag: "orta" },
        ],
      },
      {
        dow: 5,
        name: "FULL C",
        focus: "Bacak + omuz + core",
        exercises: [
          { exercise: "Leg Press", sets: 3, rep_lo: 10, rep_hi: 12, rest_sec: 120, load_tag: "orta_agir" },
          { exercise: "Dumbbell Row", sets: 3, rep_lo: 8, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Lateral Raise", sets: 3, rep_lo: 12, rep_hi: 15, rest_sec: 60, load_tag: "hafif" },
          { exercise: "Standing Calf Raise", sets: 3, rep_lo: 12, rep_hi: 15, rest_sec: 60, load_tag: "orta" },
          { exercise: "Mekik", sets: 3, rep_lo: 12, rep_hi: 15, rest_sec: 45, load_tag: "hafif" },
        ],
      },
    ],
  },
  {
    key: "ul4",
    name: "Upper / Lower (4 gün)",
    description:
      "Dengeli 4 günlük üst-alt split. Pazartesi–Perşembe aktif, hafta sonu serbest.",
    tags: "katalog,upperlower,orta,4gun,guc,hipertrofi,barbell,dumbbell",
    share_code: "UL4DAY",
    days: [
      {
        dow: 1,
        name: "UPPER A",
        focus: "Göğüs · Sırt · Omuz",
        exercises: [
          { exercise: "Barbell Bench Press", sets: 4, rep_lo: 5, rep_hi: 8, rest_sec: 150, load_tag: "agir" },
          { exercise: "Barbell Row", sets: 4, rep_lo: 6, rep_hi: 8, rest_sec: 120, load_tag: "agir" },
          { exercise: "Seated Dumbbell Shoulder Press", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 90, load_tag: "orta" },
          { exercise: "Lat Pulldown", sets: 3, rep_lo: 8, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Biceps Curl", sets: 2, rep_lo: 10, rep_hi: 12, rest_sec: 60, load_tag: "orta" },
        ],
      },
      {
        dow: 2,
        name: "LOWER A",
        focus: "Squat pattern",
        exercises: [
          { exercise: "Squat", sets: 4, rep_lo: 5, rep_hi: 8, rest_sec: 180, load_tag: "agir" },
          { exercise: "Romanian Deadlift", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 120, load_tag: "orta_agir" },
          { exercise: "Leg Press", sets: 3, rep_lo: 10, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Standing Calf Raise", sets: 4, rep_lo: 10, rep_hi: 15, rest_sec: 60, load_tag: "orta" },
        ],
      },
      {
        dow: 4,
        name: "UPPER B",
        focus: "Hacim odaklı üst",
        exercises: [
          { exercise: "Incline Dumbbell Press", sets: 4, rep_lo: 8, rep_hi: 12, rest_sec: 120, load_tag: "orta_agir" },
          { exercise: "Chest-Supported Row", sets: 4, rep_lo: 8, rep_hi: 12, rest_sec: 90, load_tag: "orta" },
          { exercise: "Lateral Raise", sets: 3, rep_lo: 12, rep_hi: 15, rest_sec: 60, load_tag: "hafif" },
          { exercise: "Face Pull", sets: 3, rep_lo: 12, rep_hi: 15, rest_sec: 60, load_tag: "hafif" },
          { exercise: "Triceps Pushdown", sets: 3, rep_lo: 10, rep_hi: 12, rest_sec: 60, load_tag: "orta" },
        ],
      },
      {
        dow: 5,
        name: "LOWER B",
        focus: "Kalça + hamstring",
        exercises: [
          { exercise: "Deadlift", sets: 3, rep_lo: 3, rep_hi: 5, rest_sec: 180, load_tag: "agir" },
          { exercise: "Hip Thrust", sets: 3, rep_lo: 8, rep_hi: 12, rest_sec: 90, load_tag: "orta_agir" },
          { exercise: "Leg Curl", sets: 3, rep_lo: 10, rep_hi: 12, rest_sec: 75, load_tag: "orta" },
          { exercise: "Bulgarian Split Squat", sets: 3, rep_lo: 8, rep_hi: 10, rest_sec: 90, load_tag: "orta" },
        ],
      },
    ],
  },
];

const CATALOG_VERSION = "fullsplit6-v1";

async function insertProgramDays(
  sql: Sql,
  programId: number,
  days: ProgramDaySeed[],
  byName: Map<string, number>,
) {
  for (let di = 0; di < days.length; di++) {
    const day = days[di]!;
    const dayRow = await sql<{ id: number }>`
      insert into program_days (program_id, dow, name, focus, sort)
      values (${programId}, ${day.dow}, ${day.name}, ${day.focus}, ${di})
      returning id
    `;
    const dayId = dayRow[0]!.id;
    for (let ei = 0; ei < day.exercises.length; ei++) {
      const pe = day.exercises[ei]!;
      const exerciseId = byName.get(pe.exercise);
      if (!exerciseId) continue;
      await sql`
        insert into program_exercises (
          program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
          rest_sec, load_tag, note, sort
        ) values (
          ${dayId}, ${exerciseId}, ${pe.detail ?? null}, ${pe.sets},
          ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec}, ${pe.load_tag},
          ${pe.note ?? null}, ${ei}
        )
      `;
    }
  }
}

/** Seed / refresh Salon catalog (user_id = system). Always sync FULL SPLIT.
 * Process-lifetime memoized — cold start only.
 */
const catalogGlobal = globalThis as typeof globalThis & {
  __ensureCatalogSeeded__?: Promise<void>;
};

export async function ensureCatalogSeeded(_sql: Sql): Promise<void> {
  if (catalogGlobal.__ensureCatalogSeeded__) {
    return catalogGlobal.__ensureCatalogSeeded__;
  }
  catalogGlobal.__ensureCatalogSeeded__ = (async () => {
    await withTransaction(async (sql) => {
    // Drop legacy PPL catalog if present
    await sql`
      delete from programs
      where user_id = 'system' and share_code = 'PPL6XX'
    `;

    await ensureExerciseLibrary(sql);

    const lib2 = await sql<{ id: number; name: string }>`
      select id, name from exercises where owner_id is null
    `;
    const byName = new Map(lib2.map((e) => [e.name, e.id]));

    for (const cat of CATALOG) {
      const existing = await sql<{ id: number; tags: string | null }>`
        select id, tags from programs
        where user_id = 'system' and share_code = ${cat.share_code}
      `;

      if (existing.length > 0) {
        const id = existing[0]!.id;
        const tags = existing[0]!.tags ?? "";
        // Rebuild if version marker missing (content refresh)
        if (!tags.includes(CATALOG_VERSION) && cat.key === "fullsplit6") {
          await sql`delete from program_days where program_id = ${id}`;
          await sql`
            update programs set
              name = ${cat.name},
              description = ${cat.description},
              tags = ${`${cat.tags},${CATALOG_VERSION}`}
            where id = ${id}
          `;
          await insertProgramDays(sql, id, cat.days, byName);
        }
        continue;
      }

      const prog = await sql<{ id: number }>`
        insert into programs (
          user_id, name, description, tags, is_active, valid_from,
          is_public, share_code, clone_count
        ) values (
          'system', ${cat.name}, ${cat.description},
          ${`${cat.tags},${CATALOG_VERSION}`},
          false, current_date, true, ${cat.share_code}, 0
        )
        returning id
      `;
      await insertProgramDays(sql, prog[0]!.id, cat.days, byName);
    }
    });
  })().catch((err) => {
    catalogGlobal.__ensureCatalogSeeded__ = undefined;
    throw err;
  });
  return catalogGlobal.__ensureCatalogSeeded__;
}

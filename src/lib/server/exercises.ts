import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { resolveExerciseMedia } from "@/lib/exercise-media-resolve.server";
import {
  browseDatasetByMuscle,
  datasetCount,
  ensureDatasetExercise,
  ensureExerciseLibrary,
  resolveDataset,
  searchDataset,
} from "./seed";
import { v, positiveId, shortText, optionalString } from "@/lib/validation";
import { z } from "zod";

export type ExerciseRow = {
  id: number;
  owner_id: string | null;
  name: string;
  detail: string | null;
  unit: string;
  muscle_group: string;
  default_note: string | null;
  gif_url?: string | null;
  image_url?: string | null;
  form_cues?: string | null;
  external_id?: string | null;
};

function titleCase(name: string) {
  return name
    .split(" ")
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function mapDatasetRow(d: {
  id: string;
  name: string;
  muscle: string;
  equipment?: string | null;
  note?: string | null;
  gif?: string | null;
  image?: string | null;
}): ExerciseRow {
  return {
    id: -1,
    owner_id: null,
    name: titleCase(d.name),
    detail: d.equipment ?? null,
    unit: "kg",
    muscle_group: d.muscle,
    default_note: d.note ?? null,
    gif_url: d.gif ?? null,
    image_url: d.image ?? null,
    form_cues: d.note ?? null,
    external_id: d.id,
  };
}

export const listExercises = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureExerciseLibrary(sql);
    try {
      return await sql<ExerciseRow>`
        select id, owner_id, name, detail, unit, muscle_group, default_note,
               gif_url, image_url, form_cues, external_id
        from exercises
        where owner_id is null or owner_id = ${context.userId}
        order by name
      `;
    } catch {
      return await sql<ExerciseRow>`
        select id, owner_id, name, detail, unit, muscle_group, default_note
        from exercises
        where owner_id is null or owner_id = ${context.userId}
        order by name
      `;
    }
  });

/**
 * Search / browse full exercises-dataset (1324) + local library.
 * - q: free text (min 1–2 chars for dataset name match)
 * - muscleGroup: gogus | sirt | omuz | kol | bacak | core | trapez | diger
 * Empty q + muscle = browse that group from the full catalog.
 * Empty both = local library + first page of full catalog.
 */
export const searchExerciseCatalog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: unknown) => {
    if (typeof d === "string") return { q: d.slice(0, 120) };
    return v(
      z.object({
        q: z.string().trim().max(120).optional(),
        muscleGroup: z.string().trim().max(40).optional(),
        limit: z.number().int().min(1).max(200).optional(),
      }),
    )(d);
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureExerciseLibrary(sql);
    const term = (data.q ?? "").trim().toLowerCase();
    const muscle = data.muscleGroup?.trim() || null;
    const limit = Math.min(Math.max(data.limit ?? 100, 20), 200);

    let local: ExerciseRow[] = [];
    try {
      if (term && muscle) {
        local = await sql<ExerciseRow>`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and lower(name) like ${"%" + term + "%"}
            and muscle_group = ${muscle}
          order by name
          limit ${limit}
        `;
      } else if (term) {
        local = await sql<ExerciseRow>`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and lower(name) like ${"%" + term + "%"}
          order by name
          limit ${limit}
        `;
      } else if (muscle) {
        local = await sql<ExerciseRow>`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and muscle_group = ${muscle}
          order by name
          limit ${limit}
        `;
      } else {
        local = await sql<ExerciseRow>`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where owner_id is null or owner_id = ${context.userId}
          order by name
          limit ${Math.min(limit, 80)}
        `;
      }
    } catch {
      local = await sql<ExerciseRow>`
        select id, owner_id, name, detail, unit, muscle_group, default_note
        from exercises
        where owner_id is null or owner_id = ${context.userId}
        order by name
        limit 80
      `;
    }

    // Full dataset layer
    let fromDs: ExerciseRow[] = [];
    if (term.length >= 1) {
      fromDs = searchDataset(term, limit)
        .filter((d) => !muscle || d.muscle === muscle)
        .map(mapDatasetRow);
    } else {
      // Browse by muscle or open catalog slice
      fromDs = browseDatasetByMuscle(muscle, limit, 0).map(mapDatasetRow);
    }

    const seen = new Set(local.map((r) => r.name.toLowerCase()));
    const merged = [...local];
    for (const d of fromDs) {
      if (seen.has(d.name.toLowerCase())) continue;
      seen.add(d.name.toLowerCase());
      merged.push(d);
    }

    return merged.slice(0, limit);
  });

/** Materialize a dataset exercise into DB and return its id. */
export const adoptDatasetExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
      externalId: z.string().trim().max(32).optional(),
      exerciseId: positiveId.optional(),
    })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureExerciseLibrary(sql);
    if (data.exerciseId && data.exerciseId > 0) {
      const own = await sql<{ id: number }>`
        select id from exercises
        where id = ${data.exerciseId}
          and (owner_id is null or owner_id = ${context.userId})
      `;
      if (own[0]) return { id: own[0].id };
    }
    if (!data.externalId) throw new Error("Hareket belirtilmedi.");
    const id = await ensureDatasetExercise(sql, data.externalId);
    if (!id) throw new Error("Dataset hareketi eklenemedi.");
    return { id };
  });

export const getExercisePreview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(z.object({
      exerciseId: positiveId.optional(),
      name: z.string().trim().max(120).optional(),
    })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.exerciseId && data.exerciseId > 0) {
      try {
        const rows = await sql<{
          name: string;
          gif_url: string | null;
          image_url: string | null;
          form_cues: string | null;
          default_note: string | null;
          muscle_group: string;
        }>`
          select name, gif_url, image_url, form_cues, default_note, muscle_group
          from exercises
          where id = ${data.exerciseId}
            and (owner_id is null or owner_id = ${context.userId})
        `;
        if (rows[0]) {
          return {
            name: rows[0].name,
            gif_url: rows[0].gif_url,
            image_url: rows[0].image_url,
            form_cues: rows[0].form_cues ?? rows[0].default_note,
            muscle_group: rows[0].muscle_group,
          };
        }
      } catch {
        /* ignore */
      }
    }
    if (data.name) {
      const hits = searchDataset(data.name, 1);
      if (hits[0]) {
        const d = hits[0];
        return {
          name: titleCase(d.name),
          gif_url: d.gif ?? null,
          image_url: d.image ?? null,
          form_cues: d.note ?? null,
          muscle_group: d.muscle,
        };
      }
    }
    return null;
  });

/** Lookup media by exercise name (preview button) — full 1324 dataset. */
export const getExerciseMedia = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(shortText(120)))
  .handler(async ({ context, data: name }) => {
    const sql = await getSql();
    await ensureExerciseLibrary(sql);

    // 1) DB row with media
    try {
      const rows = await sql<{
        gif_url: string | null;
        image_url: string | null;
        form_cues: string | null;
        default_note: string | null;
        muscle_group: string;
        external_id: string | null;
      }>`
        select gif_url, image_url, form_cues, default_note, muscle_group, external_id
        from exercises
        where lower(name) = lower(${name})
          and (owner_id is null or owner_id = ${context.userId})
        limit 1
      `;
      const r = rows[0];
      if (r?.gif_url || r?.image_url) {
        return {
          gif_url: r.gif_url,
          image_url: r.image_url,
          form_cues: r.form_cues ?? r.default_note,
          default_note: r.default_note,
          muscle_group: r.muscle_group,
        };
      }
    } catch {
      /* media cols may miss */
    }

    // 2) Strong resolve from full dataset (aliases + fuzzy)
    const local = resolveExerciseMedia(name);
    if (local.gif_url || local.image_url) {
      if (local.dataset_id) {
        try {
          await ensureDatasetExercise(sql, local.dataset_id);
        } catch {
          /* ignore */
        }
      }
      return {
        gif_url: local.gif_url,
        image_url: local.image_url,
        form_cues: local.form_cues,
        default_note: local.form_cues,
        muscle_group: local.muscle_group ?? undefined,
      };
    }

    const d = resolveDataset(name);
    if (d) {
      try {
        await ensureDatasetExercise(sql, d.id);
      } catch {
        /* ignore */
      }
      return {
        gif_url: d.gif ?? null,
        image_url: d.image ?? null,
        form_cues: d.note ?? null,
        default_note: d.note ?? null,
        muscle_group: d.muscle,
      };
    }

    return {
      gif_url: null as string | null,
      image_url: null as string | null,
      form_cues: null as string | null,
      default_note: null as string | null,
      muscle_group: undefined as string | undefined,
    };
  });

export const similarExercises = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        exerciseId: z.number().int().nonnegative(),
        excludeIds: z.array(positiveId).max(50).optional(),
        externalId: z.string().trim().max(32).optional(),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureExerciseLibrary(sql);

    let muscle: string | null = null;
    let name: string | null = null;

    if (data.exerciseId > 0) {
      try {
        const row = await sql<{ muscle_group: string; name: string }>`
          select muscle_group, name from exercises where id = ${data.exerciseId}
        `;
        muscle = row[0]?.muscle_group ?? null;
        name = row[0]?.name ?? null;
      } catch {
        /* ignore */
      }
    }

    let local: ExerciseRow[] = [];
    if (muscle) {
      try {
        local = await sql<ExerciseRow>`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and muscle_group = ${muscle}
          order by name
          limit 24
        `;
      } catch {
        local = await sql<ExerciseRow>`
          select id, owner_id, name, detail, unit, muscle_group, default_note
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and muscle_group = ${muscle}
          order by name
          limit 24
        `;
      }
    }

    const exclude = new Set(data.excludeIds ?? []);
    exclude.add(data.exerciseId);

    const filtered = local.filter((r) => !exclude.has(r.id));
    const pad = browseDatasetByMuscle(muscle, 24)
      .filter((d) => !name || normName(d.name) !== normName(name))
      .map(mapDatasetRow);

    const seen = new Set(filtered.map((r) => r.name.toLowerCase()));
    const merged = [...filtered];
    for (const d of pad) {
      if (seen.has(d.name.toLowerCase())) continue;
      seen.add(d.name.toLowerCase());
      merged.push(d);
    }
    return merged.slice(0, 24);
  });

function normName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export const createExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        name: shortText(120),
        detail: optionalString(200),
        unit: z.string().trim().max(20).optional(),
        muscle_group: z.string().trim().max(40).optional(),
        default_note: optionalString(500),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Hareket adı çok kısa.");
    const rows = await sql<{ id: number }>`
      insert into exercises (owner_id, name, detail, unit, muscle_group, default_note)
      values (
        ${context.userId},
        ${name},
        ${data.detail ?? null},
        ${data.unit ?? "kg"},
        ${data.muscle_group ?? "diger"},
        ${data.default_note ?? null}
      )
      returning id
    `;
    return { id: rows[0]!.id };
  });

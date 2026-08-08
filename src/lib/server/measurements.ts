import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";

export type MeasurementRow = {
  id: number;
  date: string;
  body_weight: string | null;
  waist: string | null;
  chest: string | null;
  arm: string | null;
  thigh: string | null;
};

export const listMeasurements = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return sql<MeasurementRow>`
      select id, date::text as date,
             body_weight::text as body_weight,
             waist::text as waist,
             chest::text as chest,
             arm::text as arm,
             thigh::text as thigh
      from body_measurements
      where user_id = ${context.userId}
      order by date desc
    `;
  });

export const saveMeasurement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      date: string;
      body_weight?: number | null;
      waist?: number | null;
      chest?: number | null;
      arm?: number | null;
      thigh?: number | null;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await sql`
      insert into body_measurements (
        user_id, date, body_weight, waist, chest, arm, thigh
      ) values (
        ${context.userId}, ${data.date}::date,
        ${data.body_weight ?? null}, ${data.waist ?? null},
        ${data.chest ?? null}, ${data.arm ?? null}, ${data.thigh ?? null}
      )
      on conflict (user_id, date) do update set
        body_weight = excluded.body_weight,
        waist = excluded.waist,
        chest = excluded.chest,
        arm = excluded.arm,
        thigh = excluded.thigh
    `;
    return { ok: true };
  });

export const deleteMeasurement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from body_measurements
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

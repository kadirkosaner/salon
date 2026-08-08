import type { Sql } from "@/lib/db";

const DEFAULT_TZ = "Europe/Istanbul";

/**
 * "Today" for a user in their stored timezone (Postgres-side).
 * Avoids UTC vs local midnight bugs on Vercel.
 */
export async function todayForUser(
  sql: Sql,
  userId: string,
): Promise<string> {
  // Ensure settings row
  await sql`
    insert into user_settings (user_id, time_zone)
    values (${userId}, ${DEFAULT_TZ})
    on conflict (user_id) do nothing
  `;
  const rows = await sql<{ d: string }>`
    select (
      now() at time zone coalesce(
        (select time_zone from user_settings where user_id = ${userId}),
        ${DEFAULT_TZ}
      )
    )::date::text as d
  `;
  return rows[0]?.d ?? new Date().toISOString().slice(0, 10);
}

/** ISO weekday 1=Mon … 7=Sun for a date string in a timezone. */
export async function isoDowForUser(
  sql: Sql,
  userId: string,
  dateStr: string,
): Promise<number> {
  const rows = await sql<{ n: number }>`
    select extract(isodow from ${dateStr}::date)::int as n
  `;
  return rows[0]?.n ?? 1;
}

/** Monday of the ISO week containing `dateStr` (YYYY-MM-DD). */
export async function startOfWeekMonday(
  sql: Sql,
  dateStr: string,
): Promise<string> {
  const rows = await sql<{ d: string }>`
    select (date_trunc('week', ${dateStr}::date))::date::text as d
  `;
  // Postgres date_trunc('week') is Monday for ISO in recent PG
  return rows[0]?.d ?? dateStr;
}

export async function getUserTimeZone(
  sql: Sql,
  userId: string,
): Promise<string> {
  const rows = await sql<{ time_zone: string }>`
    select time_zone from user_settings where user_id = ${userId}
  `;
  return rows[0]?.time_zone ?? DEFAULT_TZ;
}

export async function setUserTimeZone(
  sql: Sql,
  userId: string,
  timeZone: string,
): Promise<void> {
  const tz = timeZone.trim().slice(0, 64) || DEFAULT_TZ;
  await sql`
    insert into user_settings (user_id, time_zone, updated_at)
    values (${userId}, ${tz}, now())
    on conflict (user_id) do update set
      time_zone = excluded.time_zone,
      updated_at = now()
  `;
}

//#region node_modules/.nitro/vite/services/ssr/assets/time-BN4ZvYw3.js
var DEFAULT_TZ = "Europe/Istanbul";
/**
* "Today" for a user in their stored timezone (Postgres-side).
* Avoids UTC vs local midnight bugs on Vercel.
*/
async function todayForUser(sql, userId) {
	await sql`
    insert into user_settings (user_id, time_zone)
    values (${userId}, ${DEFAULT_TZ})
    on conflict (user_id) do nothing
  `;
	return (await sql`
    select (
      now() at time zone coalesce(
        (select time_zone from user_settings where user_id = ${userId}),
        ${DEFAULT_TZ}
      )
    )::date::text as d
  `)[0]?.d ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
/** Monday of the ISO week containing `dateStr` (YYYY-MM-DD). */
async function startOfWeekMonday(sql, dateStr) {
	return (await sql`
    select (date_trunc('week', ${dateStr}::date))::date::text as d
  `)[0]?.d ?? dateStr;
}
async function getUserTimeZone(sql, userId) {
	return (await sql`
    select time_zone from user_settings where user_id = ${userId}
  `)[0]?.time_zone ?? DEFAULT_TZ;
}
async function setUserTimeZone(sql, userId, timeZone) {
	await sql`
    insert into user_settings (user_id, time_zone, updated_at)
    values (${userId}, ${timeZone.trim().slice(0, 64) || DEFAULT_TZ}, now())
    on conflict (user_id) do update set
      time_zone = excluded.time_zone,
      updated_at = now()
  `;
}
//#endregion
export { getUserTimeZone, setUserTimeZone, startOfWeekMonday, todayForUser };

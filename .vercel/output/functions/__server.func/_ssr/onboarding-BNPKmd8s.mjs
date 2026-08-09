import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { ensureUserSeeded } from "./seed-DlydNDJa.mjs";
import { todayForUser } from "./time-BN4ZvYw3.mjs";
import { t as ensureCatalogSeeded } from "./catalog-CK8l1uze.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-BNPKmd8s.js
/**
* Safety net if migration 0016 has not run yet on this PGLite instance.
* Matches 0016_onboarding.sql: add column + backfill existing profiles only
* when the column was just created (so new signups keep null onboarded_at).
*/
async function ensureOnboardingColumn(sql) {
	try {
		await sql`select onboarded_at from user_profiles limit 0`;
		return;
	} catch {}
	try {
		await sql`alter table user_profiles add column if not exists onboarded_at timestamptz`;
		await sql`
      update user_profiles
      set onboarded_at = coalesce(created_at, now())
      where onboarded_at is null
        and created_at < now() - interval '2 seconds'
    `;
	} catch {}
}
var getOnboardingStatus_createServerFn_handler = createServerRpc({
	id: "cf95c44ac65697d4000e76d3056279880e4a5f7279730bcffebadc4adf40af20",
	name: "getOnboardingStatus",
	filename: "src/lib/server/onboarding.ts"
}, (opts) => getOnboardingStatus.__executeServer(opts));
var getOnboardingStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(getOnboardingStatus_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureOnboardingColumn(sql);
	const prof = await sql`
      select
        onboarded_at::text as onboarded_at,
        unit_system,
        theme,
        accent,
        birth_date::text as birth_date,
        sex,
        height_cm::text as height_cm
      from user_profiles
      where user_id = ${context.userId}
    `;
	const onboarded = prof[0]?.onboarded_at != null;
	const bw = await sql`
      select body_weight::float8 as body_weight
      from body_measurements
      where user_id = ${context.userId} and body_weight is not null
      order by date desc
      limit 1
    `;
	const prog = await sql`
      select id from programs
      where user_id = ${context.userId} and is_active = true
      limit 1
    `;
	const user = await sql`
      select name from "user" where id = ${context.userId} limit 1
    `;
	return {
		onboarded,
		hasWeight: bw[0]?.body_weight != null,
		hasProgram: prog.length > 0,
		hasBirthDate: !!prof[0]?.birth_date,
		hasSex: !!prof[0]?.sex && prof[0].sex !== "unspecified",
		hasHeight: prof[0]?.height_cm != null,
		unitSystem: prof[0]?.unit_system === "imperial" ? "imperial" : "metric",
		theme: prof[0]?.theme === "carbon" ? "carbon" : "obsidian",
		accent: prof[0]?.accent || "pirinc",
		weightKg: bw[0]?.body_weight ?? null,
		displayName: user[0]?.name ?? null
	};
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "bac1cf5f409befad194a9d2819359f64dafef4d1c35bdc1d1633ed0289aed22d",
	name: "completeOnboarding",
	filename: "src/lib/server/onboarding.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(noInput).handler(completeOnboarding_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureOnboardingColumn(sql);
	await sql`
      insert into user_profiles (user_id, username, onboarded_at)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        now()
      )
      on conflict (user_id) do update set
        onboarded_at = coalesce(user_profiles.onboarded_at, now()),
        updated_at = now()
    `;
	return { ok: true };
});
var saveOnboardingWeight_createServerFn_handler = createServerRpc({
	id: "866e7916e383a6a0a2ffee0b4f5ce8ef765ef673f07f7ce3564f961549773a61",
	name: "saveOnboardingWeight",
	filename: "src/lib/server/onboarding.ts"
}, (opts) => saveOnboardingWeight.__executeServer(opts));
var saveOnboardingWeight = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	weightKg: number().min(1).max(1e3),
	unitSystem: _enum(["metric", "imperial"])
}))).handler(saveOnboardingWeight_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const today = await todayForUser(sql, context.userId);
	const kg = data.unitSystem === "imperial" ? Math.round(data.weightKg * .453592 * 10) / 10 : data.weightKg;
	if (kg < 20 || kg > 400) throw new Error("Weight out of range");
	await sql`
      insert into body_measurements (user_id, date, body_weight)
      values (${context.userId}, ${today}::date, ${kg})
      on conflict (user_id, date) do update set
        body_weight = excluded.body_weight
    `;
	await sql`
      insert into user_profiles (user_id, username, unit_system)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        ${data.unitSystem}
      )
      on conflict (user_id) do update set
        unit_system = ${data.unitSystem},
        updated_at = now()
    `;
	return {
		ok: true,
		weightKg: kg
	};
});
var saveOnboardingAppearance_createServerFn_handler = createServerRpc({
	id: "93485e081daa9a81cc5666fe1ae75678985db063305fdf5276d8c24488463ee7",
	name: "saveOnboardingAppearance",
	filename: "src/lib/server/onboarding.ts"
}, (opts) => saveOnboardingAppearance.__executeServer(opts));
var saveOnboardingAppearance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	theme: _enum(["obsidian", "carbon"]),
	accent: string().min(2).max(20)
}))).handler(saveOnboardingAppearance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await sql`
      insert into user_profiles (user_id, username, theme, accent)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        ${data.theme},
        ${data.accent}
      )
      on conflict (user_id) do update set
        theme = ${data.theme},
        accent = ${data.accent},
        updated_at = now()
    `;
	return { ok: true };
});
var getOnboardingPrograms_createServerFn_handler = createServerRpc({
	id: "6c681d328573957b5a36941ef07febb24749286d796546d1bcd1464f232cb730",
	name: "getOnboardingPrograms",
	filename: "src/lib/server/onboarding.ts"
}, (opts) => getOnboardingPrograms.__executeServer(opts));
var getOnboardingPrograms = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	daysPerWeek: number().int().min(2).max(6).optional(),
	locale: string().optional()
}))).handler(getOnboardingPrograms_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureCatalogSeeded(sql);
	const days = data.daysPerWeek ?? 3;
	const locale = data.locale ?? "en";
	const scored = (await sql`
      select
        p.id,
        p.name,
        p.description,
        p.tags,
        p.share_code,
        (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
        (
          select count(*)::int from program_exercises pe
          join program_days pd on pd.id = pe.program_day_id
          where pd.program_id = p.id
        ) as exercise_count,
        coalesce(p.clone_count, 0)::int as clone_count
      from programs p
      where p.user_id = 'system' and p.is_public = true
      order by p.id
    `).map((r) => ({
		...r,
		score: Math.abs(r.day_count - days) * 10 + (r.day_count === days ? 0 : 1)
	})).sort((a, b) => a.score - b.score || a.id - b.id).slice(0, 4);
	const out = [];
	for (const r of scored) {
		let name = r.name;
		let description = r.description;
		if (locale.startsWith("tr")) try {
			const tr = await sql`
            select name, description from program_translations
            where program_id = ${r.id} and locale = 'tr'
            limit 1
          `;
			if (tr[0]) {
				name = tr[0].name;
				description = tr[0].description ?? description;
			}
		} catch {}
		out.push({
			id: r.id,
			name,
			description,
			tags: r.tags,
			share_code: r.share_code,
			day_count: r.day_count,
			exercise_count: r.exercise_count,
			clone_count: r.clone_count,
			is_catalog: true,
			author_name: "Salon",
			is_own: false
		});
	}
	return out;
});
var isOnboarded_createServerFn_handler = createServerRpc({
	id: "d6c5810d6838e0caeeb115ba1e32758df3fc237bf89ae3b4f579a2798243acec",
	name: "isOnboarded",
	filename: "src/lib/server/onboarding.ts"
}, (opts) => isOnboarded.__executeServer(opts));
var isOnboarded = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(isOnboarded_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureOnboardingColumn(sql);
	try {
		const rows = await sql`
        select onboarded_at::text as onboarded_at
        from user_profiles
        where user_id = ${context.userId}
      `;
		if (rows.length === 0) return { onboarded: false };
		return { onboarded: rows[0].onboarded_at != null };
	} catch {
		return { onboarded: true };
	}
});
//#endregion
export { completeOnboarding_createServerFn_handler, getOnboardingPrograms_createServerFn_handler, getOnboardingStatus_createServerFn_handler, isOnboarded_createServerFn_handler, saveOnboardingAppearance_createServerFn_handler, saveOnboardingWeight_createServerFn_handler };

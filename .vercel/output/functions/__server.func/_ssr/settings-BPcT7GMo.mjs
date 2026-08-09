import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { r as ensureUserProfile } from "./social-BjKrIrtg.mjs";
import { getUserTimeZone, setUserTimeZone } from "./time-BN4ZvYw3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BPcT7GMo.js
var themeSchema = _enum(["obsidian", "carbon"]);
var accentSchema = _enum([
	"pirinc",
	"bakir",
	"kemik",
	"volt",
	"ates",
	"buz",
	"neon",
	"kehribar",
	"beyaz",
	"ufuk"
]);
var getSettings_createServerFn_handler = createServerRpc({
	id: "9b36a4c1185958551fcc8de1b888777de8a08ebe75806d2780396ecc0b4eafe7",
	name: "getSettings",
	filename: "src/lib/server/settings.ts"
}, (opts) => getSettings.__executeServer(opts));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(getSettings_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const timeZone = await getUserTimeZone(sql, context.userId);
	await sql`
      insert into user_settings (user_id, time_zone)
      values (${context.userId}, ${timeZone})
      on conflict (user_id) do nothing
    `;
	let hapticEnabled = true;
	let notificationsEnabled = true;
	try {
		const rows = await sql`
        select haptic_enabled, notifications_enabled
        from user_settings
        where user_id = ${context.userId}
      `;
		if (rows[0]) {
			hapticEnabled = rows[0].haptic_enabled !== false;
			notificationsEnabled = rows[0].notifications_enabled !== false;
		}
	} catch {}
	await ensureUserProfile(sql, context.userId);
	const prof = await sql`
      select unit_system from user_profiles where user_id = ${context.userId}
    `;
	let theme = "obsidian";
	let accent = "pirinc";
	try {
		const themeRows = await sql`
        select coalesce(theme, 'obsidian') as theme,
               coalesce(accent, 'pirinc') as accent
        from user_profiles where user_id = ${context.userId}
      `;
		if (themeRows[0]) {
			theme = themeRows[0].theme === "carbon" ? "carbon" : "obsidian";
			accent = themeRows[0].accent || "pirinc";
		}
	} catch {}
	return {
		timeZone,
		hapticEnabled,
		notificationsEnabled,
		unitSystem: prof[0]?.unit_system || "metric",
		theme,
		accent
	};
});
var updateSettings_createServerFn_handler = createServerRpc({
	id: "0e182776be6283b912be100cdaf806931752666530bbee6f8ea2a74039c779ba",
	name: "updateSettings",
	filename: "src/lib/server/settings.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	timeZone: string().trim().min(1).max(64).optional(),
	hapticEnabled: boolean().optional(),
	notificationsEnabled: boolean().optional(),
	unitSystem: _enum(["metric", "imperial"]).optional(),
	theme: themeSchema.optional(),
	accent: accentSchema.optional()
}))).handler(updateSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserProfile(sql, context.userId);
	if (data.timeZone) await setUserTimeZone(sql, context.userId, data.timeZone);
	if (data.hapticEnabled !== void 0) await sql`
        insert into user_settings (user_id, time_zone, haptic_enabled, updated_at)
        values (${context.userId}, 'Europe/Istanbul', ${data.hapticEnabled}, now())
        on conflict (user_id) do update set
          haptic_enabled = ${data.hapticEnabled},
          updated_at = now()
      `;
	if (data.notificationsEnabled !== void 0) await sql`
        insert into user_settings (user_id, time_zone, notifications_enabled, updated_at)
        values (${context.userId}, 'Europe/Istanbul', ${data.notificationsEnabled}, now())
        on conflict (user_id) do update set
          notifications_enabled = ${data.notificationsEnabled},
          updated_at = now()
      `;
	if (data.unitSystem) await sql`
        update user_profiles set unit_system = ${data.unitSystem}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.theme !== void 0 || data.accent !== void 0) try {
		if (data.theme !== void 0 && data.accent !== void 0) await sql`
            update user_profiles
            set theme = ${data.theme}, accent = ${data.accent}, updated_at = now()
            where user_id = ${context.userId}
          `;
		else if (data.theme !== void 0) await sql`
            update user_profiles
            set theme = ${data.theme}, updated_at = now()
            where user_id = ${context.userId}
          `;
		else if (data.accent !== void 0) await sql`
            update user_profiles
            set accent = ${data.accent}, updated_at = now()
            where user_id = ${context.userId}
          `;
	} catch {}
	return { ok: true };
});
var exportMyData_createServerFn_handler = createServerRpc({
	id: "f234a67bab3f7e8438c0cb607261fbb8bcc91ecc48658176705bb3bcbd5fb747",
	name: "exportMyData",
	filename: "src/lib/server/settings.ts"
}, (opts) => exportMyData.__executeServer(opts));
var exportMyData = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(exportMyData_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const user = await sql`
      select id, name, email, "createdAt"::text as created_at
      from "user" where id = ${context.userId}
    `;
	const profile = await sql`
      select username, bio, visibility, unit_system, measures_public
      from user_profiles where user_id = ${context.userId}
    `;
	let theme = "obsidian";
	let accent = "pirinc";
	try {
		const ta = await sql`
        select coalesce(theme, 'obsidian') as theme,
               coalesce(accent, 'pirinc') as accent
        from user_profiles where user_id = ${context.userId}
      `;
		if (ta[0]) {
			theme = ta[0].theme;
			accent = ta[0].accent;
		}
	} catch {}
	const workouts = await sql`
      select id, date::text as date, day_name, status, notes
      from workouts where user_id = ${context.userId}
      order by date desc limit 500
    `;
	const measures = await sql`
      select date::text as date,
             body_weight::text as body_weight,
             waist::text as waist,
             chest::text as chest,
             arm::text as arm,
             thigh::text as thigh
      from body_measurements where user_id = ${context.userId}
      order by date desc limit 200
    `;
	const programs = await sql`
      select id, name, description, tags, is_public, share_code
      from programs where user_id = ${context.userId}
    `;
	return {
		exported_at: (/* @__PURE__ */ new Date()).toISOString(),
		user: user[0] ? {
			id: user[0].id,
			name: user[0].name,
			email: user[0].email,
			created_at: user[0].created_at
		} : null,
		profile: profile[0] ? {
			username: profile[0].username,
			bio: profile[0].bio,
			visibility: profile[0].visibility,
			unit_system: profile[0].unit_system,
			measures_public: profile[0].measures_public === true,
			theme,
			accent
		} : null,
		workouts: workouts.map((w) => ({
			id: Number(w.id),
			date: w.date,
			day_name: w.day_name,
			status: w.status,
			notes: w.notes
		})),
		measures: measures.map((m) => ({
			date: m.date,
			body_weight: m.body_weight,
			waist: m.waist,
			chest: m.chest,
			arm: m.arm,
			thigh: m.thigh
		})),
		programs: programs.map((p) => ({
			id: Number(p.id),
			name: p.name,
			description: p.description,
			tags: p.tags,
			is_public: p.is_public === true,
			share_code: p.share_code
		}))
	};
});
var deleteMyAccount_createServerFn_handler = createServerRpc({
	id: "7fd971e076a0cb90d76d0d895765ba1c55eb0ec3cdccd5478850ef7f1c566420",
	name: "deleteMyAccount",
	filename: "src/lib/server/settings.ts"
}, (opts) => deleteMyAccount.__executeServer(opts));
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({ confirm: literal("DELETE") }))).handler(deleteMyAccount_createServerFn_handler, async ({ context }) => {
	await (await getSql())`delete from "user" where id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { deleteMyAccount_createServerFn_handler, exportMyData_createServerFn_handler, getSettings_createServerFn_handler, updateSettings_createServerFn_handler };

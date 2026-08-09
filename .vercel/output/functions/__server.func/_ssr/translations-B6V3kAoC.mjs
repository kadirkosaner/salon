//#region node_modules/.nitro/vite/services/ssr/assets/translations-B6V3kAoC.js
/** Normalize app locale id for program_translations rows. */
function translationLocale(locale) {
	const v = (locale || "en").trim();
	const lower = v.toLowerCase();
	if (lower === "pt-br" || v === "pt-BR") return "pt-BR";
	if (lower === "zh-cn" || lower === "zh-hans" || v === "zh-CN") return "zh-CN";
	if (lower === "zh-tw" || lower === "zh-hant" || v === "zh-TW") return "zh-TW";
	return v.split("-")[0].toLowerCase() || "en";
}
/** Resolve program name/description for locale with EN fallback. */
async function translatePrograms(sql, rows, locale) {
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) map.set(r.id, {
		name: r.name,
		description: r.description
	});
	if (rows.length === 0) return map;
	const ids = rows.map((r) => r.id);
	const loc = translationLocale(locale);
	try {
		const tr = await sql`
      select program_id, name, description, locale
      from program_translations
      where program_id = any(${ids}::int[])
        and locale in (${loc}, 'en')
    `;
		const byId = /* @__PURE__ */ new Map();
		for (const row of tr) {
			const cur = byId.get(row.program_id) ?? {};
			if (row.locale === "en") cur.en = row;
			if (row.locale === loc) cur.pref = row;
			byId.set(row.program_id, cur);
		}
		for (const [id, pack] of byId) {
			const hit = pack.pref ?? pack.en;
			if (hit) map.set(id, {
				name: hit.name,
				description: hit.description
			});
		}
	} catch {}
	return map;
}
//#endregion
export { translatePrograms as t };

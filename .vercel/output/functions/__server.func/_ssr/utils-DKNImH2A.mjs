import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DKNImH2A.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** BCP47 tag for Intl from app locale id */
function localeTag(locale = "en") {
	if (locale === "pt-BR") return "pt-BR";
	if (locale === "zh-CN" || locale === "zh-Hans") return "zh-CN";
	if (locale === "zh-TW" || locale === "zh-Hant") return "zh-TW";
	return locale || "en";
}
/** Medium date with weekday — unambiguous across locales (e.g. Sun, 9 Aug 2026). */
function formatDate(date, locale = "en") {
	return (typeof date === "string" ? /* @__PURE__ */ new Date(date + (date.length === 10 ? "T12:00:00" : "")) : date).toLocaleDateString(localeTag(locale), {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
/** ISO weekday 1=Mon … 7=Sun → long name in locale */
function dowLong(dow, locale = "en") {
	return new Date(Date.UTC(2024, 0, dow)).toLocaleDateString(localeTag(locale), {
		weekday: "long",
		timeZone: "UTC"
	});
}
function dowShort(dow, locale = "en") {
	return new Date(Date.UTC(2024, 0, dow)).toLocaleDateString(localeTag(locale), {
		weekday: "short",
		timeZone: "UTC"
	});
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/** ISO weekday: 1=Mon ... 7=Sun (matches program_days.dow) */
function isoDow(dateStr) {
	const js = (/* @__PURE__ */ new Date(dateStr + "T12:00:00")).getDay();
	return js === 0 ? 7 : js;
}
/** Add days to YYYY-MM-DD and return YYYY-MM-DD */
function addDaysISO(dateStr, days) {
	const d = /* @__PURE__ */ new Date(dateStr + "T12:00:00");
	d.setDate(d.getDate() + days);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/** Remap program day DOWs so anchor lands on start weekday (rest days stay empty). */
function remapDow(originalDow, anchorOriginalDow, startDateDow) {
	const rel = (originalDow - anchorOriginalDow + 7) % 7;
	return (startDateDow - 1 + rel) % 7 + 1;
}
/** Short chart tick: YYYY-MM-DD → locale-ish short */
function formatChartDate(iso, locale = "en") {
	if (iso.length >= 10) return (/* @__PURE__ */ new Date(iso.slice(0, 10) + "T12:00:00")).toLocaleDateString(localeTag(locale), {
		day: "2-digit",
		month: "2-digit"
	});
	if (iso.includes("-") && iso.length <= 5) {
		const [m, d] = iso.split("-");
		return `${d}.${m}`;
	}
	return iso;
}
//#endregion
export { formatChartDate as a, remapDow as c, dowShort as i, todayISO as l, cn as n, formatDate as o, dowLong as r, isoDow as s, addDaysISO as t };

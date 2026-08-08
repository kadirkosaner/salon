import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BtReAY3a.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatDateTR(date) {
	return formatDate(date, "tr");
}
function formatDate(date, locale = "tr") {
	const d = typeof date === "string" ? /* @__PURE__ */ new Date(date + (date.length === 10 ? "T12:00:00" : "")) : date;
	const tag = locale === "en" ? "en-GB" : "tr-TR";
	return d.toLocaleDateString(tag, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
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
//#endregion
export { isoDow as a, formatDateTR as i, cn as n, todayISO as o, formatDate as r, addDaysISO as t };

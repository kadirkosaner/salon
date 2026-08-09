//#region node_modules/.nitro/vite/services/ssr/assets/relative-time-DJjUiPBV.js
/** Compact relative time via Intl (locale-aware). */
function toBcp47(locale) {
	if (locale === "pt-BR") return "pt-BR";
	if (locale === "zh-CN" || locale === "zh-Hans") return "zh-CN";
	if (locale === "zh-TW" || locale === "zh-Hant") return "zh-TW";
	return locale || "en";
}
function relativeTime(iso, locale = "en", now = Date.now()) {
	const t = Date.parse(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
	if (Number.isNaN(t)) return "";
	const sec = Math.round((now - t) / 1e3);
	const rtf = new Intl.RelativeTimeFormat(toBcp47(locale), {
		numeric: "auto",
		style: "narrow"
	});
	const abs = Math.abs(sec);
	if (abs < 45) return rtf.format(0, "second");
	if (abs < 3600) return rtf.format(-Math.floor(sec / 60), "minute");
	if (abs < 86400) return rtf.format(-Math.floor(sec / 3600), "hour");
	if (abs < 604800) return rtf.format(-Math.floor(sec / 86400), "day");
	if (abs < 2592e3) return rtf.format(-Math.floor(sec / 604800), "week");
	return rtf.format(-Math.floor(sec / 2592e3), "month");
}
//#endregion
export { relativeTime as t };

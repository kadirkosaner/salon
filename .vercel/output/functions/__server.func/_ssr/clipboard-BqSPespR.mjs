//#region node_modules/.nitro/vite/services/ssr/assets/clipboard-BqSPespR.js
/** Copy text with fallback when Clipboard API is blocked (iframes / insecure). */
async function copyText(text) {
	const value = text.trim();
	if (!value) return false;
	try {
		if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(value);
			return true;
		}
	} catch {}
	try {
		const ta = document.createElement("textarea");
		ta.value = value;
		ta.setAttribute("readonly", "");
		ta.style.position = "fixed";
		ta.style.left = "-9999px";
		ta.style.top = "0";
		document.body.appendChild(ta);
		ta.focus();
		ta.select();
		ta.setSelectionRange(0, value.length);
		const ok = document.execCommand("copy");
		document.body.removeChild(ta);
		return ok;
	} catch {
		return false;
	}
}
//#endregion
export { copyText as t };

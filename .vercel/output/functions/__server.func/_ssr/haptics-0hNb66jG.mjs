//#region node_modules/.nitro/vite/services/ssr/assets/haptics-0hNb66jG.js
var KEY = "salon.haptic";
/** Read haptic preference (local cache of server setting). Default on. */
function isHapticEnabled() {
	if (typeof window === "undefined") return true;
	try {
		const v = localStorage.getItem(KEY);
		if (v === "0") return false;
		if (v === "1") return true;
	} catch {}
	return true;
}
function setHapticEnabled(on) {
	try {
		localStorage.setItem(KEY, on ? "1" : "0");
	} catch {}
}
function vibe(pattern) {
	if (typeof navigator === "undefined" || !navigator.vibrate) return;
	if (!isHapticEnabled()) return;
	try {
		navigator.vibrate(pattern);
	} catch {}
}
var haptic = {
	setComplete: () => vibe(12),
	pr: () => vibe([
		30,
		40,
		30,
		40,
		60
	]),
	like: () => vibe(8),
	follow: () => vibe(14),
	light: () => vibe(6)
};
//#endregion
export { setHapticEnabled as n, haptic as t };

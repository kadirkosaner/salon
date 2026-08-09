//#region node_modules/.nitro/vite/services/ssr/assets/pwa-DZy85EaR.js
var deferred = null;
var listeners = /* @__PURE__ */ new Set();
function notify() {
	for (const fn of listeners) fn();
}
/** Call once from the app root (browser only). */
function initPwa() {
	if (typeof window === "undefined") return;
	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferred = e;
		notify();
	});
	window.addEventListener("appinstalled", () => {
		deferred = null;
		try {
			localStorage.setItem("salon.pwa.installed", "1");
		} catch {}
		notify();
	});
	if ("serviceWorker" in navigator) {
		if (window.isSecureContext || location.hostname === "localhost" || location.hostname === "127.0.0.1") navigator.serviceWorker.register("/sw.js").catch(() => {});
	}
}
function getInstallPrompt() {
	return deferred;
}
function subscribeInstallAvailability(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function isStandalone() {
	if (typeof window === "undefined") return false;
	const mq = window.matchMedia("(display-mode: standalone)").matches;
	const ios = "standalone" in navigator && navigator.standalone;
	return mq || !!ios;
}
function isIos() {
	if (typeof navigator === "undefined") return false;
	return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroid() {
	if (typeof navigator === "undefined") return false;
	return /android/i.test(navigator.userAgent);
}
async function promptInstall() {
	if (!deferred) return "unavailable";
	const ev = deferred;
	deferred = null;
	notify();
	await ev.prompt();
	const { outcome } = await ev.userChoice;
	return outcome;
}
//#endregion
export { isStandalone as a, isIos as i, initPwa as n, promptInstall as o, isAndroid as r, subscribeInstallAvailability as s, getInstallPrompt as t };

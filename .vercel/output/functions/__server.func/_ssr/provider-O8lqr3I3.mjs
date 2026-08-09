import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/provider-O8lqr3I3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OBSIDIAN_ACCENTS = [
	{
		id: "pirinc",
		hex: "#B9A177",
		labelKey: "settings.accentPirinc"
	},
	{
		id: "bakir",
		hex: "#C08552",
		labelKey: "settings.accentBakir"
	},
	{
		id: "kemik",
		hex: "#E8E2D6",
		labelKey: "settings.accentKemik"
	}
];
var CARBON_ACCENTS = [
	{
		id: "volt",
		hex: "#D6FF3F",
		labelKey: "settings.accentVolt"
	},
	{
		id: "ates",
		hex: "#FF6A2B",
		labelKey: "settings.accentAtes"
	},
	{
		id: "buz",
		hex: "#42E3FF",
		labelKey: "settings.accentBuz"
	},
	{
		id: "neon",
		hex: "#FF3F86",
		labelKey: "settings.accentNeon"
	},
	{
		id: "kehribar",
		hex: "#FFC23F",
		labelKey: "settings.accentKehribar"
	},
	{
		id: "beyaz",
		hex: "#FFFFFF",
		labelKey: "settings.accentBeyaz"
	},
	{
		id: "ufuk",
		hex: "#7C5CFF",
		labelKey: "settings.accentUfuk"
	}
];
var DEFAULT_THEME = "obsidian";
var DEFAULT_ACCENT = {
	obsidian: "pirinc",
	carbon: "volt"
};
var THEME_STORAGE_KEY = "salon.theme";
var ACCENT_STORAGE_KEY = "salon.accent";
function isTheme(v) {
	return v === "obsidian" || v === "carbon";
}
function accentsFor(theme) {
	return theme === "carbon" ? CARBON_ACCENTS : OBSIDIAN_ACCENTS;
}
function isAccentForTheme(theme, accent) {
	if (!accent) return false;
	return accentsFor(theme).some((a) => a.id === accent);
}
function normalizeAccent(theme, accent) {
	if (isAccentForTheme(theme, accent)) return accent;
	return DEFAULT_ACCENT[theme];
}
function applyThemeToDocument(theme, accent) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.setAttribute("data-theme", theme);
	root.setAttribute("data-accent", accent);
}
function readStoredTheme() {
	if (typeof window === "undefined") return DEFAULT_THEME;
	try {
		const v = localStorage.getItem(THEME_STORAGE_KEY);
		if (isTheme(v)) return v;
	} catch {}
	return DEFAULT_THEME;
}
function readStoredAccent(theme) {
	if (typeof window === "undefined") return DEFAULT_ACCENT[theme];
	try {
		return normalizeAccent(theme, localStorage.getItem(ACCENT_STORAGE_KEY));
	} catch {
		return DEFAULT_ACCENT[theme];
	}
}
/** Inline script source — inject in <head> to prevent FOUC. */
var THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||${JSON.stringify(DEFAULT_THEME)};if(t!=="obsidian"&&t!=="carbon")t=${JSON.stringify(DEFAULT_THEME)};var a=localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});var ok={obsidian:["pirinc","bakir","kemik"],carbon:["volt","ates","buz","neon","kehribar","beyaz","ufuk"]};if(!a||ok[t].indexOf(a)<0)a={obsidian:"pirinc",carbon:"volt"}[t];var d=document.documentElement;d.setAttribute("data-theme",t);d.setAttribute("data-accent",a);}catch(e){document.documentElement.setAttribute("data-theme","obsidian");document.documentElement.setAttribute("data-accent","pirinc");}})();`;
var ThemeContext = (0, import_react.createContext)(null);
function ThemeProvider({ children, serverTheme, serverAccent }) {
	const [theme, setThemeState] = (0, import_react.useState)(DEFAULT_THEME);
	const [accent, setAccentState] = (0, import_react.useState)(DEFAULT_ACCENT.obsidian);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let t = readStoredTheme();
		let a = readStoredAccent(t);
		if (serverTheme && isTheme(serverTheme)) {
			t = serverTheme;
			a = normalizeAccent(t, serverAccent ?? a);
		}
		setThemeState(t);
		setAccentState(a);
		applyThemeToDocument(t, a);
		setReady(true);
	}, [serverTheme, serverAccent]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		applyThemeToDocument(theme, accent);
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
			localStorage.setItem(ACCENT_STORAGE_KEY, accent);
		} catch {}
	}, [
		theme,
		accent,
		ready
	]);
	const setTheme = (0, import_react.useCallback)((t) => {
		setThemeState(t);
		setAccentState((prev) => normalizeAccent(t, prev));
	}, []);
	const setAccent = (0, import_react.useCallback)((a) => {
		setAccentState(a);
	}, []);
	const setThemeAndAccent = (0, import_react.useCallback)((t, a) => {
		const nextA = normalizeAccent(t, a);
		setThemeState((prev) => prev === t ? prev : t);
		setAccentState((prev) => prev === nextA ? prev : nextA);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		accent,
		setTheme,
		setAccent,
		setThemeAndAccent,
		ready
	}), [
		theme,
		accent,
		setTheme,
		setAccent,
		setThemeAndAccent,
		ready
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) throw new Error("useTheme outside provider");
	return ctx;
}
//#endregion
export { useTheme as a, accentsFor as i, THEME_BOOT_SCRIPT as n, ThemeProvider as r, DEFAULT_ACCENT as t };

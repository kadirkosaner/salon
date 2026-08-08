import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/section-DWQXzvPD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Short roll-up for stats (tonnage, streak, followers).
* Respects prefers-reduced-motion via CSS / no-op when reduced.
*/
function CountUp({ value, className, duration = 500, decimals = 0 }) {
	const [display, setDisplay] = (0, import_react.useState)(value);
	const fromRef = (0, import_react.useRef)(value);
	const preferReduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
	(0, import_react.useEffect)(() => {
		if (preferReduce || !Number.isFinite(value)) {
			setDisplay(value);
			fromRef.current = value;
			return;
		}
		const from = fromRef.current;
		const to = value;
		if (from === to) return;
		const start = performance.now();
		let raf = 0;
		const tick = (now) => {
			const t = Math.min(1, (now - start) / duration);
			const e = 1 - (1 - t) ** 3;
			const cur = from + (to - from) * e;
			setDisplay(cur);
			if (t < 1) raf = requestAnimationFrame(tick);
			else fromRef.current = to;
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		value,
		duration,
		preferReduce
	]);
	const formatted = decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("num tabular-nums", className),
		children: formatted
	});
}
function PageSection({ title, description, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("card-surface min-w-0 overflow-hidden p-3.5 sm:p-4", className),
		children: [(title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex min-w-0 items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg tracking-wide text-text sm:text-xl",
					children: title
				}) : null, description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs leading-relaxed text-muted",
					children: description
				}) : null]
			}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0",
				children: action
			}) : null]
		}), children]
	});
}
function StatTile({ label, value, countValue, countDecimals, hint, icon, onClick, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(onClick ? "button" : "div", {
		type: onClick ? "button" : void 0,
		onClick,
		className: cn("min-w-0 rounded-xl p-3 text-left transition active:scale-[0.96]", accent ? "card-accent" : "card-surface hover:brightness-110", onClick && "cursor-pointer"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[11px] font-medium uppercase tracking-wide text-muted",
					children: label
				}), icon]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-display mt-1.5 truncate text-2xl leading-none tracking-wide sm:text-3xl", accent ? "text-yellow" : "text-text"),
				children: countValue != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
					value: countValue,
					decimals: countDecimals ?? 0
				}) : value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { StatTile as n, PageSection as t };

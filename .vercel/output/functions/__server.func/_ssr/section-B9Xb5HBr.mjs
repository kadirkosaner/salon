import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/section-B9Xb5HBr.js
var import_jsx_runtime = require_jsx_runtime();
function PageSection({ title, description, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("min-w-0 overflow-hidden rounded-xl border border-line bg-surface p-3.5 sm:p-4", className),
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
function StatTile({ label, value, hint, icon, onClick, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(onClick ? "button" : "div", {
		type: onClick ? "button" : void 0,
		onClick,
		className: cn("min-w-0 rounded-xl border p-3 text-left transition", accent ? "border-yellow/35 bg-yellow/10 hover:border-yellow/50" : "border-line bg-surface hover:border-line", onClick && "active:scale-[0.99]"),
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
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function EmptyState({ title, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line px-4 py-8 text-center",
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-text",
			children: title
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-xs text-sm text-muted",
			children: hint
		})]
	});
}
//#endregion
export { PageSection as n, StatTile as r, EmptyState as t };

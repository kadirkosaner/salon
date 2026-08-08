import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { s as btnClass } from "./skeleton-V6qtQgX7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-BGOjuNag.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Premium empty state: icon + short copy + single clear CTA.
* Never leave the user wondering "what now?".
*/
function EmptyState({ icon: Icon, title, hint, actionLabel, actionTo, onAction, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center gap-3 rounded-2xl px-5 py-10 text-center", "bg-surface2/40 shadow-[var(--shadow-highlight)]", className),
		children: [
			Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-14 place-items-center rounded-2xl bg-yellow/10 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.22)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-7",
					strokeWidth: 1.75
				})
			}) : null,
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl tracking-wide text-text",
				children: title
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xs text-sm leading-relaxed text-muted",
				children: hint
			}),
			actionLabel && actionTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: actionTo,
				className: btnClass("primary", "mt-1 min-w-[10rem]"),
				children: actionLabel
			}) : null,
			actionLabel && onAction && !actionTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onAction,
				className: btnClass("primary", "mt-1 min-w-[10rem]"),
				children: actionLabel
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };

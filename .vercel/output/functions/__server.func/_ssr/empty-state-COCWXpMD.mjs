import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { o as btnClass } from "./skeleton-BoolYdvP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-COCWXpMD.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Premium empty state: icon + short copy + single clear CTA.
* Never leave the user wondering "what now?".
*/
function EmptyState({ icon: Icon, title, hint, actionLabel, actionTo, onAction, actionVariant = "soft", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 text-center", "bg-raised/40 shadow-[var(--shadow-highlight)]", className),
		children: [
			Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 place-items-center rounded-xl bg-accent/10 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			}) : null,
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-base tracking-wide text-text",
				children: title
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xs text-sm leading-relaxed text-text-2",
				children: hint
			}),
			actionLabel && actionTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: actionTo,
				className: btnClass(actionVariant, "mt-1 min-h-11 min-w-[10rem]"),
				children: actionLabel
			}) : null,
			actionLabel && onAction && !actionTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onAction,
				className: btnClass(actionVariant, "mt-1 min-h-11 min-w-[10rem]"),
				children: actionLabel
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };

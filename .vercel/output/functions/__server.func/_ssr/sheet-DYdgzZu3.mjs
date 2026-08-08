import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sheet-DYdgzZu3.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Mobile-first bottom sheet (vaul).
* Drop-in for the old Modal/Sheet pattern: render when open, call onClose to dismiss.
* Provides: drag handle, focus trap, Escape, scroll lock, backdrop scale.
*/
function AppSheet({ title, children, onClose, open = true, className, contentClassName }) {
	const hasTitle = title != null && title !== "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open,
		onOpenChange: (next) => {
			if (!next) onClose();
		},
		shouldScaleBackground: true,
		setBackgroundColorOnScale: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-50 bg-black/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
			className: cn("fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] w-full max-w-[480px] flex-col outline-none", "rounded-t-[1.25rem] bg-elevated", "shadow-[var(--shadow-sheet)]", className),
			style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-2.5 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Handle, { className: "mx-auto !h-1 !w-10 !rounded-full !bg-line-strong" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-line/80 px-4 pb-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
						className: cn("font-display min-w-0 flex-1 text-xl tracking-wide text-text", !hasTitle && "sr-only"),
						children: hasTitle ? title : "Dialog"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Close, {
						type: "button",
						className: "grid size-11 shrink-0 place-items-center rounded-full bg-surface2 text-muted shadow-[var(--shadow-highlight)] active:scale-95 active:bg-surface",
						"aria-label": "Kapat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("min-h-0 flex-1 overflow-y-auto overscroll-contain p-4", contentClassName),
					children
				})
			]
		})] })
	});
}
/** Alias used in workout route */
function Sheet(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, { ...props });
}
//#endregion
export { Sheet as n, AppSheet as t };

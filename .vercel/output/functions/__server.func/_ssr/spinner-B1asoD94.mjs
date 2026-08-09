import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spinner-B1asoD94.js
var import_jsx_runtime = require_jsx_runtime();
/** Lightweight CSS spinner for button/action feedback (replaces Loader2). */
function Spinner({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: label ? "status" : void 0,
		"aria-label": label,
		"aria-hidden": label ? void 0 : true,
		className: cn("inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent", className)
	});
}
//#endregion
export { Spinner as t };

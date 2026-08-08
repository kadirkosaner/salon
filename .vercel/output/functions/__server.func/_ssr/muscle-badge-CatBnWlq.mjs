import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as MUSCLE_LABELS } from "./library-BctWyVXl.mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/muscle-badge-CatBnWlq.js
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	gogus: "border-red/30 bg-red/10 text-red",
	sirt: "border-softblue/30 bg-softblue/10 text-softblue",
	omuz: "border-yellow/30 bg-yellow/10 text-yellow",
	kol: "border-blue/30 bg-blue/10 text-blue",
	bacak: "border-green/30 bg-green/10 text-green",
	trapez: "border-orange/30 bg-orange/10 text-orange",
	core: "border-line bg-surface2 text-muted",
	diger: "border-line bg-surface2 text-dim"
};
function muscleLabel(group) {
	if (!group) return MUSCLE_LABELS.diger;
	return MUSCLE_LABELS[group] ?? group;
}
function MuscleBadge({ group, className, size = "sm" }) {
	const key = group || "diger";
	const label = muscleLabel(key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border font-medium", size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]", TONE[key] ?? TONE.diger, className),
		children: label
	});
}
//#endregion
export { MuscleBadge as t };

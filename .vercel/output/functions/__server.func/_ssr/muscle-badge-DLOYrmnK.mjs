import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as MUSCLE_KEYS } from "./library-DGJU16Cf.mjs";
import { d as useT } from "./provider-DKU9A7zf.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/muscle-badge-DLOYrmnK.js
var import_jsx_runtime = require_jsx_runtime();
/** Semantic status colors only — muscle groups stay neutral by default. */
var TONE = {
	gogus: "border-rule bg-raised text-text-2",
	sirt: "border-rule bg-raised text-text-2",
	omuz: "border-rule bg-raised text-text-2",
	kol: "border-rule bg-raised text-text-2",
	bacak: "border-rule bg-raised text-text-2",
	trapez: "border-rule bg-raised text-text-2",
	core: "border-rule bg-raised text-text-2",
	diger: "border-rule bg-raised text-text-3"
};
function muscleLabel(group, t) {
	if (!group) return t("muscle.diger");
	const key = MUSCLE_KEYS[group];
	return key ? t(key) : group;
}
function MuscleBadge({ group, className, size = "sm" }) {
	const t = useT();
	const slug = group || "diger";
	const label = muscleLabel(slug, t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border font-medium", size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]", TONE[slug] ?? TONE.diger, className),
		children: label
	});
}
//#endregion
export { muscleLabel as n, MuscleBadge as t };

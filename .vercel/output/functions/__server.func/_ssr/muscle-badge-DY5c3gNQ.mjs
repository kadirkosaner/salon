import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { c as MUSCLE_LABELS } from "./library-DXw4XNK8.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/muscle-badge-DY5c3gNQ.js
var import_jsx_runtime = require_jsx_runtime();
var programs_exports = /* @__PURE__ */ __exportAll({
	addProgramDay: () => addProgramDay,
	addProgramExercise: () => addProgramExercise,
	createProgram: () => createProgram,
	deleteProgramExercise: () => deleteProgramExercise,
	getActiveProgram: () => getActiveProgram,
	reorderProgramExercises: () => reorderProgramExercises,
	setWeekSchedule: () => setWeekSchedule,
	updateProgramDay: () => updateProgramDay,
	updateProgramExercise: () => updateProgramExercise
});
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("594d4eb468e641b2e1946099093db375f6f1335f8f5b3d3720ed9d6ff2863e83"));
var getActiveProgram = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("492c59b7ae7e87a93f0769074a3c2fa0854245b8937346ac25ac0fe0be29fbaa"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("61e9a16a1abc76676e3cf0c280b82fd182926a7567dc10b2a449c17d772964b0"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("7d209b75950cfadfb3f425e5be3df3130811f3686b85de936ad37d1c9a0c1e67"));
var createProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("8a16d13a104ad0eb47aabfcb0ade826b60488383d12df868462b9100f3ac1c4d"));
var addProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("180e5f28add199b638c547f437ff49db577dcfb38a348ac1eb58726514921478"));
var updateProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("74ce8358fb9f645b4a65bddfa53b671c7cb791d330732af11f921ff837afbf30"));
var setWeekSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("96e1b82b9f2474048cbb4be14e225026ad5b6b579f8087abe490b8784554afea"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("6637fb9fa085c3e6eacb39f6981ae5ee927aff958e463ab6ec97a24a7aa1796b"));
var addProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("773184e549ab922b8d89769e473ae3c026091da75cf449fa7ed279007e484eec"));
var updateProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1d2a464c009ca9b8b62e8a6cd535660f8d5df3a1b1861cb9d1d28bd1c2fc21f7"));
var deleteProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("99da0c2636d87cf261b75fbbc00e9f514f5d93b67429467266c8b2d972db8fc2"));
var reorderProgramExercises = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("ac897f0a9d04feec42896d48947c132ac44208b96298cf5c5eaf86b6a523ab72"));
var TONE = {
	gogus: "border-red/30 bg-red/10 text-red",
	sirt: "border-softblue/30 bg-softblue/10 text-softblue",
	omuz: "border-yellow/30 bg-yellow/10 text-yellow",
	kol: "border-purple-400/30 bg-purple-400/10 text-purple-300",
	bacak: "border-green/30 bg-green/10 text-green",
	trapez: "border-orange-400/30 bg-orange-400/10 text-orange-300",
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
export { deleteProgramExercise as a, reorderProgramExercises as c, updateProgramExercise as d, createProgram as i, setWeekSchedule as l, addProgramDay as n, getActiveProgram as o, addProgramExercise as r, programs_exports as s, MuscleBadge as t, updateProgramDay as u };

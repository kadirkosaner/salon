import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { cn as _enum, gn as object } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-DcAVto0q.js
var $$splitComponentImporter = () => import("./discover-DiCcbnPF.mjs");
var tabSchema = object({ tab: _enum([
	"forYou",
	"programs",
	"people",
	"exercises"
]).optional() });
var Route = createFileRoute("/discover")({
	validateSearch: tabSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

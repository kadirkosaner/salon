import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workout-BI_WdUOc.js
var $$splitComponentImporter = () => import("./workout-8edMG0rp.mjs");
var searchSchema = object({ date: string().optional() });
var Route = createFileRoute("/workout")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

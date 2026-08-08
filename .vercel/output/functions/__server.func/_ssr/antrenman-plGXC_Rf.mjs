import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { _n as string, mn as object } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/antrenman-plGXC_Rf.js
var $$splitComponentImporter = () => import("./antrenman-Bda8kD4_.mjs");
var searchSchema = object({ date: string().optional() });
var Route = createFileRoute("/antrenman")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

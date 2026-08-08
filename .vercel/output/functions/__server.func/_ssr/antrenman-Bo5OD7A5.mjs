import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/antrenman-Bo5OD7A5.js
var $$splitComponentImporter = () => import("./antrenman-D2Cyg2tF.mjs");
var searchSchema = object({ date: string().optional() });
var Route = createFileRoute("/antrenman")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

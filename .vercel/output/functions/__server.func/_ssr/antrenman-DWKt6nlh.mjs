import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/antrenman-DWKt6nlh.js
var $$splitComponentImporter = () => import("./antrenman-CtT-rku9.mjs");
var searchSchema = object({ date: string().optional() });
var Route = createFileRoute("/antrenman")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

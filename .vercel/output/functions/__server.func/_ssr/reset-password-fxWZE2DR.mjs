import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-fxWZE2DR.js
var $$splitComponentImporter = () => import("./reset-password-BW0Gv25H.mjs");
var Route = createFileRoute("/reset-password")({
	validateSearch: (s) => ({
		token: typeof s.token === "string" ? s.token : void 0,
		error: typeof s.error === "string" ? s.error : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

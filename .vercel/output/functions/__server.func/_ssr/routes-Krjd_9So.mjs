import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Krjd_9So.js
var $$splitComponentImporter = () => import("./routes-BpEp0gdG.mjs");
var Route = createFileRoute("/")({
	validateSearch: (s) => {
		const out = {};
		if (typeof s.activity === "string" && s.activity) out.activity = s.activity;
		else if (typeof s.activity === "number") out.activity = String(s.activity);
		if (typeof s.post === "string" && s.post) out.post = s.post;
		else if (typeof s.post === "number") out.post = String(s.post);
		return out;
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

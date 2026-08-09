import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as Outlet, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getMyProfileHub } from "./social-BjKrIrtg.mjs";
import { u as useI18n } from "./provider-DKU9A7zf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { r as ProfileSkeleton } from "./skeleton-BoolYdvP.mjs";
import { t as ProfileView } from "./profile-view-BPkXuXf0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-C8ouNqAi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* `/profile/edit` is a child route (file: profile.edit.tsx). Without an
* Outlet the parent keeps rendering ProfileView and Edit appears broken.
*/
function ProfileRoute() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.startsWith("/profile/") && pathname !== "/profile") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, {});
}
function ProfilePage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t } = useI18n();
	const [hub, setHub] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const reload = (0, import_react.useCallback)(async () => {
		setHub(await getMyProfileHub());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		let cancelled = false;
		setLoading(true);
		reload().catch(() => {
			if (!cancelled) toast.error(t("common.error"));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		userId,
		reload,
		t
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("profile.title"),
		subtitle: hub ? `@${hub.username}` : t("profile.noProgram"),
		children: loading || !hub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, {
			hub,
			t,
			onChanged: () => void reload()
		})
	});
}
//#endregion
export { ProfileRoute as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as getUserProfile } from "./social-Co4clLoL.mjs";
import { n as useI18n } from "./provider-D_-Wceyw.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-DoE9NuRg.mjs";
import { i as ProfileSkeleton } from "./skeleton-V6qtQgX7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ProfileView } from "./profile-view-BkudJadc.mjs";
import { t as Route } from "./u._username-Cp7CohbE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._username-CYZjlrKu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicProfilePage() {
	const { username } = Route.useParams();
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const me = user?.id;
	const { t } = useI18n();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const reload = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const hub = await getUserProfile({ data: username });
			setData(hub);
			if (hub.username && hub.username.toLowerCase() !== username.toLowerCase()) navigate({
				to: "/u/$username",
				params: { username: hub.username },
				replace: true
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [
		username,
		navigate,
		t
	]);
	(0, import_react.useEffect)(() => {
		if (!me) return;
		reload();
	}, [me, reload]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("profile.title"),
		subtitle: data ? `@${data.username}` : "…",
		children: loading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, {
			hub: data,
			t,
			onChanged: () => void reload()
		})
	});
}
//#endregion
export { PublicProfilePage as component };

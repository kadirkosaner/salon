import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as getUserProfile } from "./social-BjKrIrtg.mjs";
import { u as useI18n } from "./provider-DKU9A7zf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { r as ProfileSkeleton } from "./skeleton-BoolYdvP.mjs";
import { t as ProfileView } from "./profile-view-BPkXuXf0.mjs";
import { t as Route } from "./u._username-D0gNKqRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._username-DTPgqd5C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Public profile at /u/:username
* Also accepts legacy /u/:userId links — loads by id, then replace-navigates
* to the canonical @username URL.
*/
function PublicProfilePage() {
	const { username: handle } = Route.useParams();
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const me = user?.id;
	const { t } = useI18n();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const reload = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setMissing(false);
		try {
			const hub = await getUserProfile({ data: handle });
			setData(hub);
			if (hub.username && hub.username.toLowerCase() !== handle.toLowerCase()) navigate({
				to: "/u/$username",
				params: { username: hub.username },
				replace: true
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : t("common.error");
			if (/bulunamad|not found|404/i.test(msg)) {
				setMissing(true);
				setData(null);
			} else {
				toast.error(msg);
				setData(null);
			}
		} finally {
			setLoading(false);
		}
	}, [
		handle,
		navigate,
		t
	]);
	(0, import_react.useEffect)(() => {
		if (!me) return;
		reload();
	}, [me, reload]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("profile.title"),
		subtitle: t("common.error"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-rule bg-sunken p-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-2",
				children: t("profile.notFound")
			})
		})
	});
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

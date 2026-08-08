import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as usernameError, n as normalizeUsername, t as isValidUsername } from "./username-DNrJudLp.mjs";
import { o as updateMyProfile, r as getMyProfileHub } from "./social-Co4clLoL.mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { n as useI18n } from "./provider-D_-Wceyw.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-DoE9NuRg.mjs";
import { i as ProfileSkeleton, s as btnClass } from "./skeleton-V6qtQgX7.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ProfileView } from "./profile-view-BkudJadc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil-CFboQ-n2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** First-login sheet: confirm or change auto-generated username. Not dismissible. */
function UsernameClaimSheet({ initial, t, onDone }) {
	const [value, setValue] = (0, import_react.useState)(initial);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const err = usernameError(normalizeUsername(value), t);
	async function save(confirmOnly = false) {
		setSaving(true);
		try {
			if (confirmOnly) {
				await updateMyProfile({ data: { confirm_username: true } });
				onDone(initial);
				toast.success(t("common.saved"));
				return;
			}
			const u = normalizeUsername(value);
			if (!isValidUsername(u)) {
				toast.error(err || t("profile.usernameInvalid"));
				return;
			}
			onDone((await updateMyProfile({ data: { username: u } })).username);
			toast.success(t("common.saved"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open: true,
		dismissible: false,
		shouldScaleBackground: true,
		setBackgroundColorOnScale: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-50 bg-black/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
			className: cn("fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] w-full max-w-[480px] flex-col outline-none", "rounded-t-[1.25rem] bg-elevated shadow-[var(--shadow-sheet)]"),
			style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-2.5 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-10 rounded-full bg-line-strong" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-line/80 px-4 pb-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
						className: "font-display text-xl tracking-wide",
						children: t("profile.claimTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-11",
						"aria-hidden": true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 overflow-y-auto p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: t("profile.claimHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted",
									children: t("profile.username")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "@"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value,
										onChange: (e) => setValue(e.target.value.toLowerCase()),
										maxLength: 20,
										autoCapitalize: "none",
										autoCorrect: "off",
										spellCheck: false,
										className: "h-12 min-w-0 flex-1 rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
									})]
								}),
								err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-red",
									children: err
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-dim",
									children: "3–20 · a-z, 0-9, _"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: saving || !!err,
							onClick: () => void save(false),
							className: btnClass("primary", "w-full"),
							children: t("profile.claimSave")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: saving,
							onClick: () => void save(true),
							className: btnClass("ghost", "w-full"),
							children: [
								t("profile.claimKeep"),
								" @",
								initial
							]
						})
					]
				})
			]
		})] })
	});
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
		children: loading || !hub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, {
			hub,
			t,
			onChanged: () => void reload()
		}), !hub.username_confirmed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsernameClaimSheet, {
			initial: hub.username,
			t,
			onDone: () => void reload()
		}) : null] })
	});
}
//#endregion
export { ProfilePage as component };

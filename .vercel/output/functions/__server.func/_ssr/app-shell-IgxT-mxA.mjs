import { b as require_jsx_runtime, g as Link, l as useRouterState, v as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { r as useT } from "./provider-CtWU2_Vu.mjs";
import { t as useCurrentUser } from "./use-current-user-BRGBwLSs.mjs";
import { D as LayoutDashboard, P as Dumbbell, W as CalendarDays, Y as Activity, _ as Search, h as Settings } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-IgxT-mxA.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* Auth is ON by default (including the sandbox live preview, which does real
* sign-in). Visitors are signed out until they authenticate. The shared dev
* user only appears when auth is explicitly disabled (`VITE_AUTH_ENABLED=false`).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
function AppShell({ children, title, subtitle, actions, restTimerActive }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const user = useCurrentUser();
	const t = useT();
	const LEFT_NAV = [{
		to: "/",
		label: t("nav.panel"),
		icon: LayoutDashboard
	}, {
		to: "/antrenman",
		label: t("nav.workout"),
		icon: CalendarDays
	}];
	const RIGHT_NAV = [{
		to: "/program",
		label: t("nav.program"),
		icon: Dumbbell
	}];
	const initials = (user?.displayName || user?.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const onSettings = pathname === "/ayarlar";
	const searchActive = pathname === "/kesfet";
	const onProfile = pathname === "/profil" || pathname.startsWith("/u/");
	function navOn(to) {
		if (to === "/") return pathname === "/";
		return pathname === to || pathname.startsWith(to + "/");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full max-w-[100vw] overflow-x-clip bg-bg text-text",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-[var(--grok-banner-h,0px)] z-30 border-b border-line/80 bg-bg/95 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-2xl items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-9 shrink-0 place-items-center rounded-lg bg-yellow/15 text-yellow ring-1 ring-yellow/15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
								className: "size-5",
								strokeWidth: 2.25
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display truncate text-lg leading-none tracking-wide",
								children: title ?? t("app.name")
							}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-xs text-muted",
								children: subtitle
							}) : null]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ayarlar",
							className: cn("grid size-12 place-items-center rounded-2xl transition active:scale-95", onSettings ? "bg-yellow/15 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]" : "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:text-text"),
							"aria-label": t("nav.settings"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
								className: "size-5",
								strokeWidth: onSettings ? 2.4 : 2
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: cn("mx-auto w-full max-w-2xl min-w-0 px-3 pt-3 sm:px-4 sm:pt-4", restTimerActive ? "rest-timer-pad" : "app-pad-bottom"),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md",
				style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-2xl grid-cols-5 items-end",
					children: [
						LEFT_NAV.map((item) => {
							const isOn = navOn(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors", isOn ? "text-yellow" : "text-muted hover:text-text"),
								children: [
									isOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-5 top-0 h-0.5 rounded-full bg-yellow" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-5 shrink-0",
										strokeWidth: isOn ? 2.4 : 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-full truncate",
										children: item.label
									})
								]
							}, item.to);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex min-h-14 items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/kesfet",
								"aria-label": `${t("nav.search")} / ${t("nav.discover")}`,
								className: cn("absolute -top-5 grid size-14 place-items-center rounded-full shadow-lg shadow-black/40 ring-4 ring-bg transition", searchActive ? "bg-yellow text-bg" : "bg-yellow/90 text-bg hover:bg-yellow"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									className: "size-6",
									strokeWidth: 2.5
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mt-7 text-[10px] font-medium", searchActive ? "text-yellow" : "text-muted"),
								children: t("nav.search")
							})]
						}),
						RIGHT_NAV.map((item) => {
							const isOn = navOn(item.to) && !searchActive;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors", isOn ? "text-yellow" : "text-muted hover:text-text"),
								children: [
									isOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-5 top-0 h-0.5 rounded-full bg-yellow" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-5 shrink-0",
										strokeWidth: isOn ? 2.4 : 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-full truncate",
										children: item.label
									})
								]
							}, item.to);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profil",
							"aria-label": t("nav.profile"),
							className: cn("relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors", onProfile ? "text-yellow" : "text-muted hover:text-text"),
							children: [
								onProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-5 top-0 h-0.5 rounded-full bg-yellow" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("grid size-7 place-items-center overflow-hidden rounded-full font-display text-[11px]", onProfile ? "bg-yellow/20 text-yellow ring-2 ring-yellow/50" : "bg-surface2 text-muted ring-1 ring-line"),
									children: user?.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: user.profileImageUrl,
										alt: "",
										className: "size-7 rounded-full object-cover"
									}) : initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-full truncate",
									children: t("nav.profile")
								})
							]
						})
					]
				})
			})
		]
	});
}
function AuthGateSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xs space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-10 w-10 animate-pulse rounded-lg bg-surface2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 animate-pulse rounded bg-surface2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-2/3 animate-pulse rounded bg-surface2" })
			]
		})
	});
}
//#endregion
export { AuthGateSkeleton as n, RedirectToSignIn as r, AppShell as t };

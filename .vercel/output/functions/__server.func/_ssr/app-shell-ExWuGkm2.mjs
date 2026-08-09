import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { V as Dumbbell, et as CalendarDays, g as Settings, j as LayoutDashboard, nt as Bell, y as Search } from "../_libs/lucide-react.mjs";
import { c as SearchSolid, d as useT, l as SettingsSolid, n as BellSolid, r as CalendarDaysSolid, s as LayoutDashboardSolid, t as ActivitySolid } from "./provider-DKU9A7zf.mjs";
import { l as todayISO, n as cn } from "./utils-DKNImH2A.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useCurrentUser } from "./use-current-user-TqsTIwHi.mjs";
import { t as getUnreadNotificationCount } from "./notifications-WEvd4wDq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-ExWuGkm2.js
var import_jsx_runtime = require_jsx_runtime();
/** Phone-frame column width — desktop stays a centered mobile shell. */
var SHELL_MAX = "max-w-[480px]";
function AppShell({ children, title, subtitle, actions }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const user = useCurrentUser();
	const t = useT();
	const { data: notifData } = useQuery({
		queryKey: [...qk.settings, "notif-count"],
		queryFn: () => getUnreadNotificationCount(),
		enabled: !!user?.id,
		refetchInterval: 6e4
	});
	const unread = notifData?.count ?? 0;
	const LEFT_NAV = [{
		to: "/",
		label: t("nav.panel"),
		icon: LayoutDashboard,
		iconSolid: LayoutDashboardSolid
	}, {
		to: "/workout",
		label: t("nav.workout"),
		icon: CalendarDays,
		iconSolid: CalendarDaysSolid
	}];
	const RIGHT_NAV = [{
		to: "/program",
		label: t("nav.program"),
		icon: Dumbbell,
		iconSolid: Dumbbell
	}];
	const initials = (user?.displayName || user?.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const onSettings = pathname === "/settings";
	const searchActive = pathname === "/discover";
	const onProfile = pathname === "/profile" || pathname.startsWith("/u/");
	const onNotif = pathname === "/notifications";
	function navOn(to) {
		if (to === "/") return pathname === "/";
		return pathname === to || pathname.startsWith(to + "/");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full overflow-x-clip bg-canvas text-text",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full flex-col", SHELL_MAX, "border-x border-rule/70 bg-canvas shadow-[0_0_40px_rgba(0,0,0,0.35)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-[var(--grok-banner-h,0px)] z-30 border-b border-rule/80 bg-canvas/95 backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center gap-2 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivitySolid, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display truncate text-lg leading-none tracking-wide",
									children: title ?? t("app.name")
								}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 truncate text-xs text-text-2",
									children: subtitle
								}) : null]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [
								actions,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/notifications",
									className: cn("relative grid size-12 place-items-center rounded-2xl transition active:scale-95", onNotif ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:text-text"),
									"aria-label": t("nav.notifications"),
									children: [onNotif ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellSolid, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold leading-4 text-white",
										children: unread > 99 ? "99+" : unread
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/settings",
									className: cn("grid size-12 place-items-center rounded-2xl transition active:scale-95", onSettings ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:text-text"),
									"aria-label": t("nav.settings"),
									children: onSettings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSolid, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: cn("min-w-0 w-full flex-1 overflow-x-clip px-3 pt-3", "app-pad-bottom"),
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: cn("fixed bottom-0 z-40 border-t border-rule bg-sunken/95 backdrop-blur-md", "left-1/2 w-full -translate-x-1/2", SHELL_MAX),
					style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid w-full grid-cols-5 items-end",
						children: [
							LEFT_NAV.map((item) => {
								const isOn = navOn(item.to);
								const Icon = isOn ? item.iconSolid : item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									...item.to === "/workout" ? { search: { date: todayISO() } } : {},
									className: cn("relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] font-medium transition-colors sm:min-h-16 sm:text-[11px]", isOn ? "text-accent" : "text-text-2 hover:text-text"),
									children: [
										isOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-5 top-0 h-0.5 bg-accent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "max-w-full truncate",
											children: item.label
										})
									]
								}, item.to);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative flex min-h-16 items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/discover",
									"aria-label": t("nav.discover"),
									className: cn("grid size-14 place-items-center rounded-full shadow-lg shadow-black/40 ring-4 ring-canvas transition -translate-y-3", searchActive ? "bg-primary text-on-primary" : "bg-primary/90 text-on-primary hover:bg-primary"),
									children: searchActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchSolid, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-6" })
								})
							}),
							RIGHT_NAV.map((item) => {
								const isOn = navOn(item.to) && !searchActive;
								const Icon = isOn ? item.iconSolid : item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] font-medium transition-colors sm:min-h-16 sm:text-[11px]", isOn ? "text-accent" : "text-text-2 hover:text-text"),
									children: [
										isOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-5 top-0 h-0.5 bg-accent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "max-w-full truncate",
											children: item.label
										})
									]
								}, item.to);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/profile",
								"aria-label": t("nav.profile"),
								className: cn("relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] font-medium transition-colors sm:min-h-16 sm:text-[11px]", onProfile ? "text-accent" : "text-text-2 hover:text-text"),
								children: [
									onProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-5 top-0 h-0.5 bg-accent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("grid size-7 place-items-center overflow-hidden rounded-full font-display text-[11px]", onProfile ? "bg-accent/20 text-accent ring-2 ring-accent/50" : "bg-raised text-text-2 ring-1 ring-rule"),
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
		})
	});
}
function AuthGateSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-canvas px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-[480px] space-y-3 px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-10 w-10 animate-pulse rounded-lg bg-raised" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 animate-pulse rounded bg-raised" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-2/3 animate-pulse rounded bg-raised" })
			]
		})
	});
}
//#endregion
export { AuthGateSkeleton as n, AppShell as t };

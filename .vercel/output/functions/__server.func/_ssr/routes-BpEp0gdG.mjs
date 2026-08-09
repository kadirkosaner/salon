import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { _ as v, a as noInput, h as shortText, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { i as followUser } from "./social-BjKrIrtg.mjs";
import { C as RefreshCw, q as ChevronRight, r as Users } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { c as getSuggestedAthletes, o as getDiscoverFeed, s as getFeed } from "./activity-BAbxc4Wl.mjs";
import { n as cn, o as formatDate } from "./utils-DKNImH2A.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { i as useQueryClient, n as useQuery, t as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useUnitSystem } from "./use-unit-system--Rqopd2R.mjs";
import { n as displayVolume, u as weightUnit } from "./units-CBFS2Xa_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { t as DashboardSkeleton } from "./skeleton-BoolYdvP.mjs";
import { t as EmptyState } from "./empty-state-COCWXpMD.mjs";
import { i as listDiscoverPrograms } from "./share-C5nb_MX_.mjs";
import { t as Route } from "./routes-Krjd_9So.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BpEp0gdG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(shortText(120))).handler(createSsrRpc("85d38fe238ed62e55e52afe9bdc24ec519e505fc89d618f452f6db1887b0a6e6"));
/** Weekly volume — volume only (no invented goal). */
function WeeklyVolume({ current, target: _target, sessionsLeft, unitLabel, className }) {
	const t = useT();
	const left = sessionsLeft !== void 0 ? sessionsLeft === 1 ? t("home.sessionsLeftOne") : t("home.sessionsLeft", { n: sessionsLeft }) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-2", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.14em] text-text-2",
				children: t("home.weeklyVolume")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "num text-3xl leading-none tracking-tight text-text sm:text-4xl",
					children: formatCompact(current)
				}), unitLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 text-sm text-text-2",
					children: unitLabel
				}) : null]
			}),
			left ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-text-3",
				children: left
			}) : null
		]
	});
}
function formatCompact(n) {
	if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
	return String(Math.round(n));
}
var CommentSheet = (0, import_react.lazy)(() => import("./comment-sheet-spJSmV_m.mjs").then((m) => ({ default: m.CommentSheet })));
var FeedEmptyDiscover = (0, import_react.lazy)(() => import("./empty-discover-C95Po3CY.mjs").then((m) => ({ default: m.FeedEmptyDiscover })));
var ActivityCard = (0, import_react.lazy)(() => import("./activity-card-CUBYI5YW.mjs").then((m) => ({ default: m.ActivityCard })));
var ComposePost = (0, import_react.lazy)(() => import("./compose-post-D-ouOBgm.mjs").then((m) => ({ default: m.ComposePost })));
function FeedPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t, locale } = useI18n();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const unitSystem = useUnitSystem(!!userId);
	const search = Route.useSearch();
	const [commentItem, setCommentItem] = (0, import_react.useState)(null);
	const [pullY, setPullY] = (0, import_react.useState)(0);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [highlightId, setHighlightId] = (0, import_react.useState)(null);
	const touchStart = (0, import_react.useRef)(null);
	const sentinelRef = (0, import_react.useRef)(null);
	const feedQuery = useInfiniteQuery({
		queryKey: qk.feed,
		queryFn: ({ pageParam }) => getFeed({ data: {
			cursor: pageParam,
			limit: 12
		} }),
		initialPageParam: void 0,
		getNextPageParam: (last) => last.nextCursor ?? void 0,
		enabled: !!userId
	});
	const items = feedQuery.data?.pages.flatMap((p) => p.items) ?? [];
	const empty = !feedQuery.isLoading && items.length === 0;
	const dashQuery = useQuery({
		queryKey: qk.dashboard,
		queryFn: () => getDashboard(),
		enabled: !!userId
	});
	const suggestedQuery = useQuery({
		queryKey: qk.suggested,
		queryFn: () => getSuggestedAthletes(),
		enabled: !!userId && empty
	});
	const discoverQuery = useQuery({
		queryKey: [...qk.feed, "discover"],
		queryFn: () => getDiscoverFeed(),
		enabled: !!userId && empty
	});
	const programsQuery = useQuery({
		queryKey: [...qk.discover, locale],
		queryFn: () => listDiscoverPrograms({ data: { locale } }),
		enabled: !!userId && empty
	});
	const hasNextPage = feedQuery.hasNextPage;
	const isFetchingNextPage = feedQuery.isFetchingNextPage;
	const fetchNextPage = feedQuery.fetchNextPage;
	(0, import_react.useEffect)(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const io = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
		}, { rootMargin: "200px" });
		io.observe(el);
		return () => io.disconnect();
	}, [
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		items.length
	]);
	(0, import_react.useEffect)(() => {
		if (!search.activity || items.length === 0) return;
		const id = Number(search.activity);
		if (!Number.isFinite(id)) return;
		const found = items.find((it) => it.id === id);
		setHighlightId(id);
		if (found) {
			setCommentItem(found);
			requestAnimationFrame(() => {
				document.querySelector(`[data-activity-id="${id}"]`)?.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			});
		}
		navigate({
			to: "/",
			search: {},
			replace: true
		});
	}, [
		search.activity,
		items,
		navigate
	]);
	const refresh = (0, import_react.useCallback)(async () => {
		setRefreshing(true);
		try {
			await qc.invalidateQueries({ queryKey: qk.feed });
			await feedQuery.refetch();
		} finally {
			setRefreshing(false);
			setPullY(0);
		}
	}, [qc, feedQuery]);
	function onTouchStart(e) {
		if (window.scrollY <= 0) touchStart.current = e.touches[0].clientY;
		else touchStart.current = null;
	}
	function onTouchMove(e) {
		if (touchStart.current == null) return;
		const dy = e.touches[0].clientY - touchStart.current;
		if (dy > 0 && window.scrollY <= 0) setPullY(Math.min(72, dy * .45));
	}
	async function onTouchEnd() {
		if (pullY > 48) await refresh();
		else setPullY(0);
		touchStart.current = null;
	}
	async function follow(id) {
		try {
			await followUser({ data: id });
			toast.success(t("common.success"));
			qc.invalidateQueries({ queryKey: qk.suggested });
			qc.invalidateQueries({ queryKey: qk.feed });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const greeting = user.displayName?.split(" ")[0] ?? t("common.athlete");
	const next = dashQuery.data?.next;
	const volUnit = weightUnit(unitSystem);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("feed.title"),
		subtitle: t("panel.hello", { name: greeting }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-5",
			onTouchStart,
			onTouchMove,
			onTouchEnd: () => void onTouchEnd(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center overflow-hidden text-xs text-text-2 transition-all",
					style: { height: pullY || (refreshing ? 28 : 0) },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", (refreshing || pullY > 48) && "animate-spin text-accent") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-20 animate-pulse rounded-2xl bg-raised",
						"aria-busy": "true"
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposePost, { onPosted: () => {
						qc.invalidateQueries({ queryKey: qk.feed });
					} })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (next) navigate({
							to: "/workout",
							search: { date: next.date }
						});
						else navigate({ to: "/workout" });
					},
					className: "flex w-full items-center gap-3 border-y border-rule py-3 text-left transition active:bg-raised/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-text-3",
							children: t("panel.next")
						}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 truncate text-sm font-semibold",
							children: [next.day_name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-normal text-text-2",
								children: [
									" · ",
									formatDate(next.date, locale),
									" · ",
									next.exercise_count,
									" ",
									t("feed.exercises")
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm font-medium text-text-2",
							children: t("feed.planWorkout")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-text-3" })]
				}),
				dashQuery.data?.hasActiveProgram && dashQuery.data?.week ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeeklyVolume, {
					current: displayVolume(dashQuery.data.week.volume, unitSystem),
					sessionsLeft: Math.max(0, (dashQuery.data.week.planned ?? 0) - (dashQuery.data.week.completed ?? 0)),
					unitLabel: volUnit
				}) : null,
				feedQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSkeleton, {}) : empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Users,
						title: t("feed.emptyTitle"),
						hint: t("feed.emptyHint"),
						actionLabel: t("nav.discover"),
						actionTo: "/discover",
						actionVariant: "soft",
						className: "py-5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							"aria-busy": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-xl bg-raised" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-xl bg-raised" })]
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedEmptyDiscover, {
							t,
							suggested: suggestedQuery.data ?? [],
							discoverItems: discoverQuery.data ?? [],
							programs: programsQuery.data ?? [],
							onFollow: (id) => void follow(id),
							onComment: setCommentItem
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							"aria-busy": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-raised" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-raised" })]
						}),
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-activity-id": item.id,
							className: cn(highlightId === item.id && "rounded-2xl ring-2 ring-accent/60 ring-offset-2 ring-offset-canvas"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityCard, {
								item,
								t,
								onComment: setCommentItem,
								onRemoved: () => void qc.invalidateQueries({ queryKey: qk.feed })
							})
						}, item.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: sentinelRef,
						className: "flex justify-center py-3",
						children: feedQuery.isFetchingNextPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto h-8 w-8 animate-pulse rounded-full bg-raised",
							"aria-hidden": true
						}) : feedQuery.hasNextPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-text-3",
							children: t("feed.loadMore")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-text-3",
							children: t("feed.end")
						})
					})]
				})
			]
		}), commentItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentSheet, {
				item: commentItem,
				t,
				onClose: () => setCommentItem(null),
				onAdded: () => {
					qc.invalidateQueries({ queryKey: qk.feed });
				}
			})
		}) : null]
	});
}
//#endregion
export { FeedPage as component };

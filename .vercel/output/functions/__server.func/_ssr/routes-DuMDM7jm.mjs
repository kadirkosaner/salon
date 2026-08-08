import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { g as v, m as shortText, t as authMiddleware } from "./validation-CwL44con.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { n as followUser } from "./social-Bu5LAUW-.mjs";
import { i as formatDateTR, n as cn } from "./utils-BtReAY3a.mjs";
import { n as useI18n } from "./provider-CeWW0z-e.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { $ as BookOpen, C as RefreshCw, I as Flame, O as MessageCircle, P as Heart, V as Dumbbell, c as Trophy, f as Trash2, h as Share2, i as Users, j as LoaderCircle, o as UserPlus, q as ChevronRight, v as Send } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-A_6k73rc.mjs";
import { n as DashboardSkeleton } from "./skeleton-V6qtQgX7.mjs";
import { t as AppSheet } from "./sheet-DYdgzZu3.mjs";
import { t as haptic } from "./haptics-0hNb66jG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-BGOjuNag.mjs";
import { i as listDiscoverPrograms } from "./share-fpDZHWUO.mjs";
import { t as qk } from "./query-keys-CYbHPFJF.mjs";
import { i as useQueryClient, n as useQuery, t as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { c as getSuggestedAthletes, d as unlikeActivity, l as likeActivity, n as deleteActivity, o as getDiscoverFeed, s as getFeed, t as addComment, u as listComments } from "./activity-D4WccFQz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DuMDM7jm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Compact relative time for feed cards (tr-friendly). */
function relativeTime(iso, now = Date.now()) {
	const t = Date.parse(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
	if (Number.isNaN(t)) return "";
	const sec = Math.round((now - t) / 1e3);
	if (sec < 45) return "şimdi";
	if (sec < 3600) return `${Math.floor(sec / 60)}dk`;
	if (sec < 86400) return `${Math.floor(sec / 3600)}sa`;
	if (sec < 604800) return `${Math.floor(sec / 86400)}g`;
	if (sec < 2592e3) return `${Math.floor(sec / 604800)}hf`;
	return `${Math.floor(sec / 2592e3)}ay`;
}
function ActivityCard({ item, t, onComment, onRemoved }) {
	const [liked, setLiked] = (0, import_react.useState)(item.liked_by_me);
	const [likes, setLikes] = (0, import_react.useState)(item.like_count);
	const [comments, setComments] = (0, import_react.useState)(item.comment_count);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const initials = (item.author.name || "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	async function toggleLike() {
		const next = !liked;
		setLiked(next);
		setLikes((n) => n + (next ? 1 : -1));
		haptic.like();
		try {
			if (next) await likeActivity({ data: item.id });
			else await unlikeActivity({ data: item.id });
		} catch {
			setLiked(!next);
			setLikes((n) => n + (next ? -1 : 1));
			toast.error(t("common.error"));
		}
	}
	async function remove() {
		if (!item.is_mine) return;
		if (!confirm(t("feed.deleteConfirm"))) return;
		setBusy(true);
		try {
			await deleteActivity({ data: item.id });
			onRemoved?.(item.id);
			toast.success(t("common.success"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	async function share() {
		const text = shareText(item);
		try {
			if (navigator.share) await navigator.share({ text });
			else {
				await navigator.clipboard.writeText(text);
				toast.success(t("common.copied"));
			}
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("card-surface overflow-hidden", item.type === "personal_record" && "shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 p-3.5 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/u/$username",
						params: { username: item.author.username || item.author.id },
						className: "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow/15 font-display text-sm text-yellow",
						children: item.author.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.author.image,
							alt: "",
							className: "size-full object-cover"
						}) : initials
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/u/$username",
									params: { username: item.author.username || item.author.id },
									className: "truncate text-sm font-semibold hover:underline",
									children: item.author.name
								}),
								item.author.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-xs text-muted",
									children: ["@", item.author.username]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-[11px] text-dim",
									children: ["· ", relativeTime(item.created_at)]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] font-medium uppercase tracking-wider text-dim",
							children: typeLabel(item.type, t)
						})]
					}),
					item.is_mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void remove(),
						className: "grid size-9 place-items-center rounded-lg text-dim hover:text-red",
						"aria-label": t("common.delete"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3.5 pb-3",
				children: renderBody(item, t)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 border-t border-line/60 px-2 py-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void toggleLike(),
						className: cn("flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition active:scale-[0.98]", liked ? "text-red" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", liked && "fill-current") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: likes
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onComment(item);
							setComments((c) => c);
						},
						className: "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-muted transition active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: comments
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void share(),
						className: "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-muted transition active:scale-[0.98]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
					})
				]
			})
		]
	});
}
function typeLabel(type, t) {
	switch (type) {
		case "workout_completed": return t("feed.typeWorkout");
		case "personal_record": return t("feed.typePr");
		case "program_published": return t("feed.typeProgram");
		case "streak_milestone": return t("feed.typeStreak");
		default: return "";
	}
}
function renderBody(item, t) {
	const p = item.payload;
	if (item.type === "workout_completed") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl bg-surface2/60 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-11 place-items-center rounded-xl bg-yellow/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-5 text-yellow" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display truncate text-xl leading-none",
				children: String(p.day_name ?? "Seans")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted",
				children: [
					Number(p.exercise_count ?? 0),
					" ",
					t("feed.exercises"),
					Number(p.tonnage) > 0 ? ` · ${Number(p.tonnage).toLocaleString("tr-TR")} kg` : ""
				]
			})]
		})]
	});
	if (item.type === "personal_record") {
		const prev = p.prev_weight != null ? Number(p.prev_weight) : null;
		const w = Number(p.weight ?? 0);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow/20 via-yellow/5 to-transparent p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-12 place-items-center rounded-2xl bg-yellow text-bg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-yellow",
							children: t("feed.prBadge")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate font-medium",
							children: String(p.exercise_name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "num mt-1 text-3xl leading-none text-yellow",
							children: [w, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-sm font-sans text-muted",
								children: "kg"
							})]
						}),
						prev != null && prev > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								"+",
								(w - prev).toFixed(w % 1 || prev % 1 ? 1 : 0),
								" kg"
							]
						}) : null
					]
				})]
			})
		});
	}
	if (item.type === "program_published") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl bg-surface2/60 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-11 place-items-center rounded-xl bg-blue/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5 text-blue" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate font-medium",
				children: String(p.name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-muted",
				children: [
					Number(p.day_count ?? 0),
					" ",
					t("feed.days"),
					p.share_code ? ` · ${String(p.share_code)}` : ""
				]
			})]
		})]
	});
	if (item.type === "streak_milestone") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl bg-orange/10 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-11 place-items-center rounded-xl bg-orange/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5 text-orange" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-2xl text-orange",
			children: [
				Number(p.weeks),
				" ",
				t("profile.weekUnit")
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: t("feed.streakHint")
		})] })]
	});
	return null;
}
function shareText(item) {
	const p = item.payload;
	if (item.type === "personal_record") return `🏆 ${p.exercise_name}: ${p.weight} kg — Salon`;
	if (item.type === "workout_completed") return `✅ ${p.day_name} · ${p.tonnage ?? 0} kg — Salon`;
	if (item.type === "program_published") return `📋 ${p.name} — Salon`;
	return `Salon · ${item.author.name}`;
}
function CommentSheet({ item, t, onClose, onAdded }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [body, setBody] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		listComments({ data: item.id }).then((r) => {
			if (!cancelled) setRows(r);
		}).catch(() => {
			if (!cancelled) toast.error(t("common.error"));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [item.id, t]);
	async function send(e) {
		e.preventDefault();
		const text = body.trim();
		if (!text) return;
		setSending(true);
		try {
			await addComment({ data: {
				eventId: item.id,
				body: text
			} });
			setBody("");
			const r = await listComments({ data: item.id });
			setRows(r);
			onAdded();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("common.error"));
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
		title: t("feed.comments"),
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[40vh] flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 space-y-3 overflow-y-auto pb-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-muted" })
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-muted",
					children: t("feed.noComments")
				}) : rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow/15 text-[11px] font-semibold text-yellow",
						children: c.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image,
							alt: "",
							className: "size-full object-cover"
						}) : (c.name[0] ?? "?").toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 rounded-xl bg-surface2/60 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-dim",
								children: relativeTime(c.created_at)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm leading-snug",
							children: c.body
						})]
					})]
				}, c.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void send(e),
				className: "flex gap-2 border-t border-line pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: body,
					onChange: (e) => setBody(e.target.value),
					maxLength: 280,
					placeholder: t("feed.commentPlaceholder"),
					className: "h-11 min-w-0 flex-1 rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: sending || !body.trim(),
					className: "grid size-11 shrink-0 place-items-center rounded-xl bg-yellow text-bg disabled:opacity-50",
					children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
				})]
			})]
		})
	});
}
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(shortText(120))).handler(createSsrRpc("85d38fe238ed62e55e52afe9bdc24ec519e505fc89d618f452f6db1887b0a6e6"));
function FeedPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t } = useI18n();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [commentItem, setCommentItem] = (0, import_react.useState)(null);
	const [pullY, setPullY] = (0, import_react.useState)(0);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
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
		queryKey: qk.discover,
		queryFn: () => listDiscoverPrograms(),
		enabled: !!userId && empty
	});
	(0, import_react.useEffect)(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const io = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) feedQuery.fetchNextPage();
		}, { rootMargin: "200px" });
		io.observe(el);
		return () => io.disconnect();
	}, [
		feedQuery.hasNextPage,
		feedQuery.isFetchingNextPage,
		feedQuery.fetchNextPage,
		items.length
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
	const greeting = user.displayName?.split(" ")[0] ?? "Sporcu";
	const next = dashQuery.data?.next;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("feed.title"),
		subtitle: t("panel.hello", { name: greeting }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			onTouchStart,
			onTouchMove,
			onTouchEnd: () => void onTouchEnd(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center overflow-hidden text-xs text-muted transition-all",
					style: { height: pullY || (refreshing ? 28 : 0) },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", (refreshing || pullY > 48) && "animate-spin text-yellow") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (next) navigate({
							to: "/antrenman",
							search: { date: next.date }
						});
						else navigate({ to: "/antrenman" });
					},
					className: "card-accent flex w-full items-center gap-3 p-3.5 text-left transition active:scale-[0.99]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-yellow",
							children: t("panel.next")
						}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-0.5 truncate text-2xl leading-none tracking-wide",
							children: next.day_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								formatDateTR(next.date),
								" · ",
								next.exercise_count,
								" ",
								t("feed.exercises")
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-0.5 text-xl",
							children: t("feed.planWorkout")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-yellow" })]
				}),
				feedQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSkeleton, {}) : empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: Users,
							title: t("feed.emptyTitle"),
							hint: t("feed.emptyHint"),
							actionLabel: t("nav.discover"),
							actionTo: "/kesfet"
						}),
						(suggestedQuery.data?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted",
							children: t("feed.suggested")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: suggestedQuery.data.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/u/$username",
									params: { username: u.username || u.id },
									className: "flex min-w-0 flex-1 items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-10 place-items-center overflow-hidden rounded-full bg-yellow/15 text-sm font-semibold text-yellow",
										children: u.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: u.image,
											alt: "",
											className: "size-full object-cover"
										}) : u.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-medium",
											children: u.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted",
											children: [
												u.username ? `@${u.username}` : "",
												" · ",
												u.followers,
												" ",
												t("profile.followers").toLowerCase()
											]
										})]
									})]
								}), !u.is_following ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void follow(u.id),
									className: "flex h-9 items-center gap-1 rounded-lg bg-yellow px-2.5 text-xs font-semibold text-bg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), t("profile.follow")]
								}) : null]
							}, u.id))
						})] }),
						(discoverQuery.data?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "px-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted",
								children: t("feed.publicActivity")
							}), discoverQuery.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityCard, {
								item,
								t,
								onComment: setCommentItem
							}, item.id))]
						}),
						(programsQuery.data?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted",
							children: t("feed.featuredPrograms")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
							children: programsQuery.data.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => navigate({ to: "/kesfet" }),
								className: "w-40 shrink-0 rounded-xl border border-line bg-surface2/50 p-3 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted",
									children: [
										p.day_count,
										" ",
										t("feed.days"),
										" · ",
										p.clone_count,
										" kopya"
									]
								})]
							}, p.id))
						})] })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityCard, {
						item,
						t,
						onComment: setCommentItem,
						onRemoved: () => void qc.invalidateQueries({ queryKey: qk.feed })
					}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: sentinelRef,
						className: "flex justify-center py-3",
						children: feedQuery.isFetchingNextPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-muted" }) : feedQuery.hasNextPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-dim",
							children: t("feed.loadMore")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-dim",
							children: t("feed.end")
						})
					})]
				})
			]
		}), commentItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentSheet, {
			item: commentItem,
			t,
			onClose: () => setCommentItem(null),
			onAdded: () => {
				qc.invalidateQueries({ queryKey: qk.feed });
			}
		}) : null]
	});
}
//#endregion
export { FeedPage as component };

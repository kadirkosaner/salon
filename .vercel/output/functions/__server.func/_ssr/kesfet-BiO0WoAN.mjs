import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { g as v, t as authMiddleware } from "./validation-CwL44con.mjs";
import { a as DOW_SHORT, i as DOW_LABELS } from "./library-BctWyVXl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { a as unfollowUser, n as followUser } from "./social-Bu5LAUW-.mjs";
import { a as isoDow, n as cn, o as todayISO, t as addDaysISO } from "./utils-BtReAY3a.mjs";
import { r as useT } from "./provider-CeWW0z-e.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { $ as BookOpen, H as Download, U as Copy, V as Dumbbell, i as Users, j as LoaderCircle, o as UserPlus, p as Sparkles, t as X, u as TrendingUp, y as Search } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-A_6k73rc.mjs";
import { l as generateWorkouts, n as LoadTagBadge, t as ExercisePreviewButton } from "./workouts-D4JpaDWO.mjs";
import { a as ProgramCardSkeleton } from "./skeleton-V6qtQgX7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-BGOjuNag.mjs";
import { n as cloneProgram, r as getPublicProgramDetail } from "./share-fpDZHWUO.mjs";
import { t as qk } from "./query-keys-CYbHPFJF.mjs";
import { t as copyText } from "./clipboard-BqSPespR.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kesfet-BiO0WoAN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StartProgramModal({ pending, busy, onCancel, onConfirm }) {
	const [startDate, setStartDate] = (0, import_react.useState)(todayISO());
	const [startDayId, setStartDayId] = (0, import_react.useState)(null);
	const [days, setDays] = (0, import_react.useState)([]);
	const [loadingDays, setLoadingDays] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let c = false;
		setLoadingDays(true);
		const id = pending.id;
		if (!id) {
			setDays([]);
			setLoadingDays(false);
			return;
		}
		getPublicProgramDetail({ data: id }).then((d) => {
			if (c) return;
			setDays(d.days.map((x) => ({
				id: x.id,
				dow: x.dow,
				name: x.name,
				focus: x.focus
			})));
			const tod = isoDow(todayISO());
			const match = d.days.find((x) => x.dow === tod);
			setStartDayId(match?.id ?? d.days[0]?.id ?? null);
		}).catch(() => {
			if (!c) setDays([]);
		}).finally(() => {
			if (!c) setLoadingDays(false);
		});
		return () => {
			c = true;
		};
	}, [pending.id]);
	const previewDow = isoDow(startDate);
	const selected = days.find((d) => d.id === startDayId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": "Kapat",
			onClick: onCancel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 sm:rounded-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl tracking-wide",
					children: "Programı başlat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium text-text",
						children: [
							"“",
							pending.name,
							"”"
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted",
							children: "Başlangıç günü"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: startDate,
							onChange: (e) => setStartDate(e.target.value),
							className: "h-12 w-full rounded-2xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-dim",
							children: [DOW_LABELS[previewDow], " · seanslar bu günden itibaren planlanır"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted",
							children: "Hangi seansla başlansın?"
						}),
						loadingDays ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center py-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-yellow" })
						}) : days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl bg-surface2 px-3 py-3 text-xs text-muted",
							children: "Seans listesi yok — programın ilk günüyle başlar."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "max-h-52 space-y-1.5 overflow-y-auto",
							children: days.map((d) => {
								const active = startDayId === d.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStartDayId(d.id),
									className: cn("flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left text-sm active:scale-[0.99]", active ? "bg-yellow/15 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.4)]" : "bg-surface2 text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-semibold",
											children: d.name
										}), d.focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[11px] text-muted",
											children: d.focus
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-dim",
										children: DOW_SHORT[d.dow] ?? DOW_LABELS[d.dow]?.slice(0, 2)
									})]
								}) }, d.id);
							})
						}),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-yellow",
									children: selected.name
								}),
								" →",
								" ",
								DOW_LABELS[previewDow],
								" (",
								startDate,
								") gününe oturur; diğer seanslar aralıkları korunarak kayar."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-1 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Eski program silinir (üst üste binmez)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-green",
						children: "• Geçmiş tamamlanan antrenmanlar kalır"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: onCancel,
						className: "h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
						children: "Vazgeç"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy || !startDate,
						onClick: () => onConfirm({
							startDate,
							startSourceDayId: startDayId ?? void 0
						}),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:scale-[0.98] disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Başlat"]
					})]
				})
			]
		})]
	});
}
function ProgramCard({ p, busy, onOpen, onClone, onCopyCode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "min-w-0 rounded-xl border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display truncate text-lg tracking-wide",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted",
						children: [
							p.author_name,
							" · ",
							p.day_count,
							" gün · ",
							p.exercise_count,
							" hareket"
						]
					})]
				}), p.is_catalog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded-full bg-yellow/12 px-2 py-0.5 text-[10px] font-semibold text-yellow",
					children: "Salon"
				})]
			}),
			p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted",
				children: p.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpen,
						className: "h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
						children: "İncele"
					}),
					!p.is_own && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: onClone,
						className: "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:scale-[0.98] disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Seç"]
					}),
					p.share_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "num flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-surface2 px-3 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-yellow",
						onClick: onCopyCode,
						"aria-label": "Kodu kopyala",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), p.share_code]
					})
				]
			})
		]
	});
}
function DetailModal({ id, busy, onClose, onClone }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let c = false;
		getPublicProgramDetail({ data: id }).then((d) => {
			if (!c) setData(d);
		}).catch((e) => {
			if (!c) setErr(e instanceof Error ? e.message : "Hata");
		});
		return () => {
			c = true;
		};
	}, [id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": "Kapat",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl",
			children: [
				!data && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-7 animate-spin text-yellow" })
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-red",
					children: err
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tracking-wide text-yellow",
							children: data.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "grid size-9 shrink-0 place-items-center rounded-md border border-line text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: data.author_name
					}),
					data.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: data.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: data.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface2/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-base",
								children: [
									d.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-sans text-muted",
										children: DOW_LABELS[d.dow]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: d.exercises.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border-t border-line/50 pt-2 first:border-0 first:pt-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: ex.exercise_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "num text-sm text-yellow",
												children: [
													ex.sets,
													"×",
													ex.rep_lo,
													"-",
													ex.rep_hi
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadTagBadge, { tag: ex.load_tag }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewButton, {
												name: ex.exercise_name,
												formCues: ex.form_cues
											})
										]
									})]
								}, ex.id))
							})]
						}, d.id))
					}),
					!data.is_own && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => onClone(data.name),
						className: "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-yellow font-semibold text-bg disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Seç — başlangıç ayarla"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "mt-2 h-11 w-full rounded-lg border border-line text-sm text-muted",
						children: "Kapat"
					})
				] })
			]
		})]
	});
}
var getDiscoverHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c4f46824e85c9c073ba7de6e21f0c434366e69a27c7d3244ddd1814614a613ec"));
var unifiedSearch = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ q: string().trim().min(1).max(80) }))).handler(createSsrRpc("4f16e469083809426eb9ce6433cde4dbda3c7f27ea3afae62a7d955a71e01655"));
var DAY_RE = /^(\d+)\s*gun$/i;
function parseProgramTags(tags) {
	const raw = (tags ?? "").split(/[,;|]/).map((t) => t.trim().toLowerCase()).filter(Boolean);
	let days = null;
	let level = null;
	const goals = [];
	const equipment = [];
	for (const t of raw) {
		const dm = t.match(DAY_RE);
		if (dm) {
			days = Number(dm[1]);
			continue;
		}
		if (t === "3gun" || t === "3-gun") days = 3;
		if (t === "4gun" || t === "4-gun") days = 4;
		if (t === "5gun" || t === "5-gun") days = 5;
		if (t === "6gun" || t === "6-gun") days = 6;
		if (t === "baslangic" || t === "beginner") level = "baslangic";
		if (t === "orta" || t === "intermediate") level = "orta";
		if (t === "ileri" || t === "advanced") level = "ileri";
		if (t === "guc" || t === "güç" || t === "strength" || t === "power") {
			if (!goals.includes("guc")) goals.push("guc");
		}
		if (t === "hipertrofi" || t === "hypertrophy" || t === "kas") {
			if (!goals.includes("hipertrofi")) goals.push("hipertrofi");
		}
		if (t === "kilo" || t === "fatloss" || t === "zayiflama" || t === "weightloss") {
			if (!goals.includes("kilo")) goals.push("kilo");
		}
		if (t === "barbell" || t === "halter") {
			if (!equipment.includes("barbell")) equipment.push("barbell");
		}
		if (t === "dumbbell" || t === "dambıl" || t === "dambil") {
			if (!equipment.includes("dumbbell")) equipment.push("dumbbell");
		}
		if (t === "makine" || t === "machine" || t === "cable") {
			if (!equipment.includes("makine")) equipment.push("makine");
		}
		if (t === "vucut" || t === "bodyweight" || t === "bw") {
			if (!equipment.includes("vucut")) equipment.push("vucut");
		}
	}
	return {
		days,
		level,
		goals,
		equipment,
		raw
	};
}
function emptyFilters() {
	return {
		days: null,
		level: null,
		goal: null,
		equipment: null
	};
}
function matchesFilters(tags, dayCount, f) {
	const p = parseProgramTags(tags);
	const days = p.days ?? dayCount;
	if (f.days != null && days !== f.days) return false;
	if (f.level != null && p.level !== f.level) return false;
	if (f.goal != null && !p.goals.includes(f.goal)) return false;
	if (f.equipment != null && !p.equipment.includes(f.equipment)) return false;
	return true;
}
function hasActiveFilters(f) {
	return f.days != null || f.level != null || f.goal != null || f.equipment != null;
}
var RECENT_KEY = "salon.recent_searches";
var SUGGESTED_Q = [
	"squat",
	"bench",
	"full body",
	"push",
	"pull",
	"admin"
];
function loadRecent() {
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		if (!raw) return [];
		const arr = JSON.parse(raw);
		if (!Array.isArray(arr)) return [];
		return arr.filter((x) => typeof x === "string").slice(0, 8);
	} catch {
		return [];
	}
}
function pushRecent(q) {
	const t = q.trim();
	if (t.length < 2) return;
	try {
		const next = [t, ...loadRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
		localStorage.setItem(RECENT_KEY, JSON.stringify(next));
	} catch {}
}
function DiscoverPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const t = useT();
	const [q, setQ] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)(null);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [filters, setFilters] = (0, import_react.useState)(emptyFilters());
	const [code, setCode] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [cloning, setCloning] = (0, import_react.useState)(false);
	const raceRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setRecent(loadRecent());
	}, []);
	(0, import_react.useEffect)(() => {
		const id = window.setTimeout(() => setDebounced(q.trim()), 250);
		return () => window.clearTimeout(id);
	}, [q]);
	(0, import_react.useEffect)(() => {
		if (debounced.length < 1) {
			setResults(null);
			setSearching(false);
			return;
		}
		const ticket = ++raceRef.current;
		setSearching(true);
		unifiedSearch({ data: { q: debounced } }).then((r) => {
			if (ticket !== raceRef.current) return;
			setResults(r);
			pushRecent(debounced);
			setRecent(loadRecent());
		}).catch(() => {
			if (ticket !== raceRef.current) return;
			toast.error(t("common.error"));
		}).finally(() => {
			if (ticket === raceRef.current) setSearching(false);
		});
	}, [debounced, t]);
	const homeQuery = useQuery({
		queryKey: qk.discoverHome,
		queryFn: () => getDiscoverHome(),
		enabled: !!user?.id && debounced.length < 1
	});
	const runClone = (0, import_react.useCallback)(async (p, opts) => {
		setCloning(true);
		setPending(null);
		try {
			const r = p.kind === "code" ? await cloneProgram({ data: {
				shareCode: p.shareCode,
				setActive: true,
				startDate: opts.startDate,
				startSourceDayId: opts.startSourceDayId
			} }) : await cloneProgram({ data: {
				programId: p.id,
				setActive: true,
				name: p.name,
				startDate: opts.startDate,
				startSourceDayId: opts.startSourceDayId
			} });
			const from = opts.startDate > todayISO() ? opts.startDate : todayISO();
			try {
				await generateWorkouts({ data: {
					fromDate: from,
					weeks: 4,
					untilDate: addDaysISO(from, 28)
				} });
			} catch {}
			const dayHint = r.startDayName ? ` · ${r.startDayName} → ${DOW_LABELS[r.startDow] ?? ""}` : "";
			toast.success(`“${r.name}” aktif${dayHint}`);
			navigate({ to: "/program" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setCloning(false);
		}
	}, [navigate, t]);
	async function copyCode(codeStr) {
		if (await copyText(codeStr)) toast.success(`${t("common.copied")}: ${codeStr}`);
		else toast.message(`Kod: ${codeStr}`);
	}
	async function toggleFollow(id, isFollowing) {
		if (isFollowing && !confirm(t("profile.unfollowConfirm"))) return;
		setResults((prev) => prev ? {
			...prev,
			people: prev.people.map((r) => r.id === id ? {
				...r,
				is_following: !isFollowing,
				followers: r.followers + (isFollowing ? -1 : 1)
			} : r)
		} : prev);
		try {
			if (isFollowing) await unfollowUser({ data: id });
			else {
				await followUser({ data: id });
				try {
					if (navigator.vibrate) navigator.vibrate(12);
				} catch {}
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
			homeQuery.refetch();
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const searchingMode = debounced.length >= 1;
	const shelves = homeQuery.data;
	function filterList(list) {
		if (!hasActiveFilters(filters)) return list;
		return list.filter((p) => matchesFilters(p.tags, p.day_count, filters));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("discover.title"),
		subtitle: t("discover.subtitle"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full min-w-0 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: t("discover.searchPlaceholder"),
								className: "h-12 w-full rounded-xl border border-line-strong bg-surface2 py-2 pl-10 pr-10 text-sm",
								autoComplete: "off",
								enterKeyHint: "search"
							}),
							q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQ(""),
								className: "absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted",
								"aria-label": t("common.close"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							}) : null,
							searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "absolute right-10 top-1/2 size-4 -translate-y-1/2 animate-spin text-yellow" }) : null
						]
					}),
					!searchingMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: t("discover.codePlaceholder"),
							className: "num h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface2 px-3 tracking-widest",
							maxLength: 8
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: cloning,
							onClick: () => {
								const c = code.trim();
								if (c.length < 4) {
									toast.error(t("discover.codeHint"));
									return;
								}
								setPending({
									kind: "code",
									name: c,
									shareCode: c
								});
							},
							className: "h-11 shrink-0 rounded-lg bg-yellow px-3.5 text-sm font-semibold text-bg disabled:opacity-60",
							children: t("discover.addCode")
						})]
					}) : null,
					!searchingMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChips, {
						filters,
						setFilters,
						t
					}) : null,
					searchingMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchResults, {
						results,
						searching,
						t,
						onFollow: toggleFollow,
						onOpenProgram: (id) => setDetailId(id),
						onCloneProgram: (p) => setPending({
							kind: "id",
							id: p.id,
							name: p.name
						}),
						onCopyCode: (c) => void copyCode(c),
						cloning
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(recent.length > 0 || SUGGESTED_Q.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [recent.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted",
							children: t("discover.recent")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "scroll-rail-wrap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "scroll-rail",
								children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQ(r),
									className: "shrink-0 rounded-full border border-line bg-surface2 px-3 py-1.5 text-xs font-medium",
									children: r
								}, r))
							})
						})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted",
							children: t("discover.suggested")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "scroll-rail-wrap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "scroll-rail",
								children: SUGGESTED_Q.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQ(r),
									className: "shrink-0 rounded-full border border-line-strong bg-yellow/10 px-3 py-1.5 text-xs font-medium text-yellow",
									children: r
								}, r))
							})
						})] })]
					}), homeQuery.isLoading || !shelves ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCardSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
								title: t("discover.featured"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-yellow" }),
								items: filterList(shelves.featured),
								cloning,
								onOpen: setDetailId,
								onClone: (p) => setPending({
									kind: "id",
									id: p.id,
									name: p.name
								}),
								onCopyCode: (c) => void copyCode(c),
								empty: t("discover.shelfEmpty")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
								title: t("discover.topCloned"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-softblue" }),
								items: filterList(shelves.topCloned),
								cloning,
								onOpen: setDetailId,
								onClone: (p) => setPending({
									kind: "id",
									id: p.id,
									name: p.name
								}),
								onCopyCode: (c) => void copyCode(c),
								empty: t("discover.shelfEmpty"),
								horizontal: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
								title: t("discover.fromFollowing"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-green" }),
								items: filterList(shelves.fromFollowing),
								cloning,
								onOpen: setDetailId,
								onClone: (p) => setPending({
									kind: "id",
									id: p.id,
									name: p.name
								}),
								onCopyCode: (c) => void copyCode(c),
								empty: t("discover.followingEmpty"),
								horizontal: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
								title: shelves.levelHint === "baslangic" ? t("discover.forBeginner") : shelves.levelHint === "orta" ? t("discover.forMid") : t("discover.forAdv"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4 text-orange" }),
								items: filterList(shelves.forLevel),
								cloning,
								onOpen: setDetailId,
								onClone: (p) => setPending({
									kind: "id",
									id: p.id,
									name: p.name
								}),
								onCopyCode: (c) => void copyCode(c),
								empty: t("discover.shelfEmpty"),
								horizontal: true
							})
						]
					})] })
				]
			}),
			detailId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailModal, {
				id: detailId,
				busy: cloning,
				onClose: () => setDetailId(null),
				onClone: (name) => {
					setDetailId(null);
					setPending({
						kind: "id",
						id: detailId,
						name
					});
				}
			}),
			pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartProgramModal, {
				pending,
				busy: cloning,
				onCancel: () => setPending(null),
				onConfirm: (opts) => void runClone(pending, opts)
			})
		]
	});
}
function FilterChips({ filters, setFilters, t }) {
	function toggleDays(d) {
		setFilters({
			...filters,
			days: filters.days === d ? null : d
		});
	}
	function toggleLevel(l) {
		setFilters({
			...filters,
			level: filters.level === l ? null : l
		});
	}
	function toggleGoal(g) {
		setFilters({
			...filters,
			goal: filters.goal === g ? null : g
		});
	}
	function toggleEq(e) {
		setFilters({
			...filters,
			equipment: filters.equipment === e ? null : e
		});
	}
	const chip = (active) => cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95", active ? "bg-yellow text-bg" : "border border-line bg-surface2 text-muted");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scroll-rail-wrap",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-rail",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 self-center text-[10px] font-semibold uppercase tracking-wider text-dim",
						children: t("discover.filterDays")
					}),
					[
						3,
						4,
						6
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: chip(filters.days === d),
						onClick: () => toggleDays(d),
						children: [
							d,
							" ",
							t("feed.days")
						]
					}, d)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1 shrink-0 self-center text-dim",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 self-center text-[10px] font-semibold uppercase tracking-wider text-dim",
						children: t("discover.filterLevel")
					}),
					[
						["baslangic", "discover.levelBeginner"],
						["orta", "discover.levelMid"],
						["ileri", "discover.levelAdv"]
					].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: chip(filters.level === k),
						onClick: () => toggleLevel(k),
						children: t(label)
					}, k))
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scroll-rail-wrap",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-rail",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 self-center text-[10px] font-semibold uppercase tracking-wider text-dim",
						children: t("discover.filterGoal")
					}),
					[
						["guc", "discover.goalStrength"],
						["hipertrofi", "discover.goalHyper"],
						["kilo", "discover.goalFat"]
					].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: chip(filters.goal === k),
						onClick: () => toggleGoal(k),
						children: t(label)
					}, k)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1 shrink-0 self-center text-dim",
						children: "·"
					}),
					[
						["barbell", "Halter"],
						["dumbbell", "Dambıl"],
						["makine", "Makine"],
						["vucut", "Vücut"]
					].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: chip(filters.equipment === k),
						onClick: () => toggleEq(k),
						children: label
					}, k)),
					hasActiveFilters(filters) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-muted",
						onClick: () => setFilters(emptyFilters()),
						children: t("discover.clearFilters")
					}) : null
				]
			})
		})]
	});
}
function Shelf({ title, icon, items, cloning, onOpen, onClone, onCopyCode, empty, horizontal }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
		className: "font-display mb-2 flex items-center gap-2 text-base tracking-wide",
		children: [icon, title]
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-xl border border-dashed border-line px-3 py-4 text-center text-xs text-muted",
		children: empty
	}) : horizontal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scroll-rail-wrap",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scroll-rail",
			children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-[16.5rem] shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
					p,
					busy: cloning,
					onOpen: () => onOpen(p.id),
					onClone: () => onClone(p),
					onCopyCode: () => p.share_code && onCopyCode(p.share_code)
				})
			}, p.id))
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2.5",
		children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
			p,
			busy: cloning,
			onOpen: () => onOpen(p.id),
			onClone: () => onClone(p),
			onCopyCode: () => p.share_code && onCopyCode(p.share_code)
		}, p.id))
	})] });
}
function SearchResults({ results, searching, t, onFollow, onOpenProgram, onCloneProgram, onCopyCode, cloning }) {
	if (!results && searching) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-yellow" })
	});
	if (!results) return null;
	if (results.people.length === 0 && results.programs.length === 0 && results.exercises.length === 0 && !searching) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: Search,
		title: t("discover.noResults"),
		hint: t("discover.noResultsHint")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			results.people.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), t("discover.people")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: results.people.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonRow, {
					r,
					t,
					onFollow
				}, r.id))
			})] }) : null,
			results.programs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }), t("discover.programs")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2.5",
				children: results.programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
					p,
					busy: cloning,
					onOpen: () => onOpenProgram(p.id),
					onClone: () => onCloneProgram(p),
					onCopyCode: () => p.share_code && onCopyCode(p.share_code)
				}, p.id))
			})] }) : null,
			results.exercises.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-3.5" }), t("discover.exercises")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line rounded-xl border border-line bg-surface2/40",
				children: results.exercises.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-lg bg-yellow/10 text-yellow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium",
							children: e.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-muted",
							children: [e.muscle_group, e.detail ? ` · ${e.detail}` : ""]
						})]
					})]
				}, `${e.name}-${i}`))
			})] }) : null
		]
	});
}
function PersonRow({ r, t, onFollow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/u/$username",
			params: { username: r.username || r.id },
			className: "flex min-w-0 flex-1 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow/15 font-display text-sm text-yellow",
				children: r.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: r.image,
					alt: "",
					className: "size-full object-cover"
				}) : r.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm font-medium",
					children: r.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-muted",
					children: [
						r.username ? `@${r.username}` : "",
						r.username ? " · " : "",
						r.followers,
						" ",
						t("profile.followers").toLowerCase()
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void onFollow(r.id, r.is_following),
			className: cn("flex h-9 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold", r.is_following ? "border border-line text-muted" : "bg-yellow text-bg"),
			children: r.is_following ? t("profile.followingBtn") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }),
				" ",
				t("profile.follow")
			] })
		})]
	});
}
//#endregion
export { DiscoverPage as component };

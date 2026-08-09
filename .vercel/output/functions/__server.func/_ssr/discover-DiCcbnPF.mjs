import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { i as followUser, s as unfollowUser } from "./social-BjKrIrtg.mjs";
import { V as Dumbbell, a as UserPlus, f as Sparkles, l as TrendingUp, r as Users, t as X, tt as BookOpen, y as Search } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { c as getSuggestedAthletes } from "./activity-BAbxc4Wl.mjs";
import { l as todayISO, n as cn, r as dowLong, t as addDaysISO } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { a as generateWorkouts } from "./workouts-Co7BI8CT.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as Route } from "./discover-DcAVto0q.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { i as ProgramCardSkeleton } from "./skeleton-BoolYdvP.mjs";
import { t as EmptyState } from "./empty-state-COCWXpMD.mjs";
import { t as MuscleBadge } from "./muscle-badge-DLOYrmnK.mjs";
import { n as ExercisePreviewModal, s as searchExerciseCatalog } from "./load-tag-CQtjTEUB.mjs";
import { i as listDiscoverPrograms, n as cloneProgram } from "./share-C5nb_MX_.mjs";
import { t as copyText } from "./clipboard-BqSPespR.mjs";
import { i as StartProgramModal, n as ProgramCard, t as DetailModal } from "./discover-panel-CzxIeZnR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-DiCcbnPF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getDiscoverHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ locale: string().optional() }).optional())).handler(createSsrRpc("c4f46824e85c9c073ba7de6e21f0c434366e69a27c7d3244ddd1814614a613ec"));
var unifiedSearch = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	q: string().trim().min(1).max(80),
	locale: string().optional()
}))).handler(createSsrRpc("4f16e469083809426eb9ce6433cde4dbda3c7f27ea3afae62a7d955a71e01655"));
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
		if (t === "2gun" || t === "2-gun") days = 2;
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
	const { locale } = useI18n();
	const [q, setQ] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)(null);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [filters, setFilters] = (0, import_react.useState)(emptyFilters());
	const [pending, setPending] = (0, import_react.useState)(null);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [cloning, setCloning] = (0, import_react.useState)(false);
	const [searchFocused, setSearchFocused] = (0, import_react.useState)(false);
	const [muscleFilter, setMuscleFilter] = (0, import_react.useState)(null);
	const [previewEx, setPreviewEx] = (0, import_react.useState)(null);
	const tab = Route.useSearch().tab ?? "forYou";
	const raceRef = (0, import_react.useRef)(0);
	function setTab(next) {
		navigate({
			to: "/discover",
			search: next === "forYou" ? {} : { tab: next },
			replace: true
		});
	}
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
		unifiedSearch({ data: {
			q: debounced,
			locale
		} }).then((r) => {
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
	}, [
		debounced,
		t,
		locale
	]);
	const homeQuery = useQuery({
		queryKey: [...qk.discoverHome, locale],
		queryFn: () => getDiscoverHome({ data: { locale } }),
		enabled: !!user?.id && debounced.length < 1 && tab === "forYou"
	});
	const programsQuery = useQuery({
		queryKey: [
			...qk.discover,
			"all",
			locale
		],
		queryFn: () => listDiscoverPrograms({ data: { locale } }),
		enabled: !!user?.id && debounced.length < 1 && tab === "programs"
	});
	const peopleQuery = useQuery({
		queryKey: ["discover-people"],
		queryFn: () => getSuggestedAthletes({ data: { limit: 40 } }),
		enabled: !!user?.id && debounced.length < 1 && tab === "people"
	});
	const exercisesQuery = useQuery({
		queryKey: ["discover-exercises", muscleFilter],
		queryFn: () => searchExerciseCatalog({ data: {
			muscleGroup: muscleFilter ?? void 0,
			limit: 80
		} }),
		enabled: !!user?.id && debounced.length < 1 && tab === "exercises"
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
			const dayHint = r.startDayName ? ` · ${r.startDayName} → ${dowLong(r.startDow, locale)}` : "";
			toast.success(t("discover.activated", {
				name: r.name,
				day: dayHint
			}));
			navigate({ to: "/program" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setCloning(false);
		}
	}, [
		navigate,
		t,
		locale
	]);
	async function copyCode(codeStr) {
		if (await copyText(codeStr)) toast.success(`${t("common.copied")}: ${codeStr}`);
		else toast.message(t("program.codeLabel", { code: codeStr }));
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
			peopleQuery.refetch();
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								onFocus: () => setSearchFocused(true),
								onBlur: () => {
									window.setTimeout(() => setSearchFocused(false), 180);
								},
								placeholder: t("discover.searchPlaceholder"),
								className: "h-12 w-full rounded-xl border border-edge bg-raised py-2 pl-10 pr-10 text-sm",
								autoComplete: "off",
								enterKeyHint: "search"
							}),
							q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQ(""),
								className: "absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-text-2",
								"aria-label": t("common.close"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							}) : null,
							searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "absolute right-10 top-1/2 size-4 -translate-y-1/2 text-accent" }) : null
						]
					}),
					!searchingMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [tab === "forYou" || tab === "programs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChips, {
						filters,
						setFilters,
						t
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-4 overflow-x-auto border-b border-rule text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						children: [
							["forYou", t("discover.tabForYou")],
							["programs", t("discover.tabPrograms")],
							["people", t("discover.tabPeople")],
							["exercises", t("discover.tabExercises")]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab(id),
							className: cn("relative -mb-px shrink-0 pb-2 font-medium transition", tab === id ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent" : "text-text-2"),
							children: label
						}, id))
					})] }) : null,
					searchingMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchResults, {
						results,
						searching,
						t,
						onFollow: toggleFollow,
						onOpenProgram: (id) => setDetailId(id),
						onOpenExercise: (e) => setPreviewEx(e),
						onCloneProgram: (p) => setPending({
							kind: "id",
							id: p.id,
							name: p.name
						}),
						onCopyCode: (c) => void copyCode(c),
						cloning
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						searchFocused && !searchingMode && (recent.length > 0 || SUGGESTED_Q.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [recent.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-2",
								children: t("discover.recent")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onMouseDown: (e) => e.preventDefault(),
									onClick: () => setQ(r),
									className: "rounded-full border border-rule bg-raised px-3 py-1.5 text-xs font-medium",
									children: r
								}, r))
							})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-2",
								children: t("discover.suggested")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: SUGGESTED_Q.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onMouseDown: (e) => e.preventDefault(),
									onClick: () => setQ(r),
									className: "rounded-full border border-edge bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent",
									children: r
								}, r))
							})] })]
						}) : null,
						tab === "forYou" ? homeQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCardSkeleton, {}) : homeQuery.isError || !shelves ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-center text-sm text-text-2",
							children: t("common.error")
						}) : hasActiveFilters(filters) ? (() => {
							const seen = /* @__PURE__ */ new Set();
							const combined = [];
							for (const list of [
								shelves.featured,
								shelves.topCloned,
								shelves.fromFollowing,
								shelves.forLevel
							]) for (const p of filterList(list)) {
								if (seen.has(p.id)) continue;
								seen.add(p.id);
								combined.push(p);
							}
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
										children: t("discover.resultsCount", { n: combined.length })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setFilters(emptyFilters()),
										className: "text-xs font-medium text-accent",
										children: t("discover.clearAllFilters")
									})]
								}), combined.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-8 text-center text-sm text-text-2",
									children: t("discover.shelfEmpty")
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-rule border-t border-rule",
									children: combined.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
										rank: i + 1,
										p,
										busy: cloning,
										onOpen: () => setDetailId(p.id),
										onClone: () => setPending({
											kind: "id",
											id: p.id,
											name: p.name
										}),
										onCopyCode: () => p.share_code && void copyCode(p.share_code)
									}) }, p.id))
								})]
							});
						})() : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
									title: t("discover.featuredWeek"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" }),
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
									title: t("discover.newest"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-info" }),
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
									title: t("discover.followSection"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-success" }),
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
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4 text-warning" }),
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
						}) : null,
						tab === "programs" ? programsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCardSkeleton, {}) : (() => {
							const list = filterList(programsQuery.data ?? []);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
									children: [
										t("discover.programs"),
										" · ",
										list.length
									]
								}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-8 text-center text-sm text-text-2",
									children: t("discover.shelfEmpty")
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-rule border-t border-rule",
									children: list.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
										rank: i + 1,
										p,
										busy: cloning,
										onOpen: () => setDetailId(p.id),
										onClone: () => setPending({
											kind: "id",
											id: p.id,
											name: p.name
										}),
										onCopyCode: () => p.share_code && void copyCode(p.share_code)
									}) }, p.id))
								})]
							});
						})() : null,
						tab === "people" ? peopleQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCardSkeleton, {}) : (peopleQuery.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-center text-sm text-text-2",
							children: t("discover.shelfEmpty")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: (peopleQuery.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonRow, {
								r: {
									id: r.id,
									name: r.name,
									username: r.username,
									image: r.image,
									followers: r.followers,
									following: 0,
									is_following: r.is_following,
									follows_you: false,
									is_self: false,
									public_programs: r.public_programs
								},
								t,
								onFollow: (id, following) => void toggleFollow(id, following)
							}, r.id))
						}) : null,
						tab === "exercises" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [
									[null, t("muscle.all")],
									["gogus", t("muscle.gogus")],
									["sirt", t("muscle.sirt")],
									["omuz", t("muscle.omuz")],
									["kol", t("muscle.kol")],
									["bacak", t("muscle.bacak")],
									["core", t("muscle.core")]
								].map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMuscleFilter(id),
									className: cn("inline-flex min-h-11 items-center rounded-full px-3 text-xs font-semibold", muscleFilter === id ? "bg-primary text-on-primary" : "border border-rule bg-raised text-text-2"),
									children: lab
								}, lab))
							}), exercisesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCardSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-rule rounded-xl border border-rule bg-raised/40",
								children: (exercisesQuery.data ?? []).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setPreviewEx({
										name: e.name,
										form_cues: e.form_cues,
										gif_url: e.gif_url,
										image_url: e.image_url,
										muscle_group: e.muscle_group
									}),
									className: "flex h-14 w-full items-center gap-3 px-3 text-left active:bg-sunken",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 truncate text-sm font-medium",
											children: e.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
											group: e.muscle_group,
											size: "xs"
										})
									]
								}) }, `${e.id}-${e.name}-${i}`))
							})]
						}) : null
					] })
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
			}),
			previewEx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewModal, {
				name: previewEx.name,
				formCues: previewEx.form_cues,
				gifUrl: previewEx.gif_url,
				imageUrl: previewEx.image_url,
				muscleGroup: previewEx.muscle_group,
				onClose: () => setPreviewEx(null)
			}) : null
		]
	});
}
function FilterChips({ filters, setFilters, t }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const activeCount = [
		filters.days,
		filters.level,
		filters.goal,
		filters.equipment
	].filter((x) => x != null).length;
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
	const chip = (active) => cn("rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95", active ? "bg-primary text-on-primary" : "border border-rule bg-raised text-text-2");
	const tags = [];
	if (filters.days != null) tags.push({
		key: "days",
		label: `${filters.days} ${t("feed.days")}`,
		clear: () => setFilters({
			...filters,
			days: null
		})
	});
	if (filters.level) tags.push({
		key: "level",
		label: t({
			baslangic: "discover.levelBeginner",
			orta: "discover.levelMid",
			ileri: "discover.levelAdv"
		}[filters.level]),
		clear: () => setFilters({
			...filters,
			level: null
		})
	});
	if (filters.goal) tags.push({
		key: "goal",
		label: t({
			guc: "discover.goalStrength",
			hipertrofi: "discover.goalHyper",
			kilo: "discover.goalFat"
		}[filters.goal]),
		clear: () => setFilters({
			...filters,
			goal: null
		})
	});
	if (filters.equipment) {
		const map = {
			barbell: t("discover.eq.barbell"),
			dumbbell: t("discover.eq.dumbbell"),
			makine: t("discover.eq.machine"),
			vucut: t("discover.eq.bodyweight")
		};
		tags.push({
			key: "eq",
			label: map[filters.equipment] ?? filters.equipment,
			clear: () => setFilters({
				...filters,
				equipment: null
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[38px] flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(true),
				className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold", activeCount > 0 ? "bg-primary text-on-primary" : "border border-rule bg-raised text-text-2"),
				children: activeCount > 0 ? t("discover.filtersCount", { n: activeCount }) : t("discover.filters")
			}),
			tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: tag.clear,
				className: "inline-flex h-9 items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 text-xs font-medium text-accent",
				children: [tag.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })]
			}, tag.key)),
			activeCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setFilters(emptyFilters()),
				className: "text-xs font-medium text-text-2 underline-offset-2 hover:underline",
				children: t("discover.clearAllFilters")
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
				title: t("discover.filters"),
				onClose: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3",
							children: t("discover.filterDays")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								2,
								3,
								4,
								5,
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
							}, d))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3",
							children: t("discover.filterLevel")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								["baslangic", "discover.levelBeginner"],
								["orta", "discover.levelMid"],
								["ileri", "discover.levelAdv"]
							].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: chip(filters.level === k),
								onClick: () => toggleLevel(k),
								children: t(label)
							}, k))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3",
							children: t("discover.filterGoal")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								["guc", "discover.goalStrength"],
								["hipertrofi", "discover.goalHyper"],
								["kilo", "discover.goalFat"]
							].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: chip(filters.goal === k),
								onClick: () => toggleGoal(k),
								children: t(label)
							}, k))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3",
							children: t("discover.filterEquipment")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								["barbell", t("discover.eq.barbell")],
								["dumbbell", t("discover.eq.dumbbell")],
								["makine", t("discover.eq.machine")],
								["vucut", t("discover.eq.bodyweight")]
							].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: chip(filters.equipment === k),
								onClick: () => toggleEq(k),
								children: label
							}, k))
						})] }),
						hasActiveFilters(filters) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full py-2 text-sm text-text-2",
							onClick: () => setFilters(emptyFilters()),
							children: t("discover.clearFilters")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-12 w-full items-center justify-center rounded-[var(--radius-btn)] bg-primary font-semibold text-on-primary",
							onClick: () => setOpen(false),
							children: t("common.done")
						})
					]
				})
			}) : null
		]
	});
}
function Shelf({ title, icon, items, cloning, onOpen, onClone, onCopyCode }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
		className: "mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2",
		children: [icon, title]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-rule border-t border-rule",
		children: items.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
			rank: i + 1,
			p,
			busy: cloning,
			onOpen: () => onOpen(p.id),
			onClone: () => onClone(p),
			onCopyCode: () => p.share_code && onCopyCode(p.share_code)
		}) }, p.id))
	})] });
}
function SearchResults({ results, searching, t, onFollow, onOpenProgram, onOpenExercise, onCloneProgram, onCopyCode, cloning }) {
	if (!results && searching) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto space-y-3 p-4 w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-raised" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-raised" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-raised" })
			]
		})
	});
	if (!results) return null;
	if (!results.shareCodeHit && results.people.length === 0 && results.programs.length === 0 && results.exercises.length === 0 && !searching) {
		if (results.shareCodeMiss) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Search,
			title: t("discover.codeNotFound"),
			hint: t("discover.codeNotFoundHint")
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Search,
			title: t("discover.noResults"),
			hint: t("discover.noResultsHint")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			results.shareCodeHit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
					t("discover.shareCodeGroup"),
					results.shareCodeQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num tracking-widest text-text-2",
						children: ["· ", results.shareCodeQuery]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
				p: results.shareCodeHit,
				busy: cloning,
				onOpen: () => onOpenProgram(results.shareCodeHit.id),
				onClone: () => onCloneProgram(results.shareCodeHit),
				onCopyCode: () => results.shareCodeHit.share_code && onCopyCode(results.shareCodeHit.share_code)
			})] }) : results.shareCodeMiss ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Search,
				title: t("discover.codeNotFound"),
				hint: t("discover.codeNotFoundHint")
			}) : null,
			results.people.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }),
					t("discover.people"),
					" · ",
					results.people.length
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: results.people.slice(0, 5).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonRow, {
					r,
					t,
					onFollow
				}, r.id))
			})] }) : null,
			results.programs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }),
					t("discover.programs"),
					" · ",
					results.programs.length
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2.5",
				children: results.programs.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCard, {
					p,
					busy: cloning,
					onOpen: () => onOpenProgram(p.id),
					onClone: () => onCloneProgram(p),
					onCopyCode: () => p.share_code && onCopyCode(p.share_code)
				}, p.id))
			})] }) : null,
			results.exercises.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-3.5" }),
						t("discover.exercises"),
						" · ",
						results.exercises.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-rule rounded-xl border border-rule bg-raised/40",
					children: results.exercises.slice(0, 5).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpenExercise({
							name: e.name,
							form_cues: e.detail,
							muscle_group: e.muscle_group
						}),
						className: "flex h-14 w-full items-center gap-3 px-3 text-left active:bg-sunken",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate text-sm font-medium",
								children: e.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
								group: e.muscle_group,
								size: "xs"
							})
						]
					}) }, `${e.name}-${i}`))
				}),
				results.exercises.length > 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-center text-[11px] text-text-2",
					children: [
						"+",
						results.exercises.length - 5,
						" · ",
						t("discover.searchAll")
					]
				}) : null
			] }) : null
		]
	});
}
function PersonRow({ r, t, onFollow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3 rounded-xl border border-rule bg-raised/40 px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/u/$username",
			params: { username: r.username || r.id },
			className: "flex min-w-0 flex-1 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 font-display text-sm text-accent",
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
					className: "text-[11px] text-text-2",
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
			className: cn("flex h-9 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold", r.is_following ? "border border-rule text-text-2" : "bg-primary text-on-primary"),
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

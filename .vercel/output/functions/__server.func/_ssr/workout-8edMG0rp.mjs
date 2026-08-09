import { o as __toESM } from "../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Ellipsis, J as ChevronLeft, N as Info, W as Clock, X as Check, Y as ChevronDown, at as ArrowLeftRight, d as Trash2, h as Share2, m as SkipForward, q as ChevronRight, s as Trophy, t as X, w as Plus, x as Save, y as Search, z as Eraser } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { t as haptic } from "./haptics-0hNb66jG.mjs";
import { l as todayISO, n as cn, o as formatDate, t as addDaysISO } from "./utils-DKNImH2A.mjs";
import { n as Sheet, t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { c as listWorkoutsInRange, d as swapWorkoutExercise, f as updateWorkout, i as deleteWorkoutExercise, l as saveWorkoutToProgram, n as clearFutureWorkouts, p as updateWorkoutSet, r as createWorkout, s as getWorkoutByDate, t as addWorkoutExercise, u as skipWorkout } from "./workouts-Co7BI8CT.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useUnitSystem } from "./use-unit-system--Rqopd2R.mjs";
import { l as toStorageWeight, r as displayWeight, u as weightUnit } from "./units-CBFS2Xa_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { a as WorkoutSkeleton, o as btnClass } from "./skeleton-BoolYdvP.mjs";
import { n as muscleLabel, t as MuscleBadge } from "./muscle-badge-DLOYrmnK.mjs";
import { c as similarExercises, i as adoptDatasetExercise, r as LoadTagBadge, s as searchExerciseCatalog, t as ExercisePreviewButton } from "./load-tag-CQtjTEUB.mjs";
import { getActiveProgram } from "./programs-DiVqw6bh.mjs";
import { t as Route } from "./workout-BI_WdUOc.mjs";
import { n as getExerciseBenchmarks, r as getProgramSocial } from "./benchmarks-CZrRdoT9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workout-8edMG0rp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
async function renderShareCard(input) {
	const W = 1080;
	const H = 1920;
	const canvas = document.createElement("canvas");
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext("2d");
	const g = ctx.createLinearGradient(0, 0, W, H);
	g.addColorStop(0, "#0c0c0e");
	g.addColorStop(.55, "#141418");
	g.addColorStop(1, "#1a1408");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, W, H);
	const glow = ctx.createRadialGradient(W * .5, H * .28, 40, W * .5, H * .28, 520);
	glow.addColorStop(0, "color-mix(in oklab, var(--color-accent) 35%, transparent)");
	glow.addColorStop(1, "rgba(245,197,66,0)");
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, W, H);
	ctx.fillStyle = "#f5c542";
	ctx.font = "700 42px system-ui, sans-serif";
	ctx.fillText("SALON", 80, 120);
	ctx.fillStyle = "rgba(255,255,255,0.45)";
	ctx.font = "500 28px system-ui, sans-serif";
	const who = input.username ? `@${input.username}` : input.displayName || "";
	if (who) ctx.fillText(who, 80, 170);
	ctx.fillStyle = input.kind === "pr" ? "color-mix(in oklab, var(--color-accent) 35%, transparent)" : "rgba(255,255,255,0.08)";
	roundRect(ctx, 80, 260, input.kind === "pr" ? 280 : 320, 56, 28);
	ctx.fill();
	ctx.fillStyle = input.kind === "pr" ? "#f5c542" : "#e8e8ea";
	ctx.font = "700 26px system-ui, sans-serif";
	ctx.fillText(input.kind === "pr" ? "KİŞİSEL REKOR" : "ANTRENMAN", 108, 298);
	ctx.fillStyle = "#f4f4f5";
	ctx.font = "800 72px system-ui, sans-serif";
	wrapText(ctx, input.title, 80, 420, 920, 84);
	if (input.subtitle) {
		ctx.fillStyle = "rgba(255,255,255,0.55)";
		ctx.font = "500 34px system-ui, sans-serif";
		ctx.fillText(input.subtitle, 80, 560);
	}
	let y = 680;
	for (const s of input.stats) {
		ctx.fillStyle = "rgba(255,255,255,0.06)";
		roundRect(ctx, 80, y, 920, 140, 28);
		ctx.fill();
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.font = "600 26px system-ui, sans-serif";
		ctx.fillText(s.label.toUpperCase(), 110, y + 48);
		ctx.fillStyle = "#f5c542";
		ctx.font = "800 64px system-ui, sans-serif";
		ctx.fillText(s.value, 110, y + 112);
		y += 168;
	}
	ctx.fillStyle = "rgba(255,255,255,0.35)";
	ctx.font = "500 28px system-ui, sans-serif";
	ctx.fillText(input.dateLabel || (/* @__PURE__ */ new Date()).toLocaleDateString("tr-TR"), 80, 1780);
	ctx.fillText("salon · antrenman günlüğü", 80, 1830);
	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("blob failed")), "image/png", .95);
	});
}
async function shareOrDownload(blob, filename, shareText) {
	const file = new File([blob], filename, { type: "image/png" });
	try {
		if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
			await navigator.share({
				files: [file],
				text: shareText,
				title: "Salon"
			});
			return "shared";
		}
	} catch (e) {
		if (e.name === "AbortError") return "shared";
	}
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
	return "downloaded";
}
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
function wrapText(ctx, text, x, y, maxW, lineH) {
	const words = text.split(/\s+/);
	let line = "";
	let yy = y;
	for (const w of words) {
		const test = line ? `${line} ${w}` : w;
		if (ctx.measureText(test).width > maxW && line) {
			ctx.fillText(line, x, yy);
			line = w;
			yy += lineH;
		} else line = test;
	}
	if (line) ctx.fillText(line, x, yy);
}
function PrCelebration({ pr, username, displayName, t, onClose, onShared }) {
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const reduced = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}, []);
	(0, import_react.useEffect)(() => {
		haptic.pr();
	}, []);
	const delta = pr.prev_weight != null && pr.prev_weight > 0 ? pr.weight - pr.prev_weight : null;
	async function share() {
		setSharing(true);
		try {
			const result = await shareOrDownload(await renderShareCard({
				kind: "pr",
				title: pr.exercise_name,
				subtitle: t("pr.cardSubtitle"),
				stats: [{
					label: t("pr.newWeight"),
					value: `${pr.weight} ${pr.unit}`
				}, ...delta != null ? [{
					label: t("pr.delta"),
					value: `+${delta % 1 ? delta.toFixed(1) : delta} ${pr.unit}`
				}] : []],
				username,
				displayName
			}), `salon-pr-${pr.exercise_name.replace(/\s+/g, "-").toLowerCase()}.png`, `🏆 ${pr.exercise_name}: ${pr.weight}${pr.unit} — Salon`);
			toast.success(result === "shared" ? t("pr.shared") : t("pr.downloaded"));
			onShared?.();
		} catch {
			toast.error(t("common.error"));
		} finally {
			setSharing(false);
		}
	}
	const node = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": t("pr.title"),
		children: [!reduced ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti, {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-accent/30 bg-sunken p-6 sm:rounded-3xl", !reduced && "animate-[fade-up_0.4s_ease]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "absolute right-3 top-3 grid size-10 place-items-center rounded-xl text-text-2",
					"aria-label": t("common.close"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-16 place-items-center rounded-2xl bg-primary text-on-primary shadow-[var(--shadow-primary)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent",
							children: t("pr.badge")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-3xl tracking-wide",
							children: pr.exercise_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "num mt-3 text-5xl leading-none text-accent",
							children: [pr.weight, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-lg font-sans text-text-2",
								children: pr.unit
							})]
						}),
						delta != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm font-semibold text-success",
							children: [
								"+",
								delta % 1 ? delta.toFixed(1) : delta,
								" ",
								pr.unit,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal text-text-2",
									children: t("pr.vsPrev")
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-text-2",
							children: t("pr.firstRecord")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-12 flex-1 rounded-2xl bg-raised text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
						children: t("pr.continue")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: sharing,
						onClick: () => void share(),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-on-primary shadow-[var(--shadow-primary)] disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), t("pr.share")]
					})]
				})
			]
		})]
	});
	if (typeof document === "undefined") return null;
	return (0, import_react_dom.createPortal)(node, document.body);
}
function Confetti() {
	const pieces = (0, import_react.useMemo)(() => Array.from({ length: 36 }, (_, i) => ({
		id: i,
		left: `${(i * 17 + 7) % 100}%`,
		delay: `${i % 12 * .05}s`,
		color: [
			"#f5c542",
			"#3dd68c",
			"#f07178",
			"#6ea8fe",
			"#e8e8ea"
		][i % 5],
		rot: `${i * 47 % 360}deg`,
		dur: `${1.8 + i % 5 * .15}s`
	})), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": true,
		children: [pieces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-[-12px] block size-2.5 rounded-[2px] opacity-90",
			style: {
				left: p.left,
				background: p.color,
				transform: `rotate(${p.rot})`,
				animation: `confetti-fall ${p.dur} linear ${p.delay} forwards`
			}
		}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0.2; }
        }
      ` })]
	});
}
/**
* Lightweight in-session “what’s the best on this lift?” strip.
* Absolute weights only — fun, not a science panel. Labels follow unit system.
*/
function ComparisonStrip({ exerciseId }) {
	const t = useT();
	const unitSystem = useUnitSystem();
	const unit = weightUnit(unitSystem);
	const q = useQuery({
		queryKey: [
			"bench",
			exerciseId,
			"best"
		],
		queryFn: () => getExerciseBenchmarks({ data: {
			exerciseIds: [exerciseId],
			filters: { measure: "absolute" }
		} }),
		staleTime: 3e5
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center gap-2 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2 text-[11px] text-text-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-3.5" }), " …"]
	});
	if (!q.data?.optedIn) return null;
	const slice = q.data.slices.find((s) => s.exerciseId === exerciseId);
	if (!slice) return null;
	if (!slice.enough || slice.best == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] leading-snug text-text-3",
			children: t("compare.needPool")
		})
	});
	const best = displayWeight(slice.best, unitSystem) ?? 0;
	const mine = slice.myValue != null ? displayWeight(slice.myValue, unitSystem) : null;
	const youAreBest = slice.myValue != null && slice.myValue >= slice.best - .05;
	const topPct = slice.myPercentile != null ? Math.max(1, 100 - slice.myPercentile) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 space-y-1 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-semibold uppercase tracking-wider text-text-3",
				children: t("compare.funTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-text",
					children: t("compare.bestKg", {
						n: Math.round(best),
						unit
					})
				}), mine != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("num text-sm font-semibold", youAreBest ? "text-accent" : "text-text-2"),
					children: youAreBest ? t("compare.youBest") : t("compare.youKg", {
						n: Math.round(mine),
						unit
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-text-3",
					children: t("compare.logToJoin")
				})]
			}),
			youAreBest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium text-accent",
				children: t("compare.funCrown")
			}) : topPct != null && topPct <= 50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-text-2",
				children: t("compare.top", { p: topPct })
			}) : mine != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-text-3",
				children: t("compare.funChase")
			}) : null,
			slice.pool > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-text-3",
				children: t("compare.poolPeople", { n: slice.pool })
			}) : null,
			!q.data.hasBodyWeight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/measurements",
				className: "inline-flex min-h-10 items-center text-[11px] font-semibold text-accent",
				children: t("compare.openMeasures")
			}) : null
		]
	});
}
function WorkoutPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t, locale } = useI18n();
	const qc = useQueryClient();
	const navigate = useNavigate({ from: "/workout" });
	const date = Route.useSearch().date || todayISO();
	const today = todayISO();
	const [workout, setWorkout] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const [calendar, setCalendar] = (0, import_react.useState)([]);
	const [programName, setProgramName] = (0, import_react.useState)(null);
	const [programDays, setProgramDays] = (0, import_react.useState)([]);
	const [skipOpen, setSkipOpen] = (0, import_react.useState)(false);
	const [skipBusy, setSkipBusy] = (0, import_react.useState)(false);
	const [swapFor, setSwapFor] = (0, import_react.useState)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [savingProgram, setSavingProgram] = (0, import_react.useState)(false);
	const [prMoment, setPrMoment] = (0, import_react.useState)(null);
	const saveTimers = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const calFrom = (0, import_react.useMemo)(() => addDaysISO(date, -45), [date]);
	const calTo = (0, import_react.useMemo)(() => addDaysISO(date, 60), [date]);
	const goDate = (0, import_react.useCallback)((d) => {
		navigate({ search: { date: d } });
	}, [navigate]);
	const loadCal = (0, import_react.useCallback)(async () => {
		try {
			const rows = await listWorkoutsInRange({ data: {
				from: calFrom,
				to: calTo
			} });
			setCalendar(rows);
		} catch {}
	}, [calFrom, calTo]);
	const loadWorkout = (0, import_react.useCallback)(async (d) => {
		setLoading(true);
		try {
			const w = await getWorkoutByDate({ data: d });
			setWorkout(w);
		} catch {
			setWorkout(null);
		} finally {
			setLoading(false);
		}
	}, []);
	const loadProgram = (0, import_react.useCallback)(async () => {
		try {
			const p = await getActiveProgram();
			if (!p) {
				setProgramName(null);
				setProgramDays([]);
				return;
			}
			setProgramName(p.name);
			setProgramDays(p.days.map((x) => ({
				id: x.id,
				name: x.name,
				dow: x.dow
			})));
		} catch {
			setProgramName(null);
			setProgramDays([]);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		loadProgram();
	}, [userId, loadProgram]);
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		loadCal();
	}, [userId, loadCal]);
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		loadWorkout(date);
	}, [
		userId,
		date,
		loadWorkout
	]);
	const calMap = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of calendar) m.set(r.date, {
			day_name: r.day_name,
			status: r.status
		});
		return m;
	}, [calendar]);
	const needsProgram = !programName;
	function scheduleSetSave(setId, patch) {
		setWorkout((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				exercises: prev.exercises.map((ex) => ({
					...ex,
					sets: ex.sets.map((s) => {
						if (s.id !== setId) return s;
						return {
							...s,
							...patch.reps !== void 0 ? { reps: patch.reps } : {},
							...patch.completed !== void 0 ? { completed: patch.completed } : {},
							...patch.weight !== void 0 ? { weight: patch.weight == null ? null : String(patch.weight) } : {}
						};
					})
				}))
			};
		});
		setSaveState("saving");
		const prev = saveTimers.current.get(setId);
		if (prev) window.clearTimeout(prev);
		const tmr = window.setTimeout(() => {
			updateWorkoutSet({ data: {
				id: setId,
				...patch
			} }).then((res) => {
				setSaveState("saved");
				window.setTimeout(() => setSaveState("idle"), 1200);
				if (res && "pr" in res && res.pr) setPrMoment(res.pr);
			}).catch((e) => {
				toast.error(e instanceof Error ? e.message : t("common.error"));
				setSaveState("idle");
			});
		}, 350);
		saveTimers.current.set(setId, tmr);
	}
	async function finishWorkout() {
		if (!workout) return;
		try {
			await updateWorkout({ data: {
				id: workout.id,
				status: "completed"
			} });
			setWorkout({
				...workout,
				status: "completed"
			});
			toast.success(t("workout.finished"));
			await loadCal();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	async function unskipWorkout() {
		if (!workout) return;
		try {
			await updateWorkout({ data: {
				id: workout.id,
				status: "planned"
			} });
			setWorkout({
				...workout,
				status: "planned"
			});
			toast.success(t("workout.unskipped"));
			await loadCal();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	async function createFromProgram(programDayId) {
		try {
			const w = await createWorkout({ data: {
				date,
				programDayId: programDayId ?? null
			} });
			setWorkout(w);
			toast.success(t("workout.created"));
			await loadCal();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	async function doSkip(mode) {
		if (!workout) return;
		setSkipBusy(true);
		try {
			const r = await skipWorkout({ data: {
				id: workout.id,
				mode
			} });
			if (mode === "postpone_week" && r.newDate) {
				toast.success(`${t("workout.postponed")}${r.shifted ? ` · ${r.shifted}` : ""}`);
				goDate(r.newDate);
			} else {
				toast.success(t("workout.skipped"));
				await loadWorkout(date);
			}
			await loadCal();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setSkipBusy(false);
			setSkipOpen(false);
		}
	}
	async function removeExercise(ex) {
		if (!confirm(t("workout.removeConfirm"))) return;
		try {
			await deleteWorkoutExercise({ data: ex.id });
			setWorkout((prev) => prev ? {
				...prev,
				exercises: prev.exercises.filter((e) => e.id !== ex.id)
			} : prev);
			toast.success(t("workout.exerciseRemoved"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	async function doSwap(newExerciseId, externalId) {
		if (!swapFor) return;
		try {
			let id = newExerciseId;
			if (externalId) id = (await adoptDatasetExercise({ data: { externalId } })).id;
			const w = await swapWorkoutExercise({ data: {
				workoutExerciseId: swapFor.id,
				newExerciseId: id
			} });
			if (w) setWorkout(w);
			setSwapFor(null);
			toast.success(t("workout.swapped"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	async function doAddExercise(exerciseId) {
		if (!workout) return;
		try {
			await addWorkoutExercise({ data: {
				workoutId: workout.id,
				exerciseId
			} });
			await loadWorkout(date);
			setAddOpen(false);
			toast.success(t("workout.exerciseAdded"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	async function doSaveToProgram() {
		if (!workout) return;
		setSavingProgram(true);
		try {
			await saveWorkoutToProgram({ data: { workoutId: workout.id } });
			toast.success(t("workout.savedToProgram"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setSavingProgram(false);
		}
	}
	function onSetComplete(exercise, setId, done) {
		scheduleSetSave(setId, { completed: done });
		if (done) {
			haptic.setComplete();
			try {
				const all = qc.getQueriesData({ queryKey: ["bench", exercise.exercise_id] });
				let pct = null;
				for (const [, data] of all) {
					const s = data?.slices?.find((x) => x.exerciseId === exercise.exercise_id);
					if (s?.enough && s.myPercentile != null && s.myPercentile >= 50) {
						pct = s.myPercentile;
						break;
					}
				}
				if (pct != null) window.setTimeout(() => {
					toast.message(t("compare.setAbove", { p: Math.max(1, 100 - pct) }), { duration: 2200 });
				}, 450);
			} catch {}
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("workout.title"),
		subtitle: programName ?? formatDate(date, locale),
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] text-text-2",
			children: saveState === "saving" ? t("common.saving") : saveState === "saved" ? t("common.saved") : ""
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("w-full min-w-0 space-y-3", workout && !needsProgram && "workout-finish-pad"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContinuousCalendar, {
						selected: date,
						today,
						statusMap: calMap,
						locale,
						t,
						onSelect: goDate,
						onGoToday: () => goDate(today)
					}),
					needsProgram ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-accent/30 bg-accent/10 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg tracking-wide text-accent",
								children: t("workout.noProgram")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-text-2",
								children: t("workout.noProgramHint")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/discover",
								className: btnClass("primary", "mt-3 w-full"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), t("workout.pickProgram")]
							})
						]
					}) : null,
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutSkeleton, {}) : needsProgram ? null : !workout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDay, {
						programDays,
						onCreate: (id) => void createFromProgram(id),
						t
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutBody, {
						workout,
						t,
						locale,
						onFinish: () => void finishWorkout(),
						onSkip: () => setSkipOpen(true),
						onUnskip: () => void unskipWorkout(),
						onSetSave: scheduleSetSave,
						onSetComplete,
						onSwap: (ex) => setSwapFor(ex),
						onRemove: (ex) => void removeExercise(ex),
						onAdd: () => setAddOpen(true),
						onSaveProgram: () => void doSaveToProgram(),
						savingProgram,
						onClearFuture: () => {
							if (!confirm(t("workout.clearFutureConfirm"))) return;
							clearFutureWorkouts().then(async (r) => {
								toast.success(r.deleted === 0 ? t("workout.clearFutureNone") : t("workout.clearFutureDone", { n: r.deleted }));
								await loadCal();
								await loadWorkout(date);
							}).catch((e) => toast.error(e instanceof Error ? e.message : t("common.error")));
						}
					})
				]
			}),
			prMoment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrCelebration, {
				pr: prMoment,
				displayName: user.displayName,
				t,
				onClose: () => setPrMoment(null)
			}) : null,
			skipOpen && workout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipModal, {
				t,
				busy: skipBusy,
				onClose: () => setSkipOpen(false),
				onPick: (m) => void doSkip(m)
			}),
			swapFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwapModal, {
				exercise: swapFor,
				t,
				onClose: () => setSwapFor(null),
				onPick: (id, ext) => void doSwap(id, ext)
			}),
			addOpen && workout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddExModal, {
				t,
				onClose: () => setAddOpen(false),
				onPick: (id) => void doAddExercise(id)
			})
		]
	});
}
function ProgramSocialLine({ t }) {
	const q = useQuery({
		queryKey: ["program-social"],
		queryFn: () => getProgramSocial(),
		staleTime: 3e5
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!q.data || q.data.count === 0 && q.data.todayDone === 0) return null;
	const peers = q.data.peers ?? q.data.following ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-rule/70 bg-raised/30 px-2.5 py-2 text-left text-[11px] text-text-3 active:bg-raised/50",
		children: [q.data.count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex min-w-0 items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex -space-x-1.5",
				children: peers.slice(0, 4).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-5 place-items-center overflow-hidden rounded-full border border-sunken bg-accent/20 text-[8px] font-semibold text-accent",
					title: f.name,
					children: f.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: f.image,
						alt: "",
						className: "size-full object-cover"
					}) : (f.name[0] ?? "?").toUpperCase()
				}, f.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate font-medium text-text-2",
				children: t("compare.programCount", { n: q.data.count })
			})]
		}) : null, q.data.todayDone > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: t("compare.todayDone", { n: q.data.todayDone })
		}) : null]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
		title: t("compare.peersTitle"),
		onClose: () => setOpen(false),
		children: peers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-6 text-center text-sm text-text-3",
			children: t("compare.needPool")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-rule",
			children: peers.map((f) => {
				const isSelf = "isSelf" in f && !!f.isSelf;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("grid size-10 place-items-center overflow-hidden rounded-full text-sm font-semibold", isSelf ? "bg-primary/20 text-primary ring-2 ring-accent/40" : "bg-accent/15 text-accent"),
							children: f.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: f.image,
								alt: "",
								className: "size-full object-cover"
							}) : (f.name[0] ?? "?").toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm font-medium",
								children: [isSelf ? t("compare.you") : f.name, isSelf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1.5 text-[10px] font-semibold text-accent",
									children: ["· ", f.name]
								}) : f.isFollowing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1.5 text-[10px] font-semibold text-text-3",
									children: "·"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-text-3",
								children: t("compare.weekStreak", {
									w: f.week,
									s: f.streak
								})
							})]
						}),
						!isSelf && f.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/u/$username",
							params: { username: f.username },
							className: "text-xs font-medium text-accent",
							onClick: () => setOpen(false),
							children: ["@", f.username]
						}) : isSelf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent",
							children: t("compare.you")
						}) : null
					]
				}, f.id);
			})
		})
	}) : null] });
}
function ContinuousCalendar({ selected, today, statusMap, locale, t, onSelect, onGoToday }) {
	const days = (0, import_react.useMemo)(() => {
		const arr = [];
		for (let i = -7; i <= 14; i++) arr.push(addDaysISO(selected, i));
		return arr;
	}, [selected]);
	const scroller = (0, import_react.useRef)(null);
	const selectedRef = (0, import_react.useRef)(null);
	const [legendOpen, setLegendOpen] = (0, import_react.useState)(false);
	const centerSelected = (0, import_react.useCallback)(() => {
		const root = scroller.current;
		const el = selectedRef.current;
		if (!root || !el) return;
		const rootRect = root.getBoundingClientRect();
		const elRect = el.getBoundingClientRect();
		const delta = elRect.left + elRect.width / 2 - (rootRect.left + rootRect.width / 2);
		root.scrollLeft += delta;
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		centerSelected();
		const id = window.requestAnimationFrame(() => centerSelected());
		return () => window.cancelAnimationFrame(id);
	}, [
		selected,
		days,
		centerSelected
	]);
	function tone(d) {
		const info = statusMap.get(d);
		if (!info) return "empty";
		if (info.status === "completed") return "done";
		if (info.status === "skipped") return "missed";
		if (d < today && info.status === "planned") return "missed";
		return "planned";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs font-medium text-text-2",
						children: formatDate(selected, locale)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLegendOpen((v) => !v),
						className: "grid size-11 shrink-0 place-items-center rounded-full text-text-3 hover:bg-raised hover:text-text-2",
						"aria-label": t("workout.legendHint"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						selected !== today ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onGoToday,
							className: "inline-flex min-h-11 items-center rounded-full px-3 text-[11px] font-semibold text-accent",
							children: t("workout.today")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSelect(addDaysISO(selected, -7)),
							className: "grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised",
							"aria-label": "Prev week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSelect(addDaysISO(selected, 7)),
							className: "grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised",
							"aria-label": "Next week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						})
					]
				})]
			}),
			legendOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-0.5 text-[10px] leading-snug text-text-3",
				children: t("workout.legendHint")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "flex flex-nowrap gap-1 overflow-x-auto overscroll-x-contain px-0.5 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: days.map((d) => {
					const tn = tone(d);
					const isSel = d === selected;
					const isToday = d === today;
					const info = statusMap.get(d);
					const dow = (/* @__PURE__ */ new Date(d + "T12:00:00")).toLocaleDateString(locale === "tr" ? "tr" : locale || "en", { weekday: "short" });
					const dayNum = d.slice(8);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						ref: isSel ? selectedRef : void 0,
						type: "button",
						onClick: () => onSelect(d),
						title: info?.day_name ?? d,
						"aria-current": isToday ? "date" : void 0,
						"aria-pressed": isSel,
						className: cn("relative flex w-11 shrink-0 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 transition active:scale-95", isSel ? "bg-accent/15 text-accent shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]" : "text-text-2 hover:bg-raised/60"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-medium uppercase opacity-80",
								children: dow
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num text-sm leading-none",
								children: Number(dayNum)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-1.5 rounded-full", tn === "done" && "bg-success", tn === "missed" && "bg-danger", tn === "planned" && "bg-accent", tn === "empty" && "bg-edge") })
						]
					}, d);
				})
			})
		]
	});
}
function EmptyDay({ programDays, onCreate, t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-rule bg-sunken p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: t("workout.emptyDay")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onCreate(null),
				className: btnClass("primary", "mt-3 w-full"),
				children: t("workout.createFromProgram")
			}),
			programDays.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-text-2",
				children: t("workout.orPickDay")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: programDays.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onCreate(d.id),
					className: btnClass("ghost", void 0, { size: "sm" }),
					children: d.name
				}, d.id))
			})] })
		]
	});
}
function muscleSummary(exercises, t) {
	const seen = /* @__PURE__ */ new Set();
	const labels = [];
	for (const e of exercises) {
		const g = e.muscle_group || "";
		if (!g || seen.has(g)) continue;
		seen.add(g);
		labels.push(muscleLabel(g, t));
		if (labels.length >= 4) break;
	}
	return labels.join(" · ");
}
function WorkoutBody({ workout, t, locale: _locale, onFinish, onSkip, onUnskip, onSetSave, onSetComplete, onSwap, onRemove, onAdd, onSaveProgram, savingProgram, onClearFuture }) {
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const [finishConfirm, setFinishConfirm] = (0, import_react.useState)(false);
	const doneSets = workout.exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0);
	const totalSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
	const doneEx = workout.exercises.filter((e) => e.sets.length > 0 && e.sets.every((s) => s.completed)).length;
	const incompleteEx = workout.exercises.length - doneEx;
	const allSetsDone = totalSets > 0 && doneSets >= totalSets;
	const canFinish = workout.status !== "completed" && workout.status !== "skipped" && doneSets > 0;
	const focusLine = muscleSummary(workout.exercises, t);
	function requestFinish() {
		if (!canFinish) return;
		if (incompleteEx > 0) {
			setFinishConfirm(true);
			return;
		}
		onFinish();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "min-w-0 truncate font-display text-xl tracking-wide text-accent",
							children: workout.day_name.replace(/\s*\/\s*/g, " ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "num shrink-0 text-sm font-semibold text-text-2",
							children: [
								doneSets,
								"/",
								totalSets || 0
							]
						})]
					}), focusLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[11px] text-text-3",
						children: focusLine
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-text-3",
						children: workout.status === "completed" ? t("workout.completed") : workout.status === "skipped" ? t("workout.skipped") : t("workout.planned")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMoreOpen((o) => !o),
						className: "grid size-10 place-items-center rounded-xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95",
						"aria-label": t("program.more"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
					}), moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "fixed inset-0 z-40",
						"aria-label": t("common.close"),
						onClick: () => setMoreOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute right-0 top-[calc(100%+0.25rem)] z-50 w-52 overflow-hidden rounded-xl border border-rule bg-sunken shadow-xl",
						children: [
							workout.status === "skipped" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
								onClick: () => {
									setMoreOpen(false);
									onUnskip();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4 text-text-2" }), t("workout.unskip")]
							}) : workout.status !== "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
								onClick: () => {
									setMoreOpen(false);
									onSkip();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4 text-text-2" }), t("workout.skip")]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
								onClick: () => {
									setMoreOpen(false);
									onAdd();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 text-text-2" }), t("workout.addExercise")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
								disabled: savingProgram,
								onClick: () => {
									setMoreOpen(false);
									onSaveProgram();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4 text-text-2" }), t("workout.saveToProgram")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10",
								onClick: () => {
									setMoreOpen(false);
									onClearFuture();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-4" }), t("program.clearFuture")]
							})
						]
					})] }) : null]
				})]
			}),
			workout.status === "skipped" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-text-3",
				children: t("workout.skippedHint")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramSocialLine, { t }),
			workout.exercises.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-rule bg-raised/40 p-4 text-sm text-text-2",
				children: t("workout.emptyShell")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseList, {
				exercises: workout.exercises,
				t,
				onSetSave,
				onSetComplete,
				onSwap,
				onRemove
			}),
			workout.status !== "completed" && workout.status !== "skipped" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-x-0 z-[35] mx-auto flex w-full max-w-[480px] items-center gap-3 border-t border-rule bg-sunken/95 px-3 py-2.5 backdrop-blur-md",
				style: { bottom: "calc(5.25rem + env(safe-area-inset-bottom, 0px))" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "num text-sm font-semibold tabular-nums text-text",
						children: [
							doneSets,
							"/",
							totalSets || 0
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-text-3",
						children: t("workout.setsLabel")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !canFinish,
					onClick: requestFinish,
					title: !canFinish ? t("workout.finishNeedSet") : void 0,
					className: cn("flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold transition active:scale-[0.98]", !canFinish && "bg-raised text-text-3", canFinish && allSetsDone && "bg-primary text-on-primary shadow-[var(--shadow-primary)]", canFinish && !allSetsDone && "bg-raised text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: t("workout.finish")
					})]
				})]
			}) : null,
			finishConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
				title: t("workout.finish"),
				onClose: () => setFinishConfirm(false),
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 flex-1 rounded-xl border border-rule text-sm font-semibold",
						onClick: () => setFinishConfirm(false),
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-on-primary",
						onClick: () => {
							setFinishConfirm(false);
							onFinish();
						},
						children: t("workout.finishAnyway")
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-text-2",
					children: t("workout.finishIncomplete", { n: incompleteEx })
				})
			}) : null
		]
	});
}
function ExerciseList({ exercises, t, onSetSave, onSetComplete, onSwap, onRemove }) {
	const defaultOpen = (0, import_react.useMemo)(() => {
		return exercises.find((e) => !e.sets.every((s) => s.completed))?.id ?? exercises[0]?.id ?? null;
	}, [exercises]);
	const [openId, setOpenId] = (0, import_react.useState)(defaultOpen);
	const idsKey = exercises.map((e) => e.id).join(",");
	(0, import_react.useEffect)(() => {
		const firstOpen = exercises.find((e) => !e.sets.every((s) => s.completed));
		setOpenId(firstOpen?.id ?? exercises[0]?.id ?? null);
	}, [idsKey]);
	function handleSetComplete(ex, setId, done) {
		onSetComplete(ex, setId, done);
		if (!done) return;
		if (!ex.sets.map((s) => s.id === setId ? {
			...s,
			completed: true
		} : s).every((s) => s.completed)) return;
		const idx = exercises.findIndex((e) => e.id === ex.id);
		for (let i = idx + 1; i < exercises.length; i++) {
			const n = exercises[i];
			if (!n.sets.every((s) => s.completed)) {
				setOpenId(n.id);
				return;
			}
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1.5",
		children: exercises.map((ex, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCard, {
			index: i + 1,
			exercise: ex,
			open: openId === ex.id,
			onToggle: () => setOpenId((cur) => cur === ex.id ? null : ex.id),
			t,
			onSetSave,
			onSetComplete: handleSetComplete,
			onSwap: () => onSwap(ex),
			onRemove: () => onRemove(ex)
		}, ex.id))
	});
}
function lastWeightForSet(exercise, setIndex) {
	const last = exercise.lastTime?.sets;
	if (!last?.length) return null;
	return (last.find((s, i) => i + 1 === setIndex) ?? last[last.length - 1])?.weight ?? null;
}
function lastRepsForSet(exercise, setIndex) {
	const last = exercise.lastTime?.sets;
	if (!last?.length) return null;
	return (last.find((s, i) => i + 1 === setIndex) ?? last[last.length - 1])?.reps ?? null;
}
function ExerciseActionMenu({ t, hasNote, noteOpen, onNote, onSwap, onRemove }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised",
			"aria-label": t("program.more"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "fixed inset-0 z-40",
			"aria-label": t("common.close"),
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 top-[calc(100%+0.25rem)] z-50 w-44 overflow-hidden rounded-xl border border-rule bg-sunken shadow-xl",
			children: [
				hasNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
					onClick: () => {
						setOpen(false);
						onNote();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4 text-text-2" }), noteOpen ? t("workout.hideNote") : t("workout.showNote")]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
					onClick: () => {
						setOpen(false);
						onSwap();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4 text-text-2" }), t("workout.swap")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-rule" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10",
					onClick: () => {
						setOpen(false);
						onRemove();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), t("workout.removeExercise")]
				})
			]
		})] }) : null]
	});
}
function ExerciseCard({ index, exercise, open, onToggle, t, onSetSave, onSetComplete, onSwap, onRemove }) {
	const [noteOpen, setNoteOpen] = (0, import_react.useState)(false);
	const [highlightSet, setHighlightSet] = (0, import_react.useState)(null);
	const unitSystem = useUnitSystem();
	const wu = weightUnit(unitSystem);
	const weightIsMass = exercise.unit === "kg" || exercise.unit === "lb" || !exercise.unit;
	const displayUnit = weightIsMass ? wu : exercise.unit || "kg";
	const toDisplayW = (kg) => {
		if (kg == null || kg === "") return null;
		const n = typeof kg === "number" ? kg : Number(kg);
		if (!Number.isFinite(n)) return null;
		return weightIsMass ? displayWeight(n, unitSystem) : n;
	};
	const toStoreW = (display, system) => weightIsMass ? toStorageWeight(display, system) : display;
	const doneCount = exercise.sets.filter((s) => s.completed).length;
	const allDone = doneCount === exercise.sets.length && exercise.sets.length > 0;
	const topLast = toDisplayW(exercise.lastTime?.sets.reduce((m, s) => {
		if (s.weight == null) return m;
		return m == null || s.weight > m ? s.weight : m;
	}, null) ?? null);
	function repeatLast() {
		for (const s of exercise.sets) {
			const w = lastWeightForSet(exercise, s.set_index);
			const r = lastRepsForSet(exercise, s.set_index);
			if (w != null || r != null) onSetSave(s.id, {
				...w != null ? { weight: w } : {},
				...r != null ? { reps: r } : {}
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cn("min-w-0 overflow-hidden rounded-xl border bg-sunken transition", open ? "border-accent/40" : "border-rule/80", allDone && !open && "border-accent/30 bg-accent/5"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex min-h-11 w-full items-center gap-2 px-2.5 py-2.5 text-left active:bg-raised/40",
			"aria-expanded": open,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("num grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold", allDone ? "bg-accent/20 text-accent" : open ? "bg-accent/20 text-accent" : "bg-raised text-text-2"),
					children: allDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : String(index).padStart(2, "0")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate text-sm font-medium",
					children: exercise.exercise_name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num shrink-0 text-[11px] text-text-2",
					children: [
						exercise.target_sets,
						"×",
						exercise.target_rep_lo,
						"–",
						exercise.target_rep_hi
					]
				}),
				exercise.rest_sec != null && exercise.rest_sec > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num shrink-0 text-[10px] tabular-nums text-text-3",
					children: [exercise.rest_sec, "s"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num shrink-0 text-[11px] tabular-nums text-text-3",
					children: [
						doneCount,
						"/",
						exercise.sets.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 shrink-0 text-text-3 transition-transform", open && "rotate-180 text-accent") })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-rule/80 px-2.5 pb-2.5 pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 flex-wrap items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
									group: exercise.muscle_group,
									size: "xs"
								}),
								exercise.load_tag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadTagBadge, { tag: exercise.load_tag }) : null,
								exercise.rest_sec != null && exercise.rest_sec > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-0.5 rounded-full border border-rule bg-raised px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), t("workout.restSec", { n: exercise.rest_sec })]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewButton, {
							name: exercise.exercise_name,
							muscleGroup: exercise.muscle_group,
							compact: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseActionMenu, {
							t,
							hasNote: !!exercise.note,
							noteOpen,
							onNote: () => setNoteOpen((v) => !v),
							onSwap,
							onRemove
						})
					]
				}),
				topLast != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-text-3",
						children: t("workout.lastKg", {
							w: topLast,
							unit: displayUnit
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: repeatLast,
						className: "inline-flex min-h-11 items-center rounded-full border border-rule px-3 text-[11px] font-semibold text-accent",
						children: t("workout.repeatLast")
					})]
				}) : null,
				noteOpen && exercise.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 rounded-lg bg-raised/50 px-2 py-1.5 text-[11px] leading-relaxed text-text-2",
					children: exercise.note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "set-grid mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-text-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "#" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayUnit }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("workout.reps") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
					]
				}),
				exercise.sets.map((s) => {
					const ghostW = toDisplayW(lastWeightForSet(exercise, s.set_index));
					const ghostR = lastRepsForSet(exercise, s.set_index);
					const weightRequired = exercise.unit === "kg" || exercise.unit === "lb";
					const hasWeight = s.weight != null && Number(s.weight) > 0;
					const hasReps = s.reps != null && s.reps > 0;
					const canComplete = hasReps && (!weightRequired || hasWeight);
					const missingWeight = weightRequired && !hasWeight;
					const missingReps = !hasReps;
					const weightDisplay = toDisplayW(s.weight);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "set-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num text-xs text-text-3",
								children: s.set_index
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "decimal",
								value: weightDisplay ?? "",
								placeholder: ghostW != null ? String(ghostW) : "—",
								"data-set-weight": s.id,
								onChange: (e) => {
									const v = e.target.value;
									onSetSave(s.id, { weight: v === "" ? null : toStoreW(Number(v), unitSystem) });
								},
								className: cn("rounded-lg border bg-canvas px-1.5 text-center text-sm placeholder:text-text-3/70", highlightSet === s.id && missingWeight ? "border-danger" : "border-edge")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								value: s.reps ?? "",
								placeholder: ghostR != null ? String(ghostR) : "—",
								"data-set-reps": s.id,
								onChange: (e) => {
									const v = e.target.value;
									onSetSave(s.id, { reps: v === "" ? null : Number(v) });
								},
								className: cn("rounded-lg border bg-canvas px-1.5 text-center text-sm placeholder:text-text-3/70", highlightSet === s.id && missingReps ? "border-danger" : "border-edge")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									if (s.completed) {
										onSetComplete(exercise, s.id, false);
										return;
									}
									if (!canComplete) {
										setHighlightSet(s.id);
										document.querySelector(missingWeight ? `[data-set-weight="${s.id}"]` : `[data-set-reps="${s.id}"]`)?.focus();
										return;
									}
									onSetComplete(exercise, s.id, true);
									setHighlightSet(null);
								},
								className: cn("set-check grid place-items-center rounded-xl transition active:scale-95", s.completed ? "set-done-pop bg-accent/20 text-accent" : "bg-raised text-text-2", !s.completed && !canComplete && "opacity-50"),
								"aria-label": t("workout.completeSet"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
							})
						]
					}, s.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonStrip, { exerciseId: exercise.exercise_id })
			]
		}) : null]
	});
}
function SkipModal({ t, busy, onClose, onPick }) {
	const options = [{
		m: "postpone_week",
		title: t("workout.skipTomorrow"),
		hint: t("workout.skipTomorrowHint")
	}, {
		m: "skip_week",
		title: t("workout.skipWeek"),
		hint: t("workout.skipWeekHint")
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: t("workout.skipTitle"),
		onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-text-2",
			children: t("workout.skipBody")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy,
				onClick: () => onPick(o.m),
				className: "w-full rounded-2xl bg-raised/80 px-3.5 py-3.5 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-sunken disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: o.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-text-2",
					children: o.hint
				})]
			}, o.m))
		})]
	});
}
function SwapModal({ exercise, t, onClose, onPick }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		similarExercises({ data: {
			exerciseId: exercise.exercise_id,
			excludeIds: [exercise.exercise_id]
		} }).then(setRows);
	}, [exercise.exercise_id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: t("workout.swapTitle"),
		onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs text-text-2",
			children: t("workout.swapHint")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "max-h-72 space-y-1 overflow-y-auto",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onPick(r.id > 0 ? r.id : -1, r.id > 0 ? null : r.external_id),
				className: "flex w-full items-center justify-between rounded-lg border border-transparent bg-sunken px-3 py-2.5 text-left text-sm hover:border-rule",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: r.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
					group: r.muscle_group,
					size: "xs"
				})]
			}) }, `${r.id}-${r.external_id ?? r.name}`))
		})]
	});
}
function AddExModal({ t, onClose, onPick }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [muscle, setMuscle] = (0, import_react.useState)("all");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		const tmr = window.setTimeout(() => {
			searchExerciseCatalog({ data: {
				q,
				muscleGroup: muscle === "all" ? void 0 : muscle,
				limit: 100
			} }).then((r) => {
				if (!cancelled) setRows(r);
			}).finally(() => {
				if (!cancelled) setLoading(false);
			});
		}, 150);
		return () => {
			cancelled = true;
			window.clearTimeout(tmr);
		};
	}, [q, muscle]);
	async function pick(r) {
		try {
			if (r.id > 0) {
				onPick(r.id);
				return;
			}
			if (r.external_id) {
				onPick((await adoptDatasetExercise({ data: { externalId: r.external_id } })).id);
				return;
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: t("workout.addExercise"),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: t("workout.searchExercises"),
				className: "mb-2 h-12 w-full rounded-2xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
				autoFocus: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex gap-1.5 overflow-x-auto pb-0.5",
				children: [
					["all", "muscle.all"],
					["gogus", "muscle.gogus"],
					["sirt", "muscle.sirt"],
					["omuz", "muscle.omuz"],
					["kol", "muscle.kol"],
					["bacak", "muscle.bacak"],
					["core", "muscle.core"]
				].map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMuscle(id),
					className: cn("shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold", muscle === id ? "bg-primary text-on-primary" : "bg-raised text-text-2"),
					children: t(lab)
				}, id))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-xs text-text-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-10 w-full max-w-xs animate-pulse rounded-xl bg-raised" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-72 space-y-1 overflow-y-auto",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void pick(r),
					className: "flex w-full items-center justify-between rounded-xl bg-sunken px-3 py-2.5 text-left text-sm active:bg-accent/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: r.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
						group: r.muscle_group,
						size: "xs"
					})]
				}) }, `${r.id}-${r.external_id ?? r.name}`))
			})
		]
	});
}
//#endregion
export { WorkoutPage as component };

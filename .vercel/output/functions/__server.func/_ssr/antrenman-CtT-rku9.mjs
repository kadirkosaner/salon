import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn, o as todayISO, r as formatDate, t as addDaysISO } from "./utils-BtReAY3a.mjs";
import { getActiveProgram } from "./programs-c1iPJ4L2.mjs";
import { n as useI18n } from "./provider-CeWW0z-e.mjs";
import { t as Route } from "./antrenman-DWKt6nlh.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { E as Pause, J as ChevronLeft, T as Play, X as Check, Y as ChevronDown, c as Trophy, f as Trash2, h as Share2, j as LoaderCircle, m as SkipForward, q as ChevronRight, rt as ArrowLeftRight, t as X, w as Plus, x as Save, y as Search, z as Eraser } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-A_6k73rc.mjs";
import { _ as swapWorkoutExercise, a as clearFutureWorkouts, c as deleteWorkoutExercise, f as listWorkoutsInRange, g as skipWorkout, h as similarExercises, i as adoptDatasetExercise, m as searchExerciseCatalog, n as LoadTagBadge, p as saveWorkoutToProgram, r as addWorkoutExercise, s as createWorkout, t as ExercisePreviewButton, u as getWorkoutByDate, v as updateWorkout, y as updateWorkoutSet } from "./workouts-D4JpaDWO.mjs";
import { t as MuscleBadge } from "./muscle-badge-CatBnWlq.mjs";
import { o as WorkoutSkeleton, s as btnClass, t as Btn } from "./skeleton-V6qtQgX7.mjs";
import { n as Sheet } from "./sheet-DYdgzZu3.mjs";
import { t as haptic } from "./haptics-0hNb66jG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/antrenman-CtT-rku9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function beep() {
	try {
		const ctx = new AudioContext();
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = "sine";
		o.frequency.value = 880;
		g.gain.value = .08;
		o.connect(g);
		g.connect(ctx.destination);
		o.start();
		g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .35);
		o.stop(ctx.currentTime + .4);
		setTimeout(() => void ctx.close(), 500);
	} catch {}
}
function RestTimerBar({ state, onClose }) {
	const [left, setLeft] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const totalRef = (0, import_react.useRef)(0);
	const firedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!state) return;
		setLeft(state.seconds);
		totalRef.current = state.seconds;
		setPaused(false);
		firedRef.current = false;
	}, [state]);
	(0, import_react.useEffect)(() => {
		if (!state || paused) return;
		if (left <= 0) {
			if (!firedRef.current) {
				firedRef.current = true;
				beep();
				try {
					navigator.vibrate?.(200);
				} catch {}
			}
			return;
		}
		const t = window.setTimeout(() => setLeft((s) => s - 1), 1e3);
		return () => window.clearTimeout(t);
	}, [
		state,
		left,
		paused
	]);
	if (!state) return null;
	const total = totalRef.current || state.seconds || 1;
	const pct = Math.max(0, Math.min(100, left / total * 100));
	const mm = String(Math.floor(left / 60)).padStart(2, "0");
	const ss = String(left % 60).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-0 z-50 border-t border-line bg-surface2 shadow-2xl",
		style: { bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1 bg-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full transition-[width] duration-1000 linear", left === 0 ? "bg-green" : "bg-yellow"),
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-lg items-center gap-3 px-4 py-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted",
						children: ["Dinlenme · ", state.exerciseName]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("num text-3xl leading-none tracking-wide", left === 0 && "text-green"),
						children: left === 0 ? "Hazır" : `${mm}:${ss}`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-md border border-line bg-surface text-text",
					onClick: () => setPaused((p) => !p),
					"aria-label": paused ? "Devam" : "Duraklat",
					children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-md border border-line bg-surface text-text",
					onClick: () => setLeft((s) => s + 30),
					"aria-label": "30 saniye ekle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "+30"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num text-xs text-muted",
					children: "+30"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-md border border-line bg-surface text-muted",
					onClick: onClose,
					"aria-label": "Kapat",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})
			]
		})]
	});
}
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
	glow.addColorStop(0, "rgba(245,197,66,0.28)");
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
	ctx.fillStyle = input.kind === "pr" ? "rgba(245,197,66,0.2)" : "rgba(255,255,255,0.08)";
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": t("pr.title"),
		children: [!reduced ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti, {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-yellow/30 bg-surface p-6 sm:rounded-3xl", !reduced && "animate-[fade-up_0.4s_ease]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "absolute right-3 top-3 grid size-10 place-items-center rounded-xl text-muted",
					"aria-label": t("common.close"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-16 place-items-center rounded-2xl bg-yellow text-bg shadow-[0_8px_32px_rgba(245,197,66,0.35)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow",
							children: t("pr.badge")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-3xl tracking-wide",
							children: pr.exercise_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "num mt-3 text-5xl leading-none text-yellow",
							children: [pr.weight, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-lg font-sans text-muted",
								children: pr.unit
							})]
						}),
						delta != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm font-semibold text-green",
							children: [
								"+",
								delta % 1 ? delta.toFixed(1) : delta,
								" ",
								pr.unit,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal text-muted",
									children: t("pr.vsPrev")
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: t("pr.firstRecord")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
						children: t("pr.continue")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: sharing,
						onClick: () => void share(),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_16px_rgba(245,197,66,0.3)] disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), t("pr.share")]
					})]
				})
			]
		})]
	});
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
function WorkoutPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t, locale } = useI18n();
	const navigate = useNavigate({ from: "/antrenman" });
	const date = Route.useSearch().date || todayISO();
	const today = todayISO();
	const [workout, setWorkout] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const [calendar, setCalendar] = (0, import_react.useState)([]);
	const [programName, setProgramName] = (0, import_react.useState)(null);
	const [programDays, setProgramDays] = (0, import_react.useState)([]);
	const [rest, setRest] = (0, import_react.useState)(null);
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
			setRest({
				seconds: exercise.rest_sec || 90,
				exerciseName: exercise.exercise_name
			});
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("workout.title"),
		subtitle: programName ? `${formatDate(date, locale)} · ${programName}` : formatDate(date, locale),
		restTimerActive: !!rest,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] text-muted",
			children: saveState === "saving" ? t("common.saving") : saveState === "saved" ? t("common.saved") : ""
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full min-w-0 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContinuousCalendar, {
						selected: date,
						today,
						statusMap: calMap,
						locale,
						onSelect: goDate,
						onGoToday: () => goDate(today)
					}),
					needsProgram ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-yellow/30 bg-yellow/10 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg tracking-wide text-yellow",
								children: t("workout.noProgram")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: t("workout.noProgramHint")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/kesfet",
								className: btnClass("primary", "mt-3 w-full"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), t("workout.pickProgram")]
							})
						]
					}) : null,
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutSkeleton, {}) : !workout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDay, {
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
						onRest: setRest,
						onSetSave: scheduleSetSave,
						onSetComplete,
						onSwap: (ex) => setSwapFor(ex),
						onRemove: (ex) => void removeExercise(ex),
						onAdd: () => setAddOpen(true),
						onSaveProgram: () => void doSaveToProgram(),
						savingProgram,
						onClearFuture: () => {
							if (!confirm(locale === "en" ? "Only if you abandon the program. Clear future planned sessions? History stays." : "Programı bırakırsan gelecek planlar silinir. Geçmiş kalır. Devam?")) return;
							clearFutureWorkouts().then(async (r) => {
								toast.success(r.deleted === 0 ? locale === "en" ? "Nothing to clear" : "Temizlenecek seans yok" : locale === "en" ? `${r.deleted} cleared` : `${r.deleted} gelecek seans silindi`);
								await loadCal();
								await loadWorkout(date);
							}).catch((e) => toast.error(e instanceof Error ? e.message : t("common.error")));
						}
					})
				]
			}),
			rest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestTimerBar, {
				state: rest,
				onClose: () => setRest(null)
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
function ContinuousCalendar({ selected, today, statusMap, locale, onSelect, onGoToday }) {
	const center = selected;
	const days = (0, import_react.useMemo)(() => {
		const arr = [];
		for (let i = -10; i <= 21; i++) arr.push(addDaysISO(center, i));
		return arr;
	}, [center]);
	const scroller = (0, import_react.useRef)(null);
	const selectedRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		selectedRef.current?.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest"
		});
	}, [selected]);
	function tone(d) {
		const info = statusMap.get(d);
		if (!info) {
			if (d < today) return "empty";
			return "empty";
		}
		if (info.status === "completed") return "done";
		if (info.status === "skipped") return "missed";
		if (d < today && info.status === "planned") return "missed";
		return "planned";
	}
	const DOW = locale === "en" ? [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	] : [
		"Paz",
		"Pzt",
		"Sal",
		"Çar",
		"Per",
		"Cum",
		"Cmt"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg tracking-wide",
					children: formatDate(selected, locale)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-dim",
					children: locale === "en" ? "Day by day · continuous" : "Gün gün · sürekli"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						selected !== today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onGoToday,
							className: btnClass("soft", void 0, { size: "sm" }),
							children: locale === "en" ? "Today" : "Bugün"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSelect(addDaysISO(selected, -7)),
							className: btnClass("icon", "!size-11"),
							"aria-label": "Prev week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSelect(addDaysISO(selected, 7)),
							className: btnClass("icon", "!size-11"),
							"aria-label": "Next week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "flex flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: days.map((d) => {
					const tn = tone(d);
					const isSel = d === selected;
					const isToday = d === today;
					const info = statusMap.get(d);
					const dt = /* @__PURE__ */ new Date(d + "T12:00:00");
					const dow = DOW[dt.getDay()] ?? "";
					const dayNum = d.slice(8);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						ref: isSel ? selectedRef : void 0,
						type: "button",
						onClick: () => onSelect(d),
						title: info?.day_name ?? d,
						className: cn("flex w-14 shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-1 py-2.5 transition active:scale-95", isSel && "ring-2 ring-yellow ring-offset-2 ring-offset-surface", tn === "done" && "border-green/40 bg-green/20 text-green", tn === "missed" && "border-red/40 bg-red/15 text-red", tn === "planned" && "border-yellow/30 bg-yellow/10 text-yellow", tn === "empty" && "border-line bg-surface2/40 text-muted", isToday && tn === "empty" && "border-yellow/50"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-medium uppercase opacity-80",
							children: dow
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num text-base leading-none",
							children: Number(dayNum)
						})]
					}, d);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-dim",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-md border border-green/40 bg-green/20" }), locale === "en" ? "Completed" : "Tamamlandı"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-md border border-red/40 bg-red/15" }), locale === "en" ? "Missed / skipped" : "Kaçırıldı / atlandı"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-md border border-yellow/40 bg-yellow/15" }), locale === "en" ? "Planned" : "Planlı"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-md border border-line bg-transparent" }), locale === "en" ? "Empty day" : "Boş gün"]
					})
				]
			})
		]
	});
}
function EmptyDay({ programDays, onCreate, t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface p-4",
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
				className: "mt-4 text-xs text-muted",
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
function WorkoutBody({ workout, t, locale, onFinish, onSkip, onUnskip, onRest, onSetSave, onSetComplete, onSwap, onRemove, onAdd, onSaveProgram, savingProgram, onClearFuture }) {
	const statusLabel = workout.status === "completed" ? t("workout.completed") : workout.status === "skipped" ? t("workout.skipped") : t("workout.planned");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-wide text-yellow",
							children: workout.day_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: [
								workout.exercises.length,
								" · ",
								statusLabel
							]
						}),
						workout.status === "skipped" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-dim",
							children: t("workout.skippedHint")
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-wrap items-center justify-end gap-2",
					children: [workout.status === "skipped" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "secondary",
						size: "sm",
						onClick: onUnskip,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" }), t("workout.unskip")]
					}) : workout.status !== "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "ghost",
						size: "sm",
						onClick: onSkip,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" }), t("workout.skip")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "primary",
						size: "sm",
						onClick: onFinish,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), t("workout.finish")]
					})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "icon",
						className: "!size-11 text-muted hover:text-red",
						onClick: onClearFuture,
						title: locale === "en" ? "Clear future when abandoning" : "Program bırakınca geleceği temizle",
						"aria-label": "clear future",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-4" })
					})]
				})]
			}),
			workout.exercises.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-line bg-surface2/40 p-4 text-sm text-muted",
				children: t("workout.emptyShell")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseList, {
				exercises: workout.exercises,
				t,
				onSetSave,
				onSetComplete,
				onSwap,
				onRemove,
				onRest
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					variant: "secondary",
					className: "w-full flex-1",
					onClick: onAdd,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), t("workout.addExercise")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					variant: "soft",
					className: "w-full flex-1",
					disabled: savingProgram,
					onClick: onSaveProgram,
					children: [savingProgram ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), t("workout.saveToProgram")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-dim",
				children: t("workout.saveToProgramHint")
			})
		]
	});
}
function ExerciseList({ exercises, t, onSetSave, onSetComplete, onSwap, onRemove, onRest }) {
	const defaultOpen = (0, import_react.useMemo)(() => {
		return exercises.find((e) => !e.sets.every((s) => s.completed))?.id ?? exercises[0]?.id ?? null;
	}, [exercises]);
	const [openId, setOpenId] = (0, import_react.useState)(defaultOpen);
	const idsKey = exercises.map((e) => e.id).join(",");
	(0, import_react.useEffect)(() => {
		const firstOpen = exercises.find((e) => !e.sets.every((s) => s.completed));
		setOpenId(firstOpen?.id ?? exercises[0]?.id ?? null);
	}, [idsKey]);
	function toggle(id) {
		setOpenId((cur) => cur === id ? null : id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: exercises.map((ex, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCard, {
			index: i + 1,
			exercise: ex,
			open: openId === ex.id,
			onToggle: () => toggle(ex.id),
			t,
			onSetSave,
			onSetComplete,
			onSwap: () => onSwap(ex),
			onRemove: () => onRemove(ex),
			onRestStart: () => onRest({
				seconds: ex.rest_sec || 90,
				exerciseName: ex.exercise_name
			})
		}, ex.id))
	});
}
function ExerciseCard({ index, exercise, open, onToggle, t, onSetSave, onSetComplete, onSwap, onRemove, onRestStart }) {
	const doneCount = exercise.sets.filter((s) => s.completed).length;
	const allDone = doneCount === exercise.sets.length && exercise.sets.length > 0;
	const allFilled = exercise.sets.every((s) => s.completed && s.reps != null && s.reps >= exercise.target_rep_hi && s.weight != null);
	const lastLine = exercise.lastTime ? `${t("workout.lastTime")} · ${exercise.lastTime.sets.map((s) => `${s.weight ?? "—"}×${s.reps ?? "—"}`).join("  ")}` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cn("min-w-0 overflow-hidden rounded-xl border bg-surface transition", open ? "border-yellow/40" : "border-line", allDone && !open && "border-green/30 bg-green/5"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full items-start gap-2.5 p-3 text-left active:bg-surface2/40",
			"aria-expanded": open,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("num mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-sm", allDone ? "bg-green/20 text-green" : open ? "bg-yellow/20 text-yellow" : "bg-surface2 text-muted"),
					children: allDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : index
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "break-words font-medium leading-snug",
						children: [exercise.exercise_name, exercise.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", exercise.detail]
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
								group: exercise.muscle_group,
								size: "xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num text-sm text-yellow",
								children: [
									exercise.target_sets,
									"×",
									exercise.target_rep_lo,
									"-",
									exercise.target_rep_hi
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted",
								children: [
									doneCount,
									"/",
									exercise.sets.length,
									" set"
								]
							}),
							!open && exercise.load_tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadTagBadge, { tag: exercise.load_tag })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("mt-1 size-5 shrink-0 text-muted transition-transform duration-200", open && "rotate-180 text-yellow") })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-line px-3 pb-3 pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [
								exercise.unit === "m" ? "m" : "kg",
								" · ",
								exercise.rest_sec,
								"s"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadTagBadge, { tag: exercise.load_tag }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewButton, {
							name: exercise.exercise_name,
							muscleGroup: exercise.muscle_group
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									onSwap();
								},
								className: btnClass("icon", "!size-11"),
								"aria-label": t("workout.swap"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									onRemove();
								},
								className: btnClass("icon", "!size-11 hover:text-red"),
								"aria-label": t("workout.removeExercise"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})
					]
				}),
				lastLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 break-words text-xs text-muted",
					children: lastLine
				}),
				allFilled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 rounded-md border border-green/30 bg-green/10 px-2.5 py-1.5 text-xs text-green",
					children: t("workout.progressHint")
				}),
				exercise.suggestedWeight != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-xs text-yellow/90",
					children: [
						t("workout.suggestWeight"),
						": ",
						exercise.suggestedWeight,
						" ",
						exercise.unit
					]
				}),
				exercise.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs leading-relaxed text-dim",
					children: exercise.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 flex items-center justify-between gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md bg-surface2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dim",
								children: [
									t("workout.targetReps"),
									": ",
									exercise.target_rep_lo,
									"–",
									exercise.target_rep_hi
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "set-grid text-[10px] font-semibold uppercase tracking-wide text-dim",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "#" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exercise.unit || "kg" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("workout.reps") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
							]
						}),
						exercise.sets.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "set-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-sm text-muted",
									children: s.set_index
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									inputMode: "decimal",
									value: s.weight ?? "",
									placeholder: "—",
									onChange: (e) => {
										const v = e.target.value;
										onSetSave(s.id, { weight: v === "" ? null : Number(v) });
									},
									className: "h-11 min-w-0 rounded-lg border border-line-strong bg-bg px-2 text-center text-sm placeholder:text-dim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									inputMode: "numeric",
									value: s.reps ?? "",
									placeholder: "—",
									onChange: (e) => {
										const v = e.target.value;
										onSetSave(s.id, { reps: v === "" ? null : Number(v) });
									},
									className: "h-11 min-w-0 rounded-lg border border-line-strong bg-bg px-2 text-center text-sm placeholder:text-dim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										const next = !s.completed;
										onSetComplete(exercise, s.id, next);
										if (next) onRestStart();
									},
									className: cn("grid size-12 place-items-center rounded-2xl transition active:scale-95", s.completed ? "set-done-pop bg-green/20 text-green shadow-[inset_0_0_0_1px_rgba(61,214,140,0.35)]" : "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"),
									"aria-label": t("workout.completeSet"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
								})
							]
						}, s.id))
					]
				})
			]
		})]
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
			className: "mb-3 text-sm text-muted",
			children: t("workout.skipBody")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy,
				onClick: () => onPick(o.m),
				className: "w-full rounded-2xl bg-surface2/80 px-3.5 py-3.5 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-surface disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: o.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted",
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
			className: "mb-2 text-xs text-muted",
			children: t("workout.swapHint")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "max-h-72 space-y-1 overflow-y-auto",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onPick(r.id > 0 ? r.id : -1, r.id > 0 ? null : r.external_id),
				className: "flex w-full items-center justify-between rounded-lg border border-transparent bg-surface px-3 py-2.5 text-left text-sm hover:border-line",
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
				placeholder: "1300+ hareket ara…",
				className: "mb-2 h-12 w-full rounded-2xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
				autoFocus: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex gap-1.5 overflow-x-auto pb-0.5",
				children: [
					["all", "Tümü"],
					["gogus", "Göğüs"],
					["sirt", "Sırt"],
					["omuz", "Omuz"],
					["kol", "Kol"],
					["bacak", "Bacak"],
					["core", "Core"]
				].map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMuscle(id),
					className: cn("shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold", muscle === id ? "bg-yellow text-bg" : "bg-surface2 text-muted"),
					children: lab
				}, id))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-xs text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-5 animate-spin" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-72 space-y-1 overflow-y-auto",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void pick(r),
					className: "flex w-full items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-left text-sm active:bg-yellow/10",
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

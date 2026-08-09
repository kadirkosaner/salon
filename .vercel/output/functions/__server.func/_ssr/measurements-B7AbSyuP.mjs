import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { gn as object, hn as number } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, r as isoDate, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { D as Minus, b as Scale, d as Trash2, it as ArrowUpRight, l as TrendingUp, ot as ArrowDownRight, u as TrendingDown, w as Plus } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { a as formatChartDate, l as todayISO, n as cn, o as formatDate } from "./utils-DKNImH2A.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useUnitSystem } from "./use-unit-system--Rqopd2R.mjs";
import { c as toStorageLength, l as toStorageWeight, r as displayWeight, s as lengthUnit, t as displayLength, u as weightUnit } from "./units-CBFS2Xa_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { n as PageSkeleton } from "./skeleton-BoolYdvP.mjs";
import { t as EmptyState } from "./empty-state-COCWXpMD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/measurements-B7AbSyuP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PageSection({ title, description, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("card-surface min-w-0 overflow-hidden p-3.5 sm:p-4", className),
		children: [(title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex min-w-0 items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg tracking-wide text-text sm:text-xl",
					children: title
				}) : null, description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs leading-relaxed text-text-2",
					children: description
				}) : null]
			}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0",
				children: action
			}) : null]
		}), children]
	});
}
var listMeasurements = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("12dd2d90164a34fb13b4cfbbb7e0f7ffaf45f65b4e0fad6c86c102bbd0897ab3"));
var saveMeasurement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	date: isoDate,
	body_weight: number().min(0).max(500).nullable().optional(),
	waist: number().min(0).max(300).nullable().optional(),
	chest: number().min(0).max(300).nullable().optional(),
	arm: number().min(0).max(100).nullable().optional(),
	thigh: number().min(0).max(200).nullable().optional()
}))).handler(createSsrRpc("e70b887802d47d726afcf47a06dddba5f338a5cd98547832400a2c3259439f88"));
var deleteMeasurement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("3c5511a3cd708b6e095746b8ac3a22c9e37285c642d9a134c0993487ec8c9a05"));
var ProgressAreaChart = (0, import_react.lazy)(() => import("./charts-DSsbBWiu.mjs").then((m) => ({ default: m.ProgressAreaChart })));
var MultiLineChart = (0, import_react.lazy)(() => import("./charts-DSsbBWiu.mjs").then((m) => ({ default: m.MultiLineChart })));
function metricsFor(t, system) {
	const wu = weightUnit(system);
	const lu = lengthUnit(system);
	return [
		{
			key: "body_weight",
			label: t("measure.weight"),
			unit: wu,
			form: "weight"
		},
		{
			key: "waist",
			label: t("measure.waist"),
			unit: lu,
			form: "circ"
		},
		{
			key: "chest",
			label: t("measure.chest"),
			unit: lu,
			form: "circ"
		},
		{
			key: "arm",
			label: t("measure.arm"),
			unit: lu,
			form: "circ"
		},
		{
			key: "thigh",
			label: t("measure.thigh"),
			unit: lu,
			form: "circ"
		}
	];
}
function num(v) {
	if (v == null || v === "") return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}
function deltaOf(a, b) {
	if (a == null || b == null) return null;
	return Math.round((a - b) * 10) / 10;
}
function fmtNum(n) {
	if (n == null) return "";
	return String(n);
}
function MeasurementsPage() {
	const t = useT();
	const { locale } = useI18n();
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const unitSystem = useUnitSystem(!!userId);
	const wu = weightUnit(unitSystem);
	const lu = lengthUnit(unitSystem);
	const METRICS = metricsFor(t, unitSystem);
	const queryClient = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("charts");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [bw, setBw] = (0, import_react.useState)("");
	const [waist, setWaist] = (0, import_react.useState)("");
	const [chest, setChest] = (0, import_react.useState)("");
	const [arm, setArm] = (0, import_react.useState)("");
	const [thigh, setThigh] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [prefilled, setPrefilled] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)({
		waist: true,
		chest: true,
		arm: true,
		thigh: true
	});
	const listQuery = useQuery({
		queryKey: qk.measurements,
		queryFn: () => listMeasurements(),
		enabled: !!userId
	});
	const rows = (0, import_react.useMemo)(() => listQuery.data ?? [], [listQuery.data]);
	const loading = listQuery.isLoading;
	async function reload() {
		await queryClient.invalidateQueries({ queryKey: qk.measurements });
	}
	(0, import_react.useEffect)(() => {
		if (rows.length === 0 || prefilled) return;
		const latest = [...rows].sort((a, b) => b.date.localeCompare(a.date))[0];
		if (date !== todayISO()) return;
		if (!bw && latest.body_weight) setBw(fmtNum(displayWeight(Number(latest.body_weight), unitSystem)));
		if (!waist && latest.waist) setWaist(fmtNum(displayLength(Number(latest.waist), unitSystem)));
		if (!chest && latest.chest) setChest(fmtNum(displayLength(Number(latest.chest), unitSystem)));
		if (!arm && latest.arm) setArm(fmtNum(displayLength(Number(latest.arm), unitSystem)));
		if (!thigh && latest.thigh) setThigh(fmtNum(displayLength(Number(latest.thigh), unitSystem)));
		setPrefilled(true);
	}, [
		rows,
		unitSystem,
		date,
		prefilled,
		bw,
		waist,
		chest,
		arm,
		thigh
	]);
	const chronological = (0, import_react.useMemo)(() => [...rows].sort((a, b) => a.date.localeCompare(b.date)), [rows]);
	const latest = chronological[chronological.length - 1];
	const prev = chronological.length >= 2 ? chronological[chronological.length - 2] : null;
	const weightNow = displayWeight(num(latest?.body_weight), unitSystem);
	const weightDelta = deltaOf(weightNow, displayWeight(num(prev?.body_weight), unitSystem));
	const first = chronological[0];
	const totalWeightDelta = deltaOf(weightNow, displayWeight(num(first?.body_weight), unitSystem));
	const weightSeries = chronological.filter((r) => r.body_weight != null).map((r) => ({
		date: r.date,
		body_weight: displayWeight(Number(r.body_weight), unitSystem) ?? 0
	}));
	const measureSeries = chronological.map((r) => ({
		date: r.date,
		waist: displayLength(r.waist != null ? Number(r.waist) : null, unitSystem),
		chest: displayLength(r.chest != null ? Number(r.chest) : null, unitSystem),
		arm: displayLength(r.arm != null ? Number(r.arm) : null, unitSystem),
		thigh: displayLength(r.thigh != null ? Number(r.thigh) : null, unitSystem)
	}));
	const circCards = METRICS.filter((m) => m.form === "circ").map((m) => {
		const cur = displayLength(latest?.[m.key] != null ? Number(latest[m.key]) : null, unitSystem);
		const before = displayLength(prev?.[m.key] != null ? Number(prev[m.key]) : null, unitSystem);
		return {
			...m,
			value: cur,
			delta: deltaOf(cur, before)
		};
	});
	async function onSave(e) {
		e.preventDefault();
		if (!bw && !waist && !chest && !arm && !thigh) {
			toast.error(t("measure.needValue"));
			return;
		}
		setSaving(true);
		try {
			const bwN = bw === "" ? null : Number(bw);
			const waistN = waist === "" ? null : Number(waist);
			const chestN = chest === "" ? null : Number(chest);
			const armN = arm === "" ? null : Number(arm);
			const thighN = thigh === "" ? null : Number(thigh);
			await saveMeasurement({ data: {
				date,
				body_weight: bwN == null || !Number.isFinite(bwN) ? null : toStorageWeight(bwN, unitSystem),
				waist: waistN == null || !Number.isFinite(waistN) ? null : toStorageLength(waistN, unitSystem),
				chest: chestN == null || !Number.isFinite(chestN) ? null : toStorageLength(chestN, unitSystem),
				arm: armN == null || !Number.isFinite(armN) ? null : toStorageLength(armN, unitSystem),
				thigh: thighN == null || !Number.isFinite(thighN) ? null : toStorageLength(thighN, unitSystem)
			} });
			toast.success(t("measure.saved"));
			setPrefilled(false);
			await reload();
			setTab("charts");
		} catch {
			toast.error(t("measure.saveFailed"));
		} finally {
			setSaving(false);
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("measure.title"),
		subtitle: t("measure.subtitle"),
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, { rows: 3 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl border border-rule bg-sunken",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,194,48,0.12),transparent_55%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative p-4 sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
									children: t("measure.lastWeight")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num font-display text-5xl leading-none tracking-wide text-accent",
										children: weightNow != null ? weightNow : t("measure.noValue")
									}), weightNow != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 text-sm text-text-2",
										children: wu
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-text-2",
									children: [latest ? formatDate(latest.date, locale) : t("measure.noRecordsHint"), rows.length > 0 ? ` · ${t("measure.recordsCount", { n: rows.length })}` : ""]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeltaPill, {
										value: weightDelta,
										unit: wu,
										label: t("measure.prev")
									}),
									totalWeightDelta != null && chronological.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeltaPill, {
										value: totalWeightDelta,
										unit: wu,
										label: t("measure.total"),
										subtle: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setTab("today"),
										className: "mt-1 flex h-10 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-on-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), t("measure.new")]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: circCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rule/80 bg-canvas/40 px-3 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-medium uppercase tracking-wide text-text-3",
										children: c.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "num mt-0.5 text-lg font-semibold text-text",
										children: [c.value != null ? c.value : "—", c.value != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-0.5 text-[11px] font-normal text-text-2",
											children: c.unit
										})]
									}),
									c.delta != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: cn("num mt-0.5 text-[11px]", c.delta < 0 ? "text-success" : c.delta > 0 ? "text-warning" : "text-text-2"),
										children: [
											c.delta > 0 ? "+" : "",
											c.delta,
											" ",
											c.unit
										]
									})
								]
							}, c.key))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1 rounded-xl border border-rule bg-sunken p-1",
					children: [
						["charts", t("measure.summary")],
						["today", t("measure.entry")],
						["history", t("measure.history")]
					].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(k),
						className: cn("h-10 rounded-lg text-sm font-semibold transition", tab === k ? "bg-primary text-on-primary" : "text-text-2 hover:text-text"),
						children: lab
					}, k))
				}),
				tab === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: t("measure.enter"),
					description: t("measure.overwriteHint"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSave,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-text-2",
									children: t("measure.date")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value),
									className: "h-12 w-full rounded-lg border border-rule bg-raised px-3",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-accent/25 bg-accent/5 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center gap-2 text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wide",
										children: t("measure.bodyWeight")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										inputMode: "decimal",
										step: "0.1",
										value: bw,
										onChange: (e) => setBw(e.target.value),
										placeholder: t("measure.weightPlaceholder"),
										className: "num h-14 min-w-0 flex-1 rounded-lg border border-accent/30 bg-raised px-3 text-2xl text-accent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-sm text-text-2",
										children: wu
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-wide text-text-3",
								children: t("measure.girthsOptional")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: t("measure.waist"),
										value: waist,
										onChange: setWaist,
										unit: lu
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: t("measure.chest"),
										value: chest,
										onChange: setChest,
										unit: lu
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: t("measure.arm"),
										value: arm,
										onChange: setArm,
										unit: lu
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: t("measure.thigh"),
										value: thigh,
										onChange: setThigh,
										unit: lu
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary disabled:opacity-60",
								children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), t("common.save")]
							})
						]
					})
				}),
				tab === "charts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-raised" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Scale,
						title: t("measure.empty"),
						hint: t("measure.chartEmptyHint")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
						title: t("measure.weightTrend"),
						description: weightSeries.length > 1 ? t("measure.nPoints", { n: weightSeries.length }) : t("measure.moreData"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressAreaChart, {
							data: weightSeries,
							xKey: "date",
							yKey: "body_weight",
							valueLabel: t("measure.weight"),
							valueUnit: wu,
							xFormatter: formatChartDate,
							emptyHint: t("measure.chartEmptyHint")
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
						title: t("measure.girth"),
						description: t("measure.toggleSeries"),
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap justify-end gap-1",
							children: [
								[
									"waist",
									t("measure.waist"),
									"#E07B1F"
								],
								[
									"chest",
									t("measure.chest"),
									"#2F6FD0"
								],
								[
									"arm",
									t("measure.arm"),
									"#2E9E5B"
								],
								[
									"thigh",
									t("measure.thigh"),
									"#D9312B"
								]
							].map(([k, lab, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShow((s) => ({
									...s,
									[k]: !s[k]
								})),
								className: cn("rounded-full border px-2 py-1 text-[11px] font-medium", show[k] ? "text-on-primary" : "border-rule text-text-2"),
								style: show[k] ? {
									backgroundColor: color,
									borderColor: color
								} : void 0,
								children: lab
							}, k))
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiLineChart, {
							data: measureSeries,
							xKey: "date",
							xFormatter: formatChartDate,
							series: [
								{
									key: "waist",
									label: t("measure.waist"),
									color: "#E07B1F",
									visible: show.waist
								},
								{
									key: "chest",
									label: t("measure.chest"),
									color: "#2F6FD0",
									visible: show.chest
								},
								{
									key: "arm",
									label: t("measure.arm"),
									color: "#2E9E5B",
									visible: show.arm
								},
								{
									key: "thigh",
									label: t("measure.thigh"),
									color: "#D9312B",
									visible: show.thigh
								}
							]
						})
					})] }) })
				}),
				tab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: t("measure.history"),
					description: t("measure.historyDesc"),
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Scale,
						title: t("measure.empty"),
						hint: t("measure.historyEmptyHint")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-rule",
						children: [...rows].sort((a, b) => b.date.localeCompare(a.date)).map((r, idx, arr) => {
							const older = arr[idx + 1];
							const wDisp = displayWeight(num(r.body_weight), unitSystem);
							const dW = deltaOf(wDisp, displayWeight(num(older?.body_weight), unitSystem));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 py-3 first:pt-0 last:pb-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-10 shrink-0 place-items-center rounded-xl bg-raised",
										children: dW == null || dW === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4 text-text-2" }) : dW < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-warning" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: formatDate(r.date, locale)
											}), wDisp != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "num text-sm text-accent",
												children: [
													wDisp,
													" ",
													wu,
													dW != null && dW !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "ml-1 text-[11px] text-text-2",
														children: [
															"(",
															dW > 0 ? "+" : "",
															dW,
															")"
														]
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 truncate text-xs text-text-2",
											children: [
												r.waist != null && `${t("measure.waist")} ${displayLength(Number(r.waist), unitSystem)} ${lu}`,
												r.chest != null && `${t("measure.chest")} ${displayLength(Number(r.chest), unitSystem)} ${lu}`,
												r.arm != null && `${t("measure.arm")} ${displayLength(Number(r.arm), unitSystem)} ${lu}`,
												r.thigh != null && `${t("measure.thigh")} ${displayLength(Number(r.thigh), unitSystem)} ${lu}`
											].filter(Boolean).join(" · ") || t("measure.weightOnly")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-10 place-items-center rounded-lg border border-rule text-danger",
										onClick: () => {
											if (!confirm(t("measure.deleteConfirm"))) return;
											deleteMeasurement({ data: r.id }).then(reload).then(() => toast.success(t("common.deleted")));
										},
										"aria-label": t("common.delete"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							}, r.id);
						})
					})
				})
			]
		})
	});
}
function DeltaPill({ value, unit, label, subtle }) {
	if (value == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-text-3", subtle ? "bg-transparent" : "bg-raised"),
		children: label
	});
	const up = value > 0;
	const down = value < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", down && "bg-success/15 text-success", up && "bg-warning/15 text-warning", !up && !down && "bg-raised text-text-2", subtle && "opacity-80"),
		children: [
			down ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-3" }) : up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" }),
			value > 0 ? "+" : "",
			value,
			" ",
			unit,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-normal opacity-70",
				children: label
			})
		]
	});
}
function Num({ label, value, onChange, unit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-text-2",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "number",
				inputMode: "decimal",
				step: "0.1",
				value,
				onChange: (e) => onChange(e.target.value),
				className: "num h-12 min-w-0 flex-1 rounded-lg border border-rule bg-raised px-3"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-xs text-text-3",
				children: unit
			})]
		})]
	});
}
//#endregion
export { MeasurementsPage as component };

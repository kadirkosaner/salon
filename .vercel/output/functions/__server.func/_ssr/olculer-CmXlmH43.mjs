import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { gn as object, hn as number } from "../_libs/@better-auth/core+[...].mjs";
import { c as positiveId, m as v, r as isoDate, t as authMiddleware } from "./validation-y1g7FGMs.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { i as formatDateTR, n as cn, o as todayISO } from "./utils-BtReAY3a.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { D as Minus, b as Scale, d as TrendingDown, f as Trash2, it as ArrowDownRight, j as LoaderCircle, nt as ArrowUpRight, u as TrendingUp, w as Plus } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-DoE9NuRg.mjs";
import { r as PageSkeleton } from "./skeleton-V6qtQgX7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-BGOjuNag.mjs";
import { t as qk } from "./query-keys-CYbHPFJF.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as PageSection } from "./section-DWQXzvPD.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/olculer-CmXlmH43.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GRID = "rgba(42,49,56,0.65)";
var TICK = "#6B7580";
var ACCENT = "#F2C230";
var SURFACE = "#171B1F";
/** Compact premium tooltip */
function ChartTip({ active, payload, label, labelFmt, valueFmt }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line/80 bg-surface/95 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1.5 text-[10px] font-medium uppercase tracking-wider text-dim",
			children: labelFmt ? labelFmt(String(label ?? "")) : String(label ?? "")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-1",
			children: payload.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-1.5 rounded-full",
					style: { background: p.color ?? ACCENT }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num text-sm text-text",
					children: valueFmt ? valueFmt(Number(p.value), p.name) : Number(p.value).toLocaleString("tr-TR")
				})]
			}, i))
		})]
	});
}
function AxisX({ dataKey, formatter }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
		dataKey,
		tick: {
			fill: TICK,
			fontSize: 10,
			fontWeight: 500
		},
		axisLine: false,
		tickLine: false,
		tickMargin: 10,
		minTickGap: 20,
		tickFormatter: formatter
	});
}
function AxisY({ width = 36 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
		tick: {
			fill: TICK,
			fontSize: 10,
			fontWeight: 500
		},
		axisLine: false,
		tickLine: false,
		width,
		tickMargin: 6,
		allowDecimals: false
	});
}
function ProgressAreaChart({ data, xKey, yKey, color = ACCENT, xFormatter, valueLabel = "Değer", valueUnit = "", emptyHint }) {
	if (!data.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-44 flex-col items-center justify-center gap-1 rounded-xl bg-surface2/40 px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Veri yok"
		}), emptyHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-[14rem] text-center text-xs text-dim",
			children: emptyHint
		}) : null]
	});
	const vals = data.map((d) => Number(d[yKey])).filter((n) => !Number.isNaN(n));
	const min = Math.min(...vals);
	const max = Math.max(...vals);
	const pad = Math.max((max - min) * .12, max * .04, 1);
	Math.max(0, Math.floor(min - pad)), Math.ceil(max + pad);
	const last = vals[vals.length - 1];
	const first = vals[0];
	const delta = last != null && first != null ? last - first : 0;
	const gradId = `g-${yKey.replace(/[^a-z0-9]/gi, "")}-${color.replace("#", "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [last != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-end justify-between gap-2 px-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-wider text-dim",
				children: "Son"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "num text-2xl leading-none text-text",
				children: [last.toLocaleString("tr-TR"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 text-sm font-normal text-muted",
					children: valueUnit
				})]
			})] }), vals.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `num text-sm ${delta > 0 ? "text-green" : delta < 0 ? "text-red" : "text-muted"}`,
				children: [
					delta > 0 ? "+" : "",
					delta.toLocaleString("tr-TR"),
					" ",
					valueUnit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chart-box h-48 sm:h-52",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data,
					margin: {
						top: 8,
						right: 6,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: gradId,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: color,
									stopOpacity: .45
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "55%",
									stopColor: color,
									stopOpacity: .12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: color,
									stopOpacity: 0
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
							id: `glow-${gradId}`,
							x: "-20%",
							y: "-20%",
							width: "140%",
							height: "140%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
								stdDeviation: "2",
								result: "b"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "b" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: GRID,
							vertical: false,
							strokeDasharray: "0",
							strokeWidth: 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisX, {
							dataKey: xKey,
							formatter: xFormatter
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisY, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: {
								stroke: color,
								strokeWidth: 1,
								strokeOpacity: .25
							},
							content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {
								labelFmt: xFormatter,
								valueFmt: (v) => `${v.toLocaleString("tr-TR")}${valueUnit ? ` ${valueUnit}` : ""} · ${valueLabel}`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: yKey,
							stroke: color,
							strokeWidth: 2.75,
							fill: `url(#${gradId})`,
							connectNulls: true,
							isAnimationActive: true,
							animationDuration: 600,
							dot: false,
							activeDot: {
								r: 5,
								strokeWidth: 3,
								stroke: SURFACE,
								fill: color
							}
						})
					]
				})
			})
		})]
	});
}
function MultiLineChart({ data, xKey, series, xFormatter }) {
	const active = series.filter((s) => s.visible);
	if (!data.length || active.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-44 items-center justify-center rounded-xl bg-surface2/40 text-sm text-muted",
		children: "Veri yok"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "chart-box h-48 sm:h-52",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				margin: {
					top: 8,
					right: 6,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: GRID,
						vertical: false,
						strokeWidth: 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisX, {
						dataKey: xKey,
						formatter: xFormatter
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisY, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: {
							stroke: GRID,
							strokeWidth: 1
						},
						content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {
							labelFmt: xFormatter,
							valueFmt: (v, name) => `${v.toLocaleString("tr-TR")} cm${name ? ` · ${name}` : ""}`
						})
					}),
					active.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: s.key,
						name: s.label,
						stroke: s.color,
						strokeWidth: 2.25,
						connectNulls: true,
						dot: false,
						activeDot: {
							r: 4,
							strokeWidth: 2,
							stroke: SURFACE,
							fill: s.color
						}
					}, s.key))
				]
			})
		})
	});
}
function formatChartDate(iso) {
	if (iso.length >= 10) {
		const [, m, d] = iso.slice(0, 10).split("-");
		return `${d}.${m}`;
	}
	if (iso.includes("-") && iso.length <= 5) {
		const [m, d] = iso.split("-");
		return `${d}.${m}`;
	}
	return iso;
}
var listMeasurements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("12dd2d90164a34fb13b4cfbbb7e0f7ffaf45f65b4e0fad6c86c102bbd0897ab3"));
var saveMeasurement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	date: isoDate,
	body_weight: number().min(0).max(500).nullable().optional(),
	waist: number().min(0).max(300).nullable().optional(),
	chest: number().min(0).max(300).nullable().optional(),
	arm: number().min(0).max(100).nullable().optional(),
	thigh: number().min(0).max(200).nullable().optional()
}))).handler(createSsrRpc("e70b887802d47d726afcf47a06dddba5f338a5cd98547832400a2c3259439f88"));
var deleteMeasurement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("3c5511a3cd708b6e095746b8ac3a22c9e37285c642d9a134c0993487ec8c9a05"));
var METRICS = [
	{
		key: "body_weight",
		label: "Ağırlık",
		unit: "kg",
		form: "weight"
	},
	{
		key: "waist",
		label: "Bel",
		unit: "cm",
		form: "circ"
	},
	{
		key: "chest",
		label: "Göğüs",
		unit: "cm",
		form: "circ"
	},
	{
		key: "arm",
		label: "Kol",
		unit: "cm",
		form: "circ"
	},
	{
		key: "thigh",
		label: "Uyluk",
		unit: "cm",
		form: "circ"
	}
];
function num(v) {
	if (v == null || v === "") return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}
function deltaOf(a, b) {
	if (a == null || b == null) return null;
	return Math.round((a - b) * 10) / 10;
}
function MeasurementsPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const queryClient = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("charts");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [bw, setBw] = (0, import_react.useState)("");
	const [waist, setWaist] = (0, import_react.useState)("");
	const [chest, setChest] = (0, import_react.useState)("");
	const [arm, setArm] = (0, import_react.useState)("");
	const [thigh, setThigh] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
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
	const rows = listQuery.data ?? [];
	const loading = listQuery.isLoading;
	async function reload() {
		await queryClient.invalidateQueries({ queryKey: qk.measurements });
	}
	(0, import_react.useEffect)(() => {
		if (rows.length === 0) return;
		const latest = [...rows].sort((a, b) => b.date.localeCompare(a.date))[0];
		if (date !== todayISO()) return;
		if (!bw && latest.body_weight) setBw(String(latest.body_weight));
		if (!waist && latest.waist) setWaist(String(latest.waist));
		if (!chest && latest.chest) setChest(String(latest.chest));
		if (!arm && latest.arm) setArm(String(latest.arm));
		if (!thigh && latest.thigh) setThigh(String(latest.thigh));
	}, [rows]);
	const chronological = (0, import_react.useMemo)(() => [...rows].sort((a, b) => a.date.localeCompare(b.date)), [rows]);
	const latest = chronological[chronological.length - 1];
	const prev = chronological.length >= 2 ? chronological[chronological.length - 2] : null;
	const weightNow = num(latest?.body_weight);
	const weightDelta = deltaOf(weightNow, num(prev?.body_weight));
	const first = chronological[0];
	const totalWeightDelta = deltaOf(weightNow, num(first?.body_weight));
	const weightSeries = chronological.filter((r) => r.body_weight != null).map((r) => ({
		date: r.date,
		body_weight: Number(r.body_weight)
	}));
	const measureSeries = chronological.map((r) => ({
		date: r.date,
		waist: r.waist != null ? Number(r.waist) : null,
		chest: r.chest != null ? Number(r.chest) : null,
		arm: r.arm != null ? Number(r.arm) : null,
		thigh: r.thigh != null ? Number(r.thigh) : null
	}));
	const circCards = METRICS.filter((m) => m.form === "circ").map((m) => {
		const cur = num(latest?.[m.key]);
		const before = num(prev?.[m.key]);
		return {
			...m,
			value: cur,
			delta: deltaOf(cur, before)
		};
	});
	async function onSave(e) {
		e.preventDefault();
		if (!bw && !waist && !chest && !arm && !thigh) {
			toast.error("En az bir değer gir");
			return;
		}
		setSaving(true);
		try {
			await saveMeasurement({ data: {
				date,
				body_weight: bw === "" ? null : Number(bw),
				waist: waist === "" ? null : Number(waist),
				chest: chest === "" ? null : Number(chest),
				arm: arm === "" ? null : Number(arm),
				thigh: thigh === "" ? null : Number(thigh)
			} });
			toast.success("Ölçüm kaydedildi");
			await reload();
			setTab("charts");
		} catch {
			toast.error("Kayıt başarısız");
		} finally {
			setSaving(false);
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Ölçüler",
		subtitle: "Vücut kompozisyonu",
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, { rows: 3 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl border border-line bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,194,48,0.12),transparent_55%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative p-4 sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted",
									children: "Son ağırlık"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num font-display text-5xl leading-none tracking-wide text-yellow",
										children: weightNow != null ? weightNow : "—"
									}), weightNow != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 text-sm text-muted",
										children: "kg"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted",
									children: [latest ? formatDateTR(latest.date) : "Henüz kayıt yok · Giriş’ten ekle", rows.length > 0 ? ` · ${rows.length} kayıt` : ""]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeltaPill, {
										value: weightDelta,
										unit: "kg",
										label: "önceki"
									}),
									totalWeightDelta != null && chronological.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeltaPill, {
										value: totalWeightDelta,
										unit: "kg",
										label: "toplam",
										subtle: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setTab("today"),
										className: "mt-1 flex h-10 items-center gap-1.5 rounded-full bg-yellow px-3.5 text-xs font-semibold text-bg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Yeni ölçüm"]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: circCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-line/80 bg-bg/40 px-3 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-medium uppercase tracking-wide text-dim",
										children: c.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "num mt-0.5 text-lg font-semibold text-text",
										children: [c.value != null ? c.value : "—", c.value != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-0.5 text-[11px] font-normal text-muted",
											children: c.unit
										})]
									}),
									c.delta != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: cn("num mt-0.5 text-[11px]", c.delta < 0 ? "text-green" : c.delta > 0 ? "text-orange" : "text-muted"),
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
					className: "grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1",
					children: [
						["charts", "Özet"],
						["today", "Giriş"],
						["history", "Geçmiş"]
					].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(k),
						className: cn("h-10 rounded-lg text-sm font-semibold transition", tab === k ? "bg-yellow text-bg" : "text-muted hover:text-text"),
						children: lab
					}, k))
				}),
				tab === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Ölçüm gir",
					description: "Aynı tarihte kayıt üzerine yazılır · son değerler önceden doldurulur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSave,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Tarih"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value),
									className: "h-12 w-full rounded-lg border border-line bg-surface2 px-3",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-yellow/25 bg-yellow/5 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center gap-2 text-yellow",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wide",
										children: "Vücut ağırlığı"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										inputMode: "decimal",
										step: "0.1",
										value: bw,
										onChange: (e) => setBw(e.target.value),
										placeholder: "örn. 78.5",
										className: "num h-14 min-w-0 flex-1 rounded-lg border border-yellow/30 bg-surface2 px-3 text-2xl text-yellow"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-sm text-muted",
										children: "kg"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-wide text-dim",
								children: "Çevre ölçüleri (cm) — isteğe bağlı"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: "Bel",
										value: waist,
										onChange: setWaist,
										unit: "cm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: "Göğüs",
										value: chest,
										onChange: setChest,
										unit: "cm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: "Kol",
										value: arm,
										onChange: setArm,
										unit: "cm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
										label: "Uyluk",
										value: thigh,
										onChange: setThigh,
										unit: "cm"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60",
								children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Kaydet"]
							})
						]
					})
				}),
				tab === "charts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Scale,
					title: "Henüz ölçüm yok",
					hint: "Giriş sekmesinden ilk kaydı ekle — trend burada görünecek."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Ağırlık trendi",
					description: weightSeries.length > 1 ? `${weightSeries.length} nokta` : "Daha fazla kayıtla trend netleşir",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressAreaChart, {
						data: weightSeries,
						xKey: "date",
						yKey: "body_weight",
						valueLabel: "Ağırlık",
						valueUnit: "kg",
						xFormatter: formatChartDate,
						emptyHint: "Giriş sekmesinden ilk ölçümü kaydet."
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Çevre",
					description: "Serileri aç/kapat",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap justify-end gap-1",
						children: [
							[
								"waist",
								"Bel",
								"#E07B1F"
							],
							[
								"chest",
								"Göğüs",
								"#2F6FD0"
							],
							[
								"arm",
								"Kol",
								"#2E9E5B"
							],
							[
								"thigh",
								"Uyluk",
								"#D9312B"
							]
						].map(([k, lab, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShow((s) => ({
								...s,
								[k]: !s[k]
							})),
							className: cn("rounded-full border px-2 py-1 text-[11px] font-medium", show[k] ? "text-bg" : "border-line text-muted"),
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
								label: "Bel",
								color: "#E07B1F",
								visible: show.waist
							},
							{
								key: "chest",
								label: "Göğüs",
								color: "#2F6FD0",
								visible: show.chest
							},
							{
								key: "arm",
								label: "Kol",
								color: "#2E9E5B",
								visible: show.arm
							},
							{
								key: "thigh",
								label: "Uyluk",
								color: "#D9312B",
								visible: show.thigh
							}
						]
					})
				})] }) }),
				tab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Kayıtlar",
					description: "Yeniden eskiye",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Scale,
						title: "Henüz ölçüm yok",
						hint: "İlk ölçü kaydını ekleyince geçmiş burada görünür."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: [...rows].sort((a, b) => b.date.localeCompare(a.date)).map((r, idx, arr) => {
							const older = arr[idx + 1];
							const dW = deltaOf(num(r.body_weight), num(older?.body_weight));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 py-3 first:pt-0 last:pb-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-10 shrink-0 place-items-center rounded-xl bg-surface2",
										children: dW == null || dW === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4 text-muted" }) : dW < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-orange" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: formatDateTR(r.date)
											}), r.body_weight != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "num text-sm text-yellow",
												children: [
													r.body_weight,
													" kg",
													dW != null && dW !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "ml-1 text-[11px] text-muted",
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
											className: "mt-0.5 truncate text-xs text-muted",
											children: [
												r.waist != null && `Bel ${r.waist}`,
												r.chest != null && `Göğüs ${r.chest}`,
												r.arm != null && `Kol ${r.arm}`,
												r.thigh != null && `Uyluk ${r.thigh}`
											].filter(Boolean).join(" · ") || "Sadece ağırlık"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-10 place-items-center rounded-lg border border-line text-red",
										onClick: () => {
											if (!confirm("Silinsin mi?")) return;
											deleteMeasurement({ data: r.id }).then(reload).then(() => toast.success("Silindi"));
										},
										"aria-label": "Sil",
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
	if (value == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("rounded-full border border-line px-2.5 py-1 text-[11px] text-muted", subtle && "opacity-70"),
		children: ["— ", label]
	});
	const up = value > 0;
	const flat = value === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium", flat ? "border-line text-muted" : up ? "border-orange/30 bg-orange/10 text-orange" : "border-green/30 bg-green/10 text-green", subtle && "opacity-80"),
		children: [
			flat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" }) : up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "num",
				children: [
					up ? "+" : "",
					value,
					" ",
					unit
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-dim",
				children: ["· ", label]
			})
		]
	});
}
function Num({ label, value, onChange, unit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block min-w-0 space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs text-muted",
			children: [label, unit ? ` (${unit})` : ""]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			inputMode: "decimal",
			step: "0.1",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "num h-12 w-full min-w-0 rounded-lg border border-line bg-surface2 px-3 text-lg"
		})]
	});
}
//#endregion
export { MeasurementsPage as component };

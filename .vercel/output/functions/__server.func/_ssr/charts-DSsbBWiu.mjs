import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-DSsbBWiu.js
var import_jsx_runtime = require_jsx_runtime();
var GRID = "rgba(42,49,56,0.65)";
var TICK = "#6B7580";
var ACCENT = "#F2C230";
var SURFACE = "#171B1F";
/** Compact premium tooltip */
function ChartTip({ active, payload, label, labelFmt, valueFmt }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-rule/80 bg-sunken/95 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1.5 text-[10px] font-medium uppercase tracking-wider text-text-3",
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
					children: valueFmt ? valueFmt(Number(p.value), p.name) : Number(p.value).toLocaleString()
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
function AxisY({ width = 36, domain }) {
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
		allowDecimals: false,
		domain
	});
}
function ProgressAreaChart({ data, xKey, yKey, color = ACCENT, xFormatter, valueLabel = "Value", valueUnit = "", emptyHint }) {
	if (!data.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-44 flex-col items-center justify-center gap-1 rounded-xl bg-raised/40 px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-text-2",
			children: "Veri yok"
		}), emptyHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-[14rem] text-center text-xs text-text-3",
			children: emptyHint
		}) : null]
	});
	const vals = data.map((d) => Number(d[yKey])).filter((n) => !Number.isNaN(n));
	const min = Math.min(...vals);
	const max = Math.max(...vals);
	const pad = Math.max((max - min) * .12, max * .04, 1);
	const domain = [Math.max(0, Math.floor(min - pad)), Math.ceil(max + pad)];
	const last = vals[vals.length - 1];
	const first = vals[0];
	const delta = last != null && first != null ? last - first : 0;
	const gradId = `g-${yKey.replace(/[^a-z0-9]/gi, "")}-${color.replace("#", "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [last != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-end justify-between gap-2 px-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-wider text-text-3",
				children: "Son"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "num text-2xl leading-none text-text",
				children: [last.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 text-sm font-normal text-text-2",
					children: valueUnit
				})]
			})] }), vals.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `num text-sm ${delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-text-2"}`,
				children: [
					delta > 0 ? "+" : "",
					delta.toLocaleString(),
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
							strokeDasharray: "0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisX, {
							dataKey: xKey,
							formatter: xFormatter
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisY, { domain }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: {
								stroke: color,
								strokeWidth: 1,
								strokeOpacity: .25
							},
							content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {
								labelFmt: xFormatter,
								valueFmt: (v) => `${v.toLocaleString()}${valueUnit ? ` ${valueUnit}` : ""} · ${valueLabel}`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: yKey,
							stroke: color,
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
		className: "flex h-44 items-center justify-center rounded-xl bg-raised/40 text-sm text-text-2",
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
						vertical: false
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
							valueFmt: (v, name) => `${v.toLocaleString()} cm${name ? ` · ${name}` : ""}`
						})
					}),
					active.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: s.key,
						name: s.label,
						stroke: s.color,
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
//#endregion
export { MultiLineChart, ProgressAreaChart };

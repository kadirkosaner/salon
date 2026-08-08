import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as XAxis, c as CartesianGrid, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Bar, n as BarChart, o as Area, r as LineChart, s as Line, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-BR2MOmCC.js
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
function VolumeBarChart({ data, emptyHint }) {
	const allEmpty = data.every((v) => v.tonnage === 0);
	const total = data.reduce((s, d) => s + d.tonnage, 0);
	const peak = Math.max(...data.map((d) => d.tonnage), 0);
	const last = data[data.length - 1]?.tonnage ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "12 hf toplam",
						value: fmtTon(total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Bu hafta",
						value: fmtTon(last),
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Zirve",
						value: fmtTon(peak)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chart-box h-44 sm:h-48",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 4,
							right: 2,
							left: 0,
							bottom: 0
						},
						barCategoryGap: "22%",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: GRID,
								vertical: false,
								strokeWidth: 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisX, { dataKey: "week" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisY, { width: 34 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								cursor: { fill: "rgba(242,194,48,0.06)" },
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { valueFmt: (v) => `${Number(v).toLocaleString("tr-TR")} kg` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "tonnage",
								radius: [
									6,
									6,
									2,
									2
								],
								maxBarSize: 22,
								children: data.map((entry, i) => {
									const isLast = i === data.length - 1;
									const fill = entry.tonnage <= 0 ? "rgba(242,194,48,0.12)" : isLast ? ACCENT : "rgba(242,194,48,0.55)";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill }, i);
								})
							})
						]
					})
				})
			}),
			allEmpty && emptyHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center text-xs text-muted",
				children: emptyHint
			}) : null
		]
	});
}
function MiniStat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface2/50 px-2.5 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wide text-dim",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `num mt-0.5 text-lg leading-none ${accent ? "text-yellow" : "text-text"}`,
			children: value
		})]
	});
}
function fmtTon(n) {
	if (n >= 1e3) return `${(n / 1e3).toFixed(1)}t`;
	return n.toLocaleString("tr-TR");
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
//#endregion
export { formatChartDate as i, ProgressAreaChart as n, VolumeBarChart as r, MultiLineChart as t };

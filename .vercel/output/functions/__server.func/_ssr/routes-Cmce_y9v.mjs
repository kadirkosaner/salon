import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, b as require_jsx_runtime, g as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { s as MAIN_LIFTS } from "./library-DXw4XNK8.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as formatDateTR, n as cn } from "./utils-BtReAY3a.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { A as Flame, E as LoaderCircle, n as Weight, s as Trophy, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-IgxT-mxA.mjs";
import { n as PageSection, r as StatTile, t as EmptyState } from "./section-B9Xb5HBr.mjs";
import { i as formatChartDate, n as ProgressAreaChart, r as VolumeBarChart } from "./charts-BR2MOmCC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cmce_y9v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12"));
var getExerciseProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((name) => name).handler(createSsrRpc("85d38fe238ed62e55e52afe9bdc24ec519e505fc89d618f452f6db1887b0a6e6"));
function DashboardPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [chartMode, setChartMode] = (0, import_react.useState)("volume");
	const [progressName, setProgressName] = (0, import_react.useState)(MAIN_LIFTS[0]);
	const [progress, setProgress] = (0, import_react.useState)([]);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		let cancelled = false;
		setLoading(true);
		getDashboard().then((d) => {
			if (cancelled) return;
			setData(d);
			setProgressName(d.progressExercise || MAIN_LIFTS[0]);
			setProgress(d.progress);
		}).catch(() => {
			if (!cancelled) setData(null);
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [userId]);
	async function changeProgress(name) {
		setProgressName(name);
		try {
			setProgress(await getExerciseProgress({ data: name }));
		} catch {
			setProgress([]);
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const greeting = user.displayName?.split(" ")[0] ?? "Sporcu";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Panel",
		subtitle: `Merhaba, ${greeting}`,
		children: loading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-yellow" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (data.next) navigate({
							to: "/antrenman",
							search: { date: data.next.date }
						});
						else navigate({ to: "/antrenman" });
					},
					className: "flex w-full items-center gap-3 rounded-2xl border border-yellow/30 bg-gradient-to-br from-yellow/12 via-surface to-surface p-4 text-left transition active:scale-[0.99]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-yellow",
							children: "Sıradaki"
						}), data.next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 truncate text-3xl leading-none tracking-wide",
							children: data.next.day_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-sm text-muted",
							children: [
								formatDateTR(data.next.date),
								" · ",
								data.next.exercise_count,
								" hareket"
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-2xl",
							children: "Antrenman planla"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Takvimden başla"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-yellow" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Hafta",
							value: `${data.week.completed}/${data.week.planned || 6}`,
							hint: "seans"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Tonaj",
							value: data.week.volume >= 1e3 ? `${(data.week.volume / 1e3).toFixed(1)}t` : String(data.week.volume),
							hint: "bu hafta",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weight, { className: "size-3.5 text-yellow" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Seri",
							value: `${data.streak}`,
							hint: "hafta",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5 text-orange" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Grafikler",
					description: chartMode === "volume" ? "Son 12 hafta antrenman hacmi" : "Hareket max ağırlık trendi",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-lg border border-line bg-surface2 p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setChartMode("volume"),
							className: cn("rounded-md px-2.5 py-1.5 text-[11px] font-semibold", chartMode === "volume" ? "bg-yellow text-bg" : "text-muted"),
							children: "Hacim"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setChartMode("progress"),
							className: cn("rounded-md px-2.5 py-1.5 text-[11px] font-semibold", chartMode === "progress" ? "bg-yellow text-bg" : "text-muted"),
							children: "İlerleme"
						})]
					}),
					children: chartMode === "volume" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeBarChart, {
						data: data.volumeByWeek,
						emptyHint: "Antrenman bitirdikçe dolacak."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: progressName,
							onChange: (e) => void changeProgress(e.target.value),
							className: "h-10 w-full rounded-lg border border-line bg-surface2 px-3 text-sm",
							children: MAIN_LIFTS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n,
								children: n
							}, n))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressAreaChart, {
							data: progress,
							xKey: "date",
							yKey: "weight",
							valueLabel: "Max",
							valueUnit: "kg",
							xFormatter: formatChartDate,
							emptyHint: "Bu hareket için set tamamla."
						})]
					})
				}),
				data.records.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Rekorlar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: data.records.slice(0, 5).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 py-2.5 first:pt-0 last:pb-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 shrink-0 text-yellow" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted",
										children: formatDateTR(r.date)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-xl text-yellow",
									children: r.weight
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "kg"
								})
							]
						}, r.name))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Son seanslar",
					children: data.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: "Henüz antrenman yok." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: data.recent.slice(0, 5).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/antrenman",
							search: { date: w.date },
							className: "flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface2/30 px-3 py-3 transition hover:border-yellow/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display truncate text-lg leading-none",
										children: w.day_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											formatDateTR(w.date),
											" ·",
											" ",
											w.status === "completed" ? "Tamamlandı" : w.status === "skipped" ? "Atlandı" : "Planlandı"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num shrink-0 text-sm text-muted",
									children: w.tonnage > 0 ? `${w.tonnage.toLocaleString("tr-TR")}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-dim" })
							]
						}) }, w.id))
					})
				})
			]
		})
	});
}
//#endregion
export { DashboardPage as component };

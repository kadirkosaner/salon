import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { H as Download } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { i as dowShort, l as todayISO, n as cn, r as dowLong, s as isoDow } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import "../_libs/sonner.mjs";
import { r as LoadTagBadge, t as ExercisePreviewButton } from "./load-tag-CQtjTEUB.mjs";
import { r as getPublicProgramDetail } from "./share-C5nb_MX_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-panel-CzxIeZnR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StartProgramModal({ pending, busy, onCancel, onConfirm }) {
	const t = useT();
	const { locale } = useI18n();
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
		getPublicProgramDetail({ data: {
			id,
			locale
		} }).then((d) => {
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
	}, [pending.id, locale]);
	const previewDow = isoDow(startDate);
	const selected = days.find((d) => d.id === startDayId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppSheet, {
		title: t("discover.startProgram"),
		onClose: onCancel,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "-mt-1 mb-3 text-sm text-text-2",
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
						className: "text-xs font-semibold text-text-2",
						children: t("discover.startDay")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: startDate,
						onChange: (e) => setStartDate(e.target.value),
						className: "h-12 w-full rounded-2xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-text-3",
						children: [
							dowLong(previewDow, locale),
							" · ",
							t("discover.schedFrom")
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-text-2",
						children: t("discover.whichSession")
					}),
					loadingDays ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 py-2",
						"aria-busy": "true",
						children: [
							0,
							1,
							2
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-2xl bg-raised" }, i))
					}) : days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-raised px-3 py-3 text-xs text-text-2",
						children: t("discover.noSessionList")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-52 space-y-1.5 overflow-y-auto",
						children: days.map((d) => {
							const active = startDayId === d.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStartDayId(d.id),
								className: cn("flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left text-sm active:scale-[0.99]", active ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-semibold",
										children: d.name
									}), d.focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[11px] text-text-2",
										children: d.focus
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[11px] text-text-3",
									children: dowShort(d.dow, locale)
								})]
							}) }, d.id);
						})
					}),
					selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-text-2",
						children: t("discover.sessionMaps", {
							name: selected.name,
							dow: dowLong(previewDow, locale),
							date: startDate
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-1 text-xs text-text-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", t("discover.oldProgramRemoved")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-success",
					children: ["• ", t("discover.historyKept")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: onCancel,
					className: "h-12 flex-1 rounded-2xl bg-raised text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
					children: t("common.cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy || !startDate,
					onClick: () => onConfirm({
						startDate,
						startSourceDayId: startDayId ?? void 0
					}),
					className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.98] disabled:opacity-60",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), t("discover.start")]
				})]
			})
		]
	});
}
/** Week dots — dayCount training days distributed across Mon–Sun. */
function WeekStrip({ dayCount }) {
	const n = Math.max(0, Math.min(7, dayCount));
	const filled = /* @__PURE__ */ new Set();
	if (n === 1) filled.add(0);
	else if (n > 1) for (let i = 0; i < n; i++) filled.add(Math.round(i * 6 / (n - 1)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1",
		"aria-hidden": true,
		children: Array.from({ length: 7 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: filled.has(i) ? "size-1.5 rounded-full bg-accent" : "size-1.5 rounded-full border border-edge bg-transparent" }, i))
	});
}
/** Dense edge-to-edge row. Tap opens detail — does not clone. */
function ProgramRow({ rank, p, onOpen }) {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		className: "flex w-full items-center gap-3 py-3 text-left active:bg-raised/40",
		children: [rank != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "num w-5 shrink-0 text-xs tabular-nums text-text-3",
			children: String(rank).padStart(2, "0")
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-semibold text-text",
						children: p.name
					}), p.is_catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[10px] font-medium uppercase tracking-wider text-accent",
						children: "Salon"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] tabular-nums text-text-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("discover.daysShort", { n: p.day_count }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-text-3",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("discover.exercisesShort", { n: p.exercise_count }) }),
						p.clone_count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-text-3",
							children: "·"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: p.clone_count === 1 ? t("discover.clonesOne") : t("discover.clones", { n: p.clone_count.toLocaleString() })
						})] }) : null,
						!p.is_catalog && p.author_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-text-3",
							children: "·"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: p.author_name
						})] }) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekStrip, { dayCount: p.day_count })
				})
			]
		})]
	});
}
/** Card API kept; renders dense row (clone only in detail sheet). */
function ProgramCard({ p, busy: _busy, onOpen, onClone: _onClone, onCopyCode: _onCopyCode, rank }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramRow, {
		rank,
		p,
		onOpen
	});
}
function DetailModal({ id, busy, onClose, onClone }) {
	const t = useT();
	const { locale } = useI18n();
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let c = false;
		getPublicProgramDetail({ data: {
			id,
			locale
		} }).then((d) => {
			if (!c) setData(d);
		}).catch((e) => {
			if (!c) setErr(e instanceof Error ? e.message : "Hata");
		});
		return () => {
			c = true;
		};
	}, [id, locale]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppSheet, {
		title: data?.name ?? "Program",
		onClose,
		footer: data && !data.is_own ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: busy,
			onClick: () => onClone(data.name),
			className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.98] disabled:opacity-60",
			children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), t("discover.selectToStart")]
		}) : null,
		children: [
			!data && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 py-6",
				"aria-busy": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-2/3 animate-pulse rounded-lg bg-raised" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-raised" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-raised" })
				]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-danger",
				children: err
			}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "-mt-1 mb-2 text-xs text-text-2",
					children: data.author_name
				}),
				data.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-text-2",
					children: data.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: data.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-rule bg-raised/40 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-base",
							children: [
								d.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-sans text-text-2",
									children: dowLong(d.dow, locale)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: d.exercises.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-t border-rule/50 pt-2 first:border-0 first:pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: ex.exercise_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "num text-sm text-accent",
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
				})
			] })
		]
	});
}
//#endregion
export { StartProgramModal as i, ProgramCard as n, ProgramRow as r, DetailModal as t };

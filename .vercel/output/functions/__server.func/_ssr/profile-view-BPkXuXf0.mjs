import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as followUser, s as unfollowUser } from "./social-BjKrIrtg.mjs";
import { A as Lock, H as Download, I as Flame, S as Ruler, V as Dumbbell, a as UserPlus, o as UserMinus, s as Trophy, t as X, tt as BookOpen } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { n as cn, o as formatDate } from "./utils-DKNImH2A.mjs";
import { i as formatHeight, n as displayVolume, r as displayWeight, u as weightUnit } from "./units-CBFS2Xa_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-COCWXpMD.mjs";
import { n as cloneProgram } from "./share-C5nb_MX_.mjs";
import { t as DetailModal } from "./discover-panel-CzxIeZnR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-view-BPkXuXf0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isoOf(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function startOfWeekMonday(d) {
	const x = new Date(d);
	x.setHours(12, 0, 0, 0);
	const dow = (x.getDay() + 6) % 7;
	x.setDate(x.getDate() - dow);
	return x;
}
/** Weekly contribution strip — one cell per week for the last ~12 weeks. */
function WorkoutHeatmap({ days, label }) {
	const t = useT();
	const { locale } = useI18n();
	const title = label ?? t("heatmap.last6mo");
	const byDate = new Map(days.map((d) => [d.date, d.count]));
	const today = /* @__PURE__ */ new Date();
	today.setHours(12, 0, 0, 0);
	const thisWeekStart = startOfWeekMonday(today);
	const weeks = [];
	for (let i = 11; i >= 0; i--) {
		const start = new Date(thisWeekStart);
		start.setDate(start.getDate() - 7 * i);
		const end = new Date(start);
		end.setDate(end.getDate() + 6);
		let count = 0;
		const cursor = new Date(start);
		for (let d = 0; d < 7; d++) {
			if (cursor <= today) count += byDate.get(isoOf(cursor)) ?? 0;
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push({
			start: isoOf(start),
			end: isoOf(end),
			count,
			partial: end > today
		});
	}
	function cellClass(count) {
		if (count === 0) return "bg-raised";
		if (count === 1) return "bg-accent/25";
		if (count === 2) return "bg-accent/40";
		if (count === 3) return "bg-accent/55";
		if (count >= 4) return "bg-accent/75";
		return "bg-raised";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-[10px] text-text-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("heatmap.low") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-raised" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-accent/25" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-accent/55" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-accent/75" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("heatmap.high") })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5",
				children: weeks.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						title: t("heatmap.weekTitle", {
							date: formatDate(w.start, locale),
							count: w.count
						}),
						className: cn("mx-auto aspect-square w-full max-w-8 rounded-md", cellClass(w.count), w.partial && w.count === 0 && "opacity-70")
					})
				}, w.start))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex justify-between text-[10px] text-text-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(weeks[0].start, locale) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("heatmap.thisWeek") })]
			})
		]
	});
}
/** BMI = kg / m². Returns null if inputs invalid. */
function calcBmi(weightKg, heightCm) {
	if (weightKg == null || heightCm == null) return null;
	if (weightKg < 20 || weightKg > 400) return null;
	if (heightCm < 80 || heightCm > 250) return null;
	const m = heightCm / 100;
	const bmi = weightKg / (m * m);
	if (!Number.isFinite(bmi)) return null;
	return Math.round(bmi * 10) / 10;
}
function bmiBand(bmi) {
	if (bmi < 18.5) return "under";
	if (bmi < 25) return "normal";
	if (bmi < 30) return "over";
	return "obese";
}
function ageFromBirth(iso) {
	if (!iso) return null;
	const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
	if (Number.isNaN(d.getTime())) return null;
	const now = /* @__PURE__ */ new Date();
	let age = now.getFullYear() - d.getFullYear();
	const m = now.getMonth() - d.getMonth();
	if (m < 0 || m === 0 && now.getDate() < d.getDate()) age -= 1;
	return age >= 0 && age < 130 ? age : null;
}
function ProfileView({ hub, t, onChanged }) {
	const { locale } = useI18n();
	const [tab, setTab] = (0, import_react.useState)("activity");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [following, setFollowing] = (0, import_react.useState)(hub.is_following);
	const [followers, setFollowers] = (0, import_react.useState)(hub.followers);
	const [dismissPick, setDismissPick] = (0, import_react.useState)(false);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const initials = (hub.name || "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	async function toggleFollow() {
		if (hub.is_self) return;
		const next = !following;
		if (!next && !confirm(t("profile.unfollowConfirm"))) return;
		setFollowing(next);
		setFollowers((n) => n + (next ? 1 : -1));
		setBusy(true);
		try {
			if (next) await followUser({ data: hub.id });
			else await unfollowUser({ data: hub.id });
			onChanged?.();
		} catch (e) {
			setFollowing(!next);
			setFollowers((n) => n + (next ? -1 : 1));
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	async function adopt(programId, _name) {
		if (!confirm(t("profile.cloneConfirm"))) return;
		setBusy(true);
		try {
			const r = await cloneProgram({ data: {
				programId,
				setActive: true
			} });
			toast.success(t("profile.programActive", { name: r.name }));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	if (hub.restricted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdentityRow, {
			hub,
			initials,
			t,
			following,
			followers,
			busy,
			onFollow: () => void toggleFollow()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Lock,
			title: t("profile.private"),
			hint: t("profile.privateHint")
		})]
	});
	const heatHasData = hub.heatmap.some((d) => d.count > 0);
	const age = ageFromBirth(hub.birth_date);
	const heightLabel = formatHeight(hub.height_cm, hub.unit_system);
	const wu = weightUnit(hub.unit_system);
	const totalVol = displayVolume(hub.total_volume, hub.unit_system);
	const bmi = calcBmi(hub.measurement?.body_weight, hub.height_cm);
	const bmiLabel = bmi == null ? null : bmiBand(bmi) === "under" ? t("profile.bmiUnder") : bmiBand(bmi) === "normal" ? t("profile.bmiNormal") : bmiBand(bmi) === "over" ? t("profile.bmiOver") : t("profile.bmiObese");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in w-full min-w-0 space-y-0 pb-2",
		children: [
			hub.is_self && !hub.username_confirmed && !dismissPick ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2 border border-accent/25 bg-accent/10 px-3 py-2.5 text-xs text-text",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile/edit",
					className: "min-w-0 flex-1 font-medium text-accent",
					children: t("profile.pickUsername")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setDismissPick(true),
					className: "grid size-8 place-items-center text-text-2",
					"aria-label": t("common.close"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdentityRow, {
				hub,
				initials,
				t,
				following,
				followers,
				busy,
				onFollow: () => void toggleFollow()
			}),
			(age != null || hub.sex || heightLabel || bmi != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-rule px-0 py-2 text-xs text-text-2",
				children: [
					age != null ? t("profile.ageYears", { n: age }) : null,
					hub.sex && hub.sex !== "unspecified" ? t(`profile.sex.${hub.sex}`) : null,
					heightLabel,
					bmi != null ? t("profile.bmiValue", { n: bmi }) : null
				].filter(Boolean).join(" · ")
			}),
			heatHasData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-rule py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutHeatmap, {
					days: hub.heatmap,
					label: t("profile.heatmap")
				})
			}) : hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-rule py-2 text-xs text-text-3",
				children: t("profile.heatmapEmpty")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4 overflow-x-auto border-b border-rule text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: [
					["activity", t("profile.activity")],
					["programs", t("profile.programs")],
					["stats", t("profile.stats")]
				].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(k),
					className: cn("relative -mb-px shrink-0 pb-2.5 pt-3 font-medium transition", tab === k ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent" : "text-text-2"),
					children: lab
				}, k))
			}),
			tab === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: hub.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Dumbbell,
						title: t("profile.activityEmpty"),
						hint: hub.is_self ? t("profile.activityEmptyHint") : t("profile.activityEmptyOther"),
						actionLabel: hub.is_self ? t("nav.workout") : void 0,
						actionTo: hub.is_self ? "/workout" : void 0,
						className: "py-4"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-rule",
					children: hub.recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: r.day_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-text-2",
									children: formatDate(r.date, locale)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "num text-sm text-accent",
									children: r.tonnage > 0 ? displayVolume(r.tonnage, hub.unit_system) : "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-text-3",
									children: wu
								})]
							})
						]
					}) }, r.id))
				})
			}),
			tab === "programs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hub.programs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: BookOpen,
					title: t("profile.noPublicPrograms"),
					hint: hub.is_self ? t("profile.programsEmptyHint") : t("profile.programsEmptyOther"),
					actionLabel: hub.is_self ? t("nav.program") : void 0,
					actionTo: hub.is_self ? "/program" : void 0
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-rule",
				children: hub.programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setDetailId(p.id),
						className: "flex min-w-0 flex-1 items-center gap-3 py-3 text-left active:bg-sunken/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[11px] text-text-2",
									children: [t("discover.daysShort", { n: p.day_count }), p.clone_count > 0 ? ` · ${p.clone_count === 1 ? t("discover.clonesOne") : t("discover.clones", { n: p.clone_count })}` : ""]
								})]
							}),
							hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-xs font-medium text-accent",
								children: t("discover.inspect")
							}) : null
						]
					}), !hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void adopt(p.id, p.name),
						className: "inline-flex h-11 shrink-0 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-on-primary disabled:opacity-60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }),
							" ",
							t("common.copy")
						]
					}) : null]
				}, p.id))
			}), detailId != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailModal, {
				id: detailId,
				busy,
				onClose: () => setDetailId(null),
				onClone: (name) => {
					const id = detailId;
					setDetailId(null);
					adopt(id, name);
				}
			}) : null] }) }),
			tab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-rule",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-x-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
								children: t("profile.streak")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num mt-0.5 text-2xl text-accent",
								children: hub.streak
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-text-3",
								children: t("profile.weekUnit")
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
								children: t("profile.volume")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num mt-0.5 text-2xl text-text",
								children: totalVol >= 1e3 ? `${(totalVol / 1e3).toFixed(1)}k` : totalVol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-text-3",
								children: wu
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-2",
							children: t("profile.records")
						}), hub.records.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-3",
							children: t("profile.recordsEmptyHint")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-rule/60",
							children: hub.records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 shrink-0 text-accent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: r.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-text-2",
											children: formatDate(r.date, locale)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-lg text-accent",
										children: displayWeight(r.weight, hub.unit_system)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-text-2",
										children: wu
									})
								]
							}, r.name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-text-2",
								children: t("profile.measures")
							}), hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/measurements",
								className: "flex items-center gap-1 text-xs font-medium text-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-3.5" }),
									" ",
									t("common.edit")
								]
							}) : null]
						}), !hub.measurement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-3",
							children: hub.is_self ? t("profile.measuresEmptySelf") : t("profile.measuresEmptyHint")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-text-2",
									children: formatDate(hub.measurement.date, locale)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 text-sm",
									children: [
										hub.measurement.body_weight != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "num rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent",
											children: [
												displayWeight(hub.measurement.body_weight, hub.unit_system),
												" ",
												wu
											]
										}),
										bmi != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-sm text-accent",
											children: [t("profile.bmiValue", { n: bmi }), bmiLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "ms-1.5 text-[11px] font-medium text-text-2",
												children: ["· ", bmiLabel]
											}) : null]
										}) : hub.is_self && hub.measurement.body_weight != null && hub.height_cm == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-text-3",
											children: t("profile.bmiNeedData")
										}) : null,
										hub.measurement.waist != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full border border-rule px-2.5 py-1 text-text-2",
											children: [
												t("measure.waist"),
												" ",
												hub.measurement.waist
											]
										}),
										hub.measurement.chest != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full border border-rule px-2.5 py-1 text-text-2",
											children: [
												t("measure.chest"),
												" ",
												hub.measurement.chest
											]
										}),
										hub.measurement.arm != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full border border-rule px-2.5 py-1 text-text-2",
											children: [
												t("measure.arm"),
												" ",
												hub.measurement.arm
											]
										}),
										hub.measurement.thigh != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full border border-rule px-2.5 py-1 text-text-2",
											children: [
												t("measure.thigh"),
												" ",
												hub.measurement.thigh
											]
										})
									]
								}),
								bmi != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[11px] leading-relaxed text-text-3",
									children: t("profile.bmiHint")
								}) : null
							]
						})]
					})
				]
			})
		]
	});
}
function IdentityRow({ hub, initials, t, following, followers, busy, onFollow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-rule pb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/15 font-display text-xl text-accent",
				children: hub.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hub.image,
					alt: "",
					className: "size-full object-cover"
				}) : initials
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "flex items-center gap-1.5 text-base font-semibold leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: hub.name
								}), hub.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary",
									title: "Verified",
									children: "✓"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-accent",
								children: ["@", hub.username]
							})]
						}), hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile/edit",
							className: "inline-flex h-11 shrink-0 items-center rounded-full border border-rule px-3 text-xs font-semibold text-text-2",
							children: t("profile.edit")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: onFollow,
							className: cn("inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-semibold disabled:opacity-60", following ? "border border-rule text-text-2" : "bg-primary text-on-primary"),
							children: following ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "size-3.5" }),
								" ",
								t("profile.followingBtn")
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }),
								" ",
								t("profile.follow")
							] })
						})]
					}),
					hub.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 break-words text-sm leading-relaxed text-text-2",
						children: hub.bio
					}) : null,
					hub.follows_you ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1.5 inline-block rounded-full bg-raised px-2 py-0.5 text-[11px] font-medium text-text-2",
						children: t("profile.followsYou")
					}) : null
				]
			})]
		}), !hub.restricted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num font-semibold text-text",
						children: followers ?? hub.followers
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-text-2",
						children: t("profile.followers").toLowerCase()
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num font-semibold text-text",
						children: hub.following
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-text-2",
						children: t("profile.following").toLowerCase()
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num font-semibold text-text",
						children: hub.total_sessions
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-text-2",
						children: t("profile.sessions").toLowerCase()
					})
				] })
			]
		})]
	});
}
//#endregion
export { ProfileView as t };

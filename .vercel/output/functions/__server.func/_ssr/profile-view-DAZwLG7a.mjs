import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as unfollowUser, n as followUser } from "./social-Bu5LAUW-.mjs";
import { i as formatDateTR, n as cn } from "./utils-BtReAY3a.mjs";
import { $ as BookOpen, A as Lock, H as Download, I as Flame, S as Ruler, V as Dumbbell, c as Trophy, n as Weight, o as UserPlus, s as UserMinus } from "../_libs/lucide-react.mjs";
import { s as btnClass } from "./skeleton-V6qtQgX7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-BGOjuNag.mjs";
import { n as cloneProgram } from "./share-fpDZHWUO.mjs";
import { n as StatTile, t as PageSection } from "./section-DWQXzvPD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-view-DAZwLG7a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** GitHub-style contribution grid for last ~26 weeks of workouts. */
function WorkoutHeatmap({ days, label = "Son 6 ay" }) {
	const byDate = new Map(days.map((d) => [d.date, d.count]));
	const today = /* @__PURE__ */ new Date();
	today.setHours(12, 0, 0, 0);
	const start = new Date(today);
	start.setDate(start.getDate() - 175);
	const dow = (start.getDay() + 6) % 7;
	start.setDate(start.getDate() - dow);
	const weeks = [];
	const cursor = new Date(start);
	while (cursor <= today) {
		const week = [];
		for (let i = 0; i < 7; i++) {
			const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
			const future = cursor > today;
			week.push({
				date: iso,
				count: future ? -1 : byDate.get(iso) ?? 0
			});
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push(week);
	}
	function cellClass(count) {
		if (count < 0) return "bg-transparent";
		if (count === 0) return "bg-surface2";
		if (count === 1) return "bg-yellow/25";
		if (count === 2) return "bg-yellow/45";
		if (count >= 3) return "bg-yellow/75";
		return "bg-surface2";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wider text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 text-[10px] text-dim",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Az" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-surface2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-yellow/25" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-yellow/45" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-yellow/75" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Çok" })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto pb-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex gap-[3px]",
				children: weeks.map((week, wi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-[3px]",
					children: week.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						title: day.count < 0 ? void 0 : `${day.date}: ${day.count} seans`,
						className: cn("size-[11px] rounded-[2px] sm:size-3", cellClass(day.count))
					}, day.date))
				}, wi))
			})
		})]
	});
}
function ProfileView({ hub, t, onChanged }) {
	const [tab, setTab] = (0, import_react.useState)("activity");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [following, setFollowing] = (0, import_react.useState)(hub.is_following);
	const [followers, setFollowers] = (0, import_react.useState)(hub.followers);
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
	async function adopt(programId, name) {
		if (!confirm(`“${name}” programını almak mevcut programını değiştirebilir. Devam?`)) return;
		setBusy(true);
		try {
			const r = await cloneProgram({ data: {
				programId,
				setActive: true
			} });
			toast.success(`“${r.name}” aktif programın`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	if (hub.restricted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			hub,
			initials,
			t,
			following,
			busy,
			onFollow: () => void toggleFollow()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Lock,
			title: t("profile.private"),
			hint: t("profile.privateHint")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in w-full min-w-0 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				hub,
				initials,
				t,
				following,
				followers,
				busy,
				onFollow: () => void toggleFollow()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutHeatmap, {
					days: hub.heatmap,
					label: t("profile.heatmap")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: t("profile.followers"),
						countValue: followers,
						onClick: () => setTab("activity")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: t("profile.following"),
						countValue: hub.following
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: t("profile.sessions"),
						countValue: hub.total_sessions,
						onClick: () => setTab("stats")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
				children: [
					["activity", t("profile.activity")],
					["programs", t("profile.programs")],
					["stats", t("profile.stats")]
				].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(k),
					className: cn("h-11 rounded-xl text-sm font-semibold transition active:scale-[0.98]", tab === k ? "bg-yellow text-bg shadow-[0_2px_10px_rgba(245,197,66,0.25)]" : "text-muted"),
					children: lab
				}, k))
			}),
			tab === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
				title: t("profile.history"),
				children: hub.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Dumbbell,
					title: t("workout.emptyDay"),
					hint: hub.is_self ? "Tamamladığın seanslar burada listelenir." : "Bu sporcu henüz antrenman paylaşmadı.",
					actionLabel: hub.is_self ? t("nav.workout") : void 0,
					actionTo: hub.is_self ? "/antrenman" : void 0
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: hub.recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-xl bg-surface2/40 px-3 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-yellow/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4 text-yellow" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: r.day_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: formatDateTR(r.date)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "num text-sm text-yellow",
									children: r.tonnage > 0 ? r.tonnage : "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-dim",
									children: "kg"
								})]
							})
						]
					}, r.id))
				})
			}),
			tab === "programs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
				title: t("profile.programs"),
				children: hub.programs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: BookOpen,
					title: t("profile.noPublicPrograms"),
					hint: hub.is_self ? "Programını herkese açık yaparak paylaş." : "Bu sporcu henüz program yayınlamadı.",
					actionLabel: hub.is_self ? t("nav.program") : void 0,
					actionTo: hub.is_self ? "/program" : void 0
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: hub.programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex min-w-0 items-center gap-3 rounded-xl bg-surface2/40 px-3 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									p.day_count,
									" gün · ",
									p.clone_count,
									" kopya"
								]
							})]
						}), !hub.is_self && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void adopt(p.id, p.name),
							className: btnClass("primary", void 0, { size: "sm" }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }),
								" ",
								t("common.copy")
							]
						})]
					}, p.id))
				})
			}),
			tab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: t("profile.streak"),
						countValue: hub.streak,
						hint: t("profile.weekUnit"),
						accent: true,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5 text-orange" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: t("profile.volume"),
						value: hub.total_volume >= 1e3 ? `${(hub.total_volume / 1e3).toFixed(1)}k` : String(hub.total_volume),
						hint: "kg",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weight, { className: "size-3.5 text-muted" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: t("profile.records"),
					children: hub.records.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Trophy,
						title: t("profile.noRecords"),
						hint: "Set tamamladıkça rekorlar burada."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: hub.records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
					title: t("profile.measures"),
					action: hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/olculer",
						className: "flex items-center gap-1 text-xs font-medium text-yellow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-3.5" }),
							" ",
							t("common.edit")
						]
					}) : null,
					children: !hub.measurement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Ruler,
						title: t("nav.measurements"),
						hint: hub.is_self ? "İlk ölçünü kaydet." : "Ölçüler gizli veya yok.",
						actionLabel: hub.is_self ? t("nav.measurements") : void 0,
						actionTo: hub.is_self ? "/olculer" : void 0
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: formatDateTR(hub.measurement.date)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 text-sm",
							children: [
								hub.measurement.body_weight != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num rounded-full border border-yellow/30 bg-yellow/10 px-2.5 py-1 text-yellow",
									children: [hub.measurement.body_weight, " kg"]
								}),
								hub.measurement.waist != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-line px-2.5 py-1 text-muted",
									children: ["Bel ", hub.measurement.waist]
								}),
								hub.measurement.chest != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-line px-2.5 py-1 text-muted",
									children: ["Göğüs ", hub.measurement.chest]
								}),
								hub.measurement.arm != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-line px-2.5 py-1 text-muted",
									children: ["Kol ", hub.measurement.arm]
								}),
								hub.measurement.thigh != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-line px-2.5 py-1 text-muted",
									children: ["Uyluk ", hub.measurement.thigh]
								})
							]
						})]
					})
				})
			] })
		]
	});
}
function Header({ hub, initials, t, following, followers, busy, onFollow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 bg-gradient-to-br from-yellow/25 via-yellow/5 to-transparent sm:h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative px-4 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "-mt-10 flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-4 border-surface bg-yellow/15 font-display text-2xl text-yellow shadow-lg",
						children: hub.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hub.image,
							alt: "",
							className: "size-full object-cover"
						}) : initials
					}), hub.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ayarlar",
						className: btnClass("soft", void 0, { size: "sm" }),
						children: t("profile.edit")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: onFollow,
						className: cn("mb-1 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold disabled:opacity-60", following ? "border border-line text-muted" : "bg-yellow text-bg"),
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-2xl tracking-wide",
					children: hub.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-sm text-yellow",
					children: ["@", hub.username]
				}),
				hub.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: hub.bio
				}) : null,
				hub.follows_you ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 inline-block rounded-full bg-surface2 px-2 py-0.5 text-[11px] font-medium text-muted",
					children: t("profile.followsYou")
				}) : null,
				hub.active_program && !hub.restricted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-yellow",
					children: hub.active_program
				}) : null,
				!hub.restricted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num font-semibold text-text",
							children: followers ?? hub.followers
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: t("profile.followers").toLowerCase()
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num font-semibold text-text",
							children: hub.following
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: t("profile.following").toLowerCase()
						})
					] })]
				})
			]
		})]
	});
}
//#endregion
export { ProfileView as t };

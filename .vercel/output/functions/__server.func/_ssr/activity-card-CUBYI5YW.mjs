import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as Flame, O as MessageCircle, P as Heart, V as Dumbbell, d as Trash2, h as Share2, s as Trophy, tt as BookOpen } from "../_libs/lucide-react.mjs";
import { i as HeartSolid, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { f as unlikeActivity, l as likeActivity, n as deleteActivity } from "./activity-BAbxc4Wl.mjs";
import { t as relativeTime } from "./relative-time-DJjUiPBV.mjs";
import { t as haptic } from "./haptics-0hNb66jG.mjs";
import { n as cn, o as formatDate } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { o as getPublicWorkout } from "./workouts-Co7BI8CT.mjs";
import { t as useUnitSystem } from "./use-unit-system--Rqopd2R.mjs";
import { n as displayVolume, r as displayWeight, u as weightUnit } from "./units-CBFS2Xa_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-card-CUBYI5YW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkoutDetailSheet({ workoutId, onClose }) {
	const { t, locale } = useI18n();
	const unitSystem = useUnitSystem();
	const wu = weightUnit(unitSystem);
	const [data, setData] = (0, import_react.useState)(void 0);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let c = false;
		setData(void 0);
		setErr(null);
		getPublicWorkout({ data: workoutId }).then((d) => {
			if (!c) setData(d);
		}).catch((e) => {
			if (!c) {
				setData(null);
				setErr(e instanceof Error ? e.message : t("common.error"));
			}
		});
		return () => {
			c = true;
		};
	}, [workoutId, t]);
	const title = data === void 0 ? t("common.loading") : data ? data.day_name : t("feed.typeWorkout");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
		title,
		onClose,
		children: data === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-6 text-accent" })
		}) : data == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-8 text-center text-sm text-text-2",
			children: err ?? t("feed.workoutGone")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-text-2",
					children: [formatDate(data.date, locale), data.tonnage > 0 ? ` · ${displayVolume(data.tonnage, unitSystem).toLocaleString(locale)} ${wu}` : ""]
				}), data.program && data.program.is_public ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-accent",
					children: data.program.name
				}) : null] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-rule border-t border-rule",
					children: data.exercises.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: ex.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1.5 space-y-0.5",
							children: ex.sets.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "num flex items-center gap-2 text-xs text-text-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 text-text-3",
										children: s.set_index
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										s.weight != null ? `${displayWeight(s.weight, unitSystem)} ${wu}` : "—",
										" × ",
										s.reps != null ? s.reps : "—"
									] }),
									!s.completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-text-3",
										children: "·"
									}) : null
								]
							}, s.set_index))
						})]
					}, ex.id))
				}),
				data.is_owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/workout",
					search: { date: data.date },
					className: "flex h-11 items-center justify-center rounded-xl border border-edge text-sm font-semibold",
					onClick: onClose,
					children: t("workout.title")
				}) : null
			]
		})
	});
}
function ActivityCard({ item, t, onComment, onRemoved }) {
	const { locale } = useI18n();
	const unitSystem = useUnitSystem();
	weightUnit(unitSystem);
	const [liked, setLiked] = (0, import_react.useState)(item.liked_by_me);
	const [likes, setLikes] = (0, import_react.useState)(item.like_count);
	const [comments, setComments] = (0, import_react.useState)(item.comment_count);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [openWorkoutId, setOpenWorkoutId] = (0, import_react.useState)(null);
	const initials = (item.author.name || "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	async function toggleLike() {
		const next = !liked;
		setLiked(next);
		setLikes((n) => n + (next ? 1 : -1));
		haptic.like();
		try {
			if (next) await likeActivity({ data: item.id });
			else await unlikeActivity({ data: item.id });
		} catch {
			setLiked(!next);
			setLikes((n) => n + (next ? -1 : 1));
			toast.error(t("common.error"));
		}
	}
	async function remove() {
		if (!item.is_mine) return;
		if (!confirm(t("feed.deleteConfirm"))) return;
		setBusy(true);
		try {
			await deleteActivity({ data: item.id });
			onRemoved?.(item.id);
			toast.success(t("common.success"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	async function share() {
		const text = shareText(item, unitSystem);
		try {
			if (navigator.share) await navigator.share({ text });
			else {
				await navigator.clipboard.writeText(text);
				toast.success(t("common.copied"));
			}
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("card-surface overflow-hidden", item.type === "personal_record" && "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 p-3.5 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/u/$username",
						params: { username: item.author.username || item.author.id },
						className: "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 font-display text-sm text-accent",
						children: item.author.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.author.image,
							alt: "",
							className: "size-full object-cover"
						}) : initials
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-baseline gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/u/$username",
									params: { username: item.author.username || item.author.id },
									className: "truncate text-sm font-semibold hover:underline",
									children: item.author.name
								}),
								item.author_verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary",
									title: "Verified",
									children: "✓"
								}) : null,
								item.author.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-xs text-text-2",
									children: ["@", item.author.username]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-[11px] text-text-3",
									children: ["· ", relativeTime(item.created_at, locale)]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] font-medium uppercase tracking-wider text-text-3",
							children: typeLabel(item.type, t)
						})]
					}),
					item.is_mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void remove(),
						className: "grid size-9 place-items-center rounded-lg text-text-3 hover:text-danger",
						"aria-label": t("common.delete"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3.5 pb-3",
				children: renderBody(item, t, locale, unitSystem, (id) => setOpenWorkoutId(id))
			}),
			openWorkoutId != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutDetailSheet, {
				workoutId: openWorkoutId,
				onClose: () => setOpenWorkoutId(null)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 border-t border-rule/60 px-2 py-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void toggleLike(),
						className: cn("flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition active:scale-[0.98]", liked ? "text-danger" : "text-text-2"),
						children: [liked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartSolid, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: likes
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onComment(item);
							setComments((c) => c);
						},
						className: "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-text-2 transition active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: comments
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void share(),
						className: "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-text-2 transition active:scale-[0.98]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
					})
				]
			})
		]
	});
}
function typeLabel(type, t) {
	switch (type) {
		case "workout_completed": return t("feed.typeWorkout");
		case "personal_record": return t("feed.typePr");
		case "program_published": return t("feed.typeProgram");
		case "streak_milestone": return t("feed.typeStreak");
		case "user_post": return t("feed.typePost");
		default: return "";
	}
}
function renderBody(item, t, locale, unitSystem, onOpenWorkout) {
	const p = item.payload;
	const wu = weightUnit(unitSystem);
	if (item.type === "workout_completed") {
		const wid = item.subject_id ?? p.workout_id ?? null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => wid != null && onOpenWorkout?.(wid),
			className: "flex w-full items-center gap-3 rounded-xl bg-raised/60 p-3 text-left transition active:scale-[0.99]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-11 place-items-center rounded-xl bg-accent/15",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-5 text-accent" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display truncate text-xl leading-none",
					children: String(p.day_name ?? t("feed.session"))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-text-2",
					children: [
						Number(p.exercise_count ?? 0),
						" ",
						t("feed.exercises"),
						Number(p.tonnage) > 0 ? ` · ${displayVolume(Number(p.tonnage), unitSystem).toLocaleString(locale === "en" ? "en-GB" : locale)} ${wu}` : ""
					]
				})]
			})]
		});
	}
	if (item.type === "personal_record") {
		const prev = p.prev_weight != null ? Number(p.prev_weight) : null;
		const w = Number(p.weight ?? 0);
		const wid = p.workout_id ?? null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => wid != null && onOpenWorkout?.(wid),
			className: "relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent p-4 text-left transition active:scale-[0.99]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-12 place-items-center rounded-2xl bg-primary text-on-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-accent",
							children: t("feed.prBadge")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate font-medium",
							children: String(p.exercise_name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "num mt-1 truncate text-2xl leading-none text-accent sm:text-3xl",
							children: [displayWeight(w, unitSystem), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-sm font-sans text-text-2",
								children: wu
							})]
						}),
						prev != null && prev > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-text-2",
							children: [
								"+",
								((displayWeight(w, unitSystem) ?? 0) - (displayWeight(prev, unitSystem) ?? 0)).toFixed(w % 1 || prev % 1 ? 1 : 0),
								" ",
								wu
							]
						}) : null
					]
				})]
			})
		});
	}
	if (item.type === "program_published") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl bg-raised/60 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-11 place-items-center rounded-xl bg-info/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5 text-info" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate font-medium",
				children: String(p.name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-text-2",
				children: [
					Number(p.day_count ?? 0),
					" ",
					t("feed.days"),
					p.share_code ? ` · ${String(p.share_code)}` : ""
				]
			})]
		})]
	});
	if (item.type === "streak_milestone") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl bg-warning/10 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-11 place-items-center rounded-xl bg-warning/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5 text-warning" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-2xl text-warning",
			children: [
				Number(p.weeks),
				" ",
				t("profile.weekUnit")
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-text-2",
			children: t("feed.streakHint")
		})] })]
	});
	if (item.type === "user_post") {
		const parts = String(p.body ?? "").split(/([@#][\w\u00C0-\u024F]+)/g);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm leading-relaxed",
					children: parts.map((part, i) => {
						if (part.startsWith("@") && part.length > 1) {
							const u = part.slice(1);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/u/$username",
								params: { username: u },
								className: "font-medium text-accent hover:underline",
								children: part
							}, i);
						}
						if (part.startsWith("#") && part.length > 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-info",
							children: part
						}, i);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
					})
				}),
				p.workout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => p.workout_id != null && onOpenWorkout?.(p.workout_id),
					className: "flex w-full items-center gap-3 rounded-xl bg-raised/60 p-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-10 place-items-center rounded-xl bg-accent/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-4 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: String(p.workout.day_name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-text-2",
							children: [
								p.workout.date,
								Number(p.workout.exercise_count) > 0 ? ` · ${p.workout.exercise_count} ${t("feed.exercises")}` : "",
								Number(p.workout.tonnage) > 0 ? ` · ${displayVolume(Number(p.workout.tonnage), unitSystem).toLocaleString(locale)} ${wu}` : ""
							]
						})]
					})]
				}) : null,
				p.program ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl bg-raised/60 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-10 place-items-center rounded-xl bg-info/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4 text-info" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: String(p.program.name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-text-2",
							children: [
								Number(p.program.day_count ?? 0),
								" ",
								t("feed.days")
							]
						})]
					})]
				}) : null
			]
		});
	}
	return null;
}
function shareText(item, unitSystem = "metric") {
	const p = item.payload;
	const wu = weightUnit(unitSystem);
	if (item.type === "user_post") return `${item.author.name}: ${p.body ?? ""} — Salon`;
	if (item.type === "personal_record") return `🏆 ${p.exercise_name}: ${displayWeight(Number(p.weight), unitSystem)} ${wu} — Salon`;
	if (item.type === "workout_completed") return `✅ ${p.day_name} · ${displayVolume(Number(p.tonnage ?? 0), unitSystem)} ${wu} — Salon`;
	if (item.type === "program_published") return `📋 ${p.name} — Salon`;
	return `Salon · ${item.author.name}`;
}
//#endregion
export { ActivityCard };

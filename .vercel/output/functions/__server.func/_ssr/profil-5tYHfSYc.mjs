import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, b as require_jsx_runtime, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatDateTR, n as cn } from "./utils-BtReAY3a.mjs";
import { n as useI18n } from "./provider-CtWU2_Vu.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { A as Flame, E as LoaderCircle, a as UserPlus, b as Ruler, n as Weight, r as Users } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-IgxT-mxA.mjs";
import { n as btnClass } from "./btn-B255j_Du.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageSection, r as StatTile, t as EmptyState } from "./section-B9Xb5HBr.mjs";
import { a as listFollowing, i as listFollowers, n as getMyProfileHub, s as unfollowUser, t as followUser } from "./social-gX42t5sk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil-5tYHfSYc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t } = useI18n();
	const [hub, setHub] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [following, setFollowing] = (0, import_react.useState)([]);
	const [followers, setFollowers] = (0, import_react.useState)([]);
	const [friendsLoading, setFriendsLoading] = (0, import_react.useState)(false);
	const reload = (0, import_react.useCallback)(async () => {
		setHub(await getMyProfileHub());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		let cancelled = false;
		setLoading(true);
		reload().catch(() => {
			if (!cancelled) toast.error(t("common.error"));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		userId,
		reload,
		t
	]);
	const loadFriends = (0, import_react.useCallback)(async () => {
		setFriendsLoading(true);
		try {
			const [f1, f2] = await Promise.all([listFollowing(), listFollowers()]);
			setFollowing(f1);
			setFollowers(f2);
		} catch {
			toast.error(t("common.error"));
		} finally {
			setFriendsLoading(false);
		}
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (tab === "following") loadFriends();
	}, [tab, loadFriends]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const initials = (user.displayName || user.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	async function toggleFollow(id, isFollowing) {
		try {
			if (isFollowing) {
				await unfollowUser({ data: id });
				toast.success(t("common.success"));
			} else {
				await followUser({ data: id });
				toast.success(t("common.success"));
			}
			await Promise.all([loadFriends(), reload()]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("profile.title"),
		subtitle: hub?.active_program ?? t("profile.noProgram"),
		children: loading || !hub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-yellow" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl border border-line bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 bg-gradient-to-br from-yellow/25 via-yellow/5 to-transparent sm:h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative px-4 pb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "-mt-10 flex items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-4 border-surface bg-yellow/15 font-display text-2xl text-yellow shadow-lg",
									children: user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: user.profileImageUrl,
										alt: "",
										className: "size-full object-cover"
									}) : initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/ayarlar",
									className: btnClass("soft", void 0, { size: "sm" }),
									children: t("profile.edit")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display mt-3 text-2xl tracking-wide",
								children: user.displayName ?? "—"
							}),
							hub.active_program ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-yellow",
								children: hub.active_program
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-dim",
								children: t("profile.noProgram")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTab("following"),
									className: "hover:underline",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "num font-semibold text-text",
											children: hub.following
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: t("profile.following").toLowerCase()
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTab("following"),
									className: "hover:underline",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "num font-semibold text-text",
											children: hub.followers
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: "·"
										})
									]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: t("profile.streak"),
							value: String(hub.streak),
							hint: t("profile.weekUnit"),
							accent: true,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5 text-orange" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: t("profile.sessions"),
							value: String(hub.total_sessions)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: t("profile.volume"),
							value: hub.total_volume >= 1e3 ? `${(hub.total_volume / 1e3).toFixed(1)}k` : String(hub.total_volume),
							hint: "kg",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weight, { className: "size-3.5 text-muted" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: t("profile.thisWeek"),
							value: String(hub.week_sessions),
							hint: `${hub.week_volume} kg`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
					children: [
						["overview", t("profile.overview")],
						["activity", t("profile.activity")],
						["following", t("profile.following")]
					].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(k),
						className: cn("h-11 rounded-xl text-sm font-semibold transition active:scale-[0.98]", tab === k ? "bg-yellow text-bg shadow-[0_2px_10px_rgba(245,197,66,0.25)]" : "text-muted"),
						children: lab
					}, k))
				}),
				tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: t("profile.measures"),
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/olculer",
						className: "flex items-center gap-1 text-xs font-medium text-yellow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-3.5" }),
							" ",
							t("common.edit")
						]
					}),
					children: !hub.measurement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: t("nav.measurements") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: formatDateTR(hub.measurement.date)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeasureChip, {
									label: t("common.weight"),
									value: hub.measurement.body_weight,
									unit: "kg",
									accent: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeasureChip, {
									label: "Bel",
									value: hub.measurement.waist,
									unit: "cm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeasureChip, {
									label: "Göğüs",
									value: hub.measurement.chest,
									unit: "cm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeasureChip, {
									label: "Kol",
									value: hub.measurement.arm,
									unit: "cm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeasureChip, {
									label: "Uyluk",
									value: hub.measurement.thigh,
									unit: "cm"
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: t("profile.recent"),
					children: hub.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: t("workout.emptyDay") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: hub.recent.slice(0, 4).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 py-2.5 first:pt-0 last:pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: r.day_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: formatDateTR(r.date)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num shrink-0 text-sm text-yellow",
								children: r.tonnage > 0 ? `${r.tonnage} kg` : "—"
							})]
						}, r.id))
					})
				})] }),
				tab === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: t("profile.history"),
					children: hub.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: t("workout.emptyDay") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
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
				tab === "following" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/kesfet",
						className: btnClass("soft", "w-full"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), t("profile.searchPeople")]
					}), friendsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center py-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-yellow" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
						title: `${t("profile.following")} (${following.length})`,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-muted" }),
						children: following.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: t("profile.searchPeople") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: following.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendRow, {
								id: f.id,
								name: f.name,
								image: f.image,
								onToggle: () => void toggleFollow(f.id, true),
								following: true
							}, f.id))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
						title: `· (${followers.length})`,
						children: followers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: "—" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: followers.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendRow, {
								id: f.id,
								name: f.name,
								image: f.image,
								onToggle: () => void toggleFollow(f.id, f.is_following),
								following: f.is_following
							}, f.id))
						})
					})] })]
				})
			]
		})
	});
}
function MeasureChip({ label, value, unit, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl px-3 py-2.5", accent ? "bg-yellow/10 shadow-[inset_0_0_0_1px_rgba(245,197,66,0.25)]" : "bg-surface2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: cn("num text-lg", accent ? "text-yellow" : "text-text"),
			children: [
				value != null && value !== "" ? value : "—",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-dim",
					children: unit
				})
			]
		})]
	});
}
function FriendRow({ id, name, image, following, onToggle }) {
	const initials = name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3 rounded-xl bg-surface2/40 px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/u/$userId",
			params: { userId: id },
			className: "flex min-w-0 flex-1 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-10 place-items-center overflow-hidden rounded-full bg-yellow/15 font-display text-sm text-yellow",
				children: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "size-full object-cover"
				}) : initials
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate font-medium",
				children: name
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onToggle,
			className: btnClass(following ? "ghost" : "soft", void 0, { size: "sm" }),
			children: following ? "✓" : "+"
		})]
	});
}
//#endregion
export { ProfilePage as component };

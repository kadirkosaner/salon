import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, b as require_jsx_runtime, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatDateTR, n as cn } from "./utils-BtReAY3a.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { A as Flame, E as LoaderCircle, F as Download, a as UserPlus, n as Weight, o as UserMinus } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-IgxT-mxA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageSection, r as StatTile, t as EmptyState } from "./section-B9Xb5HBr.mjs";
import { n as cloneProgram } from "./share-PEUHhdMr.mjs";
import { r as getUserProfile, s as unfollowUser, t as followUser } from "./social-gX42t5sk.mjs";
import { t as Route } from "./u._userId-C6FyUIhM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._userId-D2l3UcTN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicProfilePage() {
	const { userId } = Route.useParams();
	const { user, isPending } = useCurrentUserState();
	const me = user?.id;
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const reload = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			setData(await getUserProfile({ data: userId }));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Profil yok");
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [userId]);
	(0, import_react.useEffect)(() => {
		if (!me) return;
		reload();
	}, [me, reload]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const initials = (data?.name || "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	async function toggleFollow() {
		if (!data || data.is_self) return;
		setBusy(true);
		try {
			if (data.is_following) {
				await unfollowUser({ data: data.id });
				toast.success("Takipten çıkıldı");
			} else {
				await followUser({ data: data.id });
				toast.success("Takip ediliyor");
			}
			await reload();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "İşlem başarısız");
		} finally {
			setBusy(false);
		}
	}
	async function adopt(programId, name) {
		if (!confirm(`“${name}” programını seçmek mevcut programını siler. Devam?`)) return;
		setBusy(true);
		try {
			const r = await cloneProgram({ data: {
				programId,
				setActive: true
			} });
			toast.success(`“${r.name}” aktif programın`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Alınamadı");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Profil",
		subtitle: data?.name ?? "…",
		children: loading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-yellow" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl border border-line bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 bg-gradient-to-br from-yellow/25 via-yellow/5 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative px-4 pb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "-mt-10 flex items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-4 border-surface bg-yellow/15 font-display text-2xl text-yellow",
									children: data.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: data.image,
										alt: "",
										className: "size-full object-cover"
									}) : initials
								}), data.is_self ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/profil",
									className: "mb-1 h-9 rounded-full border border-line px-3.5 text-xs font-semibold",
									children: "Senin profilin"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void toggleFollow(),
									className: cn("mb-1 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold disabled:opacity-60", data.is_following ? "border border-line text-muted" : "bg-yellow text-bg"),
									children: data.is_following ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "size-3.5" }), " Takipten çık"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " Takip et"] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display mt-3 text-2xl tracking-wide",
								children: data.name
							}),
							data.active_program ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-yellow",
								children: data.active_program
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num font-semibold text-text",
										children: data.following
									}),
									" takip",
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num font-semibold text-text",
										children: data.followers
									}),
									" takipçi"
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Seri",
							value: String(data.streak),
							hint: "hafta",
							accent: true,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5 text-orange" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Seans",
							value: String(data.total_sessions),
							hint: "toplam"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Tonaj",
							value: data.total_volume >= 1e3 ? `${(data.total_volume / 1e3).toFixed(1)}k` : String(data.total_volume),
							hint: "kg",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weight, { className: "size-3.5 text-muted" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Bu hafta",
							value: String(data.week_sessions),
							hint: `${data.week_volume} kg`
						})
					]
				}),
				data.measurement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageSection, {
					title: "Vücut",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-muted",
						children: ["Son · ", formatDateTR(data.measurement.date)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-sm",
						children: [
							data.measurement.body_weight != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-yellow/30 bg-yellow/10 px-2.5 py-1 num text-yellow",
								children: [data.measurement.body_weight, " kg"]
							}),
							data.measurement.waist != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-line px-2.5 py-1 text-muted",
								children: ["Bel ", data.measurement.waist]
							}),
							data.measurement.chest != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-line px-2.5 py-1 text-muted",
								children: ["Göğüs ", data.measurement.chest]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Son seanslar",
					children: data.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: "Henüz aktivite yok." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: data.recent.slice(0, 5).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
								className: "num text-sm text-yellow",
								children: r.tonnage > 0 ? `${r.tonnage} kg` : "—"
							})]
						}, r.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSection, {
					title: "Paylaştığı programlar",
					children: data.programs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: "Herkese açık program yok." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: data.programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-3",
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
							}), !data.is_self && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void adopt(p.id, p.name),
								className: "flex h-10 shrink-0 items-center gap-1 rounded-lg bg-yellow px-3 text-xs font-semibold text-bg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Al"]
							})]
						}, p.id))
					})
				})
			]
		})
	});
}
//#endregion
export { PublicProfilePage as component };

import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, b as require_jsx_runtime, g as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as DOW_LABELS } from "./library-DXw4XNK8.mjs";
import { a as isoDow, n as cn, o as todayISO, t as addDaysISO } from "./utils-BtReAY3a.mjs";
import { r as useT } from "./provider-CtWU2_Vu.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { E as LoaderCircle, F as Download, G as BookOpen, I as Copy, _ as Search, a as UserPlus, r as Users, t as X } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-IgxT-mxA.mjs";
import { l as generateWorkouts, n as LoadTagBadge, t as ExercisePreviewButton } from "./workouts-IgRN97EP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageSection, t as EmptyState } from "./section-B9Xb5HBr.mjs";
import { i as listDiscoverPrograms, n as cloneProgram, r as getPublicProgramDetail } from "./share-PEUHhdMr.mjs";
import { t as copyText } from "./clipboard-BqSPespR.mjs";
import { o as searchUsers, s as unfollowUser, t as followUser } from "./social-gX42t5sk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kesfet-C29JmD6c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Discover UI — catalog + share code. */
function DiscoverPanel({ onCloned }) {
	const [list, setList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [cloning, setCloning] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(null);
	const reload = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			setList(await listDiscoverPrograms());
		} catch {
			toast.error("Liste yüklenemedi");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		reload();
	}, [reload]);
	async function runClone(p, opts) {
		setCloning(true);
		setPending(null);
		try {
			const r = p.kind === "code" ? await cloneProgram({ data: {
				shareCode: p.shareCode,
				setActive: true,
				startDate: opts.startDate,
				startSourceDayId: opts.startSourceDayId
			} }) : await cloneProgram({ data: {
				programId: p.id,
				setActive: true,
				name: p.name,
				startDate: opts.startDate,
				startSourceDayId: opts.startSourceDayId
			} });
			const from = opts.startDate > todayISO() ? opts.startDate : todayISO();
			try {
				await generateWorkouts({ data: {
					fromDate: from,
					weeks: 4,
					untilDate: addDaysISO(from, 28)
				} });
			} catch {}
			const dayHint = r.startDayName ? ` · ${r.startDayName} → ${DOW_LABELS[r.startDow] ?? ""}` : "";
			toast.success(`“${r.name}” aktif${dayHint}`);
			onCloned();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Eklenemedi");
		} finally {
			setCloning(false);
		}
	}
	async function copyCode(codeStr) {
		if (await copyText(codeStr)) toast.success(`Kod kopyalandı: ${codeStr}`);
		else toast.message(`Kod: ${codeStr}`, { description: "Manuel kopyala (ortam panoyu engelledi)" });
	}
	const filtered = list.filter((p) => {
		if (!q.trim()) return true;
		return `${p.name} ${p.description ?? ""} ${p.tags ?? ""} ${p.author_name}`.toLowerCase().includes(q.trim().toLowerCase());
	});
	const catalog = filtered.filter((p) => p.is_catalog);
	const community = filtered.filter((p) => !p.is_catalog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted",
						children: "Katalogdan al veya arkadaş kodu gir. Başlangıç günü ve hangi seansla başlayacağını sen seçersin."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Ara…",
							className: "h-11 w-full rounded-lg border border-line bg-surface2 py-2 pl-10 pr-3 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "Kod",
							className: "num h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface2 px-3 tracking-widest",
							maxLength: 8
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: cloning,
							onClick: () => {
								const c = code.trim();
								if (c.length < 4) {
									toast.error("Paylaşım kodunu gir");
									return;
								}
								const match = list.find((p) => p.share_code?.toUpperCase() === c.toUpperCase());
								setPending({
									kind: "code",
									name: match?.name ?? c,
									shareCode: c,
									id: match?.id
								});
							},
							className: "flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-yellow px-3.5 text-sm font-semibold text-bg disabled:opacity-60",
							children: [cloning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Ekle"]
						})]
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-7 animate-spin text-yellow" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4 text-yellow" }),
					title: "Katalog"
				}),
				catalog.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: "Katalog boş." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: catalog.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						p,
						busy: cloning,
						onOpen: () => setDetailId(p.id),
						onClone: () => setPending({
							kind: "id",
							id: p.id,
							name: p.name
						}),
						onCopyCode: () => void copyCode(p.share_code)
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-softblue" }),
					title: "Topluluk"
				}),
				community.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: "Henüz paylaşım yok. Program’dan Paylaş ile ekle." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: community.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						p,
						busy: cloning,
						onOpen: () => setDetailId(p.id),
						onClone: () => setPending({
							kind: "id",
							id: p.id,
							name: p.name
						}),
						onCopyCode: () => void copyCode(p.share_code)
					}, p.id))
				})
			] }),
			detailId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailModal, {
				id: detailId,
				busy: cloning,
				onClose: () => setDetailId(null),
				onClone: (name) => {
					setDetailId(null);
					setPending({
						kind: "id",
						id: detailId,
						name
					});
				}
			}),
			pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartProgramModal, {
				pending,
				busy: cloning,
				onCancel: () => setPending(null),
				onConfirm: (opts) => void runClone(pending, opts)
			})
		]
	});
}
function StartProgramModal({ pending, busy, onCancel, onConfirm }) {
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
		getPublicProgramDetail({ data: id }).then((d) => {
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
	}, [pending.id]);
	const previewDow = isoDow(startDate);
	const selected = days.find((d) => d.id === startDayId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": "Kapat",
			onClick: onCancel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 sm:rounded-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl tracking-wide",
					children: "Programı başlat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
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
							className: "text-xs font-semibold text-muted",
							children: "Başlangıç günü"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: startDate,
							onChange: (e) => setStartDate(e.target.value),
							className: "h-12 w-full rounded-2xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-dim",
							children: [DOW_LABELS[previewDow], " · seanslar bu günden itibaren planlanır"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted",
							children: "Hangi seansla başlansın?"
						}),
						loadingDays ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center py-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-yellow" })
						}) : days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl bg-surface2 px-3 py-3 text-xs text-muted",
							children: "Seans listesi yok — programın ilk günüyle başlar."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "max-h-52 space-y-1.5 overflow-y-auto",
							children: days.map((d) => {
								const active = startDayId === d.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStartDayId(d.id),
									className: cn("flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left text-sm active:scale-[0.99]", active ? "bg-yellow/15 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.4)]" : "bg-surface2 text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-semibold",
											children: d.name
										}), d.focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[11px] text-muted",
											children: d.focus
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-dim",
										children: DOW_LABELS[d.dow]?.slice(0, 3)
									})]
								}) }, d.id);
							})
						}),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-yellow",
									children: selected.name
								}),
								" →",
								" ",
								DOW_LABELS[previewDow],
								" (",
								startDate,
								") gününe oturur; diğer seanslar aralıkları korunarak kayar."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-1 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Eski program silinir (üst üste binmez)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-green",
						children: "• Geçmiş tamamlanan antrenmanlar kalır"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: onCancel,
						className: "h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
						children: "Vazgeç"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy || !startDate,
						onClick: () => onConfirm({
							startDate,
							startSourceDayId: startDayId ?? void 0
						}),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:scale-[0.98] disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Başlat"]
					})]
				})
			]
		})]
	});
}
function SectionHead({ icon, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
		className: "font-display flex items-center gap-2 text-base tracking-wide text-text",
		children: [icon, title]
	});
}
function Card({ p, busy, onOpen, onClone, onCopyCode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "min-w-0 rounded-xl border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display truncate text-lg tracking-wide",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted",
						children: [
							p.author_name,
							" · ",
							p.day_count,
							" gün · ",
							p.exercise_count,
							" hareket"
						]
					})]
				}), p.is_catalog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded-full bg-yellow/12 px-2 py-0.5 text-[10px] font-semibold text-yellow",
					children: "Salon"
				})]
			}),
			p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted",
				children: p.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpen,
						className: "h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
						children: "İncele"
					}),
					!p.is_own && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: onClone,
						className: "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:scale-[0.98] disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Seç"]
					}),
					p.share_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "num flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-surface2 px-3 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-yellow",
						onClick: onCopyCode,
						"aria-label": "Kodu kopyala",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), p.share_code]
					})
				]
			})
		]
	});
}
function DetailModal({ id, busy, onClose, onClone }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let c = false;
		getPublicProgramDetail({ data: id }).then((d) => {
			if (!c) setData(d);
		}).catch((e) => {
			if (!c) setErr(e instanceof Error ? e.message : "Hata");
		});
		return () => {
			c = true;
		};
	}, [id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": "Kapat",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl",
			children: [
				!data && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-7 animate-spin text-yellow" })
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-red",
					children: err
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tracking-wide text-yellow",
							children: data.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "grid size-9 shrink-0 place-items-center rounded-md border border-line text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: data.author_name
					}),
					data.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: data.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: data.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface2/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-base",
								children: [
									d.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-sans text-muted",
										children: DOW_LABELS[d.dow]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: d.exercises.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border-t border-line/50 pt-2 first:border-0 first:pt-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: ex.exercise_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "num text-sm text-yellow",
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
					}),
					!data.is_own && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => onClone(data.name),
						className: "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-yellow font-semibold text-bg disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Seç — başlangıç ayarla"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "mt-2 h-11 w-full rounded-lg border border-line text-sm text-muted",
						children: "Kapat"
					})
				] })
			]
		})]
	});
}
function DiscoverPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const t = useT();
	const [mode, setMode] = (0, import_react.useState)("programs");
	const [q, setQ] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [searching, setSearching] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function doSearch() {
		if (q.trim().length < 1) return;
		setSearching(true);
		try {
			setResults(await searchUsers({ data: q }));
		} catch {
			toast.error(t("common.error"));
		} finally {
			setSearching(false);
		}
	}
	async function toggleFollow(id, isFollowing) {
		try {
			if (isFollowing) await unfollowUser({ data: id });
			else await followUser({ data: id });
			setResults(await searchUsers({ data: q }));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("discover.title"),
		subtitle: t("discover.subtitle"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("programs"),
					className: cn("h-10 rounded-lg text-sm font-semibold transition", mode === "programs" ? "bg-yellow text-bg" : "text-muted"),
					children: t("discover.programs")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("people"),
					className: cn("h-10 rounded-lg text-sm font-semibold transition", mode === "people" ? "bg-yellow text-bg" : "text-muted"),
					children: t("discover.people")
				})]
			}), mode === "programs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverPanel, { onCloned: () => {
				navigate({ to: "/program" });
			} }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageSection, {
				title: t("discover.people"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") doSearch();
								},
								placeholder: "…",
								className: "h-11 w-full rounded-lg border border-line bg-surface2 py-2 pl-10 pr-3 text-sm",
								autoFocus: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: searching,
							onClick: () => void doSearch(),
							className: "h-11 shrink-0 rounded-lg bg-yellow px-4 text-sm font-semibold text-bg",
							children: searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : t("nav.search")
						})]
					}),
					results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { hint: t("profile.searchPeople") })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/u/$userId",
								params: { userId: r.id },
								className: "flex min-w-0 flex-1 items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-10 shrink-0 place-items-center rounded-full bg-yellow/15 font-display text-sm text-yellow",
									children: r.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted",
										children: r.followers
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void toggleFollow(r.id, r.is_following),
								className: cn("flex h-9 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold", r.is_following ? "border border-line text-muted" : "bg-yellow text-bg"),
								children: r.is_following ? "—" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " +"] })
							})]
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex items-center gap-1.5 text-xs text-dim",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), t("profile.following")]
					})
				]
			})]
		})
	});
}
//#endregion
export { DiscoverPage as component };

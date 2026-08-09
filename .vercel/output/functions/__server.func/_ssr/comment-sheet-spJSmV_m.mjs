import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { P as Heart, v as Send } from "../_libs/lucide-react.mjs";
import { i as HeartSolid, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { d as listComments, p as unlikeComment, t as addComment, u as likeComment } from "./activity-BAbxc4Wl.mjs";
import { t as relativeTime } from "./relative-time-DJjUiPBV.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/comment-sheet-spJSmV_m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommentSheet({ item, t, onClose, onAdded }) {
	const { locale } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [body, setBody] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [replyTo, setReplyTo] = (0, import_react.useState)(null);
	async function reload() {
		const r = await listComments({ data: item.id });
		setRows(r);
	}
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		listComments({ data: item.id }).then((r) => {
			if (!cancelled) setRows(r);
		}).catch(() => {
			if (!cancelled) toast.error(t("common.error"));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [item.id, t]);
	const tree = (0, import_react.useMemo)(() => {
		const roots = rows.filter((c) => !c.parent_id);
		const byParent = /* @__PURE__ */ new Map();
		for (const c of rows) if (c.parent_id) {
			const list = byParent.get(c.parent_id) ?? [];
			list.push(c);
			byParent.set(c.parent_id, list);
		}
		return {
			roots,
			byParent
		};
	}, [rows]);
	async function send(e) {
		e.preventDefault();
		const text = body.trim();
		if (!text) return;
		setSending(true);
		try {
			await addComment({ data: {
				eventId: item.id,
				body: text,
				parentId: replyTo?.id ?? null
			} });
			setBody("");
			setReplyTo(null);
			await reload();
			onAdded();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("common.error"));
		} finally {
			setSending(false);
		}
	}
	async function toggleLike(c) {
		const next = !c.liked_by_me;
		setRows((prev) => prev.map((x) => x.id === c.id ? {
			...x,
			liked_by_me: next,
			like_count: x.like_count + (next ? 1 : -1)
		} : x));
		try {
			if (next) await likeComment({ data: c.id });
			else await unlikeComment({ data: c.id });
		} catch {
			setRows((prev) => prev.map((x) => x.id === c.id ? {
				...x,
				liked_by_me: !next,
				like_count: x.like_count + (next ? -1 : 1)
			} : x));
		}
	}
	function CommentRow({ c, depth }) {
		const kids = tree.byParent.get(c.id) ?? [];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn(depth > 0 && "ms-8 border-s border-rule/60 ps-3"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-[11px] font-semibold text-accent",
					children: c.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.image,
						alt: "",
						className: "size-full object-cover"
					}) : (c.name || "?")[0]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/u/$username",
									params: { username: c.username || c.user_id },
									className: "text-sm font-semibold hover:underline",
									children: c.name
								}),
								c.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-on-primary",
									children: "✓"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-text-3",
									children: [relativeTime(c.created_at, locale), c.edited_at ? ` · ${t("post.edited")}` : ""]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 whitespace-pre-wrap text-sm leading-snug",
							children: c.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void toggleLike(c),
								className: cn("inline-flex items-center gap-1 text-[11px] font-medium", c.liked_by_me ? "text-danger" : "text-text-2"),
								children: [c.liked_by_me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartSolid, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3" }), c.like_count > 0 ? c.like_count : t("post.likeComment")]
							}), depth === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReplyTo(c),
								className: "inline-flex min-h-11 items-center text-[11px] font-medium text-text-2",
								children: t("post.reply")
							}) : null]
						})
					]
				})]
			}), kids.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: kids.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, {
					c: k,
					depth: depth + 1
				}, k.id))
			}) : null]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
		title: t("feed.comments"),
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[40vh] flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 space-y-3 overflow-y-auto pb-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 py-2",
					"aria-busy": "true",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 shrink-0 animate-pulse rounded-full bg-raised" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 min-w-0 flex-1 animate-pulse rounded-xl bg-raised" })]
					}, i))
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-text-2",
					children: t("feed.noComments")
				}) : tree.roots.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, {
					c,
					depth: 0
				}, c.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void send(e),
				className: "sticky bottom-0 border-t border-rule bg-sunken pt-2",
				children: [replyTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between rounded-lg bg-raised px-2 py-1 text-[11px] text-text-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						t("post.reply"),
						" · ",
						replyTo.name
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setReplyTo(null),
						children: "×"
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: body,
						onChange: (e) => setBody(e.target.value.slice(0, 500)),
						rows: 2,
						maxLength: 500,
						placeholder: t("feed.commentPlaceholder"),
						className: "min-h-11 flex-1 resize-none rounded-xl border border-rule bg-raised px-3 py-2 text-sm outline-none focus:border-accent/40"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: sending || !body.trim(),
						className: "grid size-11 place-items-center rounded-xl bg-primary text-on-primary disabled:opacity-50",
						"aria-label": t("common.save"),
						children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})]
			})]
		})
	});
}
//#endregion
export { CommentSheet };

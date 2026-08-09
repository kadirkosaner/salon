import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { V as Dumbbell, v as Send } from "../_libs/lucide-react.mjs";
import { d as useT } from "./provider-DKU9A7zf.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { createPost, listMyRecentWorkouts } from "./posts-w_r8eL4Q.mjs";
import { t as useCurrentUser } from "./use-current-user-TqsTIwHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compose-post-D-ouOBgm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Twitter-style composer: compact feed trigger → full sheet with large
* textarea, optional workout attach chips, sticky Post button.
*/
function ComposePost({ onPosted }) {
	const t = useT();
	const user = useCurrentUser();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [workouts, setWorkouts] = (0, import_react.useState)([]);
	const [attachId, setAttachId] = (0, import_react.useState)(null);
	const taRef = (0, import_react.useRef)(null);
	const initials = (user?.displayName || user?.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const avatar = user?.profileImageUrl;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		listMyRecentWorkouts().then(setWorkouts).catch(() => setWorkouts([]));
		const id = window.setTimeout(() => taRef.current?.focus(), 80);
		return () => window.clearTimeout(id);
	}, [open]);
	function close() {
		if (busy) return;
		setOpen(false);
	}
	async function submit() {
		const text = body.trim();
		if (!text) {
			toast.error(t("post.empty"));
			return;
		}
		setBusy(true);
		try {
			await createPost({ data: {
				body: text,
				attachedWorkoutId: attachId
			} });
			setBody("");
			setAttachId(null);
			setOpen(false);
			toast.success(t("post.published"));
			onPosted();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	function onKeyDown(e) {
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			e.preventDefault();
			submit();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "flex w-full items-center gap-3 rounded-2xl border border-rule bg-sunken/80 px-3.5 py-3 text-left transition hover:bg-raised active:scale-[0.99]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent",
			children: avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: avatar,
				alt: "",
				className: "size-full object-cover"
			}) : initials
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 flex-1 text-[15px] text-text-2",
			children: t("post.compose")
		})]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppSheet, {
		title: t("post.composeTitle"),
		onClose: close,
		className: "max-h-[92dvh]",
		contentClassName: "!p-0",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "num text-[11px] text-text-3",
				children: [body.length, "/500"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy || !body.trim(),
				onClick: () => void submit(),
				className: cn("inline-flex h-11 min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.98] disabled:opacity-45"),
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), t("post.publish")]
			})]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3 px-4 pt-1 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent",
				children: avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: avatar,
					alt: "",
					className: "size-full object-cover"
				}) : initials
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				ref: taRef,
				value: body,
				onChange: (e) => setBody(e.target.value.slice(0, 500)),
				onKeyDown,
				rows: 6,
				maxLength: 500,
				placeholder: t("post.placeholder"),
				className: "min-h-[9rem] w-full flex-1 resize-none bg-transparent py-2 text-[16px] leading-relaxed text-text outline-none placeholder:text-text-3"
			})]
		}), workouts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-rule px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3",
				children: t("post.attachWorkout")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAttachId(null),
					className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition", attachId == null ? "border-accent bg-accent/15 text-accent" : "border-rule bg-raised text-text-2"),
					children: t("post.noAttach")
				}), workouts.map((w) => {
					const on = attachId === w.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setAttachId(on ? null : w.id),
						className: cn("inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition", on ? "border-accent bg-accent/15 text-accent" : "border-rule bg-raised text-text-2"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [
								w.day_name,
								" · ",
								w.date.slice(5)
							]
						})]
					}, w.id);
				})]
			})]
		}) : null]
	}) : null] });
}
//#endregion
export { ComposePost };

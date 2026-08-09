import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Z as CheckCheck, nt as Bell } from "../_libs/lucide-react.mjs";
import { u as useI18n } from "./provider-DKU9A7zf.mjs";
import { t as relativeTime } from "./relative-time-DJjUiPBV.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as listNotifications, r as markNotificationsRead } from "./notifications-WEvd4wDq.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CmgellTs.js
var import_jsx_runtime = require_jsx_runtime();
function labelFor(n, t) {
	const name = n.actor.name;
	if (n.others > 0 && n.type === "like") return t("notifications.likeGroup", {
		name,
		n: n.others
	});
	switch (n.type) {
		case "like": return t("notifications.like", { name });
		case "comment": return t("notifications.comment", { name });
		case "reply": return t("notifications.reply", { name });
		case "follow": return t("notifications.follow", { name });
		case "mention": return t("notifications.mention", { name });
		case "comment_like": return t("notifications.commentLike", { name });
		default: return name;
	}
}
function hrefFor(n) {
	if (n.type === "follow" || n.subject_type === "user") return {
		to: "/u/$username",
		params: { username: n.actor.username || n.actor.id }
	};
	if (n.activity_id != null) return {
		to: "/",
		search: { activity: String(n.activity_id) }
	};
	if (n.subject_type === "post") return {
		to: "/",
		search: { post: n.subject_id }
	};
	return {
		to: "/u/$username",
		params: { username: n.actor.username || n.actor.id }
	};
}
function NotificationsPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t, locale } = useI18n();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const listQuery = useQuery({
		queryKey: qk.notifications,
		queryFn: () => listNotifications({ data: { limit: 40 } }),
		enabled: !!userId,
		staleTime: 15e3
	});
	const items = listQuery.data?.items ?? [];
	const loading = listQuery.isLoading;
	async function markAll() {
		try {
			await markNotificationsRead({ data: { all: true } });
			qc.setQueryData(qk.notifications, (prev) => prev ? {
				...prev,
				items: prev.items.map((n) => ({
					...n,
					read_at: n.read_at ?? (/* @__PURE__ */ new Date()).toISOString()
				}))
			} : prev);
			qc.invalidateQueries({ queryKey: [...qk.settings, "notif-count"] });
		} catch {
			toast.error(t("common.error"));
		}
	}
	async function openItem(n) {
		if (!n.read_at) {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			qc.setQueryData(qk.notifications, (prev) => prev ? {
				...prev,
				items: prev.items.map((x) => x.id === n.id ? {
					...x,
					read_at: now
				} : x)
			} : prev);
			markNotificationsRead({ data: { ids: [n.id] } }).then(() => {
				qc.invalidateQueries({ queryKey: [...qk.settings, "notif-count"] });
			}).catch(() => {});
		}
		const dest = hrefFor(n);
		if (dest.to === "/u/$username" && dest.params) navigate({
			to: "/u/$username",
			params: dest.params
		});
		else if (dest.to === "/") navigate({
			to: "/",
			search: {
				activity: dest.search?.activity,
				post: dest.search?.post
			}
		});
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("notifications.title"),
		actions: items.some((n) => !n.read_at) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => void markAll(),
			className: "inline-flex items-center gap-1 rounded-xl bg-raised px-2.5 py-1.5 text-xs font-medium text-text-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3.5" }), t("notifications.markAll")]
		}) : null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 px-1 pb-24 pt-2",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-6 text-accent" })
			}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-8 text-text-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-text-2",
					children: t("notifications.empty")
				})]
			}) : items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void openItem(n),
				className: cn("flex w-full gap-3 rounded-2xl border border-rule px-3 py-3 text-left transition active:scale-[0.99]", n.read_at ? "bg-sunken" : "bg-accent/8 border-accent/25"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/u/$username",
					params: { username: n.actor.username || n.actor.id },
					onClick: (e) => e.stopPropagation(),
					className: "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-xs font-semibold text-accent",
					children: n.actor.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: n.actor.image,
						alt: "",
						className: "size-full object-cover"
					}) : (n.actor.name || "?")[0]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-snug",
						children: labelFor(n, t)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[11px] text-text-3",
						children: relativeTime(n.created_at, locale)
					})]
				})]
			}, n.id))
		})
	});
}
//#endregion
export { NotificationsPage as component };

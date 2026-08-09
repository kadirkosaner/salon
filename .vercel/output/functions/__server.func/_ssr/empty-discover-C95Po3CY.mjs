import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as UserPlus } from "../_libs/lucide-react.mjs";
import "./provider-DKU9A7zf.mjs";
import { ActivityCard } from "./activity-card-CUBYI5YW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-discover-C95Po3CY.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Empty-feed discovery shelves — code-split from the home route so the
* main feed path does not pay for suggested athletes / public programs.
*/
function FeedEmptyDiscover({ t, suggested, discoverItems, programs, onFollow, onComment }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			suggested.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2",
				children: t("feed.suggested")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: suggested.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-xl border border-rule bg-raised/40 px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/u/$username",
						params: { username: u.username || u.id },
						className: "flex min-w-0 flex-1 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent",
							children: u.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: u.image,
								alt: "",
								className: "size-full object-cover"
							}) : u.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: u.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-text-2",
								children: [
									u.username ? `@${u.username}` : "",
									" · ",
									u.followers,
									" ",
									t("profile.followers").toLowerCase()
								]
							})]
						})]
					}), !u.is_following ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onFollow(u.id),
						className: "flex h-9 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-on-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), t("profile.follow")]
					}) : null]
				}, u.id))
			})] }),
			discoverItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2",
					children: t("feed.publicActivity")
				}), discoverItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityCard, {
					item,
					t,
					onComment
				}, item.id))]
			}),
			programs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2",
				children: t("feed.featuredPrograms")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scroll-fade-x flex gap-2 overflow-x-auto pb-1 scrollbar-none",
				children: programs.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({ to: "/discover" }),
					className: "w-40 shrink-0 rounded-xl border border-rule bg-raised/50 p-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-text-2",
						children: [
							p.day_count,
							" ",
							t("feed.days"),
							" · ",
							t("feed.clones", { n: p.clone_count })
						]
					})]
				}, p.id))
			})] })
		]
	});
}
//#endregion
export { FeedEmptyDiscover };

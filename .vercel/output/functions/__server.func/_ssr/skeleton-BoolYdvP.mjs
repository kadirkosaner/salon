import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-BoolYdvP.js
var import_jsx_runtime = require_jsx_runtime();
var variants = {
	primary: "bg-primary text-on-primary shadow-[var(--shadow-primary)] active:opacity-90",
	secondary: "bg-raised text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.25)] active:bg-sunken",
	soft: "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)] active:bg-accent/18",
	ghost: "bg-white/[0.04] text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-white/[0.07] active:text-text",
	danger: "bg-danger/12 text-danger shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_30%,transparent)] active:bg-danger/18",
	icon: "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-sunken active:text-text"
};
function btnClass(variant = "secondary", className, opts) {
	const size = opts?.size ?? (variant === "icon" ? "icon" : "md");
	return cn("inline-flex items-center justify-center font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", {
		sm: "min-h-10 px-3.5 text-xs gap-1.5 rounded-[var(--radius-btn)]",
		md: "min-h-12 px-4 text-sm gap-2 rounded-[var(--radius-btn)]",
		lg: "min-h-[3.25rem] px-5 text-[15px] gap-2 rounded-[var(--radius-btn)]",
		icon: "size-12 shrink-0 rounded-[var(--radius-btn)] p-0"
	}[size], variants[variant], className);
}
function Bone({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("skeleton-block", className) });
}
/** Generic page loading skeleton (matches AuthGateSkeleton pattern). */
function PageSkeleton({ rows = 4 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-3 stagger-in",
		"aria-busy": "true",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-24 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-20 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-20 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-20 rounded-xl" })
				]
			}),
			Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-28 w-full rounded-xl" }, i))
		]
	});
}
function DashboardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-4 stagger-in",
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-[5.5rem] w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-[4.5rem] rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-[4.5rem] rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-[4.5rem] rounded-xl" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-56 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-36 w-full rounded-xl" })
		]
	});
}
function WorkoutSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-3 stagger-in",
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-16 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 overflow-hidden",
				children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-16 w-14 shrink-0 rounded-2xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-10 w-2/3 rounded-lg" }),
			Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-32 w-full rounded-2xl" }, i))
		]
	});
}
function ProgramCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 stagger-in",
		"aria-busy": "true",
		children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-28 w-full rounded-2xl" }, i))
	});
}
function ProfileSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-4 stagger-in",
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-36 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "size-16 shrink-0 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-5 w-1/2 rounded" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-4 w-1/3 rounded" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-4 w-2/3 rounded" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-16 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-16 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-16 rounded-xl" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-40 w-full rounded-xl" })
		]
	});
}
//#endregion
export { WorkoutSkeleton as a, ProgramCardSkeleton as i, PageSkeleton as n, btnClass as o, ProfileSkeleton as r, DashboardSkeleton as t };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { st as Activity } from "../_libs/lucide-react.mjs";
import { d as useT } from "./provider-DKU9A7zf.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as Route } from "./reset-password-fxWZE2DR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-BW0Gv25H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const { user, isPending } = useCurrentUserState();
	const t = useT();
	const search = Route.useSearch();
	const token = search.token;
	const [password, setPassword] = (0, import_react.useState)("");
	const [password2, setPassword2] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(search.error ? t("auth.resetInvalid") : null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const hasToken = (0, import_react.useMemo)(() => !!token && token.length > 8, [token]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-8 text-accent" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!token) {
			setError(t("auth.resetInvalid"));
			return;
		}
		if (password.length < 8) {
			setError(t("auth.passwordMin"));
			return;
		}
		if (password !== password2) {
			setError(t("common.error"));
			return;
		}
		setLoading(true);
		try {
			const { error: err } = await authClient.resetPassword({
				newPassword: password,
				token
			});
			if (err) {
				setError(err.message || t("auth.resetInvalid"));
				return;
			}
			setDone(true);
		} catch {
			setError(t("auth.networkError"));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] max-w-md flex-col justify-center px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-accent/15 text-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-wide text-text",
					children: "SALON"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-text-2",
					children: t("auth.resetTitle")
				})
			]
		}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border border-rule bg-sunken p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success",
				children: t("auth.resetDone")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary",
				children: t("auth.backToLogin")
			})]
		}) : !hasToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border border-rule bg-sunken p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-2",
				children: t("auth.resetInvalid")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary",
				children: t("auth.backToLogin")
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => void onSubmit(e),
			className: "space-y-3 rounded-xl border border-rule bg-sunken p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-text-2",
						children: t("settings.newPassword")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoComplete: "new-password",
						required: true,
						minLength: 8,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "h-12 w-full rounded-md border border-rule bg-raised px-3 text-text"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-text-2",
						children: t("settings.confirmPassword")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoComplete: "new-password",
						required: true,
						minLength: 8,
						value: password2,
						onChange: (e) => setPassword2(e.target.value),
						className: "h-12 w-full rounded-md border border-rule bg-raised px-3 text-text"
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger",
					role: "alert",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: loading,
					className: "flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60",
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("auth.resetSubmit")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "block w-full text-center text-sm font-medium text-accent",
					children: t("auth.backToLogin")
				})
			]
		})]
	});
}
//#endregion
export { ResetPasswordPage as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useT } from "./provider-D_-Wceyw.mjs";
import { r as signIn, t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { at as Activity, j as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as GROK_PROVIDERS } from "./providers-B-AR6wJz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login--T5daxpe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const t = useT();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [forgotMode, setForgotMode] = (0, import_react.useState)(false);
	const [forgotSent, setForgotSent] = (0, import_react.useState)(false);
	const [forgotLoading, setForgotLoading] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-yellow" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (password.length < 8) {
			setError(t("auth.passwordMin"));
			return;
		}
		setLoading(true);
		try {
			const { error: err } = await authClient.signIn.email({
				email: email.trim(),
				password
			});
			if (err) {
				setError(err.message?.includes("Invalid") || err.message?.includes("credentials") ? t("auth.invalidCredentials") : err.message || t("auth.loginFailed"));
				return;
			}
			window.location.href = "/";
		} catch {
			setError(t("auth.networkError"));
		} finally {
			setLoading(false);
		}
	}
	async function onForgot(e) {
		e.preventDefault();
		setError(null);
		setForgotLoading(true);
		try {
			const client = authClient;
			const fn = client.forgetPassword?.bind(client) ?? client.requestPasswordReset?.bind(client);
			if (fn) {
				const { error: err } = await fn({
					email: email.trim(),
					redirectTo: "/login"
				});
				if (err) {
					setForgotSent(true);
					return;
				}
			}
			setForgotSent(true);
		} catch {
			setForgotSent(true);
		} finally {
			setForgotLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] max-w-md flex-col justify-center px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-yellow/15 text-yellow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
							className: "size-7",
							strokeWidth: 2.25
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-wide text-text",
						children: "SALON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: t("auth.tagline")
					})
				]
			}),
			forgotMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onForgot(e),
				className: "space-y-3 rounded-xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-wide",
						children: t("auth.forgotTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("auth.forgotHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted",
							children: t("auth.email")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							autoComplete: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim",
							placeholder: "ornek@mail.com"
						})]
					}),
					forgotSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-green/30 bg-green/10 px-3 py-2 text-sm text-green",
						children: t("auth.forgotSent")
					}) : null,
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-red/30 bg-red/10 px-3 py-2 text-sm text-red",
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: forgotLoading,
						className: "flex h-12 w-full items-center justify-center gap-2 rounded-md bg-yellow font-semibold text-bg disabled:opacity-60",
						children: [forgotLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, t("auth.sendReset")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setForgotMode(false);
							setForgotSent(false);
							setError(null);
						},
						className: "w-full text-center text-sm font-medium text-yellow",
						children: t("auth.backToLogin")
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3 rounded-xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-wide",
						children: t("auth.login")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted",
							children: t("auth.email")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							autoComplete: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim",
							placeholder: "ornek@mail.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted",
							children: t("auth.password")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "current-password",
							required: true,
							minLength: 8,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim",
							placeholder: t("auth.passwordPlaceholder")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setForgotMode(true),
							className: "text-xs font-medium text-yellow underline-offset-2 hover:underline",
							children: t("auth.forgotPassword")
						})
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-red/30 bg-red/10 px-3 py-2 text-sm text-red",
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: loading,
						className: "flex h-12 w-full items-center justify-center gap-2 rounded-md bg-yellow font-semibold text-bg disabled:opacity-60",
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, t("auth.login")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-center text-sm text-muted",
						children: [
							t("auth.noAccount"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "font-medium text-yellow underline-offset-2 hover:underline",
								children: t("auth.register")
							})
						]
					})
				]
			}),
			!forgotMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-xs text-dim",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-line" }),
						t("auth.or"),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-line" })
					]
				}), GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
					className: "h-12 w-full rounded-md border border-line bg-surface text-sm font-medium text-text hover:bg-surface2",
					children: p.label
				}, p.providerId))]
			})
		]
	});
}
//#endregion
export { LoginPage as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { at as Activity, j as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-i0907NCa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const { user, isPending } = useCurrentUserState();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-yellow" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (name.trim().length < 2) {
			setError("Ad en az 2 karakter olmalı.");
			return;
		}
		if (password.length < 8) {
			setError("Şifre en az 8 karakter olmalı. Daha güvenli bir şifre seç.");
			return;
		}
		setLoading(true);
		try {
			const { error: err } = await authClient.signUp.email({
				email: email.trim(),
				password,
				name: name.trim()
			});
			if (err) {
				const msg = err.message?.toLowerCase() ?? "";
				if (msg.includes("already") || msg.includes("exists") || msg.includes("unique")) setError("Bu e-posta zaten kayıtlı. Giriş sayfasından giriş yap.");
				else setError(err.message || "Kayıt tamamlanamadı. Bilgileri kontrol edip tekrar dene.");
				return;
			}
			window.location.href = "/";
		} catch {
			setError("Bağlantı hatası. İnternetini kontrol edip tekrar dene.");
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
					className: "mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-yellow/15 text-yellow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
						className: "size-7",
						strokeWidth: 2.25
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-wide text-text",
					children: "KAYIT OL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Programını Keşfet’ten seç, sonra özelleştir"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3 rounded-xl border border-line bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted",
						children: "Ad"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						autoComplete: "name",
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text",
						placeholder: "Adın"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted",
						children: "E-posta"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						autoComplete: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text",
						placeholder: "ornek@mail.com"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted",
						children: "Şifre"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoComplete: "new-password",
						required: true,
						minLength: 8,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text",
						placeholder: "En az 8 karakter"
					})]
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
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Hesap oluştur"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-sm text-muted",
					children: [
						"Zaten hesabın var mı?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-medium text-yellow underline-offset-2 hover:underline",
							children: "Giriş yap"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { RegisterPage as component };

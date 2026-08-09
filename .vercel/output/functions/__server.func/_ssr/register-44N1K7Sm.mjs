import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as usernameError, i as slugFromIdentity, n as isValidUsername, r as normalizeUsername, t as RESERVED_USERNAMES } from "./username-Bdxea3be.mjs";
import { n as claimRegisterUsername, t as checkUsernameAvailable } from "./social-BjKrIrtg.mjs";
import { st as Activity } from "../_libs/lucide-react.mjs";
import { d as useT } from "./provider-DKU9A7zf.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-44N1K7Sm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const { user, isPending } = useCurrentUserState();
	const t = useT();
	const [name, setName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [usernameTouched, setUsernameTouched] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [sex, setSex] = (0, import_react.useState)("unspecified");
	const [heightCm, setHeightCm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [avail, setAvail] = (0, import_react.useState)({
		checking: false,
		available: null,
		suggestions: []
	});
	const maxBirth = (0, import_react.useMemo)(() => new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() - 13)).toISOString().slice(0, 10), []);
	(0, import_react.useEffect)(() => {
		if (usernameTouched) return;
		const sug = slugFromIdentity(name, email);
		if (sug.length >= 3 && !RESERVED_USERNAMES.has(sug)) setUsername(sug);
		else if (!name.trim() && !email.trim()) setUsername("");
	}, [
		name,
		email,
		usernameTouched
	]);
	const normalized = (0, import_react.useMemo)(() => normalizeUsername(username), [username]);
	const localErr = usernameTouched || normalized.length > 0 ? usernameError(normalized, t) : null;
	(0, import_react.useEffect)(() => {
		if (localErr || normalized.length < 3) {
			setAvail({
				checking: false,
				available: null,
				suggestions: []
			});
			return;
		}
		let cancelled = false;
		setAvail((s) => ({
			...s,
			checking: true
		}));
		const id = window.setTimeout(() => {
			checkUsernameAvailable({ data: { username: normalized } }).then((r) => {
				if (cancelled) return;
				setAvail({
					checking: false,
					available: r.available,
					suggestions: r.suggestions ?? []
				});
			}).catch(() => {
				if (!cancelled) setAvail({
					checking: false,
					available: null,
					suggestions: []
				});
			});
		}, 320);
		return () => {
			cancelled = true;
			window.clearTimeout(id);
		};
	}, [normalized, localErr]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-3 px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-14 animate-pulse rounded-xl bg-accent/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-8 w-32 animate-pulse rounded-lg bg-raised" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-raised" })
			]
		})
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setUsernameTouched(true);
		if (name.trim().length < 2) {
			setError(t("auth.nameMin"));
			return;
		}
		if (password.length < 8) {
			setError(t("auth.passwordMin"));
			return;
		}
		const u = normalizeUsername(username);
		if (!isValidUsername(u)) {
			setError(usernameError(u, t) || t("profile.usernameInvalid"));
			return;
		}
		if (avail.available === false) {
			setError(t("profile.usernameTaken"));
			return;
		}
		let heightNum = null;
		if (heightCm.trim() !== "") {
			heightNum = Number(heightCm.replace(",", "."));
			if (Number.isNaN(heightNum) || heightNum < 80 || heightNum > 250) {
				setError(t("profile.height"));
				return;
			}
		}
		if (birthDate) {
			const d = /* @__PURE__ */ new Date(birthDate + "T12:00:00");
			const age = (Date.now() - d.getTime()) / 315576e5;
			if (Number.isNaN(d.getTime()) || age < 13 || age > 120) {
				setError(t("profile.birthDate"));
				return;
			}
		}
		setLoading(true);
		try {
			const { error: err } = await authClient.signUp.email({
				email: email.trim(),
				password,
				name: name.trim()
			});
			if (err) {
				setError(err.message || t("auth.registerFailed"));
				return;
			}
			try {
				await claimRegisterUsername({ data: {
					username: u,
					birth_date: birthDate.trim() || null,
					sex,
					height_cm: heightNum
				} });
			} catch (claimErr) {
				console.warn(claimErr);
			}
			window.location.href = "/welcome";
		} catch {
			setError(t("auth.networkError"));
		} finally {
			setLoading(false);
		}
	}
	const inputClass = "h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3";
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
					children: t("auth.tagline")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3 rounded-xl border border-rule bg-sunken p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl tracking-wide",
					children: t("auth.register")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-text-2",
						children: t("auth.name")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						autoComplete: "name",
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						className: inputClass
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-text-2",
							children: t("profile.username")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							autoComplete: "username",
							required: true,
							maxLength: 20,
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false,
							value: username,
							onChange: (e) => {
								setUsernameTouched(true);
								setUsername(e.target.value.toLowerCase().replace(/@/g, "").replace(/[^a-z0-9_]/g, ""));
							},
							className: cn(inputClass, localErr || avail.available === false ? "border-danger/50" : avail.available ? "border-success/50" : "border-rule"),
							placeholder: t("auth.usernamePlaceholder")
						}),
						localErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: localErr
						}) : avail.checking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-3",
							children: t("common.loading")
						}) : avail.available === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-success",
							children: t("profile.usernameAvailable")
						}) : avail.available === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-danger",
								children: t("profile.usernameTaken")
							}), avail.suggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: avail.suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setUsernameTouched(true);
										setUsername(s);
									},
									className: "rounded-full border border-rule bg-raised px-2.5 py-1 text-[11px] font-medium text-accent",
									children: s
								}, s))
							}) : null]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-3",
							children: "3–20 · a-z, 0-9, _"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-text-2",
						children: t("auth.email")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						autoComplete: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: inputClass,
						placeholder: t("auth.emailPlaceholder")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-text-2",
						children: t("auth.password")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoComplete: "new-password",
						required: true,
						minLength: 8,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: inputClass,
						placeholder: t("auth.passwordPlaceholder")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-text-2",
						children: t("profile.birthDate")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: birthDate,
						onChange: (e) => setBirthDate(e.target.value),
						max: maxBirth,
						min: "1905-01-01",
						className: inputClass
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-xs font-medium text-text-2",
						children: t("profile.sexLabel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1.5",
						children: [
							["female", t("profile.sex.female")],
							["male", t("profile.sex.male")],
							["unspecified", t("profile.sex.unspecified")]
						].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSex(k),
							className: cn("rounded-md border px-2 py-2.5 text-center text-[11px] font-medium leading-tight", sex === k ? "border-accent/50 bg-accent/15 text-accent" : "border-rule bg-raised text-text-2"),
							children: lab
						}, k))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-medium text-text-2",
						children: [t("profile.height"), " (cm)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						inputMode: "decimal",
						min: 80,
						max: 250,
						step: .5,
						value: heightCm,
						onChange: (e) => setHeightCm(e.target.value),
						placeholder: "170",
						className: inputClass
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger",
					role: "alert",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: loading || !!localErr && normalized.length > 0 || avail.available === false,
					className: "flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60",
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("auth.register")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-sm text-text-2",
					children: [
						t("auth.hasAccount"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-medium text-accent underline-offset-2 hover:underline",
							children: t("auth.login")
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { RegisterPage as component };

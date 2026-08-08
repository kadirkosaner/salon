import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { n as useI18n } from "./provider-CtWU2_Vu.mjs";
import { i as signOut, t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { B as ChevronLeft, E as LoaderCircle, H as Check, I as Copy, O as KeyRound, T as LogOut, i as UserRound, k as Globe, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-IgxT-mxA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ayarlar-Cv0TUiwm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { user, isPending } = useCurrentUserState();
	const { t, locale, setLocale, locales } = useI18n();
	const [panel, setPanel] = (0, import_react.useState)("menu");
	const [name, setName] = (0, import_react.useState)("");
	const [savingName, setSavingName] = (0, import_react.useState)(false);
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [newPassword2, setNewPassword2] = (0, import_react.useState)("");
	const [savingPw, setSavingPw] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user?.displayName) setName(user.displayName);
	}, [user?.displayName]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const initials = (user.displayName || user.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const currentLang = locales.find((l) => l.id === locale)?.native ?? locale.toUpperCase();
	async function saveName(e) {
		e.preventDefault();
		const n = name.trim();
		if (n.length < 2) {
			toast.error(t("common.error"));
			return;
		}
		setSavingName(true);
		try {
			const { error } = await authClient.updateUser({ name: n });
			if (error) {
				toast.error(error.message || t("common.error"));
				return;
			}
			toast.success(t("common.saved"));
			await authClient.getSession();
			setPanel("menu");
		} catch {
			toast.error(t("common.error"));
		} finally {
			setSavingName(false);
		}
	}
	async function savePassword(e) {
		e.preventDefault();
		if (newPassword.length < 8) {
			toast.error(t("settings.newPassword") + " · 8+");
			return;
		}
		if (newPassword !== newPassword2) {
			toast.error(t("common.error"));
			return;
		}
		if (!currentPassword) {
			toast.error(t("settings.currentPassword"));
			return;
		}
		setSavingPw(true);
		try {
			const { error } = await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: false
			});
			if (error) {
				toast.error(t("common.error"));
				return;
			}
			toast.success(t("common.saved"));
			setCurrentPassword("");
			setNewPassword("");
			setNewPassword2("");
			setPanel("menu");
		} catch {
			toast.error(t("common.error"));
		} finally {
			setSavingPw(false);
		}
	}
	async function copyEmail() {
		const mail = user?.primaryEmail;
		if (!mail) return;
		try {
			await navigator.clipboard.writeText(mail);
			toast.success(t("common.copied"));
		} catch {
			toast.message(mail);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: t("settings.title"),
		subtitle: t("settings.subtitle"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full min-w-0 space-y-5",
			children: [
				panel === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-yellow/15 font-display text-xl text-yellow",
								children: user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: user.profileImageUrl,
									alt: "",
									className: "size-full object-cover"
								}) : initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-base font-semibold",
										children: user.displayName || "—"
									}),
									user.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void copyEmail(),
										className: "mt-0.5 flex max-w-full items-center gap-1.5 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm text-muted",
											children: user.primaryEmail
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 shrink-0 text-dim" })]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-dim",
										children: t("settings.emailHint")
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.account"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: UserRound,
							label: t("settings.displayName"),
							value: user.displayName ?? void 0,
							onClick: () => setPanel("name")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: KeyRound,
							label: t("settings.changePassword"),
							onClick: () => setPanel("password"),
							last: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsGroup, {
						label: t("settings.language"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: Globe,
							label: t("settings.language"),
							value: currentLang,
							onClick: () => setPanel("language"),
							last: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut("/login"),
						className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red/10 text-sm font-semibold text-red shadow-[inset_0_0_0_1px_rgba(240,113,120,0.25)] active:scale-[0.99]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), t("auth.logout")]
					})
				] }),
				panel === "language" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubPanel, {
					title: t("settings.language"),
					onBack: () => setPanel("menu"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 px-1 text-xs text-muted",
						children: t("settings.languageHint")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: locales.map((l, i) => {
							const active = locale === l.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setLocale(l.id);
									setPanel("menu");
								},
								className: cn("flex min-h-14 w-full items-center gap-3 px-4 text-left active:bg-surface2", i > 0 && "border-t border-line/80"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[15px] font-medium",
										children: l.native
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted",
										children: l.label
									})]
								}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-5 shrink-0 text-yellow",
									strokeWidth: 2.5
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-5 shrink-0" })]
							}, l.id);
						})
					})]
				}),
				panel === "name" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.displayName"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: saveName,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-12 w-full rounded-2xl bg-surface2 px-4 text-[15px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] outline-none focus:shadow-[inset_0_0_0_1px_rgba(245,197,66,0.45)]",
							autoFocus: true,
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: savingName,
							className: "flex h-12 w-full items-center justify-center rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] disabled:opacity-60",
							children: savingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : t("common.save")
						})]
					})
				}),
				panel === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.changePassword"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: savePassword,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("settings.currentPassword"),
								type: "password",
								value: currentPassword,
								onChange: setCurrentPassword,
								autoComplete: "current-password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("settings.newPassword"),
								type: "password",
								value: newPassword,
								onChange: setNewPassword,
								autoComplete: "new-password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("settings.newPasswordAgain"),
								type: "password",
								value: newPassword2,
								onChange: setNewPassword2,
								autoComplete: "new-password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: savingPw,
								className: "mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] disabled:opacity-60",
								children: savingPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : t("common.save")
							})
						]
					})
				})
			]
		})
	});
}
function SettingsGroup({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-dim",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
		children
	})] });
}
function SettingsRow({ icon: Icon, label, value, onClick, last }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex min-h-[3.25rem] w-full items-center gap-3 px-3.5 text-left active:bg-surface2", !last && "border-b border-line/80"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 shrink-0 place-items-center rounded-xl bg-surface2 text-yellow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 text-[15px] font-medium",
				children: label
			}),
			value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "max-w-[40%] truncate text-sm text-muted",
				children: value
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-dim" })
		]
	});
}
function SubPanel({ title, onBack, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onBack,
		className: "mb-4 flex min-h-11 items-center gap-1 text-sm font-medium text-yellow",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" }), title]
	}), children] });
}
function Field({ label, type, value, onChange, autoComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-0.5 text-xs font-medium text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			autoComplete,
			required: true,
			className: "h-12 w-full rounded-2xl bg-surface2 px-4 text-[15px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] outline-none focus:shadow-[inset_0_0_0_1px_rgba(245,197,66,0.45)]"
		})]
	});
}
//#endregion
export { SettingsPage as component };

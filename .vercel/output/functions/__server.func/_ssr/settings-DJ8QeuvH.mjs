import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getMyProfileHub } from "./social-BjKrIrtg.mjs";
import { E as Palette, F as Globe, H as Download, J as ChevronLeft, M as KeyRound, R as Eye, U as Copy, W as Clock, X as Check, b as Scale, d as Trash2, h as Share2, k as LogOut, n as Vibrate, nt as Bell, p as Smartphone, q as ChevronRight, rt as AtSign } from "../_libs/lucide-react.mjs";
import { d as useT, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { n as setHapticEnabled } from "./haptics-0hNb66jG.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { i as updateSettings, n as exportMyData, r as getSettings, t as deleteMyAccount } from "./settings-CQ5QIRDw.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as signOut, t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { a as useTheme, i as accentsFor, t as DEFAULT_ACCENT } from "./provider-O8lqr3I3.mjs";
import { a as isStandalone, i as isIos, o as promptInstall, r as isAndroid, s as subscribeInstallAvailability, t as getInstallPrompt } from "./pwa-DZy85EaR.mjs";
import { i as setComparisonOptIn, t as getComparisonOptIn } from "./benchmarks-CZrRdoT9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DJ8QeuvH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Compact install CTA for settings / empty states.
* Android Chrome: native install prompt when available.
* iOS Safari: Share → Add to Home Screen instructions.
*/
function InstallCard({ className }) {
	const t = useT();
	const [standalone, setStandalone] = (0, import_react.useState)(false);
	const [canPrompt, setCanPrompt] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showIosHelp, setShowIosHelp] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setStandalone(isStandalone());
		setCanPrompt(!!getInstallPrompt());
		return subscribeInstallAvailability(() => {
			setCanPrompt(!!getInstallPrompt());
			setStandalone(isStandalone());
		});
	}, []);
	if (standalone) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success", className),
		children: t("pwa.installed")
	});
	async function onInstall() {
		if (isIos()) {
			setShowIosHelp(true);
			return;
		}
		setBusy(true);
		try {
			const result = await promptInstall();
			if (result === "unavailable") {
				setShowIosHelp(true);
				toast.message(t("pwa.useBrowserMenu"));
			} else if (result === "accepted") toast.success(t("pwa.installing"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("overflow-hidden rounded-2xl border border-accent/25 bg-accent/8", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 px-4 py-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-text",
						children: t("pwa.installTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs leading-relaxed text-text-2",
						children: t("pwa.installHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void onInstall(),
						className: "mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-3.5 text-sm font-semibold text-on-primary disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), canPrompt || isAndroid() ? t("pwa.installCta") : isIos() ? t("pwa.howOnIos") : t("pwa.installCta")]
					})
				]
			})]
		}), showIosHelp || isIos() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "space-y-2 border-t border-rule/60 bg-sunken/40 px-4 py-3 text-xs leading-relaxed text-text-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num shrink-0 font-semibold text-accent",
						children: "1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						t("pwa.iosStep1"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "inline size-3.5 align-text-bottom text-accent" }),
						" ",
						t("pwa.iosShare")
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num shrink-0 font-semibold text-accent",
						children: "2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("pwa.iosStep2") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num shrink-0 font-semibold text-accent",
						children: "3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("pwa.iosStep3") })]
				}),
				isAndroid() && !canPrompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 pt-1 text-text-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num shrink-0 font-semibold text-accent",
						children: "·"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("pwa.androidMenu") })]
				}) : null
			]
		}) : null]
	});
}
function SettingsPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const { t, locale, setLocale, locales } = useI18n();
	const { theme, accent, setThemeAndAccent } = useTheme();
	const queryClient = useQueryClient();
	const [panel, setPanel] = (0, import_react.useState)("menu");
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [newPassword2, setNewPassword2] = (0, import_react.useState)("");
	const [savingPw, setSavingPw] = (0, import_react.useState)(false);
	const [timeZone, setTimeZone] = (0, import_react.useState)("Europe/Istanbul");
	const [savingTz, setSavingTz] = (0, import_react.useState)(false);
	const [compareOpt, setCompareOpt] = (0, import_react.useState)(true);
	const [hub, setHub] = (0, import_react.useState)(null);
	const [unitSystem, setUnitSystem] = (0, import_react.useState)("metric");
	const [hapticOn, setHapticOn] = (0, import_react.useState)(true);
	const [notifOn, setNotifOn] = (0, import_react.useState)(true);
	const [deleteWord, setDeleteWord] = (0, import_react.useState)("");
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [_exporting, setExporting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		getSettings().then((st) => {
			if (st.timeZone) setTimeZone(st.timeZone);
			setHapticOn(st.hapticEnabled !== false);
			setHapticEnabled(st.hapticEnabled !== false);
			setNotifOn(st.notificationsEnabled !== false);
			if (st.unitSystem) setUnitSystem(st.unitSystem);
			if (st.theme) setThemeAndAccent(st.theme, st.accent || DEFAULT_ACCENT[st.theme]);
		}).catch(() => {
			try {
				const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
				if (tz) setTimeZone(tz);
			} catch {}
		});
		getMyProfileHub().then((h) => {
			setHub(h);
		}).catch(() => {});
		getComparisonOptIn().then((r) => {
			setCompareOpt(r.optIn !== false);
		}).catch(() => {});
	}, [user?.id, setThemeAndAccent]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const initials = (user.displayName || user.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const currentLang = locales.find((l) => l.id === locale)?.native ?? locale.toUpperCase();
	const avatarSrc = hub?.image || user.profileImageUrl;
	const themeLabel = theme === "carbon" ? t("settings.themeCarbon") : t("settings.themeObsidian");
	const accentList = accentsFor(theme);
	const accentLabel = t(accentList.find((a) => a.id === accent)?.labelKey ?? "settings.accentPirinc");
	async function persistTheme(nextTheme, nextAccent) {
		setThemeAndAccent(nextTheme, nextAccent);
		try {
			await updateSettings({ data: {
				theme: nextTheme,
				accent: nextAccent
			} });
		} catch {}
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
	async function saveTz(tz) {
		setSavingTz(true);
		try {
			await updateSettings({ data: { timeZone: tz } });
			setTimeZone(tz);
			toast.success(t("common.saved"));
			setPanel("menu");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setSavingTz(false);
		}
	}
	const tzList = Array.from(new Set([
		timeZone,
		...[
			"Europe/Istanbul",
			"Europe/Berlin",
			"Europe/London",
			"Europe/Moscow",
			"America/New_York",
			"America/Los_Angeles",
			"Asia/Dubai",
			"Asia/Tokyo",
			"UTC"
		],
		(() => {
			try {
				return Intl.DateTimeFormat().resolvedOptions().timeZone;
			} catch {
				return null;
			}
		})()
	].filter(Boolean)));
	async function doExport() {
		setExporting(true);
		try {
			const data = await exportMyData();
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `salon-export-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success(t("settings.exportDone"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setExporting(false);
		}
	}
	async function doDeleteAccount() {
		if (deleteWord !== "DELETE") {
			toast.error(t("settings.deleteConfirmWord"));
			return;
		}
		if (!confirm(t("settings.deleteWarn"))) return;
		setDeleting(true);
		try {
			await deleteMyAccount({ data: { confirm: "DELETE" } });
			toast.success(t("common.success"));
			await signOut("/login");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setDeleting(false);
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
						className: "overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/15 font-display text-xl text-accent",
								children: avatarSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatarSrc,
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
									hub?.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-accent",
										children: ["@", hub.username]
									}) : null,
									user.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void copyEmail(),
										className: "mt-0.5 flex max-w-full items-center gap-1.5 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm text-text-2",
											children: user.primaryEmail
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 shrink-0 text-text-3" })]
									}) : null
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.account"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: AtSign,
							label: t("profile.editProfile"),
							value: hub ? `@${hub.username}` : void 0,
							onClick: () => void navigate({ to: "/profile/edit" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: KeyRound,
							label: t("settings.changePassword"),
							onClick: () => setPanel("password"),
							last: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.preferences"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Palette,
								label: t("settings.appearance"),
								value: `${themeLabel} · ${accentLabel}`,
								onClick: () => setPanel("appearance")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Globe,
								label: t("settings.language"),
								value: currentLang,
								onClick: () => setPanel("language")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Clock,
								label: t("settings.timezone"),
								value: timeZone,
								onClick: () => setPanel("timezone")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Scale,
								label: t("settings.units"),
								value: unitSystem === "imperial" ? t("settings.unitsImperial") : t("settings.unitsMetric"),
								onClick: () => setPanel("units")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Vibrate,
								label: t("settings.haptic"),
								value: hapticOn ? t("settings.hapticOn") : t("settings.hapticOff"),
								onClick: () => {
									const next = !hapticOn;
									setHapticOn(next);
									setHapticEnabled(next);
									updateSettings({ data: { hapticEnabled: next } }).then(() => toast.success(t("common.saved")));
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Bell,
								label: t("settings.notifications"),
								value: notifOn ? t("settings.notificationsOn") : t("settings.notificationsOff"),
								onClick: () => {
									const next = !notifOn;
									setNotifOn(next);
									updateSettings({ data: { notificationsEnabled: next } }).then(() => toast.success(t("common.saved"))).catch(() => {
										setNotifOn(!next);
										toast.error(t("common.error"));
									});
								},
								last: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.privacy"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Eye,
								label: t("compare.optIn"),
								value: compareOpt ? t("common.yes") : t("common.no"),
								onClick: () => {
									const next = !compareOpt;
									setCompareOpt(next);
									setComparisonOptIn({ data: { optIn: next } }).then(() => toast.success(t("common.saved"))).catch(() => {
										setCompareOpt(!next);
										toast.error(t("common.error"));
									});
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "-mt-1 px-4 pb-2 text-[11px] leading-relaxed text-text-3",
								children: t("compare.optInHint")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Download,
								label: t("settings.export"),
								onClick: () => void doExport()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: Trash2,
								label: t("settings.deleteAccount"),
								danger: true,
								onClick: () => setPanel("delete"),
								last: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut("/login"),
						className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-danger/10 text-sm font-semibold text-danger shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_25%,transparent)] active:scale-[0.99]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), t("auth.logout")]
					})
				] }),
				panel === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubPanel, {
					title: t("settings.appearance"),
					onBack: () => setPanel("menu"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 px-1 text-xs text-text-2",
							children: t("settings.appearanceHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-2",
							children: t("settings.theme")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "group",
							"aria-label": t("settings.theme"),
							className: "mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-raised p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
							children: ["obsidian", "carbon"].map((id) => {
								const active = theme === id;
								const label = id === "obsidian" ? t("settings.themeObsidian") : t("settings.themeCarbon");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": active,
									onClick: () => void persistTheme(id, DEFAULT_ACCENT[id]),
									className: cn("rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-primary text-on-primary" : "text-text-2 active:bg-sunken"),
									children: label
								}, id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-2",
							children: t("settings.accent")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-3 px-1",
							role: "group",
							"aria-label": t("settings.accent"),
							children: accentList.map((a) => {
								const active = accent === a.id;
								const label = t(a.labelKey);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": label,
									"aria-pressed": active,
									onClick: () => void persistTheme(theme, a.id),
									className: cn("size-10 rounded-full transition", active ? "ring-2 ring-accent ring-offset-2 ring-offset-canvas" : "ring-1 ring-edge"),
									style: { background: a.hex }
								}, a.id);
							})
						})
					]
				}),
				panel === "timezone" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubPanel, {
					title: t("settings.timezone"),
					onBack: () => setPanel("menu"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 px-1 text-xs text-text-2",
						children: t("settings.timezoneHint")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: tzList.map((tz, i) => {
							const active = timeZone === tz;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: savingTz,
								onClick: () => void saveTz(tz),
								className: cn("flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-raised", i > 0 && "border-t border-rule/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(active && "font-semibold text-accent"),
									children: tz
								}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent" }) : null]
							}, tz);
						})
					})]
				}),
				panel === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.changePassword"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => void savePassword(e),
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: t("settings.currentPassword"),
								value: currentPassword,
								onChange: (e) => setCurrentPassword(e.target.value),
								className: "h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: t("settings.newPassword"),
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								className: "h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: t("settings.newPasswordAgain"),
								value: newPassword2,
								onChange: (e) => setNewPassword2(e.target.value),
								className: "h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: savingPw,
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary disabled:opacity-60",
								children: [savingPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("common.save")]
							})
						]
					})
				}),
				panel === "language" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubPanel, {
					title: t("settings.language"),
					onBack: () => setPanel("menu"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 px-1 text-xs text-text-2",
						children: t("settings.languageHint")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: locales.map((l, i) => {
							const active = locale === l.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setLocale(l.id);
									toast.success(t("common.saved"));
									setPanel("menu");
								},
								className: cn("flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-raised", i > 0 && "border-t border-rule/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(active && "font-semibold text-accent"),
									children: l.native
								}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent" }) : null]
							}, l.id);
						})
					})]
				}),
				panel === "units" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.units"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: [["metric", t("settings.unitsMetric")], ["imperial", t("settings.unitsImperial")]].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setUnitSystem(k);
								updateSettings({ data: { unitSystem: k } }).then(() => {
									queryClient.invalidateQueries({ queryKey: [...qk.settings, "units"] });
									toast.success(t("common.saved"));
									setPanel("menu");
								});
							},
							className: cn("flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left", unitSystem === k ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: lab
							}), unitSystem === k ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "ml-auto size-4 text-accent" }) : null]
						}, k))
					})
				}),
				panel === "delete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.deleteAccount"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-2xl border border-danger/30 bg-danger/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-text-2",
								children: t("settings.deleteWarn")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-text-2",
									children: t("settings.deleteConfirmWord")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: deleteWord,
									onChange: (e) => setDeleteWord(e.target.value),
									className: "h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
									placeholder: "DELETE",
									autoComplete: "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: deleting || deleteWord !== "DELETE",
								onClick: () => void doDeleteAccount(),
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-danger font-semibold text-on-primary disabled:opacity-50",
								children: [deleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), t("settings.deleteAccount")]
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
		className: "mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-2",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
		children
	})] });
}
function SettingsRow({ icon: Icon, label, value, onClick, last, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-raised", !last && "border-b border-rule/60"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("grid size-9 place-items-center rounded-lg bg-raised", danger ? "text-danger" : "text-accent"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("block text-sm font-medium", danger && "text-danger"),
					children: label
				}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block truncate text-xs text-text-2",
					children: value
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-text-3" })
		]
	});
}
function SubPanel({ title, onBack, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onBack,
			className: "flex items-center gap-1 text-sm font-medium text-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), title]
		}), children]
	});
}
//#endregion
export { SettingsPage as component };

import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { s as parseOrThrow, t as authMiddleware } from "./validation-CwL44con.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { n as normalizeUsername, t as isValidUsername } from "./username-DNrJudLp.mjs";
import { o as updateMyProfile, r as getMyProfileHub } from "./social-Bu5LAUW-.mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { n as useI18n } from "./provider-CeWW0z-e.mjs";
import { i as signOut, t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-BRGBwLSs.mjs";
import { F as Globe, H as Download, J as ChevronLeft, N as KeyRound, R as Eye, U as Copy, W as Clock, X as Check, a as UserRound, b as Scale, et as Bell, f as Trash2, j as LoaderCircle, k as LogOut, q as ChevronRight, r as Vibrate, tt as AtSign } from "../_libs/lucide-react.mjs";
import { n as AuthGateSkeleton, r as RedirectToSignIn, t as AppShell } from "./app-shell-A_6k73rc.mjs";
import { n as setHapticEnabled } from "./haptics-0hNb66jG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ayarlar-CTAp4tMC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9b36a4c1185958551fcc8de1b888777de8a08ebe75806d2780396ecc0b4eafe7"));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => parseOrThrow(object({
	timeZone: string().trim().min(1).max(64).optional(),
	hapticEnabled: boolean().optional(),
	notificationsEnabled: boolean().optional(),
	unitSystem: _enum(["metric", "imperial"]).optional()
}), d)).handler(createSsrRpc("0e182776be6283b912be100cdaf806931752666530bbee6f8ea2a74039c779ba"));
/** Export user data as JSON (GDPR). */
var exportMyData = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f234a67bab3f7e8438c0cb607261fbb8bcc91ecc48658176705bb3bcbd5fb747"));
/** Hard-delete account (cascade via FKs). */
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => parseOrThrow(object({ confirm: literal("DELETE") }), d)).handler(createSsrRpc("7fd971e076a0cb90d76d0d895765ba1c55eb0ec3cdccd5478850ef7f1c566420"));
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
	const [timeZone, setTimeZone] = (0, import_react.useState)("Europe/Istanbul");
	const [savingTz, setSavingTz] = (0, import_react.useState)(false);
	const [hub, setHub] = (0, import_react.useState)(null);
	const [username, setUsername] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [visibility, setVisibility] = (0, import_react.useState)("public");
	const [measuresPublic, setMeasuresPublic] = (0, import_react.useState)(false);
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [unitSystem, setUnitSystem] = (0, import_react.useState)("metric");
	const [hapticOn, setHapticOn] = (0, import_react.useState)(true);
	const [notifOn, setNotifOn] = (0, import_react.useState)(true);
	const [deleteWord, setDeleteWord] = (0, import_react.useState)("");
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user?.displayName) setName(user.displayName);
	}, [user?.displayName]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getSettings().then((st) => {
			if (st.timeZone) setTimeZone(st.timeZone);
			setHapticOn(st.hapticEnabled !== false);
			setHapticEnabled(st.hapticEnabled !== false);
			setNotifOn(st.notificationsEnabled !== false);
			if (st.unitSystem) setUnitSystem(st.unitSystem);
		}).catch(() => {
			try {
				const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
				if (tz) setTimeZone(tz);
			} catch {}
		});
		getMyProfileHub().then((h) => {
			setHub(h);
			setUsername(h.username);
			setBio(h.bio ?? "");
			setVisibility(h.visibility);
			setMeasuresPublic(h.measures_public);
		}).catch(() => {});
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const initials = (user.displayName || user.primaryEmail || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const currentLang = locales.find((l) => l.id === locale)?.native ?? locale.toUpperCase();
	const avatarSrc = hub?.image || user.profileImageUrl;
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
	async function saveProfile(e) {
		e.preventDefault();
		const u = normalizeUsername(username);
		if (!isValidUsername(u)) {
			toast.error(t("profile.usernameInvalid"));
			return;
		}
		setSavingProfile(true);
		try {
			const h = await updateMyProfile({ data: {
				username: u,
				bio: bio.trim() || null,
				visibility,
				measures_public: measuresPublic
			} });
			setHub(h);
			setUsername(h.username);
			toast.success(t("common.saved"));
			setPanel("menu");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("common.error"));
		} finally {
			setSavingProfile(false);
		}
	}
	async function onAvatarFile(file) {
		if (!file) return;
		if (file.size > 2097152) {
			toast.error("Max 2MB");
			return;
		}
		if (!file.type.startsWith("image/")) {
			toast.error(t("common.error"));
			return;
		}
		try {
			const dataUrl = await compressImage(file, 256, .82);
			setSavingProfile(true);
			const h = await updateMyProfile({ data: { avatar_url: dataUrl } });
			setHub(h);
			toast.success(t("common.saved"));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("common.error"));
		} finally {
			setSavingProfile(false);
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
						className: "overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-yellow/15 font-display text-xl text-yellow",
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
										className: "text-sm text-yellow",
										children: ["@", hub.username]
									}) : null,
									user.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void copyEmail(),
										className: "mt-0.5 flex max-w-full items-center gap-1.5 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm text-muted",
											children: user.primaryEmail
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 shrink-0 text-dim" })]
									}) : null
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.account"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: AtSign,
								label: t("profile.editProfile"),
								value: hub ? `@${hub.username}` : void 0,
								onClick: () => setPanel("profile")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: UserRound,
								label: t("settings.displayName"),
								value: user.displayName ?? void 0,
								onClick: () => setPanel("name")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
								icon: KeyRound,
								label: t("settings.changePassword"),
								onClick: () => setPanel("password"),
								last: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.preferences"),
						children: [
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
								value: notifOn ? t("settings.hapticOn") : t("settings.hapticOff"),
								onClick: () => {
									const next = !notifOn;
									setNotifOn(next);
									updateSettings({ data: { notificationsEnabled: next } }).then(() => toast.success(t("common.saved")));
								},
								last: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsGroup, {
						label: t("settings.danger"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: Download,
							label: t("settings.export"),
							onClick: () => void doExport()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
							icon: Trash2,
							label: t("settings.deleteAccount"),
							onClick: () => setPanel("delete"),
							last: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut("/login"),
						className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red/10 text-sm font-semibold text-red shadow-[inset_0_0_0_1px_rgba(240,113,120,0.25)] active:scale-[0.99]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), t("auth.logout")]
					})
				] }),
				panel === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("profile.editProfile"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => void saveProfile(e),
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-16 place-items-center overflow-hidden rounded-2xl bg-yellow/15 font-display text-xl text-yellow",
									children: avatarSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: avatarSrc,
										alt: "",
										className: "size-full object-cover"
									}) : initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer text-sm font-semibold text-yellow",
									children: [t("profile.avatar"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/jpeg,image/png,image/webp",
										className: "sr-only",
										onChange: (e) => void onAvatarFile(e.target.files?.[0] ?? null)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted",
									children: t("profile.username")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "@"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: username,
										onChange: (e) => setUsername(e.target.value.toLowerCase()),
										maxLength: 20,
										className: "h-12 min-w-0 flex-1 rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-muted",
									children: [
										t("profile.bio"),
										" (",
										bio.length,
										"/160)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: bio,
									onChange: (e) => setBio(e.target.value.slice(0, 160)),
									rows: 3,
									className: "w-full resize-none rounded-xl bg-surface2 px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
									className: "flex items-center gap-1.5 text-xs font-medium text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }),
										" ",
										t("profile.visibility")
									]
								}), [
									["public", t("profile.visibilityPublic")],
									["followers", t("profile.visibilityFollowers")],
									["private", t("profile.visibilityPrivate")]
								].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3", visibility === k ? "bg-yellow/10 shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]" : "bg-surface2/50"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "vis",
										checked: visibility === k,
										onChange: () => setVisibility(k),
										className: "accent-yellow"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: lab
									})]
								}, k))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 rounded-xl bg-surface2/50 px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: t("profile.measuresPublic")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: measuresPublic,
									onChange: (e) => setMeasuresPublic(e.target.checked),
									className: "size-5 accent-yellow"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: savingProfile,
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60",
								children: [savingProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, t("common.save")]
							})
						]
					})
				}),
				panel === "timezone" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubPanel, {
					title: t("settings.timezone"),
					onBack: () => setPanel("menu"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 px-1 text-xs text-muted",
						children: t("settings.timezoneHint")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						children: tzList.map((tz, i) => {
							const active = timeZone === tz;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: savingTz,
								onClick: () => void saveTz(tz),
								className: cn("flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-surface2", i > 0 && "border-t border-line/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(active && "font-semibold text-yellow"),
									children: tz
								}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-yellow" }) : null]
							}, tz);
						})
					})]
				}),
				panel === "name" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.displayName"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => void saveName(e),
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: savingName,
							className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60",
							children: [savingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, t("common.save")]
						})]
					})
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
								className: "h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: t("settings.newPassword"),
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								className: "h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: t("settings.newPasswordAgain"),
								value: newPassword2,
								onChange: (e) => setNewPassword2(e.target.value),
								className: "h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: savingPw,
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60",
								children: [savingPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, t("common.save")]
							})
						]
					})
				}),
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
									toast.success(t("common.saved"));
									setPanel("menu");
								},
								className: cn("flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-surface2", i > 0 && "border-t border-line/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(active && "font-semibold text-yellow"),
									children: l.native
								}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-yellow" }) : null]
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
									toast.success(t("common.saved"));
									setPanel("menu");
								});
							},
							className: cn("flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left", unitSystem === k ? "bg-yellow/10 shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]" : "bg-surface2/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: lab
							}), unitSystem === k ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "ml-auto size-4 text-yellow" }) : null]
						}, k))
					})
				}),
				panel === "delete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubPanel, {
					title: t("settings.deleteAccount"),
					onBack: () => setPanel("menu"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-2xl border border-red/30 bg-red/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								children: t("settings.deleteWarn")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted",
									children: t("settings.deleteConfirmWord")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: deleteWord,
									onChange: (e) => setDeleteWord(e.target.value),
									className: "h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
									placeholder: "DELETE",
									autoComplete: "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: deleting || deleteWord !== "DELETE",
								onClick: () => void doDeleteAccount(),
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red font-semibold text-white disabled:opacity-50",
								children: [deleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), t("settings.deleteAccount")]
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
		className: "mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted",
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
		className: cn("flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-surface2", !last && "border-b border-line/60"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 place-items-center rounded-lg bg-surface2 text-yellow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-medium",
					children: label
				}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block truncate text-xs text-muted",
					children: value
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-dim" })
		]
	});
}
function SubPanel({ title, onBack, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onBack,
			className: "flex items-center gap-1 text-sm font-medium text-yellow",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), title]
		}), children]
	});
}
function compressImage(file, maxSize, quality) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(url);
			const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
			const w = Math.max(1, Math.round(img.width * scale));
			const h = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(/* @__PURE__ */ new Error("canvas"));
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			resolve(canvas.toDataURL("image/jpeg", quality));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("image"));
		};
		img.src = url;
	});
}
//#endregion
export { SettingsPage as component };

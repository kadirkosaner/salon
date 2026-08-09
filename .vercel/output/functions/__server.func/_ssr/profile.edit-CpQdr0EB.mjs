import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as isValidUsername, r as normalizeUsername } from "./username-Bdxea3be.mjs";
import { a as getMyProfileHub, c as updateMyProfile } from "./social-BjKrIrtg.mjs";
import { J as ChevronLeft, R as Eye } from "../_libs/lucide-react.mjs";
import { u as useI18n } from "./provider-DKU9A7zf.mjs";
import { n as cn } from "./utils-DKNImH2A.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { a as ftInFromCm, o as heightCmFromFtIn } from "./units-CBFS2Xa_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as authClient } from "./client-Bm2YFrbd.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.edit-CpQdr0EB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditProfilePage() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const navigate = useNavigate();
	const [hub, setHub] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [visibility, setVisibility] = (0, import_react.useState)("public");
	const [measuresPublic, setMeasuresPublic] = (0, import_react.useState)(false);
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [sex, setSex] = (0, import_react.useState)("unspecified");
	const [heightCm, setHeightCm] = (0, import_react.useState)("");
	const [heightFt, setHeightFt] = (0, import_react.useState)("");
	const [heightIn, setHeightIn] = (0, import_react.useState)("");
	const [unitSystem, setUnitSystem] = (0, import_react.useState)("metric");
	const [detailsPublic, setDetailsPublic] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		if (user.displayName) setName(user.displayName);
		getMyProfileHub().then((h) => {
			setHub(h);
			setUsername(h.username);
			setBio(h.bio ?? "");
			setVisibility(h.visibility);
			setMeasuresPublic(h.measures_public);
			setBirthDate(h.birth_date ?? "");
			setSex(h.sex || "unspecified");
			const us = h.unit_system === "imperial" ? "imperial" : "metric";
			setUnitSystem(us);
			if (h.height_cm != null) {
				setHeightCm(String(h.height_cm));
				const fi = ftInFromCm(h.height_cm);
				setHeightFt(String(fi.ft));
				setHeightIn(String(fi.inch));
			} else {
				setHeightCm("");
				setHeightFt("");
				setHeightIn("");
			}
			setDetailsPublic(h.details_public === true);
		}).catch(() => toast.error(t("common.error")));
	}, [
		user?.id,
		user?.displayName,
		t
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const initials = (name || user.displayName || "S").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
	const avatarSrc = hub?.image || user.profileImageUrl;
	function fieldClass(key) {
		return cn("h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]", errors[key] && "shadow-[inset_0_0_0_1.5px_var(--color-danger)]");
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
			setSaving(true);
			const h = await updateMyProfile({ data: { avatar_url: dataUrl } });
			setHub(h);
			toast.success(t("common.saved"));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("common.error"));
		} finally {
			setSaving(false);
		}
	}
	async function save(e) {
		e.preventDefault();
		if (!user) return;
		const currentUser = user;
		const next = {};
		const n = name.trim();
		if (n.length > 0 && n.length < 2) next.name = t("auth.nameMin");
		const u = normalizeUsername(username);
		if (!isValidUsername(u)) next.username = t("profile.usernameInvalid");
		let heightNum = void 0;
		if (unitSystem === "imperial") if (heightFt.trim() === "" && heightIn.trim() === "") heightNum = null;
		else {
			const ft = Number(heightFt.replace(",", ".") || "0");
			const inch = Number(heightIn.replace(",", ".") || "0");
			if (Number.isNaN(ft) || Number.isNaN(inch) || ft < 0 || ft > 8 || inch < 0 || inch >= 12) next.height_cm = t("profile.height");
			else {
				const cm = heightCmFromFtIn(ft, inch);
				if (cm < 80 || cm > 250) next.height_cm = t("profile.height");
				else heightNum = cm;
			}
		}
		else if (heightCm.trim() === "") heightNum = null;
		else {
			const parsed = Number(heightCm.replace(",", "."));
			if (Number.isNaN(parsed) || parsed < 80 || parsed > 250) next.height_cm = t("profile.height");
			else heightNum = parsed;
		}
		if (birthDate.trim()) {
			const d = /* @__PURE__ */ new Date(birthDate + "T12:00:00");
			const age = (Date.now() - d.getTime()) / 315576e5;
			if (Number.isNaN(d.getTime()) || age < 13 || age > 120) next.birth_date = t("profile.birthDate");
		}
		setErrors(next);
		if (Object.keys(next).length > 0) {
			requestAnimationFrame(() => {
				const el = document.querySelector("[data-field-error]");
				el?.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
				el?.querySelector("input,textarea")?.focus();
			});
			return;
		}
		setSaving(true);
		try {
			if (n.length >= 2 && n !== currentUser.displayName) {
				const { error } = await authClient.updateUser({ name: n });
				if (error) {
					setErrors({ name: error.message || t("common.error") });
					setSaving(false);
					return;
				}
				await authClient.getSession();
			}
			await updateMyProfile({ data: {
				username: u,
				visibility,
				measures_public: measuresPublic,
				details_public: detailsPublic,
				sex,
				bio: bio.trim() || null,
				birth_date: birthDate.trim() || null,
				height_cm: heightNum === void 0 ? null : heightNum
			} });
			toast.success(t("common.saved"));
			navigate({ to: "/profile" });
		} catch (err) {
			const msg = err instanceof Error ? err.message : t("common.error");
			if (/username|taken|reserved/i.test(msg)) setErrors({ username: msg });
			else if (/birth|age|date/i.test(msg)) setErrors({ birth_date: msg });
			else if (/height/i.test(msg)) setErrors({ height_cm: msg });
			else toast.error(msg);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("profile.editProfile"),
		subtitle: hub ? `@${hub.username}` : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void navigate({ to: "/profile" }),
				className: "inline-flex h-10 items-center gap-1 text-sm font-medium text-text-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), t("common.back")]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => void save(e),
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-16 place-items-center overflow-hidden rounded-2xl bg-accent/15 font-display text-xl text-accent",
						children: avatarSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: avatarSrc,
							alt: "",
							className: "size-full object-cover"
						}) : initials
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "cursor-pointer text-sm font-semibold text-accent",
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
					"data-field-error": errors.name ? "" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-text-2",
							children: t("settings.displayName")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => {
								setName(e.target.value);
								setErrors((er) => ({
									...er,
									name: void 0
								}));
							},
							className: fieldClass("name")
						}),
						errors.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: errors.name
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					"data-field-error": errors.username ? "" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-text-2",
							children: t("profile.username")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: username,
							onChange: (e) => {
								setUsername(e.target.value.toLowerCase());
								setErrors((er) => ({
									...er,
									username: void 0
								}));
							},
							maxLength: 20,
							autoCapitalize: "none",
							autoCorrect: "off",
							className: fieldClass("username")
						}),
						errors.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: errors.username
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-medium text-text-2",
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
						className: "w-full resize-none rounded-xl bg-raised px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
						className: "flex items-center gap-1.5 text-xs font-medium text-text-2",
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
						className: cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3", visibility === k ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised/50"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "vis",
							checked: visibility === k,
							onChange: () => setVisibility(k),
							className: "accent-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: lab
						})]
					}, k))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					"data-field-error": errors.birth_date ? "" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-text-2",
							children: t("profile.birthDate")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: birthDate,
							onChange: (e) => {
								setBirthDate(e.target.value);
								setErrors((er) => ({
									...er,
									birth_date: void 0
								}));
							},
							max: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() - 13)).toISOString().slice(0, 10),
							min: "1905-01-01",
							className: fieldClass("birth_date")
						}),
						errors.birth_date ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: errors.birth_date
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-xs font-medium text-text-2",
						children: t("profile.sexLabel")
					}), [
						["unspecified", t("profile.sex.unspecified")],
						["female", t("profile.sex.female")],
						["male", t("profile.sex.male")]
					].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3", sex === k ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised/50"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "sex",
							checked: sex === k,
							onChange: () => setSex(k),
							className: "accent-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: lab
						})]
					}, k))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					"data-field-error": errors.height_cm ? "" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-medium text-text-2",
							children: [
								t("profile.height"),
								" ",
								unitSystem === "imperial" ? "(ft / in)" : "(cm)"
							]
						}),
						unitSystem === "imperial" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								min: 0,
								max: 8,
								step: 1,
								value: heightFt,
								onChange: (e) => {
									setHeightFt(e.target.value);
									setErrors((er) => ({
										...er,
										height_cm: void 0
									}));
								},
								placeholder: "5",
								className: fieldClass("height_cm"),
								"aria-label": "ft"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "decimal",
								min: 0,
								max: 11,
								step: .5,
								value: heightIn,
								onChange: (e) => {
									setHeightIn(e.target.value);
									setErrors((er) => ({
										...er,
										height_cm: void 0
									}));
								},
								placeholder: "10",
								className: fieldClass("height_cm"),
								"aria-label": "in"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							inputMode: "decimal",
							min: 80,
							max: 250,
							step: .5,
							value: heightCm,
							onChange: (e) => {
								setHeightCm(e.target.value);
								setErrors((er) => ({
									...er,
									height_cm: void 0
								}));
							},
							placeholder: "170",
							className: fieldClass("height_cm")
						}),
						errors.height_cm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: errors.height_cm
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3 rounded-xl bg-raised/50 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: t("profile.detailsPublic")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: detailsPublic,
						onChange: (e) => setDetailsPublic(e.target.checked),
						className: "size-5 accent-primary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3 rounded-xl bg-raised/50 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: t("profile.measuresPublic")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: measuresPublic,
						onChange: (e) => setMeasuresPublic(e.target.checked),
						className: "size-5 accent-primary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: saving,
					className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary disabled:opacity-60",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("common.save")]
				})
			]
		})]
	});
}
async function compressImage(file, maxSide, quality) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
	const w = Math.round(bitmap.width * scale);
	const h = Math.round(bitmap.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", quality);
}
//#endregion
export { EditProfilePage as component };

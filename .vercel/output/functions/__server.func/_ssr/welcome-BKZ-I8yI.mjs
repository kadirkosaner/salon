import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { J as ChevronLeft, Q as ChartColumn, b as Scale, f as Sparkles, r as Users, st as Activity } from "../_libs/lucide-react.mjs";
import { d as useT, o as LOCALES, u as useI18n } from "./provider-DKU9A7zf.mjs";
import { l as todayISO, n as cn } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { i as updateSettings } from "./settings-CQ5QIRDw.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as cloneProgram } from "./share-C5nb_MX_.mjs";
import { i as StartProgramModal, r as ProgramRow, t as DetailModal } from "./discover-panel-CzxIeZnR.mjs";
import { a as saveOnboardingAppearance, n as getOnboardingPrograms, o as saveOnboardingWeight, r as getOnboardingStatus, t as completeOnboarding } from "./onboarding-CAcJWai0.mjs";
import { a as useTheme, i as accentsFor, t as DEFAULT_ACCENT } from "./provider-O8lqr3I3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/welcome-BKZ-I8yI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LS_WELCOME = "salon.onboarding.welcomeSeen";
var LS_APPEAR = "salon.onboarding.appearanceDone";
function OnboardingPage() {
	const { user, isPending } = useCurrentUserState();
	const t = useT();
	const { locale, setLocale } = useI18n();
	const qc = useQueryClient();
	const { theme, accent, setThemeAndAccent } = useTheme();
	const exitingRef = (0, import_react.useRef)(false);
	const statusQ = useQuery({
		queryKey: [
			"onboarding",
			"status",
			user?.id
		],
		queryFn: () => getOnboardingStatus(),
		enabled: !!user?.id
	});
	const status = statusQ.data;
	if (!isPending && user && status?.onboarded && !exitingRef.current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[100dvh] place-items-center bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-6 text-accent" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if ((statusQ.isLoading || !status) && !exitingRef.current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[100dvh] place-items-center bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-6 text-accent" })
	});
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[100dvh] place-items-center bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-6 text-accent" })
	});
	async function finish(dest) {
		exitingRef.current = true;
		await completeOnboarding();
		await qc.invalidateQueries({ queryKey: ["onboarding"] });
		if (dest === "workout") window.location.assign(`/workout?date=${todayISO()}`);
		else if (dest === "discover") window.location.assign("/discover");
		else window.location.assign("/");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingFlow, {
		status,
		locale,
		setLocale,
		theme,
		accent,
		setThemeAndAccent,
		t,
		onDone: (dest) => finish(dest),
		onSkip: () => finish("home"),
		refreshStatus: () => void qc.invalidateQueries({ queryKey: ["onboarding", "status"] })
	}, user.id);
}
/** Remaining steps from saved progress — computed once when flow mounts. */
function buildSteps(status) {
	const welcomeSeen = typeof window !== "undefined" && window.localStorage.getItem(LS_WELCOME) === "1";
	const appearDone = typeof window !== "undefined" && window.localStorage.getItem(LS_APPEAR) === "1";
	const steps = [];
	if (!welcomeSeen && !status.hasWeight) steps.push("welcome");
	if (!status.hasWeight) steps.push("weight");
	if (!appearDone) steps.push("appearance");
	if (!status.hasProgram) steps.push("program");
	steps.push("ready");
	return steps;
}
function OnboardingFlow({ status, locale, setLocale, theme, accent, setThemeAndAccent, t, onDone, onSkip, refreshStatus }) {
	const [steps] = (0, import_react.useState)(() => buildSteps(status));
	const [idx, setIdx] = (0, import_react.useState)(0);
	const step = steps[Math.min(idx, steps.length - 1)] ?? "ready";
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [pickedProgram, setPickedProgram] = (0, import_react.useState)(false);
	const [tz] = (0, import_react.useState)(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
	const [unit, setUnit] = (0, import_react.useState)(status.unitSystem);
	const [weight, setWeight] = (0, import_react.useState)(status.weightKg != null ? String(status.unitSystem === "imperial" ? Math.round(status.weightKg / .453592) : status.weightKg) : "");
	const [weightErr, setWeightErr] = (0, import_react.useState)(null);
	const [localTheme, setLocalTheme] = (0, import_react.useState)(status.theme || theme || "obsidian");
	const [localAccent, setLocalAccent] = (0, import_react.useState)(status.accent || accent || DEFAULT_ACCENT.obsidian);
	const [daysPerWeek, setDaysPerWeek] = (0, import_react.useState)(3);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [cloning, setCloning] = (0, import_react.useState)(false);
	const [langOpen, setLangOpen] = (0, import_react.useState)(false);
	const [skipWarn, setSkipWarn] = (0, import_react.useState)(false);
	const progQ = useQuery({
		queryKey: [
			"onboarding",
			"programs",
			daysPerWeek,
			locale
		],
		queryFn: () => getOnboardingPrograms({ data: {
			daysPerWeek,
			locale
		} }),
		enabled: step === "program"
	});
	(0, import_react.useEffect)(() => {
		if (step !== "appearance") return;
		setThemeAndAccent(localTheme, localAccent);
	}, [
		step,
		localTheme,
		localAccent,
		setThemeAndAccent
	]);
	function goNext() {
		setIdx((i) => Math.min(i + 1, steps.length - 1));
	}
	function goBack() {
		setIdx((i) => Math.max(i - 1, 0));
	}
	async function submitWeight() {
		setWeightErr(null);
		const n = Number(weight);
		if (!Number.isFinite(n)) {
			setWeightErr(t("onboard.weightInvalid"));
			return;
		}
		const kg = unit === "imperial" ? n * .453592 : n;
		if (kg < 20 || kg > 400) {
			setWeightErr(t("onboard.weightRange"));
			return;
		}
		setBusy(true);
		try {
			await saveOnboardingWeight({ data: {
				weightKg: n,
				unitSystem: unit
			} });
			refreshStatus();
			goNext();
		} catch {
			toast.error(t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	async function submitAppearance() {
		setBusy(true);
		try {
			await saveOnboardingAppearance({ data: {
				theme: localTheme,
				accent: localAccent
			} });
			try {
				await updateSettings({ data: {
					theme: localTheme,
					accent: localAccent,
					timeZone: tz
				} });
			} catch {}
			window.localStorage.setItem(LS_APPEAR, "1");
			refreshStatus();
			goNext();
		} catch {
			toast.error(t("common.error"));
		} finally {
			setBusy(false);
		}
	}
	async function runClone(p, opts) {
		setCloning(true);
		setPending(null);
		try {
			await cloneProgram({ data: {
				programId: p.id,
				setActive: true,
				name: p.name,
				startDate: opts.startDate,
				startSourceDayId: opts.startSourceDayId
			} });
			setPickedProgram(true);
			toast.success(t("onboard.programPicked"));
			refreshStatus();
			setIdx(steps.length - 1);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setCloning(false);
		}
	}
	const progress = (idx + 1) / steps.length * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col bg-canvas text-text",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]",
				children: [
					idx > 0 && step !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goBack,
						className: "grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised",
						"aria-label": t("common.back"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 overflow-hidden rounded-full bg-rule",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none",
								style: { width: `${progress}%` }
							})
						})
					}),
					step !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void onSkip(),
						className: "min-h-11 shrink-0 px-2 text-xs font-semibold text-text-3 hover:text-text-2",
						children: t("onboard.skip")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-16" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex min-h-0 flex-1 flex-col px-4 pb-4",
				children: [
					step === "welcome" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeStep, {
						t,
						name: status.displayName,
						onStart: () => {
							window.localStorage.setItem(LS_WELCOME, "1");
							goNext();
						}
					}),
					step === "weight" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightStep, {
						t,
						unit,
						setUnit,
						weight,
						setWeight,
						err: weightErr,
						busy,
						onContinue: () => void submitWeight()
					}),
					step === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearanceStep, {
						t,
						locale,
						tz,
						theme: localTheme,
						accent: localAccent,
						setTheme: (th) => {
							setLocalTheme(th);
							setLocalAccent(DEFAULT_ACCENT[th]);
						},
						setAccent: setLocalAccent,
						onOpenLang: () => setLangOpen(true),
						busy,
						onContinue: () => void submitAppearance()
					}),
					step === "program" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramStep, {
						t,
						daysPerWeek,
						setDaysPerWeek,
						programs: progQ.data ?? [],
						loading: progQ.isLoading,
						cloning,
						onOpen: (id) => setDetailId(id),
						onSkipProgram: () => setSkipWarn(true),
						onBrowseAll: () => {
							onDone("discover");
						}
					}),
					step === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadyStep, {
						t,
						hasProgram: pickedProgram || status.hasProgram,
						busy,
						onGo: async () => {
							setBusy(true);
							try {
								await onDone(pickedProgram || status.hasProgram ? "workout" : "discover");
							} finally {
								setBusy(false);
							}
						}
					})
				]
			}),
			detailId != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailModal, {
				id: detailId,
				busy: cloning,
				onClose: () => setDetailId(null),
				onClone: (name) => {
					setPending({
						kind: "id",
						id: detailId,
						name
					});
					setDetailId(null);
				}
			}) : null,
			pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartProgramModal, {
				pending,
				busy: cloning,
				onCancel: () => setPending(null),
				onConfirm: (opts) => void runClone(pending, opts)
			}) : null,
			langOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
				title: t("settings.language"),
				onClose: () => setLangOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-rule",
					children: LOCALES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("flex min-h-11 w-full items-center px-1 py-3 text-left text-sm", l.id === locale && "font-semibold text-accent"),
						onClick: () => {
							setLocale(l.id);
							setLangOpen(false);
						},
						children: l.native
					}) }, l.id))
				})
			}) : null,
			skipWarn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
				title: t("onboard.noProgramTitle"),
				onClose: () => setSkipWarn(false),
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 flex-1 rounded-xl border border-rule text-sm font-semibold",
						onClick: () => setSkipWarn(false),
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-on-primary",
						onClick: () => {
							setSkipWarn(false);
							setIdx(steps.length - 1);
						},
						children: t("onboard.continueWithout")
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-text-2",
					children: t("onboard.noProgramHint")
				})
			}) : null
		]
	});
}
function WelcomeStep({ t, name, onStart }) {
	const points = [
		{
			icon: Activity,
			text: t("onboard.valueLog")
		},
		{
			icon: ChartColumn,
			text: t("onboard.valueCompare")
		},
		{
			icon: Users,
			text: t("onboard.valueFollow")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col justify-center gap-6 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-text-3",
					children: t("app.name")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-3xl tracking-wide text-text",
					children: name ? t("onboard.welcomeName", { name: name.split(" ")[0] }) : t("onboard.welcome")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-text-2",
					children: t("onboard.welcomeHint")
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-2xl border border-rule bg-sunken px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-xl bg-accent/15 text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: p.text
					})]
				}, p.text))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
			onClick: onStart,
			children: t("onboard.start")
		})]
	});
}
function WeightStep({ t, unit, setUnit, weight, setWeight, err, busy, onContinue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-4 text-2xl tracking-wide",
						children: t("onboard.weightTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm leading-relaxed text-text-2",
						children: t("onboard.weightWhy")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [["metric", "kg"], ["imperial", "lb"]].map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setUnit(id),
						className: cn("inline-flex min-h-11 flex-1 items-center justify-center rounded-full border text-sm font-semibold", unit === id ? "border-accent bg-accent/15 text-accent" : "border-rule bg-raised text-text-2"),
						children: lab
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					inputMode: "decimal",
					value: weight,
					onChange: (e) => setWeight(e.target.value),
					placeholder: unit === "metric" ? "75" : "165",
					autoFocus: true,
					className: cn("num h-14 w-full rounded-2xl border bg-sunken px-4 text-center text-3xl outline-none", err ? "border-danger" : "border-rule focus:border-accent/50")
				}), err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-xs text-danger",
					children: err
				}) : null] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryBtn, {
			disabled: busy || !weight.trim(),
			onClick: onContinue,
			children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("onboard.continue")]
		})]
	});
}
function AppearanceStep({ t, locale, tz, theme, accent, setTheme, setAccent, onOpenLang, busy, onContinue }) {
	const list = accentsFor(theme);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-5 overflow-y-auto pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl tracking-wide",
					children: t("onboard.lookTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-text-2",
					children: t("onboard.lookHint")
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [["obsidian", t("settings.themeObsidian")], ["carbon", t("settings.themeCarbon")]].map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTheme(id),
						className: cn("overflow-hidden rounded-2xl border text-left transition", theme === id ? "border-accent ring-2 ring-accent/30" : "border-rule"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-16 w-full", id === "obsidian" ? "bg-[#12100e]" : "bg-[#0a0a0b]"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-full items-end gap-1 p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-3 w-3 rounded-full",
									style: { background: id === "obsidian" ? "#B9A177" : "#D6FF3F" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 flex-1 rounded-sm bg-white/10" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 py-2.5 text-sm font-semibold",
							children: lab
						})]
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3",
					children: t("settings.accent")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAccent(a.id),
						className: cn("grid size-11 place-items-center rounded-full border-2 transition", accent === a.id ? "border-text" : "border-transparent"),
						"aria-label": a.id,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-8 rounded-full",
							style: { background: a.hex }
						})
					}, a.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenLang,
					className: "flex min-h-11 items-center justify-between rounded-2xl border border-rule bg-sunken px-3 text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-text-2",
						children: [
							locale,
							" · ",
							tz
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-accent",
						children: t("onboard.change")
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryBtn, {
			disabled: busy,
			onClick: onContinue,
			children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("onboard.continue")]
		})]
	});
}
function ProgramStep({ t, daysPerWeek, setDaysPerWeek, programs, loading, cloning, onOpen, onSkipProgram, onBrowseAll }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl tracking-wide",
					children: t("onboard.programTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-text-2",
					children: t("onboard.programHint")
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3",
					children: t("onboard.daysPerWeek")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: [
						2,
						3,
						4,
						5,
						6
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDaysPerWeek(n),
						className: cn("inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold", daysPerWeek === n ? "border-accent bg-accent/15 text-accent" : "border-rule bg-raised text-text-2"),
						children: n
					}, n))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-rule rounded-2xl border border-rule bg-sunken/40",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid place-items-center py-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-5 text-accent" })
					}) : programs.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramRow, {
						rank: i + 1,
						p,
						onOpen: () => onOpen(p.id)
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "py-2 text-center text-sm font-semibold text-accent",
					onClick: onBrowseAll,
					children: t("onboard.seeAll")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: cloning,
			onClick: onSkipProgram,
			className: "mt-2 min-h-11 text-sm font-semibold text-text-3",
			children: t("onboard.continueWithout")
		})]
	});
}
function ReadyStep({ t, hasProgram, busy, onGo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center justify-center gap-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-16 place-items-center rounded-3xl bg-accent/15 text-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-wide",
					children: t("onboard.readyTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xs text-sm leading-relaxed text-text-2",
					children: hasProgram ? t("onboard.readyWithProgram") : t("onboard.readyNoProgram")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryBtn, {
			disabled: busy,
			onClick: onGo,
			children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, hasProgram ? t("onboard.goWorkout") : t("onboard.goDiscover")]
		})]
	});
}
function PrimaryBtn({ children, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		onClick,
		className: "mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.99] disabled:opacity-45",
		style: { marginBottom: "env(safe-area-inset-bottom, 0px)" },
		children
	});
}
//#endregion
export { OnboardingPage as component };

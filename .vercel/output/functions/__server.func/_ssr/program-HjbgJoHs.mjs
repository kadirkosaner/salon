import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, o as optionalString, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { a as LOAD_TAG_KEYS } from "./library-DGJU16Cf.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { $ as CalendarRange, B as Ellipsis, G as ClipboardPaste, K as ChevronUp, L as FileText, U as Copy, X as Check, Y as ChevronDown, _ as Settings2, d as Trash2, f as Sparkles, h as Share2, w as Plus, y as Search, z as Eraser } from "../_libs/lucide-react.mjs";
import { u as useI18n } from "./provider-DKU9A7zf.mjs";
import { i as dowShort, n as cn, r as dowLong } from "./utils-DKNImH2A.mjs";
import { t as AppSheet } from "./sheet-DfDNd6FJ.mjs";
import { t as Spinner } from "./spinner-B1asoD94.mjs";
import { n as clearFutureWorkouts } from "./workouts-Co7BI8CT.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-TqsTIwHi.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { n as AuthGateSkeleton, t as AppShell } from "./app-shell-ExWuGkm2.mjs";
import { i as ProgramCardSkeleton, o as btnClass } from "./skeleton-BoolYdvP.mjs";
import { t as MuscleBadge } from "./muscle-badge-DLOYrmnK.mjs";
import { a as createExercise, c as similarExercises, i as adoptDatasetExercise, o as listExercises, r as LoadTagBadge, s as searchExerciseCatalog, t as ExercisePreviewButton } from "./load-tag-CQtjTEUB.mjs";
import { a as publishProgram, o as updateProgramMeta, t as abandonProgram } from "./share-C5nb_MX_.mjs";
import { t as copyText } from "./clipboard-BqSPespR.mjs";
import { addProgramDay, addProgramExercise, createProgram, deleteProgramExercise, getActiveProgram, reorderProgramExercises, setWeekSchedule, updateProgramDay, updateProgramExercise } from "./programs-DiVqw6bh.mjs";
import { a as SelectItemIndicator, c as SelectTrigger, i as SelectItem, l as SelectValue, n as SelectContent, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program-HjbgJoHs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var previewProgramImport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(string().trim().min(1).max(5e4))).handler(createSsrRpc("f62c3ba0958cf27510d34f1a7b9998449d848f0e1635234b0ab0e160e8d4f6ed"));
var commitProgramImport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	text: string().trim().min(1).max(5e4),
	programName: optionalString(80),
	replaceActive: boolean().optional()
}))).handler(createSsrRpc("9a29518f49ca58d9919460754df5908d104fc228da7231db87004d6a5c531e28"));
/**
* Dark-theme select (Radix). Replaces native <select> which opens a white OS list.
* Item values must be non-empty strings (use a sentinel like "__none__" for empty).
*/
function AppSelect({ value, onValueChange, options, placeholder, className, triggerClassName, disabled, "aria-label": ariaLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value,
		onValueChange,
		disabled,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
			"aria-label": ariaLabel,
			className: cn("flex h-12 w-full items-center justify-between gap-2 rounded-md border border-edge bg-raised px-3 text-left text-sm text-text", "outline-none transition active:scale-[0.99]", "data-[placeholder]:text-text-2", "disabled:cursor-not-allowed disabled:opacity-50", triggerClassName, className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-text-2" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
			position: "popper",
			sideOffset: 6,
			className: cn("z-[80] max-h-72 overflow-hidden rounded-xl border border-rule bg-raised", "shadow-[0_12px_40px_rgba(0,0,0,0.55)]", "data-[state=open]:animate-in data-[state=closed]:animate-out", "w-[var(--radix-select-trigger-width)]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
				className: "p-1",
				children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: opt.value,
					className: cn("relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-8 pr-3 text-sm text-text outline-none", "data-[highlighted]:bg-accent/15 data-[highlighted]:text-accent", "data-[disabled]:pointer-events-none data-[disabled]:opacity-40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-2.5 flex size-3.5 items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-accent" }) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children: opt.label })]
				}, opt.value))
			})
		}) })]
	});
}
var SAMPLE_PASTE = `Personal Program
Push / Pull / Legs

Monday - PUSH A
1. Bench Press 4x6-8
2. Overhead Press 3x8-10
3. Lateral Raise 3x12-15

Tuesday - PULL A
1. Deadlift 3x5
2. Lat Pulldown 4x8-10
3. Face Pull 3x15

Wednesday - LEGS
1. Squat 4x6-8
2. Romanian Deadlift 3x8-10
3. Leg Curl 3x10-12
`;
function ShareModal({ program, onClose, onSaved }) {
	const { t } = useI18n();
	const [isPublic, setIsPublic] = (0, import_react.useState)(program.is_public);
	const [description, setDescription] = (0, import_react.useState)(program.description ?? "");
	const [tags, setTags] = (0, import_react.useState)(program.tags ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)(program.share_code);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: t("program.shareTitle"),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs leading-relaxed text-text-2",
				children: t("program.shareHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-3 rounded-lg border border-rule bg-raised px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: isPublic,
					onChange: (e) => setIsPublic(e.target.checked),
					className: "size-5 accent-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: t("program.public")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-text-2",
						children: t("program.publicHint")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: t("program.shareDesc")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 3,
					placeholder: t("program.shareDescPh"),
					className: "w-full rounded-md border border-rule bg-raised px-3 py-2 text-sm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: t("program.tags")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: tags,
					onChange: (e) => setTags(e.target.value),
					placeholder: t("program.tagsPh"),
					className: "h-11 w-full rounded-md border border-rule bg-raised px-3 text-sm"
				})]
			}),
			(code || isPublic) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-text-2",
					children: t("program.shareCode")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "num text-2xl tracking-[0.2em] text-accent",
						children: code ?? t("program.codePending")
					}), code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-10 shrink-0 items-center gap-1 rounded-lg border border-accent/40 px-3 text-xs font-semibold text-accent",
						onClick: async () => {
							const ok = await copyText(code);
							toast.success(ok ? t("program.copiedCode", { code }) : t("program.codeLabel", { code }));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Kopyala"]
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: saving,
				className: "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60",
				onClick: () => {
					setSaving(true);
					publishProgram({ data: {
						id: program.id,
						is_public: isPublic,
						description: description.trim() || null,
						tags: tags.trim() || null
					} }).then(async (r) => {
						setCode(r.share_code);
						toast.success(r.is_public ? t("program.shareOn", { code: r.share_code ?? "" }) : t("program.nowPrivate"));
						await onSaved();
					}).catch((e) => toast.error(e instanceof Error ? e.message : t("common.error"))).finally(() => setSaving(false));
				},
				children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), t("common.save")]
			})
		]
	});
}
function MetaModal({ program, onClose, onSaved }) {
	const { t } = useI18n();
	const [name, setName] = (0, import_react.useState)(program.name);
	const [description, setDescription] = (0, import_react.useState)(program.description ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: t("program.metaTitle"),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: t("program.nameLabel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "h-12 w-full rounded-md border border-rule bg-raised px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: t("program.descLabel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 4,
					placeholder: "Hedef, seviye, notlar…",
					className: "w-full rounded-md border border-rule bg-raised px-3 py-2 text-sm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: saving || !name.trim(),
				className: "mt-4 flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary disabled:opacity-50",
				onClick: () => {
					setSaving(true);
					updateProgramMeta({ data: {
						id: program.id,
						name: name.trim(),
						description: description.trim() || null
					} }).then(() => {
						toast.success(t("common.saved"));
						return onSaved();
					}).catch((e) => toast.error(e instanceof Error ? e.message : t("common.error"))).finally(() => setSaving(false));
				},
				children: t("common.save")
			})
		]
	});
}
function ScheduleModal({ program, onClose, onSaved }) {
	const { t, locale } = useI18n();
	const [slots, setSlots] = (0, import_react.useState)(() => {
		const init = {
			1: null,
			2: null,
			3: null,
			4: null,
			5: null,
			6: null,
			7: null
		};
		for (const d of program.days) if (d.dow >= 1 && d.dow <= 7) init[d.dow] = d.id;
		return init;
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	function setSlot(dow, dayId) {
		setSlots((prev) => {
			const next = { ...prev };
			if (dayId != null) for (const k of Object.keys(next)) {
				const n = Number(k);
				if (next[n] === dayId) next[n] = null;
			}
			next[dow] = dayId;
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: t("program.scheduleTitle"),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs leading-relaxed text-text-2",
				children: t("program.scheduleHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: [
					1,
					2,
					3,
					4,
					5,
					6,
					7
				].map((dow) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 items-center gap-2 rounded-lg border border-rule bg-raised px-2.5 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-20 shrink-0 text-sm font-medium text-text-2 sm:w-24",
						children: dowLong(dow, locale)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSelect, {
						value: slots[dow] != null ? String(slots[dow]) : "__none__",
						onValueChange: (v) => setSlot(dow, v === "__none__" ? null : Number(v)),
						options: [{
							value: "__none__",
							label: "Dinlenme"
						}, ...program.days.map((d) => ({
							value: String(d.id),
							label: d.name
						}))],
						triggerClassName: "h-11 min-w-0 flex-1 rounded-md border-rule bg-sunken",
						"aria-label": dowLong(dow, locale)
					})]
				}, dow))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: saving,
				className: "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60",
				onClick: () => {
					setSaving(true);
					setWeekSchedule({ data: {
						programId: program.id,
						schedule: [
							1,
							2,
							3,
							4,
							5,
							6,
							7
						].map((dow) => ({
							dow,
							programDayId: slots[dow] ?? null
						}))
					} }).then(() => onSaved()).catch((e) => toast.error(e instanceof Error ? e.message : t("common.error"))).finally(() => setSaving(false));
				},
				children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("common.save")]
			})
		]
	});
}
function DaySettingsModal({ day, onClose, onSave }) {
	const { t, locale } = useI18n();
	const [name, setName] = (0, import_react.useState)(day.name);
	const [focus, setFocus] = (0, import_react.useState)(day.focus ?? "");
	const [dow, setDow] = (0, import_react.useState)(day.dow);
	const [saving, setSaving] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: t("program.daySettings"),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: t("program.nameLabel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "h-12 w-full rounded-md border border-rule bg-raised px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: "Odak / not"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: focus,
					onChange: (e) => setFocus(e.target.value),
					className: "h-12 w-full rounded-md border border-rule bg-raised px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-2",
					children: t("program.whichDow")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSelect, {
					value: String(dow),
					onValueChange: (v) => setDow(Number(v)),
					options: [
						1,
						2,
						3,
						4,
						5,
						6,
						7
					].map((d) => ({
						value: String(d),
						label: dowLong(d, locale)
					})),
					"aria-label": t("program.whichDow")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: saving || name.trim().length < 1,
				className: "mt-4 flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary disabled:opacity-50",
				onClick: () => {
					setSaving(true);
					onSave({
						name: name.trim(),
						focus: focus.trim() || null,
						dow
					}).finally(() => setSaving(false));
				},
				children: t("common.save")
			})
		]
	});
}
function ImportModal({ onClose, onImported }) {
	const { t } = useI18n();
	const [text, setText] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [programName, setProgramName] = (0, import_react.useState)("");
	async function runPreview() {
		if (text.trim().length < 10) {
			toast.error(t("program.importMoreText"));
			return;
		}
		setBusy(true);
		try {
			const p = await previewProgramImport({ data: text });
			setPreview(p);
			setProgramName(p.programName);
			if (p.days.length === 0) toast.error(t("program.importNoExercises"));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("program.importPreviewFailed"));
		} finally {
			setBusy(false);
		}
	}
	async function commit() {
		setBusy(true);
		try {
			const r = await commitProgramImport({ data: {
				text,
				programName: programName || void 0,
				replaceActive: true
			} });
			toast.success(t("program.importSuccess", {
				name: r.name,
				days: r.days,
				exercises: r.exercises
			}));
			await onImported();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("program.importFailed"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Metinden program",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: text,
				onChange: (e) => {
					setText(e.target.value);
					setPreview(null);
				},
				rows: 8,
				placeholder: SAMPLE_PASTE,
				className: "w-full rounded-md border border-rule bg-raised px-3 py-2 font-mono text-xs leading-relaxed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-10 flex-1 rounded-md border border-rule text-xs text-text-2",
					onClick: () => {
						setText(SAMPLE_PASTE);
						setPreview(null);
					},
					children: t("program.importExample")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					className: "flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-accent/30 bg-raised text-sm font-medium text-accent",
					onClick: () => void runPreview(),
					children: t("program.importPreview")
				})]
			}),
			preview && preview.days.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3 border-t border-rule pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: programName,
					onChange: (e) => setProgramName(e.target.value),
					className: "h-11 w-full rounded-md border border-rule bg-raised px-3 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void commit(),
					className: "flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary",
					children: t("program.importCreate")
				})]
			})
		]
	});
}
function EditModal({ exercise, onClose, onSave, library = [] }) {
	const { t } = useI18n();
	const [sets, setSets] = (0, import_react.useState)(exercise.sets);
	const [repLo, setRepLo] = (0, import_react.useState)(exercise.rep_lo);
	const [repHi, setRepHi] = (0, import_react.useState)(exercise.rep_hi);
	const [rest, setRest] = (0, import_react.useState)(exercise.rest_sec);
	const [tag, setTag] = (0, import_react.useState)(exercise.load_tag);
	const [note, setNote] = (0, import_react.useState)(exercise.note ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [swapId, setSwapId] = (0, import_react.useState)(null);
	const [swapExt, setSwapExt] = (0, import_react.useState)(null);
	const [swapName, setSwapName] = (0, import_react.useState)(null);
	const [similar, setSimilar] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [muscleFilter, setMuscleFilter] = (0, import_react.useState)("all");
	const [catalog, setCatalog] = (0, import_react.useState)(library);
	const [loadingCat, setLoadingCat] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		similarExercises({ data: {
			exerciseId: exercise.exercise_id,
			excludeIds: [exercise.exercise_id]
		} }).then((rows) => {
			if (!cancelled) setSimilar(rows);
		});
		return () => {
			cancelled = true;
		};
	}, [exercise.exercise_id]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoadingCat(true);
		const t = window.setTimeout(() => {
			searchExerciseCatalog({ data: {
				q,
				muscleGroup: muscleFilter === "all" ? void 0 : muscleFilter
			} }).then((rows) => {
				if (!cancelled) setCatalog(rows);
			}).finally(() => {
				if (!cancelled) setLoadingCat(false);
			});
		}, 180);
		return () => {
			cancelled = true;
			window.clearTimeout(t);
		};
	}, [q, muscleFilter]);
	function pickSwap(e) {
		if (e.id > 0) {
			setSwapId(e.id);
			setSwapExt(null);
		} else {
			setSwapId(null);
			setSwapExt(e.external_id ?? null);
		}
		setSwapName(e.name);
	}
	const muscleTabs = [
		{
			id: "all",
			label: t("muscle.all")
		},
		{
			id: "gogus",
			label: t("muscle.gogus")
		},
		{
			id: "sirt",
			label: t("muscle.sirt")
		},
		{
			id: "omuz",
			label: t("muscle.omuz")
		},
		{
			id: "kol",
			label: t("muscle.kol")
		},
		{
			id: "bacak",
			label: t("muscle.bacak")
		},
		{
			id: "trapez",
			label: t("muscle.trapez")
		},
		{
			id: "core",
			label: t("muscle.core")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: swapName ?? exercise.exercise_name,
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewButton, {
					name: swapName ?? exercise.exercise_name,
					formCues: swapId || swapExt ? null : exercise.form_cues
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, { group: exercise.muscle_group })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-lg border border-rule bg-raised/40 p-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3",
						children: t("program.swapTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: t("program.searchPh"),
						className: "mb-2 h-10 w-full rounded-md border border-rule bg-sunken px-3 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex gap-1.5 overflow-x-auto pb-0.5",
						children: muscleTabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMuscleFilter(tab.id),
							className: cn("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium", muscleFilter === tab.id ? "border-accent bg-accent/15 text-accent" : "border-rule text-text-2"),
							children: tab.label
						}, tab.id))
					}),
					loadingCat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-4 text-center text-xs text-text-2",
						children: t("program.loading")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "max-h-44 space-y-1 overflow-y-auto",
						children: [catalog.filter((e) => e.id !== exercise.exercise_id).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => pickSwap(e),
							className: cn("flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-left text-sm", swapId === e.id && e.id > 0 || swapExt && swapExt === e.external_id ? "border-accent bg-accent/15 text-accent" : "border-transparent bg-sunken hover:border-rule"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate",
								children: e.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
									group: e.muscle_group,
									size: "xs"
								}), e.gif_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-text-3",
									children: "GIF"
								}) : null]
							})]
						}) }, `${e.id}-${e.external_id ?? e.name}`)), catalog.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-3 text-center text-xs text-text-2",
							children: t("program.noResults")
						})]
					})
				]
			}),
			similar.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-lg border border-rule/80 bg-raised/20 p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3",
					children: t("program.sameRegion")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setSwapId(null);
							setSwapExt(null);
							setSwapName(null);
						},
						className: cn("rounded-full border px-2.5 py-1 text-xs", !swapId && !swapExt ? "border-accent bg-accent/15 text-accent" : "border-rule text-text-2 hover:text-text"),
						children: exercise.exercise_name
					}), similar.slice(0, 12).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => pickSwap(s),
						className: cn("rounded-full border px-2.5 py-1 text-xs", swapId === s.id && s.id > 0 || swapExt && swapExt === s.external_id ? "border-accent bg-accent/15 text-accent" : "border-rule text-text-2 hover:text-text"),
						children: s.name
					}, `${s.id}-${s.external_id ?? s.name}`))]
				})]
			}),
			swapName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs text-accent",
				children: t("program.swapPending", { name: swapName })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Set",
						value: sets,
						onChange: setSets
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Dinlenme (sn)",
						value: rest,
						onChange: setRest
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Tekrar min",
						value: repLo,
						onChange: setRepLo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "Tekrar max",
						value: repHi,
						onChange: setRepHi
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSelect, {
				value: tag,
				onValueChange: setTag,
				options: Object.keys(LOAD_TAG_KEYS).map((k) => ({
					value: k,
					label: t(LOAD_TAG_KEYS[k])
				})),
				className: "mt-3",
				"aria-label": t("program.load")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: note,
				onChange: (e) => setNote(e.target.value),
				rows: 3,
				className: "mt-3 w-full rounded-md border border-rule bg-raised px-3 py-2 text-sm",
				placeholder: t("program.noteOptional")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: saving,
				className: "mt-4 flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary",
				onClick: () => {
					setSaving(true);
					(async () => {
						let exerciseId = swapId ?? void 0;
						if (swapExt) exerciseId = (await adoptDatasetExercise({ data: { externalId: swapExt } })).id;
						await onSave({
							exerciseId,
							sets,
							rep_lo: repLo,
							rep_hi: repHi,
							rest_sec: rest,
							load_tag: tag,
							note: note.trim() || null
						});
					})().finally(() => setSaving(false));
				},
				children: t("common.save")
			})
		]
	});
}
function AddModal({ library: _library, onClose, onAdd, onCreateExercise }) {
	const { t } = useI18n();
	const [q, setQ] = (0, import_react.useState)("");
	const [muscleFilter, setMuscleFilter] = (0, import_react.useState)("all");
	const [catalog, setCatalog] = (0, import_react.useState)([]);
	const [loadingCat, setLoadingCat] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [sets, setSets] = (0, import_react.useState)("");
	const [repLo, setRepLo] = (0, import_react.useState)("");
	const [repHi, setRepHi] = (0, import_react.useState)("");
	const [rest, setRest] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)("orta");
	const [note, setNote] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoadingCat(true);
		const t = window.setTimeout(() => {
			searchExerciseCatalog({ data: {
				q,
				muscleGroup: muscleFilter === "all" ? void 0 : muscleFilter,
				limit: 120
			} }).then((rows) => {
				if (!cancelled) setCatalog(rows);
			}).finally(() => {
				if (!cancelled) setLoadingCat(false);
			});
		}, 160);
		return () => {
			cancelled = true;
			window.clearTimeout(t);
		};
	}, [q, muscleFilter]);
	const muscleTabs = [
		{
			id: "all",
			label: t("muscle.all")
		},
		{
			id: "gogus",
			label: t("muscle.gogus")
		},
		{
			id: "sirt",
			label: t("muscle.sirt")
		},
		{
			id: "omuz",
			label: t("muscle.omuz")
		},
		{
			id: "kol",
			label: t("muscle.kol")
		},
		{
			id: "bacak",
			label: t("muscle.bacak")
		},
		{
			id: "core",
			label: t("muscle.core")
		},
		{
			id: "diger",
			label: t("muscle.diger")
		}
	];
	async function submit() {
		if (!selected) {
			toast.error(t("program.pickExerciseFirst"));
			return;
		}
		const s = typeof sets === "number" ? sets : Number(sets);
		const lo = typeof repLo === "number" ? repLo : Number(repLo);
		const hiRaw = typeof repHi === "number" ? repHi : Number(repHi);
		const r = typeof rest === "number" ? rest : Number(rest);
		if (!Number.isFinite(s) || s < 1) {
			toast.error(t("program.enterSets"));
			return;
		}
		if (!Number.isFinite(lo) || lo < 1) {
			toast.error(t("program.enterReps"));
			return;
		}
		const hi = Number.isFinite(hiRaw) && hiRaw >= lo ? hiRaw : lo;
		if (!Number.isFinite(r) || r < 0) {
			toast.error(t("program.enterRest"));
			return;
		}
		setSaving(true);
		try {
			let exerciseId = selected.id;
			if (exerciseId <= 0 && selected.external_id) exerciseId = (await adoptDatasetExercise({ data: { externalId: selected.external_id } })).id;
			else if (exerciseId <= 0) exerciseId = await onCreateExercise(selected.name);
			await onAdd({
				exerciseId,
				sets: s,
				rep_lo: lo,
				rep_hi: hi,
				rest_sec: r,
				load_tag: tag,
				note: note.trim() || void 0
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: t("program.addExerciseTitle"),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Ara: bench, squat, curl, row…",
				className: "h-12 w-full rounded-2xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
				autoFocus: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-1.5 overflow-x-auto pb-0.5",
				children: muscleTabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMuscleFilter(tab.id),
					className: cn("shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold active:scale-95", muscleFilter === tab.id ? "bg-primary text-on-primary" : "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"),
					children: tab.label
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 max-h-52 overflow-y-auto rounded-2xl bg-raised/40 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
				children: loadingCat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex items-center justify-center gap-2 py-8 text-xs text-text-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 text-sm text-text-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-4 animate-pulse rounded-full bg-raised" }), t("program.loading")]
					})
				}) : catalog.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-text-2",
						children: t("discover.noResults")
					}), q.trim().length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 text-sm font-semibold text-accent",
						onClick: () => {
							onCreateExercise(q.trim()).then((id) => setSelected({
								id,
								owner_id: null,
								name: q.trim(),
								detail: null,
								unit: "kg",
								muscle_group: "diger",
								default_note: null
							}));
						},
						children: t("program.createCustom", { q: q.trim() })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: catalog.map((e) => {
						const active = selected && (e.id > 0 && selected.id === e.id || !!e.external_id && e.external_id === selected.external_id || e.id <= 0 && selected.id <= 0 && e.name === selected.name);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelected(e),
							className: cn("flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2.5 text-left text-sm active:scale-[0.99]", active ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-sunken hover:bg-raised"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate font-medium",
								children: e.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
									group: e.muscle_group,
									size: "xs"
								}), e.gif_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-text-3",
									children: "GIF"
								}) : null]
							})]
						}) }, `${e.id}-${e.external_id ?? e.name}`);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[10px] text-text-3",
				children: t("program.resultCount", { n: catalog.length })
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewButton, {
					name: selected.name,
					muscleGroup: selected.muscle_group
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-xs text-accent",
					children: selected.name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-text-2",
				children: t("program.setsEmptyHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNumField, {
						label: "Set *",
						value: sets,
						placeholder: t("program.exSetsPh"),
						onChange: setSets
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNumField, {
						label: "Dinlenme sn *",
						value: rest,
						placeholder: t("program.exRestPh"),
						onChange: setRest
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNumField, {
						label: "Tekrar min *",
						value: repLo,
						placeholder: t("program.exRepLoPh"),
						onChange: (v) => {
							setRepLo(v);
							if (typeof v === "number" && (repHi === "" || typeof repHi === "number" && repHi < v)) setRepHi(v);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNumField, {
						label: "Tekrar max",
						value: repHi,
						placeholder: t("program.exRepHiPh"),
						onChange: setRepHi
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSelect, {
				value: tag,
				onValueChange: setTag,
				options: Object.keys(LOAD_TAG_KEYS).map((k) => ({
					value: k,
					label: t(LOAD_TAG_KEYS[k])
				})),
				className: "mt-2",
				triggerClassName: "rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
				"aria-label": t("program.load")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: note,
				onChange: (e) => setNote(e.target.value),
				rows: 2,
				placeholder: t("program.noteOptional"),
				className: "mt-2 w-full rounded-2xl bg-raised px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: !selected || saving,
				className: "mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary shadow-[var(--shadow-primary)] disabled:opacity-50",
				onClick: () => void submit(),
				children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, "Programa ekle"]
			})
		]
	});
}
function Modal({ title, children, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
		title,
		onClose,
		children
	});
}
function NumField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block min-w-0 space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-text-2",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			inputMode: "numeric",
			value: Number.isFinite(value) ? value : "",
			onChange: (e) => onChange(Number(e.target.value) || 0),
			className: "num h-12 w-full min-w-0 rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
		})]
	});
}
/** Empty-by-default numeric field — no auto defaults. */
function EmptyNumField({ label, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block min-w-0 space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-text-2",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			inputMode: "numeric",
			value: value === "" ? "" : value,
			placeholder,
			onChange: (e) => {
				const raw = e.target.value;
				if (raw === "") {
					onChange("");
					return;
				}
				const n = Number(raw);
				onChange(Number.isFinite(n) ? n : "");
			},
			className: "num h-12 w-full min-w-0 rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] placeholder:text-text-3"
		})]
	});
}
function CreateProgramWizard({ onClose, onCreated, hasActiveProgram }) {
	const { t, locale } = useI18n();
	const [step, setStep] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [buildDayIdx, setBuildDayIdx] = (0, import_react.useState)(0);
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const [days, setDays] = (0, import_react.useState)(() => [
		1,
		2,
		3,
		4,
		5,
		6,
		7
	].map((dow) => ({
		dow,
		name: dow === 1 ? "Push" : dow === 2 ? "Pull" : dow === 3 ? "Legs" : dow === 4 ? "Push" : dow === 5 ? "Pull" : dow === 6 ? "Legs" : "Rest / Core",
		focus: "",
		enabled: dow <= 6,
		exercises: []
	})));
	const enabledDays = days.filter((d) => d.enabled);
	const currentDay = enabledDays[buildDayIdx] ?? enabledDays[0];
	function applyTemplate(kind) {
		setDays((prev) => prev.map((d) => {
			if (kind === "blank") return {
				...d,
				enabled: d.dow <= 3,
				name: t("program.dayN", { n: d.dow }),
				focus: "",
				exercises: []
			};
			if (kind === "ppl") {
				const map = {
					1: "Push",
					2: "Pull",
					3: "Legs",
					4: "Push",
					5: "Pull",
					6: "Legs"
				};
				return {
					...d,
					enabled: d.dow <= 6,
					name: map[d.dow] ?? "Rest",
					focus: "",
					exercises: []
				};
			}
			if (kind === "full") {
				const map = {
					1: "Full A",
					3: "Full B",
					5: "Full C"
				};
				return {
					...d,
					enabled: [
						1,
						3,
						5
					].includes(d.dow),
					name: map[d.dow] ?? "Rest",
					focus: "",
					exercises: []
				};
			}
			const map = {
				1: "Upper",
				2: "Lower",
				4: "Upper",
				5: "Lower"
			};
			return {
				...d,
				enabled: [
					1,
					2,
					4,
					5
				].includes(d.dow),
				name: map[d.dow] ?? "Rest",
				focus: "",
				exercises: []
			};
		}));
	}
	function updateEnabledDay(dow, patch) {
		setDays((prev) => prev.map((d) => d.dow === dow ? {
			...d,
			...patch
		} : d));
	}
	function addExToCurrent(ex) {
		if (!currentDay) return;
		updateEnabledDay(currentDay.dow, { exercises: [...currentDay.exercises, ex] });
		setPickerOpen(false);
	}
	function removeEx(dow, key) {
		const day = days.find((d) => d.dow === dow);
		if (!day) return;
		updateEnabledDay(dow, { exercises: day.exercises.filter((e) => e.key !== key) });
	}
	function updateEx(dow, key, patch) {
		const day = days.find((d) => d.dow === dow);
		if (!day) return;
		updateEnabledDay(dow, { exercises: day.exercises.map((e) => e.key === key ? {
			...e,
			...patch
		} : e) });
	}
	const [editingKey, setEditingKey] = (0, import_react.useState)(null);
	async function finish() {
		const n = name.trim();
		if (n.length < 2) {
			toast.error(t("program.nameRequired"));
			setStep(0);
			return;
		}
		if (enabledDays.length === 0) {
			toast.error(t("program.pickOneDay"));
			setStep(1);
			return;
		}
		setBusy(true);
		try {
			const created = await createProgram({ data: {
				name: n,
				description: description.trim() || void 0,
				days: enabledDays.map((d) => ({
					dow: d.dow,
					name: d.name.trim() || dowShort(d.dow, locale),
					focus: d.focus.trim() || void 0
				}))
			} });
			const { getActiveProgram } = await import("./programs-DiVqw6bh.mjs");
			const prog = await getActiveProgram();
			if (!prog || prog.id !== created.id) {
				toast.success(t("program.created"));
				await onCreated();
				return;
			}
			for (const draft of enabledDays) {
				const day = prog.days.find((pd) => pd.dow === draft.dow && pd.name === (draft.name.trim() || dowShort(draft.dow, locale))) ?? prog.days.find((pd) => pd.dow === draft.dow);
				if (!day) continue;
				for (const ex of draft.exercises) {
					let exerciseId = ex.exerciseId ?? 0;
					if (exerciseId <= 0 && ex.externalId) exerciseId = (await adoptDatasetExercise({ data: { externalId: ex.externalId } })).id;
					if (exerciseId <= 0) continue;
					await addProgramExercise({ data: {
						programDayId: day.id,
						exerciseId,
						sets: ex.sets,
						rep_lo: ex.rep_lo,
						rep_hi: ex.rep_hi,
						rest_sec: ex.rest_sec,
						load_tag: ex.load_tag
					} });
				}
			}
			toast.success(t("program.readyWithCount", {
				name: created.name,
				n: enabledDays.reduce((a, d) => a + d.exercises.length, 0)
			}));
			await onCreated();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("program.createFailed"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: step === 0 ? "Yeni program" : step === 1 ? t("program.setupDays") : "Hareketleri ekle",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-1.5",
				children: [
					0,
					1,
					2
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-rule") }, s))
			}),
			step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					hasActiveProgram && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-accent/10 px-3 py-2.5 text-xs leading-relaxed text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]",
						children: t("program.replaceActiveHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-text-2",
							children: t("program.nameLabel")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: t("program.namePh"),
							className: "h-12 w-full rounded-2xl bg-raised px-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
							autoFocus: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-text-2",
							children: t("program.descLabel")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 2,
							className: "w-full rounded-2xl bg-raised px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-text-3",
						children: t("program.quickTemplate")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							["ppl", t("program.tplPpl")],
							["full", "Full body 3"],
							["ul", t("program.templateUpperLower")],
							["blank", t("program.tplBlank")]
						].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => applyTemplate(k),
							className: "rounded-2xl bg-raised px-3 py-3 text-left text-xs font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
							children: t(lab)
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-semibold text-on-primary",
						onClick: () => {
							if (name.trim().length < 2) {
								toast.error(t("program.nameRequired"));
								return;
							}
							setStep(1);
						},
						children: t("program.nextDays")
					})
				]
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-text-2",
						children: t("program.whichDays")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: cn("rounded-2xl p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]", d.enabled ? "bg-raised" : "bg-sunken opacity-60"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateEnabledDay(d.dow, { enabled: !d.enabled }),
									className: cn("grid size-11 place-items-center rounded-xl text-xs font-bold", d.enabled ? "bg-primary text-on-primary" : "bg-sunken text-text-2"),
									children: dowShort(d.dow, locale)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: d.name,
									disabled: !d.enabled,
									onChange: (e) => updateEnabledDay(d.dow, { name: e.target.value }),
									className: "h-11 min-w-0 flex-1 rounded-xl bg-sunken px-3 text-sm disabled:opacity-50",
									placeholder: t("program.dayNamePh")
								})]
							})
						}, d.dow))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 flex-1 rounded-2xl bg-raised font-semibold text-text-2",
							onClick: () => setStep(0),
							children: t("common.back")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 flex-1 rounded-2xl bg-primary font-semibold text-on-primary",
							onClick: () => {
								if (enabledDays.length === 0) {
									toast.error(t("program.pickOneDay"));
									return;
								}
								setBuildDayIdx(0);
								setStep(2);
							},
							children: "Hareket ekle"
						})]
					})
				]
			}),
			step === 2 && currentDay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5 overflow-x-auto pb-1",
						children: enabledDays.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setBuildDayIdx(i),
							className: cn("shrink-0 rounded-2xl px-3 py-2 text-xs font-semibold", i === buildDayIdx ? "bg-primary text-on-primary" : "bg-raised text-text-2"),
							children: [d.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 opacity-70",
								children: [
									"(",
									d.exercises.length,
									")"
								]
							})]
						}, d.dow))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-raised/50 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									currentDay.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-text-2",
										children: ["· ", dowShort(currentDay.dow, locale)]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPickerOpen(true),
								className: "h-10 rounded-xl bg-primary px-3 text-xs font-semibold text-on-primary",
								children: "+ Hareket"
							})]
						}), currentDay.exercises.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-4 text-center text-xs text-text-2",
							children: t("program.noExercisesYet")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: currentDay.exercises.map((ex) => {
								const isEdit = editingKey === ex.key;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-xl bg-sunken px-2.5 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "min-w-0 flex-1 text-left",
												onClick: () => setEditingKey(isEdit ? null : ex.key),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium",
													children: ex.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-text-2",
													children: [
														ex.sets,
														"×",
														ex.rep_lo,
														ex.rep_hi !== ex.rep_lo ? `-${ex.rep_hi}` : "",
														" ·",
														" ",
														ex.rest_sec,
														"s · ",
														ex.load_tag
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "shrink-0 px-2 text-xs text-accent",
												onClick: () => setEditingKey(isEdit ? null : ex.key),
												children: isEdit ? t("program.close") : t("common.edit")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "shrink-0 px-2 text-xs text-danger",
												onClick: () => removeEx(currentDay.dow, ex.key),
												children: t("common.delete")
											})
										]
									}), isEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftExEditor, {
										ex,
										onChange: (patch) => updateEx(currentDay.dow, ex.key, patch)
									})]
								}, ex.key);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 flex-1 rounded-2xl bg-raised font-semibold text-text-2",
							onClick: () => setStep(1),
							children: t("common.back")
						}), buildDayIdx < enabledDays.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 flex-1 rounded-2xl bg-primary font-semibold text-on-primary",
							onClick: () => setBuildDayIdx((i) => i + 1),
							children: t("program.nextDay")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: busy,
							className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary disabled:opacity-60",
							onClick: () => void finish(),
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("program.importCreate")]
						})]
					}),
					buildDayIdx >= enabledDays.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						className: "w-full text-center text-xs text-text-2 underline",
						onClick: () => void finish(),
						children: "Hareket eklemeden bitir"
					})
				]
			}),
			pickerOpen && currentDay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseQuickPicker, {
				onClose: () => setPickerOpen(false),
				onConfirm: (draft) => {
					addExToCurrent({
						key: `${Date.now()}-${draft.name}`,
						...draft
					});
				}
			})
		]
	});
}
function DraftExEditor({ ex, onChange }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 space-y-2 border-t border-rule/60 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
					label: "Set",
					value: ex.sets,
					onChange: (n) => onChange({ sets: Math.max(1, n) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
					label: "Dinlenme (sn)",
					value: ex.rest_sec,
					onChange: (n) => onChange({ rest_sec: Math.max(0, n) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
					label: "Tekrar min",
					value: ex.rep_lo,
					onChange: (n) => onChange({
						rep_lo: Math.max(1, n),
						rep_hi: Math.max(n, ex.rep_hi)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
					label: "Tekrar max",
					value: ex.rep_hi,
					onChange: (n) => onChange({ rep_hi: Math.max(ex.rep_lo, n) })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "block space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-text-2",
				children: t("program.load")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSelect, {
				value: ex.load_tag,
				onValueChange: (v) => onChange({ load_tag: v }),
				options: Object.keys(LOAD_TAG_KEYS).map((k) => ({
					value: k,
					label: t(LOAD_TAG_KEYS[k])
				})),
				triggerClassName: "h-11 rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
				"aria-label": t("program.load")
			})]
		})]
	});
}
function ExerciseQuickPicker({ onClose, onConfirm }) {
	const { t } = useI18n();
	const [q, setQ] = (0, import_react.useState)("");
	const [muscle, setMuscle] = (0, import_react.useState)("all");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [sets, setSets] = (0, import_react.useState)("");
	const [repLo, setRepLo] = (0, import_react.useState)("");
	const [repHi, setRepHi] = (0, import_react.useState)("");
	const [rest, setRest] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)("orta");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		const t = window.setTimeout(() => {
			searchExerciseCatalog({ data: {
				q,
				muscleGroup: muscle === "all" ? void 0 : muscle,
				limit: 120
			} }).then((r) => {
				if (!cancelled) setRows(r);
			}).finally(() => {
				if (!cancelled) setLoading(false);
			});
		}, 140);
		return () => {
			cancelled = true;
			window.clearTimeout(t);
		};
	}, [q, muscle]);
	const tabs = [
		["all", "muscle.all"],
		["gogus", "muscle.gogus"],
		["sirt", "muscle.sirt"],
		["omuz", "muscle.omuz"],
		["kol", "muscle.kol"],
		["bacak", "muscle.bacak"],
		["core", "muscle.core"]
	];
	function submit() {
		if (!picked) return;
		const s = typeof sets === "number" ? sets : Number(sets);
		const lo = typeof repLo === "number" ? repLo : Number(repLo);
		const hiRaw = typeof repHi === "number" ? repHi : Number(repHi);
		const r = typeof rest === "number" ? rest : Number(rest);
		if (!Number.isFinite(s) || s < 1) {
			toast.error(t("program.enterSets"));
			return;
		}
		if (!Number.isFinite(lo) || lo < 1) {
			toast.error(t("program.enterRepRange"));
			return;
		}
		const hi = Number.isFinite(hiRaw) && hiRaw >= lo ? hiRaw : lo;
		if (!Number.isFinite(r) || r < 0) {
			toast.error(t("program.enterRest"));
			return;
		}
		onConfirm({
			name: picked.name,
			exerciseId: picked.id > 0 ? picked.id : void 0,
			externalId: picked.external_id,
			muscle_group: picked.muscle_group,
			sets: s,
			rep_lo: lo,
			rep_hi: hi,
			rest_sec: r,
			load_tag: tag
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
		title: picked ? "Set & tekrar" : "1300+ hareket",
		onClose,
		nested: true,
		contentClassName: "!p-0",
		children: !picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Ara…",
				className: "h-12 w-full rounded-2xl bg-raised px-3 text-sm",
				autoFocus: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 overflow-x-auto",
				children: tabs.map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMuscle(id),
					className: cn("shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold", muscle === id ? "bg-primary text-on-primary" : "bg-raised text-text-2"),
					children: t(lab)
				}, id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-10 text-center text-xs text-text-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto h-24 w-full animate-pulse rounded-2xl bg-raised",
					"aria-busy": "true"
				})
			}) : rows.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setPicked(e),
				className: "flex w-full items-center justify-between gap-2 rounded-xl bg-raised/60 px-3 py-3 text-left text-sm active:bg-accent/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 truncate font-medium",
					children: e.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, {
					group: e.muscle_group,
					size: "xs"
				})]
			}) }, `${e.id}-${e.external_id ?? e.name}`))
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 overflow-y-auto p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-raised px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: picked.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-text-2",
						children: "Set, tekrar ve dinlenmeyi sen gir — otomatik doldurulmaz"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-text-2",
								children: "Set *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								min: 1,
								value: sets,
								onChange: (e) => setSets(e.target.value === "" ? "" : Number(e.target.value)),
								placeholder: t("program.exSetsPh"),
								className: "num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-text-2",
								children: "Dinlenme sn *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								min: 0,
								value: rest,
								onChange: (e) => setRest(e.target.value === "" ? "" : Number(e.target.value)),
								placeholder: t("program.exRestPh"),
								className: "num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-text-2",
								children: "Tekrar min *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								min: 1,
								value: repLo,
								onChange: (e) => {
									const v = e.target.value === "" ? "" : Number(e.target.value);
									setRepLo(v);
									if (typeof v === "number" && (repHi === "" || typeof repHi === "number" && repHi < v)) setRepHi(v);
								},
								placeholder: t("program.exRepLoPh"),
								className: "num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-text-2",
								children: "Tekrar max"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "numeric",
								min: 1,
								value: repHi,
								onChange: (e) => setRepHi(e.target.value === "" ? "" : Number(e.target.value)),
								placeholder: t("program.exRepHiPh"),
								className: "num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-text-2",
						children: t("program.load")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSelect, {
						value: tag,
						onValueChange: setTag,
						options: Object.keys(LOAD_TAG_KEYS).map((k) => ({
							value: k,
							label: t(LOAD_TAG_KEYS[k])
						})),
						triggerClassName: "rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
						"aria-label": t("program.load")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 flex-1 rounded-2xl bg-raised font-semibold text-text-2",
						onClick: () => setPicked(null),
						children: t("program.changeExercise")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 flex-1 rounded-2xl bg-primary font-semibold text-on-primary",
						onClick: submit,
						children: t("common.add")
					})]
				})
			]
		})
	});
}
function ProgramPage() {
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id;
	const { t, locale } = useI18n();
	const qc = useQueryClient();
	const [program, setProgram] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [activeDayId, setActiveDayId] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [scheduleOpen, setScheduleOpen] = (0, import_react.useState)(false);
	const [daySettingsOpen, setDaySettingsOpen] = (0, import_react.useState)(false);
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const [metaOpen, setMetaOpen] = (0, import_react.useState)(false);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [library, setLibrary] = (0, import_react.useState)([]);
	const [abandonOpen, setAbandonOpen] = (0, import_react.useState)(false);
	const [clearFutureOpen, setClearFutureOpen] = (0, import_react.useState)(false);
	const [leaving, setLeaving] = (0, import_react.useState)(false);
	async function doAbandon() {
		setLeaving(true);
		try {
			await abandonProgram();
			toast.success(t("program.abandoned"));
			setAbandonOpen(false);
			setProgram(null);
			setActiveDayId(null);
			await Promise.all([
				qc.invalidateQueries({ queryKey: qk.activeProgram }),
				qc.invalidateQueries({ queryKey: ["workouts"] }),
				qc.invalidateQueries({ queryKey: qk.dashboard }),
				qc.invalidateQueries({ queryKey: qk.feed }),
				qc.invalidateQueries({ queryKey: qk.me })
			]);
			await reload();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setLeaving(false);
		}
	}
	async function doClearFuture() {
		setLeaving(true);
		try {
			const r = await clearFutureWorkouts();
			toast.success(r.deleted === 0 ? t("workout.clearFutureNone") : t("workout.clearFutureDone", { n: r.deleted }));
			setClearFutureOpen(false);
			await Promise.all([qc.invalidateQueries({ queryKey: ["workouts"] }), qc.invalidateQueries({ queryKey: qk.dashboard })]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("common.error"));
		} finally {
			setLeaving(false);
		}
	}
	const reload = (0, import_react.useCallback)(async () => {
		const p = await getActiveProgram();
		setProgram(p);
		if (p && p.days.length) setActiveDayId((prev) => {
			if (prev && p.days.some((d) => d.id === prev)) return prev;
			return p.days[0].id;
		});
		else setActiveDayId(null);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		let cancelled = false;
		setLoading(true);
		Promise.all([reload(), listExercises()]).then(([, lib]) => {
			if (!cancelled) setLibrary(lib);
		}).catch(() => {
			if (!cancelled) toast.error(t("common.error"));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		userId,
		reload,
		t
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGateSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const day = program?.days.find((d) => d.id === activeDayId) ?? program?.days[0];
	async function move(exId, dir) {
		if (!day) return;
		const ids = day.exercises.map((e) => e.id);
		const idx = ids.indexOf(exId);
		const j = idx + dir;
		if (idx < 0 || j < 0 || j >= ids.length) return;
		const next = [...ids];
		[next[idx], next[j]] = [next[j], next[idx]];
		await reorderProgramExercises({ data: {
			programDayId: day.id,
			orderedIds: next
		} });
		await reload();
	}
	async function removeEx(id) {
		if (!confirm(t("common.delete") + "?")) return;
		await deleteProgramExercise({ data: id });
		toast.success(t("common.success"));
		await reload();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: t("program.title"),
		subtitle: program?.name ?? t("program.none"),
		children: [
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramCardSkeleton, {}) : !program ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-sunken px-4 py-8 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tracking-wide",
							children: t("program.none")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-text-2",
							children: t("program.noneHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCreateOpen(true),
							className: btnClass("primary", "mt-5 w-full"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), t("program.create")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/discover",
							className: btnClass("secondary", "mt-2 w-full"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), t("program.fromDiscover")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setImportOpen(true),
							className: btnClass("ghost", "mt-2 w-full"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "size-4" }), t("program.fromPaste")]
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full min-w-0 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setScheduleOpen(true),
								className: "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-raised text-xs font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "size-3.5" }), t("program.week")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShareOpen(true),
								className: "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-raised text-xs font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-3.5" }),
									t("program.share"),
									program.is_public && program.share_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-[10px] text-accent",
										children: program.share_code
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMoreOpen((o) => !o),
									className: "grid size-12 place-items-center rounded-2xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95 active:text-accent",
									"aria-label": t("program.more"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
								}), moreOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "fixed left-0 top-0 z-40 h-dvh w-dvw",
									"aria-label": t("common.close"),
									onClick: () => setMoreOpen(false)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 top-[calc(100%+0.35rem)] z-50 w-52 overflow-hidden rounded-xl border border-rule bg-sunken shadow-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
											onClick: () => {
												setMoreOpen(false);
												setCreateOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-text-2" }), t("program.create")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
											onClick: () => {
												setMoreOpen(false);
												setMetaOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-text-2" }), t("program.meta")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
											onClick: () => {
												setMoreOpen(false);
												setImportOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "size-4 text-text-2" }), t("program.fromPaste")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised",
											onClick: () => {
												setMoreOpen(false);
												setClearFutureOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-4 text-text-2" }), t("program.clearFuture")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10",
											onClick: () => {
												setMoreOpen(false);
												setAbandonOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), t("program.abandon")]
										})
									]
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1",
						children: [
							1,
							2,
							3,
							4,
							5,
							6,
							7
						].map((dow) => {
							const assigned = program.days.find((d) => d.dow === dow);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									if (assigned) setActiveDayId(assigned.id);
									else setScheduleOpen(true);
								},
								className: cn("flex min-h-14 min-w-0 flex-col items-center justify-center rounded-2xl px-0.5 py-1.5 transition active:scale-95", assigned ? "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]" : "bg-raised text-text-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-text-2",
									children: dowShort(dow, locale)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("mt-0.5 max-w-full truncate text-[9px] font-semibold leading-tight", assigned ? "text-accent" : "text-text-3"),
									children: assigned ? assigned.name : "—"
								})]
							}, dow);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						children: [program.days.slice().sort((a, b) => a.dow - b.dow || a.sort - b.sort).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveDayId(d.id),
							className: cn("shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-95", d.id === day?.id ? "bg-primary text-on-primary shadow-[var(--shadow-primary)]" : "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"),
							children: d.name
						}, d.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: async () => {
								const used = new Set(program.days.map((d) => d.dow));
								let free = 1;
								while (used.has(free) && free <= 7) free += 1;
								if (free > 7) {
									toast.error(t("program.maxDays"));
									return;
								}
								const r = await addProgramDay({ data: {
									programId: program.id,
									dow: free,
									name: t("program.dayN", { n: program.days.length + 1 })
								} });
								await reload();
								setActiveDayId(r.id);
							},
							className: "flex shrink-0 items-center gap-1 rounded-full border border-dashed border-rule px-3 py-2 text-sm text-text-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }),
								" ",
								t("program.day")
							]
						})]
					}),
					day && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl tracking-wide",
									children: day.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-text-2",
									children: [dowLong(day.dow, locale), day.focus ? ` · ${day.focus}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDaySettingsOpen(true),
								className: "grid size-10 place-items-center rounded-lg border border-rule text-text-2",
								"aria-label": t("program.daySettings"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: day.exercises.map((ex, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "min-w-0 rounded-xl border border-rule bg-sunken p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "num mt-0.5 w-5 shrink-0 text-sm text-text-3",
											children: i + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "break-words font-medium leading-snug",
													children: [ex.exercise_name, ex.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-text-2",
														children: [" · ", ex.detail]
													}) : null]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1.5 flex flex-wrap items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuscleBadge, { group: ex.muscle_group }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "num text-lg text-accent",
															children: [
																ex.sets,
																"×",
																ex.rep_lo,
																"-",
																ex.rep_hi
															]
														}),
														ex.rest_sec != null && ex.rest_sec > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-0.5 rounded-full border border-rule bg-raised px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text-2",
															children: [ex.rest_sec, "s"]
														}) : null,
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadTagBadge, { tag: ex.load_tag }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewButton, {
															name: ex.exercise_name,
															formCues: ex.form_cues,
															muscleGroup: ex.muscle_group
														})
													]
												}),
												ex.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-xs leading-relaxed text-text-2",
													children: ex.note
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0 flex-col gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-11 place-items-center rounded-2xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95",
												onClick: () => void move(ex.id, -1),
												"aria-label": t("program.moveUp"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-11 place-items-center rounded-2xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95",
												onClick: () => void move(ex.id, 1),
												"aria-label": t("program.moveDown"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 flex-1 rounded-2xl bg-raised text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
										onClick: () => setEditing(ex),
										children: t("common.edit")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-10 place-items-center rounded-lg border border-rule text-danger",
										onClick: () => void removeEx(ex.id),
										"aria-label": t("common.delete"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								})]
							}, ex.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAdding(true),
							className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-rule text-sm font-medium text-text-2 hover:border-accent/40 hover:text-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
								" ",
								t("program.addExercise")
							]
						})
					] })
				]
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditModal, {
				exercise: editing,
				onClose: () => setEditing(null),
				onSave: async (patch) => {
					await updateProgramExercise({ data: {
						id: editing.id,
						...patch
					} });
					toast.success(t("common.saved"));
					setEditing(null);
					await reload();
				}
			}),
			adding && day && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddModal, {
				library,
				dayExerciseIds: day.exercises.map((e) => e.exercise_id),
				onClose: () => setAdding(false),
				onCreateExercise: async (name) => {
					const r = await createExercise({ data: {
						name,
						muscle_group: "diger"
					} });
					setLibrary(await listExercises());
					return r.id;
				},
				onAdd: async (payload) => {
					await addProgramExercise({ data: {
						programDayId: day.id,
						...payload
					} });
					toast.success("Eklendi");
					setAdding(false);
					await reload();
				}
			}),
			importOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportModal, {
				onClose: () => setImportOpen(false),
				onImported: async () => {
					setImportOpen(false);
					setLoading(true);
					await reload();
					setLoading(false);
				}
			}),
			scheduleOpen && program && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleModal, {
				program,
				onClose: () => setScheduleOpen(false),
				onSaved: async () => {
					setScheduleOpen(false);
					await reload();
					toast.success(t("program.scheduleUpdated"));
				}
			}),
			daySettingsOpen && day && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DaySettingsModal, {
				day,
				onClose: () => setDaySettingsOpen(false),
				onSave: async (patch) => {
					await updateProgramDay({ data: {
						id: day.id,
						...patch
					} });
					toast.success(t("common.saved"));
					setDaySettingsOpen(false);
					await reload();
				}
			}),
			shareOpen && program && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareModal, {
				program,
				onClose: () => setShareOpen(false),
				onSaved: async () => {
					setShareOpen(false);
					await reload();
				}
			}),
			metaOpen && program && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaModal, {
				program,
				onClose: () => setMetaOpen(false),
				onSaved: async () => {
					setMetaOpen(false);
					await reload();
				}
			}),
			createOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateProgramWizard, {
				hasActiveProgram: !!program,
				onClose: () => setCreateOpen(false),
				onCreated: async () => {
					setCreateOpen(false);
					setLoading(true);
					await reload();
					setLoading(false);
				}
			}),
			abandonOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
				title: t("program.abandon"),
				onClose: () => !leaving && setAbandonOpen(false),
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: leaving,
						onClick: () => setAbandonOpen(false),
						className: "flex h-12 flex-1 items-center justify-center rounded-xl border border-edge text-sm font-semibold",
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: leaving,
						onClick: () => void doAbandon(),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-danger text-sm font-semibold text-white disabled:opacity-60",
						children: [leaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("program.abandon")]
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-text-2",
					children: t("program.abandonConfirm")
				})
			}) : null,
			clearFutureOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSheet, {
				title: t("program.clearFuture"),
				onClose: () => !leaving && setClearFutureOpen(false),
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: leaving,
						onClick: () => setClearFutureOpen(false),
						className: "flex h-12 flex-1 items-center justify-center rounded-xl border border-edge text-sm font-semibold",
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: leaving,
						onClick: () => void doClearFuture(),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary disabled:opacity-60",
						children: [leaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "size-4" }) : null, t("common.yes")]
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-text-2",
					children: t("workout.clearFutureConfirm")
				})
			}) : null
		]
	});
}
//#endregion
export { ProgramPage as component };

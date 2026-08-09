import { useEffect, useState } from "react";
import { Copy, Share2 } from "@/components/icons";
import { toast } from "sonner";
import { ExercisePreviewButton } from "@/components/exercise-preview";
import { MuscleBadge } from "@/components/muscle-badge";
import {
  setWeekSchedule,
  createProgram,
  addProgramExercise,
  type ProgramDetail,
  type ProgramExerciseRow,
} from "@/lib/server/programs";
import {
  similarExercises,
  searchExerciseCatalog,
  adoptDatasetExercise,
  type ExerciseRow,
} from "@/lib/server/exercises";
import {
  commitProgramImport,
  previewProgramImport,
  type ImportPreview,
} from "@/lib/server/import-program";
import { publishProgram, updateProgramMeta } from "@/lib/server/share";
import {
  LOAD_TAG_KEYS,
  type LoadTag,
} from "@/data/library";
import { copyText } from "@/lib/clipboard";
import { cn, dowLong, dowShort } from "@/lib/utils";
import { AppSelect } from "@/components/ui/select";
import { AppSheet } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";

const SAMPLE_PASTE = `Personal Program
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

export function ShareModal({
  program,
  onClose,
  onSaved,
}: {
  program: ProgramDetail;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [isPublic, setIsPublic] = useState(program.is_public);
  const [description, setDescription] = useState(program.description ?? "");
  const [tags, setTags] = useState(program.tags ?? "");
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState(program.share_code);

  return (
    <Modal title={t("program.shareTitle")} onClose={onClose}>
      <p className="mb-3 text-xs leading-relaxed text-text-2">
        {t("program.shareHint")}
      </p>
      <label className="flex items-center gap-3 rounded-lg border border-rule bg-raised px-3 py-3">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="size-5 accent-primary"
        />
        <span className="text-sm">
          <span className="font-medium">{t("program.public")}</span>
          <span className="mt-0.5 block text-xs text-text-2">{t("program.publicHint")}</span>
        </span>
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-text-2">{t("program.shareDesc")}</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={t("program.shareDescPh")}
          className="w-full rounded-md border border-rule bg-raised px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-text-2">{t("program.tags")}</span>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder={t("program.tagsPh")}
          className="h-11 w-full rounded-md border border-rule bg-raised px-3 text-sm"
        />
      </label>
      {(code || isPublic) && (
        <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2">
          <p className="text-xs text-text-2">{t("program.shareCode")}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="num text-2xl tracking-[0.2em] text-accent">
              {code ?? t("program.codePending")}
            </p>
            {code ? (
              <button
                type="button"
                className="flex h-10 shrink-0 items-center gap-1 rounded-lg border border-accent/40 px-3 text-xs font-semibold text-accent"
                onClick={async () => {
                  const ok = await copyText(code);
                  toast.success(ok ? t("program.copiedCode", { code }) : t("program.codeLabel", { code }));
                }}
              >
                <Copy className="size-3.5" />
                Kopyala
              </button>
            ) : null}
          </div>
        </div>
      )}
      <button
        type="button"
        disabled={saving}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
        onClick={() => {
          setSaving(true);
          void publishProgram({
            data: {
              id: program.id,
              is_public: isPublic,
              description: description.trim() || null,
              tags: tags.trim() || null,
            },
          })
            .then(async (r) => {
              setCode(r.share_code);
              toast.success(
                r.is_public
                  ? t("program.shareOn", { code: r.share_code ?? "" })
                  : t("program.nowPrivate"),
              );
              await onSaved();
            })
            .catch((e) => toast.error(e instanceof Error ? e.message : t("common.error")))
            .finally(() => setSaving(false));
        }}
      >
        {saving ? <Spinner className="size-4" /> : <Share2 className="size-4" />}
        {t("common.save")}
      </button>
    </Modal>
  );
}

export function MetaModal({
  program,
  onClose,
  onSaved,
}: {
  program: ProgramDetail;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(program.name);
  const [description, setDescription] = useState(program.description ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <Modal title={t("program.metaTitle")} onClose={onClose}>
      <label className="block space-y-1">
        <span className="text-xs text-text-2">{t("program.nameLabel")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-md border border-rule bg-raised px-3"
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-text-2">{t("program.descLabel")}</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Hedef, seviye, notlar…"
          className="w-full rounded-md border border-rule bg-raised px-3 py-2 text-sm"
        />
      </label>
      <button
        type="button"
        disabled={saving || !name.trim()}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary disabled:opacity-50"
        onClick={() => {
          setSaving(true);
          void updateProgramMeta({
            data: {
              id: program.id,
              name: name.trim(),
              description: description.trim() || null,
            },
          })
            .then(() => {
              toast.success(t("common.saved"));
              return onSaved();
            })
            .catch((e) => toast.error(e instanceof Error ? e.message : t("common.error")))
            .finally(() => setSaving(false));
        }}
      >
        {t("common.save")}
      </button>
    </Modal>
  );
}

export function ScheduleModal({
  program,
  onClose,
  onSaved,
}: {
  program: ProgramDetail;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { t, locale } = useI18n();
  const [slots, setSlots] = useState<Record<number, number | null>>(() => {
    const init: Record<number, number | null> = {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
    };
    for (const d of program.days) {
      if (d.dow >= 1 && d.dow <= 7) init[d.dow] = d.id;
    }
    return init;
  });
  const [saving, setSaving] = useState(false);

  function setSlot(dow: number, dayId: number | null) {
    setSlots((prev) => {
      const next = { ...prev };
      if (dayId != null) {
        for (const k of Object.keys(next)) {
          const n = Number(k);
          if (next[n] === dayId) next[n] = null;
        }
      }
      next[dow] = dayId;
      return next;
    });
  }

  return (
    <Modal title={t("program.scheduleTitle")} onClose={onClose}>
      <p className="mb-3 text-xs leading-relaxed text-text-2">
        {t("program.scheduleHint")}
      </p>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6, 7].map((dow) => (
          <label
            key={dow}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-rule bg-raised px-2.5 py-2"
          >
            <span className="w-20 shrink-0 text-sm font-medium text-text-2 sm:w-24">
              {dowLong(dow, locale)}
            </span>
            <AppSelect
              value={slots[dow] != null ? String(slots[dow]) : "__none__"}
              onValueChange={(v) => setSlot(dow, v === "__none__" ? null : Number(v))}
              options={[
                { value: "__none__", label: "Dinlenme" },
                ...program.days.map((d) => ({
                  value: String(d.id),
                  label: d.name,
                })),
              ]}
              triggerClassName="h-11 min-w-0 flex-1 rounded-md border-rule bg-sunken"
              aria-label={dowLong(dow, locale)}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={saving}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
        onClick={() => {
          setSaving(true);
          void setWeekSchedule({
            data: {
              programId: program.id,
              schedule: [1, 2, 3, 4, 5, 6, 7].map((dow) => ({
                dow,
                programDayId: slots[dow] ?? null,
              })),
            },
          })
            .then(() => onSaved())
            .catch((e) => toast.error(e instanceof Error ? e.message : t("common.error")))
            .finally(() => setSaving(false));
        }}
      >
        {saving ? <Spinner className="size-4" /> : null}
        {t("common.save")}
      </button>
    </Modal>
  );
}

export function DaySettingsModal({
  day,
  onClose,
  onSave,
}: {
  day: ProgramDetail["days"][number];
  onClose: () => void;
  onSave: (p: { name: string; focus: string | null; dow: number }) => Promise<void>;
}) {
  const { t, locale } = useI18n();
  const [name, setName] = useState(day.name);
  const [focus, setFocus] = useState(day.focus ?? "");
  const [dow, setDow] = useState(day.dow);
  const [saving, setSaving] = useState(false);

  return (
    <Modal title={t("program.daySettings")} onClose={onClose}>
      <label className="block space-y-1">
        <span className="text-xs text-text-2">{t("program.nameLabel")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-md border border-rule bg-raised px-3"
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-text-2">Odak / not</span>
        <input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          className="h-12 w-full rounded-md border border-rule bg-raised px-3"
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-text-2">{t("program.whichDow")}</span>
        <AppSelect
          value={String(dow)}
          onValueChange={(v) => setDow(Number(v))}
          options={[1, 2, 3, 4, 5, 6, 7].map((d) => ({
            value: String(d),
            label: dowLong(d, locale),
          }))}
          aria-label={t("program.whichDow")}
        />
      </label>
      <button
        type="button"
        disabled={saving || name.trim().length < 1}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary disabled:opacity-50"
        onClick={() => {
          setSaving(true);
          void onSave({
            name: name.trim(),
            focus: focus.trim() || null,
            dow,
          }).finally(() => setSaving(false));
        }}
      >
        {t("common.save")}
      </button>
    </Modal>
  );
}

export function ImportModal({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [programName, setProgramName] = useState("");

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
      const r = await commitProgramImport({
        data: {
          text,
          programName: programName || undefined,
          replaceActive: true,
        },
      });
      toast.success(t("program.importSuccess", { name: r.name, days: r.days, exercises: r.exercises }));
      await onImported();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("program.importFailed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Metinden program" onClose={onClose}>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPreview(null);
        }}
        rows={8}
        placeholder={SAMPLE_PASTE}
        className="w-full rounded-md border border-rule bg-raised px-3 py-2 font-mono text-xs leading-relaxed"
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="h-10 flex-1 rounded-md border border-rule text-xs text-text-2"
          onClick={() => {
            setText(SAMPLE_PASTE);
            setPreview(null);
          }}
        >
          {t("program.importExample")}
        </button>
        <button
          type="button"
          disabled={busy}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-accent/30 bg-raised text-sm font-medium text-accent"
          onClick={() => void runPreview()}
        >
          {t("program.importPreview")}
        </button>
      </div>
      {preview && preview.days.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-rule pt-4">
          <input
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="h-11 w-full rounded-md border border-rule bg-raised px-3 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => void commit()}
            className="flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary"
          >
            {t("program.importCreate")}
          </button>
        </div>
      )}
    </Modal>
  );
}

export function EditModal({
  exercise,
  onClose,
  onSave,
  library = [],
}: {
  exercise: ProgramExerciseRow;
  onClose: () => void;
  onSave: (p: {
    exerciseId?: number;
    sets: number;
    rep_lo: number;
    rep_hi: number;
    rest_sec: number;
    load_tag: string;
    note: string | null;
  }) => Promise<void>;
  library?: ExerciseRow[];
}) {
  const { t } = useI18n();
  const [sets, setSets] = useState(exercise.sets);
  const [repLo, setRepLo] = useState(exercise.rep_lo);
  const [repHi, setRepHi] = useState(exercise.rep_hi);
  const [rest, setRest] = useState(exercise.rest_sec);
  const [tag, setTag] = useState(exercise.load_tag);
  const [note, setNote] = useState(exercise.note ?? "");
  const [saving, setSaving] = useState(false);
  const [swapId, setSwapId] = useState<number | null>(null);
  const [swapExt, setSwapExt] = useState<string | null>(null);
  const [swapName, setSwapName] = useState<string | null>(null);
  const [similar, setSimilar] = useState<ExerciseRow[]>([]);
  const [q, setQ] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string>("all");
  const [catalog, setCatalog] = useState<ExerciseRow[]>(library);
  const [loadingCat, setLoadingCat] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void similarExercises({
      data: {
        exerciseId: exercise.exercise_id,
        excludeIds: [exercise.exercise_id],
      },
    }).then((rows) => {
      if (!cancelled) setSimilar(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [exercise.exercise_id]);

  // Always load full catalog (not only similar)
  useEffect(() => {
    let cancelled = false;
    setLoadingCat(true);
    const t = window.setTimeout(() => {
      void searchExerciseCatalog({
        data: {
          q: q,
          muscleGroup: muscleFilter === "all" ? undefined : muscleFilter,
        },
      })
        .then((rows) => {
          if (!cancelled) setCatalog(rows);
        })
        .finally(() => {
          if (!cancelled) setLoadingCat(false);
        });
    }, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q, muscleFilter]);

  function pickSwap(e: ExerciseRow) {
    if (e.id > 0) {
      setSwapId(e.id);
      setSwapExt(null);
    } else {
      setSwapId(null);
      setSwapExt(e.external_id ?? null);
    }
    setSwapName(e.name);
  }

  const muscleTabs: { id: string; label: string }[] = [
    { id: "all", label: t("muscle.all") },
    { id: "gogus", label: t("muscle.gogus") },
    { id: "sirt", label: t("muscle.sirt") },
    { id: "omuz", label: t("muscle.omuz") },
    { id: "kol", label: t("muscle.kol") },
    { id: "bacak", label: t("muscle.bacak") },
    { id: "trapez", label: t("muscle.trapez") },
    { id: "core", label: t("muscle.core") },
  ];

  return (
    <Modal title={swapName ?? exercise.exercise_name} onClose={onClose}>
      <div className="mb-3 flex flex-wrap gap-2">
        <ExercisePreviewButton
          name={swapName ?? exercise.exercise_name}
          formCues={swapId || swapExt ? null : exercise.form_cues}
        />
        <MuscleBadge group={exercise.muscle_group} />
      </div>

      {/* Full library — always visible */}
      <div className="mb-3 rounded-lg border border-rule bg-raised/40 p-2.5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">
          {t("program.swapTitle")}
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("program.searchPh")}
          className="mb-2 h-10 w-full rounded-md border border-rule bg-sunken px-3 text-sm"
        />
        <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {muscleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMuscleFilter(tab.id)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                muscleFilter === tab.id
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-rule text-text-2",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {loadingCat ? (
          <p className="py-4 text-center text-xs text-text-2">{t("program.loading")}</p>
        ) : (
          <ul className="max-h-44 space-y-1 overflow-y-auto">
            {catalog
              .filter((e) => e.id !== exercise.exercise_id)
              .map((e) => (
                <li key={`${e.id}-${e.external_id ?? e.name}`}>
                  <button
                    type="button"
                    onClick={() => pickSwap(e)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-left text-sm",
                      (swapId === e.id && e.id > 0) ||
                        (swapExt && swapExt === e.external_id)
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-transparent bg-sunken hover:border-rule",
                    )}
                  >
                    <span className="min-w-0 truncate">{e.name}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      <MuscleBadge group={e.muscle_group} size="xs" />
                      {e.gif_url ? (
                        <span className="text-[9px] text-text-3">GIF</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            {catalog.length === 0 && (
              <li className="py-3 text-center text-xs text-text-2">{t("program.noResults")}</li>
            )}
          </ul>
        )}
      </div>

      {/* Similar suggestions (optional strip) */}
      {similar.length > 0 && (
        <div className="mb-3 rounded-lg border border-rule/80 bg-raised/20 p-2.5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">
            {t("program.sameRegion")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSwapId(null);
                setSwapExt(null);
                setSwapName(null);
              }}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs",
                !swapId && !swapExt
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-rule text-text-2 hover:text-text",
              )}
            >
              {exercise.exercise_name}
            </button>
            {similar.slice(0, 12).map((s) => (
              <button
                key={`${s.id}-${s.external_id ?? s.name}`}
                type="button"
                onClick={() => pickSwap(s)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  (swapId === s.id && s.id > 0) ||
                    (swapExt && swapExt === s.external_id)
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-rule text-text-2 hover:text-text",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {swapName && (
        <p className="mb-2 rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs text-accent">
          {t("program.swapPending", { name: swapName })}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <NumField label="Set" value={sets} onChange={setSets} />
        <NumField label="Dinlenme (sn)" value={rest} onChange={setRest} />
        <NumField label="Tekrar min" value={repLo} onChange={setRepLo} />
        <NumField label="Tekrar max" value={repHi} onChange={setRepHi} />
      </div>
      <AppSelect
        value={tag}
        onValueChange={setTag}
        options={(Object.keys(LOAD_TAG_KEYS) as LoadTag[]).map((k) => ({
          value: k,
          label: t(LOAD_TAG_KEYS[k]),
        }))}
        className="mt-3"
        aria-label={t("program.load")}
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="mt-3 w-full rounded-md border border-rule bg-raised px-3 py-2 text-sm"
        placeholder={t("program.noteOptional")}
      />
      <button
        type="button"
        disabled={saving}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary"
        onClick={() => {
          setSaving(true);
          void (async () => {
            let exerciseId = swapId ?? undefined;
            if (swapExt) {
              const r = await adoptDatasetExercise({ data: { externalId: swapExt } });
              exerciseId = r.id;
            }
            await onSave({
              exerciseId,
              sets,
              rep_lo: repLo,
              rep_hi: repHi,
              rest_sec: rest,
              load_tag: tag,
              note: note.trim() || null,
            });
          })().finally(() => setSaving(false));
        }}
      >
        {t("common.save")}
      </button>
    </Modal>
  );
}

export function AddModal({
  library: _library,
  onClose,
  onAdd,
  onCreateExercise,
}: {
  library: ExerciseRow[];
  onClose: () => void;
  onCreateExercise: (name: string) => Promise<number>;
  dayExerciseIds?: number[];
  onAdd: (p: {
    exerciseId: number;
    sets: number;
    rep_lo: number;
    rep_hi: number;
    rest_sec: number;
    load_tag: string;
    note?: string;
  }) => Promise<void>;
}) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("all");
  const [catalog, setCatalog] = useState<ExerciseRow[]>([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [selected, setSelected] = useState<ExerciseRow | null>(null);
  const [sets, setSets] = useState<number | "">("");
  const [repLo, setRepLo] = useState<number | "">("");
  const [repHi, setRepHi] = useState<number | "">("");
  const [rest, setRest] = useState<number | "">("");
  const [tag, setTag] = useState<string>("orta");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingCat(true);
    const t = window.setTimeout(() => {
      void searchExerciseCatalog({
        data: {
          q,
          muscleGroup: muscleFilter === "all" ? undefined : muscleFilter,
          limit: 120,
        },
      })
        .then((rows) => {
          if (!cancelled) setCatalog(rows);
        })
        .finally(() => {
          if (!cancelled) setLoadingCat(false);
        });
    }, 160);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q, muscleFilter]);

  const muscleTabs: { id: string; label: string }[] = [
    { id: "all", label: t("muscle.all") },
    { id: "gogus", label: t("muscle.gogus") },
    { id: "sirt", label: t("muscle.sirt") },
    { id: "omuz", label: t("muscle.omuz") },
    { id: "kol", label: t("muscle.kol") },
    { id: "bacak", label: t("muscle.bacak") },
    { id: "core", label: t("muscle.core") },
    { id: "diger", label: t("muscle.diger") },
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
      if (exerciseId <= 0 && selected.external_id) {
        const ad = await adoptDatasetExercise({
          data: { externalId: selected.external_id },
        });
        exerciseId = ad.id;
      } else if (exerciseId <= 0) {
        exerciseId = await onCreateExercise(selected.name);
      }
      await onAdd({
        exerciseId,
        sets: s,
        rep_lo: lo,
        rep_hi: hi,
        rest_sec: r,
        load_tag: tag,
        note: note.trim() || undefined,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={t("program.addExerciseTitle")} onClose={onClose}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ara: bench, squat, curl, row…"
        className="h-12 w-full rounded-2xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        autoFocus
      />
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5">
        {muscleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMuscleFilter(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold active:scale-95",
              muscleFilter === tab.id
                ? "bg-primary text-on-primary"
                : "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2 max-h-52 overflow-y-auto rounded-2xl bg-raised/40 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        {loadingCat ? (
          <p className="flex items-center justify-center gap-2 py-8 text-xs text-text-2">
            <span className="inline-flex items-center gap-2 text-sm text-text-2"><span className="size-4 animate-pulse rounded-full bg-raised" />{t("program.loading")}</span>
          </p>
        ) : catalog.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-text-2">{t("discover.noResults")}</p>
            {q.trim().length >= 2 && (
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-accent"
                onClick={() => {
                  void onCreateExercise(q.trim()).then((id) =>
                    setSelected({
                      id,
                      owner_id: null,
                      name: q.trim(),
                      detail: null,
                      unit: "kg",
                      muscle_group: "diger",
                      default_note: null,
                    }),
                  );
                }}
              >
                {t("program.createCustom", { q: q.trim() })}
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {catalog.map((e) => {
              const active =
                selected &&
                ((e.id > 0 && selected.id === e.id) ||
                  (!!e.external_id &&
                    e.external_id === selected.external_id) ||
                  (e.id <= 0 &&
                    selected.id <= 0 &&
                    e.name === selected.name));
              return (
                <li key={`${e.id}-${e.external_id ?? e.name}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(e)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2.5 text-left text-sm active:scale-[0.99]",
                      active
                        ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
                        : "bg-sunken hover:bg-raised",
                    )}
                  >
                    <span className="min-w-0 truncate font-medium">{e.name}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      <MuscleBadge group={e.muscle_group} size="xs" />
                      {e.gif_url ? (
                        <span className="text-[9px] text-text-3">GIF</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p className="mt-1 text-[10px] text-text-3">
        {t("program.resultCount", { n: catalog.length })}
      </p>

      {selected && (
        <div className="mt-2 flex items-center gap-2">
          <ExercisePreviewButton
            name={selected.name}
            muscleGroup={selected.muscle_group}
          />
          <span className="truncate text-xs text-accent">{selected.name}</span>
        </div>
      )}

      <p className="mt-3 text-xs text-text-2">
        {t("program.setsEmptyHint")}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <EmptyNumField
          label="Set *"
          value={sets}
          placeholder={t("program.exSetsPh")}
          onChange={setSets}
        />
        <EmptyNumField
          label="Dinlenme sn *"
          value={rest}
          placeholder={t("program.exRestPh")}
          onChange={setRest}
        />
        <EmptyNumField
          label="Tekrar min *"
          value={repLo}
          placeholder={t("program.exRepLoPh")}
          onChange={(v) => {
            setRepLo(v);
            if (
              typeof v === "number" &&
              (repHi === "" || (typeof repHi === "number" && repHi < v))
            ) {
              setRepHi(v);
            }
          }}
        />
        <EmptyNumField
          label="Tekrar max"
          value={repHi}
          placeholder={t("program.exRepHiPh")}
          onChange={setRepHi}
        />
      </div>
      <AppSelect
        value={tag}
        onValueChange={setTag}
        options={(Object.keys(LOAD_TAG_KEYS) as LoadTag[]).map((k) => ({
          value: k,
          label: t(LOAD_TAG_KEYS[k]),
        }))}
        className="mt-2"
        triggerClassName="rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        aria-label={t("program.load")}
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder={t("program.noteOptional")}
        className="mt-2 w-full rounded-2xl bg-raised px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
      />
      <button
        type="button"
        disabled={!selected || saving}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary shadow-[var(--shadow-primary)] disabled:opacity-50"
        onClick={() => void submit()}
      >
        {saving ? <Spinner className="size-4" /> : null}
        Programa ekle
      </button>
    </Modal>
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AppSheet title={title} onClose={onClose}>
      {children}
    </AppSheet>
  );
}

export function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block min-w-0 space-y-1">
      <span className="text-xs text-text-2">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="num h-12 w-full min-w-0 rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
      />
    </label>
  );
}

/** Empty-by-default numeric field — no auto defaults. */
export function EmptyNumField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number | "";
  onChange: (n: number | "") => void;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0 space-y-1">
      <span className="text-xs text-text-2">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value === "" ? "" : value}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange("");
            return;
          }
          const n = Number(raw);
          onChange(Number.isFinite(n) ? n : "");
        }}
        className="num h-12 w-full min-w-0 rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] placeholder:text-text-3"
      />
    </label>
  );
}

/* ── Full program builder (name → days → exercises from 1300+) ── */

type DraftEx = {
  key: string;
  name: string;
  exerciseId?: number;
  externalId?: string | null;
  muscle_group: string;
  sets: number;
  rep_lo: number;
  rep_hi: number;
  rest_sec: number;
  load_tag: string;
};

type DraftDay = {
  dow: number;
  name: string;
  focus: string;
  enabled: boolean;
  exercises: DraftEx[];
};


export function CreateProgramWizard({
  onClose,
  onCreated,
  hasActiveProgram,
}: {
  onClose: () => void;
  onCreated: () => Promise<void>;
  hasActiveProgram?: boolean;
}) {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [buildDayIdx, setBuildDayIdx] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [days, setDays] = useState<DraftDay[]>(() =>
    [1, 2, 3, 4, 5, 6, 7].map((dow) => ({
      dow,
      name:
        dow === 1
          ? "Push"
          : dow === 2
            ? "Pull"
            : dow === 3
              ? "Legs"
              : dow === 4
                ? "Push"
                : dow === 5
                  ? "Pull"
                  : dow === 6
                    ? "Legs"
                    : "Rest / Core",
      focus: "",
      enabled: dow <= 6,
      exercises: [],
    })),
  );

  const enabledDays = days.filter((d) => d.enabled);
  const currentDay = enabledDays[buildDayIdx] ?? enabledDays[0];

  function applyTemplate(kind: "ppl" | "full" | "ul" | "blank") {
    setDays((prev) =>
      prev.map((d) => {
        if (kind === "blank") {
          return {
            ...d,
            enabled: d.dow <= 3,
            name: t("program.dayN", { n: d.dow }),
            focus: "",
            exercises: [],
          };
        }
        if (kind === "ppl") {
          const map: Record<number, string> = {
            1: "Push",
            2: "Pull",
            3: "Legs",
            4: "Push",
            5: "Pull",
            6: "Legs",
          };
          return {
            ...d,
            enabled: d.dow <= 6,
            name: map[d.dow] ?? "Rest",
            focus: "",
            exercises: [],
          };
        }
        if (kind === "full") {
          const map: Record<number, string> = {
            1: "Full A",
            3: "Full B",
            5: "Full C",
          };
          return {
            ...d,
            enabled: [1, 3, 5].includes(d.dow),
            name: map[d.dow] ?? "Rest",
            focus: "",
            exercises: [],
          };
        }
        // upper lower
        const map: Record<number, string> = {
          1: "Upper",
          2: "Lower",
          4: "Upper",
          5: "Lower",
        };
        return {
          ...d,
          enabled: [1, 2, 4, 5].includes(d.dow),
          name: map[d.dow] ?? "Rest",
          focus: "",
          exercises: [],
        };
      }),
    );
  }

  function updateEnabledDay(
    dow: number,
    patch: Partial<DraftDay>,
  ) {
    setDays((prev) =>
      prev.map((d) => (d.dow === dow ? { ...d, ...patch } : d)),
    );
  }

  function addExToCurrent(ex: DraftEx) {
    if (!currentDay) return;
    updateEnabledDay(currentDay.dow, {
      exercises: [...currentDay.exercises, ex],
    });
    setPickerOpen(false);
  }

  function removeEx(dow: number, key: string) {
    const day = days.find((d) => d.dow === dow);
    if (!day) return;
    updateEnabledDay(dow, {
      exercises: day.exercises.filter((e) => e.key !== key),
    });
  }

  function updateEx(dow: number, key: string, patch: Partial<DraftEx>) {
    const day = days.find((d) => d.dow === dow);
    if (!day) return;
    updateEnabledDay(dow, {
      exercises: day.exercises.map((e) =>
        e.key === key ? { ...e, ...patch } : e,
      ),
    });
  }

  const [editingKey, setEditingKey] = useState<string | null>(null);

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
      const created = await createProgram({
        data: {
          name: n,
          description: description.trim() || undefined,
          days: enabledDays.map((d) => ({
            dow: d.dow,
            name: d.name.trim() || dowShort(d.dow, locale),
            focus: d.focus.trim() || undefined,
          })),
        },
      });

      // Reload to get day ids — createProgram only returns program id
      // Re-fetch active program via getActiveProgram is on parent; we need day ids.
      // Use addProgramDay was already done in create. Fetch by listing isn't available here.
      // import getActiveProgram
      const { getActiveProgram } = await import("@/lib/server/programs");
      const prog = await getActiveProgram();
      if (!prog || prog.id !== created.id) {
        toast.success(t("program.created"));
        await onCreated();
        return;
      }

      for (const draft of enabledDays) {
        const day = prog.days.find(
          (pd) => pd.dow === draft.dow && pd.name === (draft.name.trim() || dowShort(draft.dow, locale)),
        ) ?? prog.days.find((pd) => pd.dow === draft.dow);
        if (!day) continue;
        for (const ex of draft.exercises) {
          let exerciseId = ex.exerciseId ?? 0;
          if (exerciseId <= 0 && ex.externalId) {
            const r = await adoptDatasetExercise({
              data: { externalId: ex.externalId },
            });
            exerciseId = r.id;
          }
          if (exerciseId <= 0) continue;
          await addProgramExercise({
            data: {
              programDayId: day.id,
              exerciseId,
              sets: ex.sets,
              rep_lo: ex.rep_lo,
              rep_hi: ex.rep_hi,
              rest_sec: ex.rest_sec,
              load_tag: ex.load_tag,
            },
          });
        }
      }

      toast.success(
        t("program.readyWithCount", { name: created.name, n: enabledDays.reduce((a, d) => a + d.exercises.length, 0) }),
      );
      await onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("program.createFailed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title={
        step === 0
          ? "Yeni program"
          : step === 1
            ? t("program.setupDays")
            : "Hareketleri ekle"
      }
      onClose={onClose}
    >
      {/* Progress */}
      <div className="mb-4 flex gap-1.5">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full",
              s <= step ? "bg-primary" : "bg-rule",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          {hasActiveProgram && (
            <p className="rounded-xl bg-accent/10 px-3 py-2.5 text-xs leading-relaxed text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]">
              {t("program.replaceActiveHint")}
            </p>
          )}
          <label className="block space-y-1">
            <span className="text-xs text-text-2">{t("program.nameLabel")}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("program.namePh")}
              className="h-12 w-full rounded-2xl bg-raised px-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              autoFocus
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-text-2">{t("program.descLabel")}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-2xl bg-raised px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            />
          </label>
          <p className="text-xs text-text-3">{t("program.quickTemplate")}</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["ppl", t("program.tplPpl")],
                ["full", "Full body 3"],
                ["ul", t("program.templateUpperLower")],
                ["blank", t("program.tplBlank")],
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => applyTemplate(k)}
                className="rounded-2xl bg-raised px-3 py-3 text-left text-xs font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]"
              >
                {t(lab)}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-semibold text-on-primary"
            onClick={() => {
              if (name.trim().length < 2) {
                toast.error(t("program.nameRequired"));
                return;
              }
              setStep(1);
            }}
          >
            {t("program.nextDays")}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs text-text-2">
            {t("program.whichDays")}
          </p>
          <ul className="space-y-2">
            {days.map((d) => (
              <li
                key={d.dow}
                className={cn(
                  "rounded-2xl p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                  d.enabled ? "bg-raised" : "bg-sunken opacity-60",
                )}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateEnabledDay(d.dow, { enabled: !d.enabled })
                    }
                    className={cn(
                      "grid size-11 place-items-center rounded-xl text-xs font-bold",
                      d.enabled
                        ? "bg-primary text-on-primary"
                        : "bg-sunken text-text-2",
                    )}
                  >
                    {dowShort(d.dow, locale)}
                  </button>
                  <input
                    value={d.name}
                    disabled={!d.enabled}
                    onChange={(e) =>
                      updateEnabledDay(d.dow, { name: e.target.value })
                    }
                    className="h-11 min-w-0 flex-1 rounded-xl bg-sunken px-3 text-sm disabled:opacity-50"
                    placeholder={t("program.dayNamePh")}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-raised font-semibold text-text-2"
              onClick={() => setStep(0)}
            >
              {t("common.back")}
            </button>
            <button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-primary font-semibold text-on-primary"
              onClick={() => {
                if (enabledDays.length === 0) {
                  toast.error(t("program.pickOneDay"));
                  return;
                }
                setBuildDayIdx(0);
                setStep(2);
              }}
            >
              Hareket ekle
            </button>
          </div>
        </div>
      )}

      {step === 2 && currentDay && (
        <div className="space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {enabledDays.map((d, i) => (
              <button
                key={d.dow}
                type="button"
                onClick={() => setBuildDayIdx(i)}
                className={cn(
                  "shrink-0 rounded-2xl px-3 py-2 text-xs font-semibold",
                  i === buildDayIdx
                    ? "bg-primary text-on-primary"
                    : "bg-raised text-text-2",
                )}
              >
                {d.name}
                <span className="ml-1 opacity-70">({d.exercises.length})</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-raised/50 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium">
                {currentDay.name}{" "}
                <span className="text-xs text-text-2">
                  · {dowShort(currentDay.dow, locale)}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="h-10 rounded-xl bg-primary px-3 text-xs font-semibold text-on-primary"
              >
                + Hareket
              </button>
            </div>
            {currentDay.exercises.length === 0 ? (
              <p className="py-4 text-center text-xs text-text-2">
                {t("program.noExercisesYet")}
              </p>
            ) : (
              <ul className="space-y-1.5">
                {currentDay.exercises.map((ex) => {
                  const isEdit = editingKey === ex.key;
                  return (
                    <li
                      key={ex.key}
                      className="rounded-xl bg-sunken px-2.5 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() =>
                            setEditingKey(isEdit ? null : ex.key)
                          }
                        >
                          <p className="truncate text-sm font-medium">
                            {ex.name}
                          </p>
                          <p className="text-[11px] text-text-2">
                            {ex.sets}×{ex.rep_lo}
                            {ex.rep_hi !== ex.rep_lo ? `-${ex.rep_hi}` : ""} ·{" "}
                            {ex.rest_sec}s · {ex.load_tag}
                          </p>
                        </button>
                        <button
                          type="button"
                          className="shrink-0 px-2 text-xs text-accent"
                          onClick={() =>
                            setEditingKey(isEdit ? null : ex.key)
                          }
                        >
                          {isEdit ? t("program.close") : t("common.edit")}
                        </button>
                        <button
                          type="button"
                          className="shrink-0 px-2 text-xs text-danger"
                          onClick={() => removeEx(currentDay.dow, ex.key)}
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                      {isEdit && (
                        <DraftExEditor
                          ex={ex}
                          onChange={(patch) =>
                            updateEx(currentDay.dow, ex.key, patch)
                          }
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-raised font-semibold text-text-2"
              onClick={() => setStep(1)}
            >
              {t("common.back")}
            </button>
            {buildDayIdx < enabledDays.length - 1 ? (
              <button
                type="button"
                className="h-12 flex-1 rounded-2xl bg-primary font-semibold text-on-primary"
                onClick={() => setBuildDayIdx((i) => i + 1)}
              >
                {t("program.nextDay")}
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary disabled:opacity-60"
                onClick={() => void finish()}
              >
                {busy ? <Spinner className="size-4" /> : null}
                {t("program.importCreate")}
              </button>
            )}
          </div>
          {buildDayIdx >= enabledDays.length - 1 && (
            <button
              type="button"
              disabled={busy}
              className="w-full text-center text-xs text-text-2 underline"
              onClick={() => void finish()}
            >
              Hareket eklemeden bitir
            </button>
          )}
        </div>
      )}

      {pickerOpen && currentDay && (
        <ExerciseQuickPicker
          onClose={() => setPickerOpen(false)}
          onConfirm={(draft) => {
            addExToCurrent({
              key: `${Date.now()}-${draft.name}`,
              ...draft,
            });
          }}
        />
      )}
    </Modal>
  );
}

function DraftExEditor({
  ex,
  onChange,
}: {
  ex: DraftEx;
  onChange: (patch: Partial<DraftEx>) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="mt-2 space-y-2 border-t border-rule/60 pt-2">
      <div className="grid grid-cols-2 gap-2">
        <NumField
          label="Set"
          value={ex.sets}
          onChange={(n) => onChange({ sets: Math.max(1, n) })}
        />
        <NumField
          label="Dinlenme (sn)"
          value={ex.rest_sec}
          onChange={(n) => onChange({ rest_sec: Math.max(0, n) })}
        />
        <NumField
          label="Tekrar min"
          value={ex.rep_lo}
          onChange={(n) =>
            onChange({
              rep_lo: Math.max(1, n),
              rep_hi: Math.max(n, ex.rep_hi),
            })
          }
        />
        <NumField
          label="Tekrar max"
          value={ex.rep_hi}
          onChange={(n) =>
            onChange({
              rep_hi: Math.max(ex.rep_lo, n),
            })
          }
        />
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-text-2">{t("program.load")}</span>
        <AppSelect
          value={ex.load_tag}
          onValueChange={(v) => onChange({ load_tag: v })}
          options={(Object.keys(LOAD_TAG_KEYS) as LoadTag[]).map((k) => ({ value: k, label: t(LOAD_TAG_KEYS[k]) }))}
          triggerClassName="h-11 rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          aria-label={t("program.load")}
        />
      </label>
    </div>
  );
}

function ExerciseQuickPicker({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (
    draft: Omit<DraftEx, "key">,
  ) => void;
}) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [rows, setRows] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<ExerciseRow | null>(null);
  const [sets, setSets] = useState<number | "">("");
  const [repLo, setRepLo] = useState<number | "">("");
  const [repHi, setRepHi] = useState<number | "">("");
  const [rest, setRest] = useState<number | "">("");
  const [tag, setTag] = useState<string>("orta");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = window.setTimeout(() => {
      void searchExerciseCatalog({
        data: {
          q,
          muscleGroup: muscle === "all" ? undefined : muscle,
          limit: 120,
        },
      })
        .then((r) => {
          if (!cancelled) setRows(r);
        })
        .finally(() => {
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
    ["core", "muscle.core"],
  ] as const;

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
      exerciseId: picked.id > 0 ? picked.id : undefined,
      externalId: picked.external_id,
      muscle_group: picked.muscle_group,
      sets: s,
      rep_lo: lo,
      rep_hi: hi,
      rest_sec: r,
      load_tag: tag,
    });
  }

  return (
    <AppSheet
      title={picked ? "Set & tekrar" : "1300+ hareket"}
      onClose={onClose}
      nested
      contentClassName="!p-0"
    >
      {!picked ? (
        <>
          <div className="space-y-2 p-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara…"
              className="h-12 w-full rounded-2xl bg-raised px-3 text-sm"
              autoFocus
            />
            <div className="flex gap-1.5 overflow-x-auto">
              {tabs.map(([id, lab]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMuscle(id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold",
                    muscle === id
                      ? "bg-primary text-on-primary"
                      : "bg-raised text-text-2",
                  )}
                >
                  {t(lab)}
                </button>
              ))}
            </div>
          </div>
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {loading ? (
              <li className="py-10 text-center text-xs text-text-2">
                <div
                  className="mx-auto h-24 w-full animate-pulse rounded-2xl bg-raised"
                  aria-busy="true"
                />
              </li>
            ) : (
              rows.map((e) => (
                <li key={`${e.id}-${e.external_id ?? e.name}`}>
                  <button
                    type="button"
                    onClick={() => setPicked(e)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl bg-raised/60 px-3 py-3 text-left text-sm active:bg-accent/10"
                  >
                    <span className="min-w-0 truncate font-medium">
                      {e.name}
                    </span>
                    <MuscleBadge group={e.muscle_group} size="xs" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      ) : (
        <div className="space-y-3 overflow-y-auto p-4">
          <div className="rounded-2xl bg-raised px-3 py-2.5">
            <p className="text-sm font-semibold">{picked.name}</p>
            <p className="text-[11px] text-text-2">
              Set, tekrar ve dinlenmeyi sen gir — otomatik doldurulmaz
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block min-w-0 space-y-1">
              <span className="text-xs text-text-2">Set *</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={sets}
                onChange={(e) =>
                  setSets(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder={t("program.exSetsPh")}
                className="num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                autoFocus
              />
            </label>
            <label className="block min-w-0 space-y-1">
              <span className="text-xs text-text-2">Dinlenme sn *</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={rest}
                onChange={(e) =>
                  setRest(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder={t("program.exRestPh")}
                className="num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              />
            </label>
            <label className="block min-w-0 space-y-1">
              <span className="text-xs text-text-2">Tekrar min *</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={repLo}
                onChange={(e) => {
                  const v =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setRepLo(v);
                  if (
                    typeof v === "number" &&
                    (repHi === "" ||
                      (typeof repHi === "number" && repHi < v))
                  ) {
                    setRepHi(v);
                  }
                }}
                placeholder={t("program.exRepLoPh")}
                className="num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              />
            </label>
            <label className="block min-w-0 space-y-1">
              <span className="text-xs text-text-2">Tekrar max</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={repHi}
                onChange={(e) =>
                  setRepHi(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder={t("program.exRepHiPh")}
                className="num h-12 w-full rounded-2xl bg-raised px-3 text-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs text-text-2">{t("program.load")}</span>
            <AppSelect
              value={tag}
              onValueChange={setTag}
              options={(Object.keys(LOAD_TAG_KEYS) as LoadTag[]).map((k) => ({ value: k, label: t(LOAD_TAG_KEYS[k]) }))}
              triggerClassName="rounded-2xl border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              aria-label={t("program.load")}
            />
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-raised font-semibold text-text-2"
              onClick={() => setPicked(null)}
            >
              {t("program.changeExercise")}
            </button>
            <button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-primary font-semibold text-on-primary"
              onClick={submit}
            >
              {t("common.add")}
            </button>
          </div>
        </div>
      )}
    </AppSheet>
  );
}

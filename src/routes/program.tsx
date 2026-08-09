import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarRange,
  ChevronDown,
  ChevronUp,
  ClipboardPaste,
  Eraser,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { useT } from "@/lib/i18n/provider";
import { btnClass } from "@/components/ui/btn";
import { LoadTagBadge } from "@/components/load-tag";
import { MuscleBadge } from "@/components/muscle-badge";
import { ExercisePreviewButton } from "@/components/exercise-preview";
import { ProgramCardSkeleton } from "@/components/ui/skeleton";
import {
  AddModal,
  CreateProgramWizard,
  DaySettingsModal,
  EditModal,
  ImportModal,
  MetaModal,
  ScheduleModal,
  ShareModal,
} from "@/components/program/modals";
import {
  addProgramDay,
  addProgramExercise,
  deleteProgramExercise,
  getActiveProgram,
  reorderProgramExercises,
  updateProgramDay,
  updateProgramExercise,
  type ProgramDetail,
  type ProgramExerciseRow,
} from "@/lib/server/programs";
import {
  createExercise,
  listExercises,
  type ExerciseRow,
} from "@/lib/server/exercises";
import { abandonProgram } from "@/lib/server/share";
import { clearFutureWorkouts } from "@/lib/server/workouts";
import { DOW_LABELS, DOW_SHORT } from "@/data/library";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/program")({
  component: ProgramPage,
});

function ProgramPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const t = useT();

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDayId, setActiveDayId] = useState<number | null>(null);
  const [editing, setEditing] = useState<ProgramExerciseRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [daySettingsOpen, setDaySettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [library, setLibrary] = useState<ExerciseRow[]>([]);

  const reload = useCallback(async () => {
    const p = await getActiveProgram();
    setProgram(p);
    if (p && p.days.length) {
      setActiveDayId((prev) => {
        if (prev && p.days.some((d) => d.id === prev)) return prev;
        return p.days[0]!.id;
      });
    } else {
      setActiveDayId(null);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([reload(), listExercises()])
      .then(([, lib]) => {
        if (!cancelled) setLibrary(lib);
      })
      .catch(() => {
        if (!cancelled) toast.error(t("common.error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reload, t]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const day = program?.days.find((d) => d.id === activeDayId) ?? program?.days[0];

  async function move(exId: number, dir: -1 | 1) {
    if (!day) return;
    const ids = day.exercises.map((e) => e.id);
    const idx = ids.indexOf(exId);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= ids.length) return;
    const next = [...ids];
    [next[idx], next[j]] = [next[j]!, next[idx]!];
    await reorderProgramExercises({ data: { programDayId: day.id, orderedIds: next } });
    await reload();
  }

  async function removeEx(id: number) {
    if (!confirm(t("common.delete") + "?")) return;
    await deleteProgramExercise({ data: id });
    toast.success(t("common.success"));
    await reload();
  }

  return (
    <AppShell title={t("program.title")} subtitle={program?.name ?? t("program.none")}>
      {loading ? (
        <ProgramCardSkeleton />
      ) : !program ? (
        <div className="space-y-3">
          <div className="rounded-2xl bg-surface px-4 py-8 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <p className="font-display text-xl tracking-wide">{t("program.none")}</p>
            <p className="mt-2 text-sm text-muted">{t("program.noneHint")}</p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className={btnClass("primary", "mt-5 w-full")}
            >
              <Sparkles className="size-4" />
              {t("program.create")}
            </button>
            <Link
              to="/kesfet"
              className={btnClass("secondary", "mt-2 w-full")}
            >
              <Search className="size-4" />
              {t("program.fromDiscover")}
            </Link>
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className={btnClass("ghost", "mt-2 w-full")}
            >
              <ClipboardPaste className="size-4" />
              {t("program.fromPaste")}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-surface2 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-yellow"

            >
              <CalendarRange className="size-3.5" />
              {t("program.week")}
            </button>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-surface2 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-yellow"

            >
              <Share2 className="size-3.5" />
              {t("program.share")}
              {program.is_public && program.share_code ? (
                <span className="num text-[10px] text-yellow">{program.share_code}</span>
              ) : null}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className="grid size-12 place-items-center rounded-2xl bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95 active:text-yellow"

                aria-label={t("program.more")}
              >
                <MoreHorizontal className="size-4" />
              </button>
              {moreOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40"
                    aria-label={t("common.close")}
                    onClick={() => setMoreOpen(false)}
                  />
                  <div className="absolute right-0 top-[calc(100%+0.35rem)] z-50 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-surface2"
                      onClick={() => {
                        setMoreOpen(false);
                        setCreateOpen(true);
                      }}
                    >
                      <Sparkles className="size-4 text-muted" />
                      {t("program.create")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-surface2"
                      onClick={() => {
                        setMoreOpen(false);
                        setMetaOpen(true);
                      }}
                    >
                      <FileText className="size-4 text-muted" />
                      {t("program.meta")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-surface2"
                      onClick={() => {
                        setMoreOpen(false);
                        setImportOpen(true);
                      }}
                    >
                      <ClipboardPaste className="size-4 text-muted" />
                      {t("program.fromPaste")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-surface2"
                      onClick={() => {
                        setMoreOpen(false);
                        if (
                          !confirm(
                            "Bugünden itibaren planlanan (ve atlanan) seanslar silinir. Tamamlanan geçmiş KALIR. Devam?",
                          )
                        )
                          return;
                        void clearFutureWorkouts()
                          .then((r) => {
                            toast.success(
                              r.deleted === 0
                                ? "Temizlenecek gelecek seans yok"
                                : `${r.deleted} gelecek seans silindi (geçmiş duruyor)`,
                            );
                          })
                          .catch((e) =>
                            toast.error(e instanceof Error ? e.message : "Hata"),
                          );
                      }}
                    >
                      <Eraser className="size-4 text-muted" />
                      Gelecek seansları temizle
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red hover:bg-red/10"
                      onClick={() => {
                        setMoreOpen(false);
                        if (
                          !confirm(
                            "Programı terk etmek istiyor musun? Program silinir; geçmiş antrenmanların kalır. Yeni programı Keşfet’ten seçersin.",
                          )
                        )
                          return;
                        void abandonProgram()
                          .then(async () => {
                            toast.success("Program terk edildi");
                            setLoading(true);
                            await reload();
                            setLoading(false);
                          })
                          .catch((e) =>
                            toast.error(e instanceof Error ? e.message : "Hata"),
                          );
                      }}
                    >
                      <Trash2 className="size-4" />
                      Programı terk et
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
              const assigned = program.days.find((d) => d.dow === dow);
              return (
                <button
                  key={dow}
                  type="button"
                  onClick={() => {
                    if (assigned) setActiveDayId(assigned.id);
                    else setScheduleOpen(true);
                  }}
                  className={cn(
                    "flex min-h-14 min-w-0 flex-col items-center justify-center rounded-2xl px-0.5 py-1.5 transition active:scale-95",
                    assigned
                      ? "bg-yellow/12 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.3)]"
                      : "bg-surface2 text-dim shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
                  )}
                >
                  <span className="text-[9px] text-muted">
                    {DOW_SHORT[dow] ?? DOW_LABELS[dow]?.slice(0, 2)}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 max-w-full truncate text-[9px] font-semibold leading-tight",
                      assigned ? "text-yellow" : "text-dim",
                    )}
                  >
                    {assigned ? assigned.name : "—"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {program.days
              .slice()
              .sort((a, b) => a.dow - b.dow || a.sort - b.sort)
              .map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDayId(d.id)}
                  className={cn(
                    "shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-95",
                    d.id === day?.id
                      ? "bg-yellow text-bg shadow-[0_4px_14px_rgba(245,197,66,0.25)]"
                      : "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                  )}
                >
                  {d.name}
                </button>
              ))}
            <button
              type="button"
              onClick={async () => {
                const used = new Set(program.days.map((d) => d.dow));
                let free = 1;
                while (used.has(free) && free <= 7) free += 1;
                if (free > 7) {
                  toast.error("Haftada en fazla 7 gün. Önce bir günü sil veya değiştir.");
                  return;
                }
                const r = await addProgramDay({
                  data: {
                    programId: program.id,
                    dow: free,
                    name: `Gün ${program.days.length + 1}`,
                  },
                });
                await reload();
                setActiveDayId(r.id);
              }}
              className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-line px-3 py-2 text-sm text-muted"
            >
              <Plus className="size-3.5" /> Gün
            </button>
          </div>

          {day && (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-xl tracking-wide">{day.name}</p>
                  <p className="text-xs text-muted">
                    {DOW_LABELS[day.dow]}
                    {day.focus ? ` · ${day.focus}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDaySettingsOpen(true)}
                  className="grid size-10 place-items-center rounded-lg border border-line text-muted"
                  aria-label="Gün ayarı"
                >
                  <Settings2 className="size-4" />
                </button>
              </div>

              <ul className="space-y-2">
                {day.exercises.map((ex, i) => (
                  <li
                    key={ex.id}
                    className="min-w-0 rounded-xl border border-line bg-surface p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="num mt-0.5 w-5 shrink-0 text-sm text-dim">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-medium leading-snug">
                          {ex.exercise_name}
                          {ex.detail ? (
                            <span className="text-muted"> · {ex.detail}</span>
                          ) : null}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <MuscleBadge group={ex.muscle_group} />
                          <span className="num text-lg text-yellow">
                            {ex.sets}×{ex.rep_lo}-{ex.rep_hi}
                          </span>
                          <span className="text-xs text-muted">{ex.rest_sec}s</span>
                          <LoadTagBadge tag={ex.load_tag} />
                          <ExercisePreviewButton
                            name={ex.exercise_name}
                            formCues={ex.form_cues}
                            muscleGroup={ex.muscle_group}
                          />
                        </div>
                        {ex.note && (
                          <p className="mt-2 text-xs leading-relaxed text-muted">
                            {ex.note}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-2xl bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95"

                          onClick={() => void move(ex.id, -1)}
                          aria-label="Yukarı"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-2xl bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95"

                          onClick={() => void move(ex.id, 1)}
                          aria-label="Aşağı"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        className="h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]"

                        onClick={() => setEditing(ex)}
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        className="grid size-10 place-items-center rounded-lg border border-line text-red"
                        onClick={() => void removeEx(ex.id)}
                        aria-label="Sil"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line text-sm font-medium text-muted hover:border-yellow/40 hover:text-yellow"
              >
                <Plus className="size-4" /> {t("program.addExercise")}
              </button>
            </>
          )}
        </div>
      )}

      {editing && (
        <EditModal
          exercise={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            await updateProgramExercise({ data: { id: editing.id, ...patch } });
            toast.success("Kaydedildi");
            setEditing(null);
            await reload();
          }}
        />
      )}
      {adding && day && (
        <AddModal
          library={library}
          dayExerciseIds={day.exercises.map((e) => e.exercise_id)}
          onClose={() => setAdding(false)}
          onCreateExercise={async (name) => {
            const r = await createExercise({ data: { name, muscle_group: "diger" } });
            setLibrary(await listExercises());
            return r.id;
          }}
          onAdd={async (payload) => {
            await addProgramExercise({ data: { programDayId: day.id, ...payload } });
            toast.success("Eklendi");
            setAdding(false);
            await reload();
          }}
        />
      )}
      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImported={async () => {
            setImportOpen(false);
            setLoading(true);
            await reload();
            setLoading(false);
          }}
        />
      )}
      {scheduleOpen && program && (
        <ScheduleModal
          program={program}
          onClose={() => setScheduleOpen(false)}
          onSaved={async () => {
            setScheduleOpen(false);
            await reload();
            toast.success("Takvim güncellendi");
          }}
        />
      )}
      {daySettingsOpen && day && (
        <DaySettingsModal
          day={day}
          onClose={() => setDaySettingsOpen(false)}
          onSave={async (patch) => {
            await updateProgramDay({ data: { id: day.id, ...patch } });
            toast.success("Kaydedildi");
            setDaySettingsOpen(false);
            await reload();
          }}
        />
      )}
      {shareOpen && program && (
        <ShareModal
          program={program}
          onClose={() => setShareOpen(false)}
          onSaved={async () => {
            setShareOpen(false);
            await reload();
          }}
        />
      )}
      {metaOpen && program && (
        <MetaModal
          program={program}
          onClose={() => setMetaOpen(false)}
          onSaved={async () => {
            setMetaOpen(false);
            await reload();
          }}
        />
      )}
      {createOpen && (
        <CreateProgramWizard
          hasActiveProgram={!!program}
          onClose={() => setCreateOpen(false)}
          onCreated={async () => {
            setCreateOpen(false);
            setLoading(true);
            await reload();
            setLoading(false);
          }}
        />
      )}
    </AppShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
} from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
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
import { qk } from "@/lib/query-keys";
import { cn, dowLong, dowShort } from "@/lib/utils";
import { AppSheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/program")({
  component: ProgramPage,
});

function ProgramPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const { t, locale } = useI18n();
  const qc = useQueryClient();

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
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [clearFutureOpen, setClearFutureOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

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
        qc.invalidateQueries({ queryKey: qk.me }),
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
      toast.success(
        r.deleted === 0
          ? t("workout.clearFutureNone")
          : t("workout.clearFutureDone", { n: r.deleted }),
      );
      setClearFutureOpen(false);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["workouts"] }),
        qc.invalidateQueries({ queryKey: qk.dashboard }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLeaving(false);
    }
  }

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
          <div className="rounded-2xl bg-sunken px-4 py-8 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <p className="font-display text-xl tracking-wide">{t("program.none")}</p>
            <p className="mt-2 text-sm text-text-2">{t("program.noneHint")}</p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className={btnClass("primary", "mt-5 w-full")}
            >
              <Sparkles className="size-4" />
              {t("program.create")}
            </button>
            <Link
              to="/discover"
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
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-raised text-xs font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-accent"

            >
              <CalendarRange className="size-3.5" />
              {t("program.week")}
            </button>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-raised text-xs font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-accent"

            >
              <Share2 className="size-3.5" />
              {t("program.share")}
              {program.is_public && program.share_code ? (
                <span className="num text-[10px] text-accent">{program.share_code}</span>
              ) : null}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className="grid size-12 place-items-center rounded-2xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95 active:text-accent"

                aria-label={t("program.more")}
              >
                <MoreHorizontal className="size-4" />
              </button>
              {moreOpen && (
                <>
                  <button
                    type="button"
                    className="fixed left-0 top-0 z-40 h-dvh w-dvw"
                    aria-label={t("common.close")}
                    onClick={() => setMoreOpen(false)}
                  />
                  <div className="absolute right-0 top-[calc(100%+0.35rem)] z-50 w-52 overflow-hidden rounded-xl border border-rule bg-sunken shadow-xl">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                      onClick={() => {
                        setMoreOpen(false);
                        setCreateOpen(true);
                      }}
                    >
                      <Sparkles className="size-4 text-text-2" />
                      {t("program.create")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                      onClick={() => {
                        setMoreOpen(false);
                        setMetaOpen(true);
                      }}
                    >
                      <FileText className="size-4 text-text-2" />
                      {t("program.meta")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                      onClick={() => {
                        setMoreOpen(false);
                        setImportOpen(true);
                      }}
                    >
                      <ClipboardPaste className="size-4 text-text-2" />
                      {t("program.fromPaste")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                      onClick={() => {
                        setMoreOpen(false);
                        setClearFutureOpen(true);
                      }}
                    >
                      <Eraser className="size-4 text-text-2" />
                      {t("program.clearFuture")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10"
                      onClick={() => {
                        setMoreOpen(false);
                        setAbandonOpen(true);
                      }}
                    >
                      <Trash2 className="size-4" />
                      {t("program.abandon")}
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
                      ? "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
                      : "bg-raised text-text-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
                  )}
                >
                  <span className="text-[9px] text-text-2">
                    {dowShort(dow, locale)}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 max-w-full truncate text-[9px] font-semibold leading-tight",
                      assigned ? "text-accent" : "text-text-3",
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
                      ? "bg-primary text-on-primary shadow-[var(--shadow-primary)]"
                      : "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
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
                  toast.error(t("program.maxDays"));
                  return;
                }
                const r = await addProgramDay({
                  data: {
                    programId: program.id,
                    dow: free,
                    name: t("program.dayN", { n: program.days.length + 1 }),
                  },
                });
                await reload();
                setActiveDayId(r.id);
              }}
              className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-rule px-3 py-2 text-sm text-text-2"
            >
              <Plus className="size-3.5" /> {t("program.day")}
            </button>
          </div>

          {day && (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-xl tracking-wide">{day.name}</p>
                  <p className="text-xs text-text-2">
                    {dowLong(day.dow, locale)}
                    {day.focus ? ` · ${day.focus}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDaySettingsOpen(true)}
                  className="grid size-10 place-items-center rounded-lg border border-rule text-text-2"
                  aria-label={t("program.daySettings")}
                >
                  <Settings2 className="size-4" />
                </button>
              </div>

              <ul className="space-y-2">
                {day.exercises.map((ex, i) => (
                  <li
                    key={ex.id}
                    className="min-w-0 rounded-xl border border-rule bg-sunken p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="num mt-0.5 w-5 shrink-0 text-sm text-text-3">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-medium leading-snug">
                          {ex.exercise_name}
                          {ex.detail ? (
                            <span className="text-text-2"> · {ex.detail}</span>
                          ) : null}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <MuscleBadge group={ex.muscle_group} />
                          <span className="num text-lg text-accent">
                            {ex.sets}×{ex.rep_lo}-{ex.rep_hi}
                          </span>
                          <span className="text-xs text-text-2">{ex.rest_sec}s</span>
                          <LoadTagBadge tag={ex.load_tag} />
                          <ExercisePreviewButton
                            name={ex.exercise_name}
                            formCues={ex.form_cues}
                            muscleGroup={ex.muscle_group}
                          />
                        </div>
                        {ex.note && (
                          <p className="mt-2 text-xs leading-relaxed text-text-2">
                            {ex.note}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-2xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95"

                          onClick={() => void move(ex.id, -1)}
                          aria-label={t("program.moveUp")}
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-2xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95"

                          onClick={() => void move(ex.id, 1)}
                          aria-label={t("program.moveDown")}
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        className="h-12 flex-1 rounded-2xl bg-raised text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]"

                        onClick={() => setEditing(ex)}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        className="grid size-10 place-items-center rounded-lg border border-rule text-danger"
                        onClick={() => void removeEx(ex.id)}
                        aria-label={t("common.delete")}
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-rule text-sm font-medium text-text-2 hover:border-accent/40 hover:text-accent"
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
            toast.success(t("common.saved"));
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
            toast.success(t("program.scheduleUpdated"));
          }}
        />
      )}
      {daySettingsOpen && day && (
        <DaySettingsModal
          day={day}
          onClose={() => setDaySettingsOpen(false)}
          onSave={async (patch) => {
            await updateProgramDay({ data: { id: day.id, ...patch } });
            toast.success(t("common.saved"));
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

      {abandonOpen ? (
        <AppSheet
          title={t("program.abandon")}
          onClose={() => !leaving && setAbandonOpen(false)}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                disabled={leaving}
                onClick={() => setAbandonOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-edge text-sm font-semibold"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                disabled={leaving}
                onClick={() => void doAbandon()}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-danger text-sm font-semibold text-white disabled:opacity-60"
              >
                {leaving ? <Spinner className="size-4" /> : null}
                {t("program.abandon")}
              </button>
            </div>
          }
        >
          <p className="text-sm leading-relaxed text-text-2">
            {t("program.abandonConfirm")}
          </p>
        </AppSheet>
      ) : null}

      {clearFutureOpen ? (
        <AppSheet
          title={t("program.clearFuture")}
          onClose={() => !leaving && setClearFutureOpen(false)}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                disabled={leaving}
                onClick={() => setClearFutureOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-edge text-sm font-semibold"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                disabled={leaving}
                onClick={() => void doClearFuture()}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary disabled:opacity-60"
              >
                {leaving ? <Spinner className="size-4" /> : null}
                {t("common.yes")}
              </button>
            </div>
          }
        >
          <p className="text-sm leading-relaxed text-text-2">
            {t("workout.clearFutureConfirm")}
          </p>
        </AppSheet>
      ) : null}
    </AppShell>
  );
}

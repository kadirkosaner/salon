import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Check, ChevronDown, ChevronLeft, ChevronRight, Eraser, Plus, Save, Search, SkipForward, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { LoadTagBadge } from "@/components/load-tag";
import { MuscleBadge } from "@/components/muscle-badge";
import { RestTimerBar, type RestTimerState } from "@/components/rest-timer";
import { ExercisePreviewButton } from "@/components/exercise-preview";
import {
  clearFutureWorkouts,
  createWorkout,
  deleteWorkoutExercise,
  getWorkoutByDate,
  listWorkoutsInRange,
  saveWorkoutToProgram,
  skipWorkout,
  swapWorkoutExercise,
  updateWorkout,
  updateWorkoutSet,
  type WorkoutDetail,
  type WorkoutExerciseRow,
  addWorkoutExercise,
} from "@/lib/server/workouts";
import { getActiveProgram } from "@/lib/server/programs";
import {
  similarExercises,
  adoptDatasetExercise,
  searchExerciseCatalog,
  type ExerciseRow,
} from "@/lib/server/exercises";
import { useI18n } from "@/lib/i18n/provider";
import { Btn, btnClass } from "@/components/ui/btn";
import { Sheet } from "@/components/ui/sheet";
import { WorkoutSkeleton } from "@/components/ui/skeleton";
import { PrCelebration, type PrMoment } from "@/components/pr-celebration";
import { haptic } from "@/lib/haptics";
import { addDaysISO, cn, formatDate, todayISO } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const searchSchema = z.object({
  date: z.string().optional(),
});

export const Route = createFileRoute("/antrenman")({
  validateSearch: searchSchema,
  component: WorkoutPage,
});

function WorkoutPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const { t, locale } = useI18n();
  const navigate = useNavigate({ from: "/antrenman" });
  const search = Route.useSearch();
  const date = search.date || todayISO();
  const today = todayISO();

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [calendar, setCalendar] = useState<
    { id: number; date: string; day_name: string; status: string }[]
  >([]);
  const [programName, setProgramName] = useState<string | null>(null);
  const [programDays, setProgramDays] = useState<
    { id: number; name: string; dow: number }[]
  >([]);
  const [rest, setRest] = useState<RestTimerState>(null);
  const [skipOpen, setSkipOpen] = useState(false);
  const [skipBusy, setSkipBusy] = useState(false);
  const [swapFor, setSwapFor] = useState<WorkoutExerciseRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [savingProgram, setSavingProgram] = useState(false);
  const [prMoment, setPrMoment] = useState<PrMoment | null>(null);
  const saveTimers = useRef<Map<number, number>>(new Map());

  // Continuous window around selected day — server auto-extends program while active
  const calFrom = useMemo(() => addDaysISO(date, -45), [date]);
  const calTo = useMemo(() => addDaysISO(date, 60), [date]);

  const goDate = useCallback(
    (d: string) => {
      void navigate({ search: { date: d } });
    },
    [navigate],
  );

  const loadCal = useCallback(async () => {
    try {
      const rows = await listWorkoutsInRange({
        data: { from: calFrom, to: calTo },
      });
      setCalendar(rows);
    } catch {
      /* ignore */
    }
  }, [calFrom, calTo]);

  const loadWorkout = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const w = await getWorkoutByDate({ data: d });
      setWorkout(w);
    } catch {
      setWorkout(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProgram = useCallback(async () => {
    try {
      const p = await getActiveProgram();
      if (!p) {
        setProgramName(null);
        setProgramDays([]);
        return;
      }
      setProgramName(p.name);
      setProgramDays(p.days.map((x) => ({ id: x.id, name: x.name, dow: x.dow })));
    } catch {
      setProgramName(null);
      setProgramDays([]);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    void loadProgram();
  }, [userId, loadProgram]);

  useEffect(() => {
    if (!userId) return;
    void loadCal();
  }, [userId, loadCal]);

  useEffect(() => {
    if (!userId) return;
    void loadWorkout(date);
  }, [userId, date, loadWorkout]);

  const calMap = useMemo(() => {
    const m = new Map<string, { day_name: string; status: string }>();
    for (const r of calendar) {
      m.set(r.date, { day_name: r.day_name, status: r.status });
    }
    return m;
  }, [calendar]);

  const needsProgram = !programName;

  function scheduleSetSave(
    setId: number,
    patch: {
      weight?: number | null;
      reps?: number | null;
      completed?: boolean;
    },
  ) {
    setWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            return {
              ...s,
              ...(patch.reps !== undefined ? { reps: patch.reps } : {}),
              ...(patch.completed !== undefined
                ? { completed: patch.completed }
                : {}),
              ...(patch.weight !== undefined
                ? {
                    weight:
                      patch.weight == null ? null : String(patch.weight),
                  }
                : {}),
            };
          }),
        })),
      };
    });
    setSaveState("saving");
    const prev = saveTimers.current.get(setId);
    if (prev) window.clearTimeout(prev);
    const tmr = window.setTimeout(() => {
      void updateWorkoutSet({ data: { id: setId, ...patch } })
        .then((res) => {
          setSaveState("saved");
          window.setTimeout(() => setSaveState("idle"), 1200);
          if (res && "pr" in res && res.pr) {
            setPrMoment(res.pr);
          }
        })
        .catch((e) => {
          toast.error(e instanceof Error ? e.message : t("common.error"));
          setSaveState("idle");
        });
    }, 350);
    saveTimers.current.set(setId, tmr);
  }

  async function finishWorkout() {
    if (!workout) return;
    try {
      await updateWorkout({ data: { id: workout.id, status: "completed" } });
      setWorkout({ ...workout, status: "completed" });
      toast.success(t("workout.finished"));
      await loadCal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function unskipWorkout() {
    if (!workout) return;
    try {
      await updateWorkout({ data: { id: workout.id, status: "planned" } });
      setWorkout({ ...workout, status: "planned" });
      toast.success(t("workout.unskipped"));
      await loadCal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function createFromProgram(programDayId?: number | null) {
    try {
      const w = await createWorkout({
        data: { date, programDayId: programDayId ?? null },
      });
      setWorkout(w);
      toast.success(t("workout.created"));
      await loadCal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function doSkip(mode: "skip_week" | "postpone_week") {
    if (!workout) return;
    setSkipBusy(true);
    try {
      const r = await skipWorkout({ data: { id: workout.id, mode } });
      if (mode === "postpone_week" && r.newDate) {
        toast.success(
          `${t("workout.postponed")}${r.shifted ? ` · ${r.shifted}` : ""}`,
        );
        goDate(r.newDate);
      } else {
        toast.success(t("workout.skipped"));
        await loadWorkout(date);
      }
      await loadCal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSkipBusy(false);
      setSkipOpen(false);
    }
  }

  async function removeExercise(ex: WorkoutExerciseRow) {
    if (!confirm(t("workout.removeConfirm"))) return;
    try {
      await deleteWorkoutExercise({ data: ex.id });
      setWorkout((prev) =>
        prev
          ? { ...prev, exercises: prev.exercises.filter((e) => e.id !== ex.id) }
          : prev,
      );
      toast.success(t("workout.exerciseRemoved"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function doSwap(newExerciseId: number, externalId?: string | null) {
    if (!swapFor) return;
    try {
      let id = newExerciseId;
      if (externalId) {
        const r = await adoptDatasetExercise({ data: { externalId } });
        id = r.id;
      }
      const w = await swapWorkoutExercise({
        data: { workoutExerciseId: swapFor.id, newExerciseId: id },
      });
      if (w) setWorkout(w);
      setSwapFor(null);
      toast.success(t("workout.swapped"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function doAddExercise(exerciseId: number) {
    if (!workout) return;
    try {
      await addWorkoutExercise({
        data: { workoutId: workout.id, exerciseId },
      });
      await loadWorkout(date);
      setAddOpen(false);
      toast.success(t("workout.exerciseAdded"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function doSaveToProgram() {
    if (!workout) return;
    setSavingProgram(true);
    try {
      await saveWorkoutToProgram({ data: { workoutId: workout.id } });
      toast.success(t("workout.savedToProgram"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSavingProgram(false);
    }
  }

  function onSetComplete(exercise: WorkoutExerciseRow, setId: number, done: boolean) {
    scheduleSetSave(setId, { completed: done });
    if (done) {
      haptic.setComplete();
      setRest({
        seconds: exercise.rest_sec || 90,
        exerciseName: exercise.exercise_name,
      });
    }
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell
      title={t("workout.title")}
      subtitle={
        programName
          ? `${formatDate(date, locale)} · ${programName}`
          : formatDate(date, locale)
      }
      restTimerActive={!!rest}
      actions={
        <span className="text-[11px] text-muted">
          {saveState === "saving"
            ? t("common.saving")
            : saveState === "saved"
              ? t("common.saved")
              : ""}
        </span>
      }
    >
      <div className="w-full min-w-0 space-y-4">
        <ContinuousCalendar
          selected={date}
          today={today}
          statusMap={calMap}
          locale={locale}
          t={t}
          onSelect={goDate}
          onGoToday={() => goDate(today)}
        />

        {needsProgram ? (
          <div className="rounded-xl border border-yellow/30 bg-yellow/10 p-4">
            <p className="font-display text-lg tracking-wide text-yellow">
              {t("workout.noProgram")}
            </p>
            <p className="mt-1 text-sm text-muted">{t("workout.noProgramHint")}</p>
            <Link
              to="/kesfet"
              className={btnClass("primary", "mt-3 w-full")}
            >
              <Search className="size-4" />
              {t("workout.pickProgram")}
            </Link>
          </div>
        ) : null}

        {loading ? (
          <WorkoutSkeleton />
        ) : !workout ? (
          <EmptyDay
            programDays={programDays}
            onCreate={(id) => void createFromProgram(id)}
            t={t}
          />
        ) : (
          <WorkoutBody
            workout={workout}
            t={t}
            locale={locale}
            onFinish={() => void finishWorkout()}
            onSkip={() => setSkipOpen(true)}
            onUnskip={() => void unskipWorkout()}
            onRest={setRest}
            onSetSave={scheduleSetSave}
            onSetComplete={onSetComplete}
            onSwap={(ex) => setSwapFor(ex)}
            onRemove={(ex) => void removeExercise(ex)}
            onAdd={() => setAddOpen(true)}
            onSaveProgram={() => void doSaveToProgram()}
            savingProgram={savingProgram}
            onClearFuture={() => {
              if (!confirm(t("workout.clearFutureConfirm"))) return;
              void clearFutureWorkouts()
                .then(async (r) => {
                  toast.success(
                    r.deleted === 0
                      ? t("workout.clearFutureNone")
                      : t("workout.clearFutureDone", { n: r.deleted }),
                  );
                  await loadCal();
                  await loadWorkout(date);
                })
                .catch((e) =>
                  toast.error(e instanceof Error ? e.message : t("common.error")),
                );
            }}
          />
        )}
      </div>

      {rest && <RestTimerBar state={rest} onClose={() => setRest(null)} />}

      {prMoment ? (
        <PrCelebration
          pr={prMoment}
          displayName={user.displayName}
          t={t}
          onClose={() => setPrMoment(null)}
        />
      ) : null}

      {skipOpen && workout && (
        <SkipModal
          t={t}
          busy={skipBusy}
          onClose={() => setSkipOpen(false)}
          onPick={(m) => void doSkip(m)}
        />
      )}

      {swapFor && (
        <SwapModal
          exercise={swapFor}
          t={t}
          onClose={() => setSwapFor(null)}
          onPick={(id, ext) => void doSwap(id, ext)}
        />
      )}

      {addOpen && workout && (
        <AddExModal
          t={t}
          onClose={() => setAddOpen(false)}
          onPick={(id) => void doAddExercise(id)}
        />
      )}
    </AppShell>
  );
}

/* ─── Continuous day strip ─── */

function ContinuousCalendar({
  selected,
  today,
  statusMap,
  locale,
  t,
  onSelect,
  onGoToday,
}: {
  selected: string;
  today: string;
  statusMap: Map<string, { day_name: string; status: string }>;
  locale: string;
  t: (k: string, vars?: Record<string, string | number>) => string;
  onSelect: (d: string) => void;
  onGoToday: () => void;
}) {
  const center = selected;
  const days = useMemo(() => {
    const arr: string[] = [];
    for (let i = -10; i <= 21; i++) arr.push(addDaysISO(center, i));
    return arr;
  }, [center]);

  const scroller = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selected]);

  function tone(d: string): "done" | "missed" | "planned" | "empty" {
    const info = statusMap.get(d);
    if (!info) {
      if (d < today) return "empty";
      return "empty";
    }
    if (info.status === "completed") return "done";
    if (info.status === "skipped") return "missed";
    if (d < today && info.status === "planned") return "missed";
    return "planned";
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="font-display text-lg tracking-wide">
            {formatDate(selected, locale)}
          </p>
          <p className="text-[10px] text-dim">
            {t("workout.dayByDay")}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {selected !== today && (
            <button
              type="button"
              onClick={onGoToday}
              className={btnClass("soft", undefined, { size: "sm" })}
            >
              {t("workout.today")}
            </button>
          )}
          <button
            type="button"
            onClick={() => onSelect(addDaysISO(selected, -7))}
            className={btnClass("icon", "!size-11")}
            aria-label="Prev week"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onSelect(addDaysISO(selected, 7))}
            className={btnClass("icon", "!size-11")}
            aria-label="Next week"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {days.map((d) => {
          const tn = tone(d);
          const isSel = d === selected;
          const isToday = d === today;
          const info = statusMap.get(d);
          const dt = new Date(d + "T12:00:00");
          const dow = dt.toLocaleDateString(locale === "tr" ? "tr" : locale || "en", {
            weekday: "short",
          });
          const dayNum = d.slice(8);
          return (
            <button
              key={d}
              ref={isSel ? selectedRef : undefined}
              type="button"
              onClick={() => onSelect(d)}
              title={info?.day_name ?? d}
              className={cn(
                "flex w-14 shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-1 py-2.5 transition active:scale-95",
                isSel && "ring-2 ring-yellow ring-offset-2 ring-offset-surface",
                tn === "done" && "border-green/40 bg-green/20 text-green",
                tn === "missed" && "border-red/40 bg-red/15 text-red",
                tn === "planned" && "border-yellow/30 bg-yellow/10 text-yellow",
                tn === "empty" && "border-line bg-surface2/40 text-muted",
                isToday && tn === "empty" && "border-yellow/50",
              )}
            >
              <span className="text-[10px] font-medium uppercase opacity-80">
                {dow}
              </span>
              <span className="num text-base leading-none">{Number(dayNum)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-dim">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-md border border-green/40 bg-green/20" />
          {t("workout.legendDone")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-md border border-red/40 bg-red/15" />
          {t("workout.legendMissed")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-md border border-yellow/40 bg-yellow/15" />
          {t("workout.legendPlanned")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-md border border-line bg-transparent" />
          {t("workout.legendEmpty")}
        </span>
      </div>
    </div>
  );
}

/* ─── Empty day ─── */

function EmptyDay({
  programDays,
  onCreate,
  t,
}: {
  programDays: { id: number; name: string; dow: number }[];
  onCreate: (id?: number | null) => void;
  t: (k: string) => string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="font-medium">{t("workout.emptyDay")}</p>
      <button
        type="button"
        onClick={() => onCreate(null)}
        className={btnClass("primary", "mt-3 w-full")}
      >
        {t("workout.createFromProgram")}
      </button>
      {programDays.length > 0 && (
        <>
          <p className="mt-4 text-xs text-muted">{t("workout.orPickDay")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {programDays.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onCreate(d.id)}
                className={btnClass("ghost", undefined, { size: "sm" })}
              >
                {d.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Workout body ─── */

function WorkoutBody({
  workout,
  t,
  locale: _locale,
  onFinish,
  onSkip,
  onUnskip,
  onRest,
  onSetSave,
  onSetComplete,
  onSwap,
  onRemove,
  onAdd,
  onSaveProgram,
  savingProgram,
  onClearFuture,
}: {
  workout: WorkoutDetail;
  t: (k: string) => string;
  locale: string;
  onFinish: () => void;
  onSkip: () => void;
  onUnskip: () => void;
  onRest: (s: RestTimerState) => void;
  onSetSave: (
    id: number,
    p: { weight?: number | null; reps?: number | null; completed?: boolean },
  ) => void;
  onSetComplete: (ex: WorkoutExerciseRow, setId: number, done: boolean) => void;
  onSwap: (ex: WorkoutExerciseRow) => void;
  onRemove: (ex: WorkoutExerciseRow) => void;
  onAdd: () => void;
  onSaveProgram: () => void;
  savingProgram: boolean;
  onClearFuture: () => void;
}) {
  const statusLabel =
    workout.status === "completed"
      ? t("workout.completed")
      : workout.status === "skipped"
        ? t("workout.skipped")
        : t("workout.planned");

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-2xl tracking-wide text-yellow">
            {workout.day_name}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {workout.exercises.length} · {statusLabel}
          </p>
          {workout.status === "skipped" ? (
            <p className="mt-1 text-[11px] text-dim">{t("workout.skippedHint")}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {workout.status === "skipped" ? (
            <Btn variant="secondary" size="sm" onClick={onUnskip}>
              <ArrowLeftRight className="size-4" />
              {t("workout.unskip")}
            </Btn>
          ) : workout.status !== "completed" ? (
            <>
              <Btn variant="ghost" size="sm" onClick={onSkip}>
                <SkipForward className="size-4" />
                {t("workout.skip")}
              </Btn>
              <Btn variant="primary" size="sm" onClick={onFinish}>
                <Check className="size-4" />
                {t("workout.finish")}
              </Btn>
            </>
          ) : null}
          <Btn
            variant="icon"
            className="!size-11 text-muted hover:text-red"
            onClick={onClearFuture}
            title={t("workout.clearFutureTitle")}
            aria-label="clear future"
          >
            <Eraser className="size-4" />
          </Btn>
        </div>
      </div>

      {workout.exercises.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface2/40 p-4 text-sm text-muted">
          {t("workout.emptyShell")}
        </p>
      ) : (
        <ExerciseList
          exercises={workout.exercises}
          t={t}
          onSetSave={onSetSave}
          onSetComplete={onSetComplete}
          onSwap={onSwap}
          onRemove={onRemove}
          onRest={onRest}
        />
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Btn variant="secondary" className="w-full flex-1" onClick={onAdd}>
          <Plus className="size-4" />
          {t("workout.addExercise")}
        </Btn>
        <Btn
          variant="soft"
          className="w-full flex-1"
          disabled={savingProgram}
          onClick={onSaveProgram}
        >
          {savingProgram ? (
            <Spinner className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {t("workout.saveToProgram")}
        </Btn>
      </div>
      <p className="text-[11px] text-dim">{t("workout.saveToProgramHint")}</p>
    </div>
  );
}

function ExerciseList({
  exercises,
  t,
  onSetSave,
  onSetComplete,
  onSwap,
  onRemove,
  onRest,
}: {
  exercises: WorkoutExerciseRow[];
  t: (k: string) => string;
  onSetSave: (
    id: number,
    p: { weight?: number | null; reps?: number | null; completed?: boolean },
  ) => void;
  onSetComplete: (ex: WorkoutExerciseRow, setId: number, done: boolean) => void;
  onSwap: (ex: WorkoutExerciseRow) => void;
  onRemove: (ex: WorkoutExerciseRow) => void;
  onRest: (s: RestTimerState) => void;
}) {
  // Open first incomplete exercise by default
  const defaultOpen = useMemo(() => {
    const firstOpen = exercises.find(
      (e) => !e.sets.every((s) => s.completed),
    );
    return firstOpen?.id ?? exercises[0]?.id ?? null;
  }, [exercises]);

  const [openId, setOpenId] = useState<number | null>(defaultOpen);

  // When exercise list identity changes (new day / new workout), reset open
  const idsKey = exercises.map((e) => e.id).join(",");
  useEffect(() => {
    const firstOpen = exercises.find(
      (e) => !e.sets.every((s) => s.completed),
    );
    setOpenId(firstOpen?.id ?? exercises[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  function toggle(id: number) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <ul className="space-y-2">
      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.id}
          index={i + 1}
          exercise={ex}
          open={openId === ex.id}
          onToggle={() => toggle(ex.id)}
          t={t}
          onSetSave={onSetSave}
          onSetComplete={onSetComplete}
          onSwap={() => onSwap(ex)}
          onRemove={() => onRemove(ex)}
          onRestStart={() =>
            onRest({
              seconds: ex.rest_sec || 90,
              exerciseName: ex.exercise_name,
            })
          }
        />
      ))}
    </ul>
  );
}

function ExerciseCard({
  index,
  exercise,
  open,
  onToggle,
  t,
  onSetSave,
  onSetComplete,
  onSwap,
  onRemove,
  onRestStart,
}: {
  index: number;
  exercise: WorkoutExerciseRow;
  open: boolean;
  onToggle: () => void;
  t: (k: string) => string;
  onSetSave: (
    id: number,
    p: { weight?: number | null; reps?: number | null; completed?: boolean },
  ) => void;
  onSetComplete: (ex: WorkoutExerciseRow, setId: number, done: boolean) => void;
  onSwap: () => void;
  onRemove: () => void;
  onRestStart: () => void;
}) {
  const doneCount = exercise.sets.filter((s) => s.completed).length;
  const allDone = doneCount === exercise.sets.length && exercise.sets.length > 0;
  const allFilled = exercise.sets.every(
    (s) =>
      s.completed &&
      s.reps != null &&
      s.reps >= exercise.target_rep_hi &&
      s.weight != null,
  );

  const lastLine = exercise.lastTime
    ? `${t("workout.lastTime")} · ${exercise.lastTime.sets
        .map((s) => `${s.weight ?? "—"}×${s.reps ?? "—"}`)
        .join("  ")}`
    : null;

  return (
    <li
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-surface transition",
        open ? "border-yellow/40" : "border-line",
        allDone && !open && "border-green/30 bg-green/5",
      )}
    >
      {/* Header — always visible, toggles open */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-2.5 p-3 text-left active:bg-surface2/40"
        aria-expanded={open}
      >
        <span
          className={cn(
            "num mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-sm",
            allDone
              ? "bg-green/20 text-green"
              : open
                ? "bg-yellow/20 text-yellow"
                : "bg-surface2 text-muted",
          )}
        >
          {allDone ? <Check className="size-3.5" /> : index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words font-medium leading-snug">
            {exercise.exercise_name}
            {exercise.detail ? (
              <span className="text-muted"> · {exercise.detail}</span>
            ) : null}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <MuscleBadge group={exercise.muscle_group} size="xs" />
            <span className="num text-sm text-yellow">
              {exercise.target_sets}×{exercise.target_rep_lo}-{exercise.target_rep_hi}
            </span>
            <span className="text-[11px] text-muted">
              {doneCount}/{exercise.sets.length} set
            </span>
            {!open && exercise.load_tag && (
              <LoadTagBadge tag={exercise.load_tag} />
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 size-5 shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180 text-yellow",
          )}
        />
      </button>

      {/* Body — collapsible */}
      {open && (
        <div className="border-t border-line px-3 pb-3 pt-2">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">
              {exercise.unit === "m" ? "m" : "kg"} · {exercise.rest_sec}s
            </span>
            <LoadTagBadge tag={exercise.load_tag} />
            <ExercisePreviewButton
              name={exercise.exercise_name}
              muscleGroup={exercise.muscle_group}
            />
            <div className="ml-auto flex gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwap();
                }}
                className={btnClass("icon", "!size-11")}
                aria-label={t("workout.swap")}
              >
                <ArrowLeftRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className={btnClass("icon", "!size-11 hover:text-red")}
                aria-label={t("workout.removeExercise")}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {lastLine && (
            <p className="mb-2 break-words text-xs text-muted">{lastLine}</p>
          )}
          {allFilled && (
            <p className="mb-2 rounded-md border border-green/30 bg-green/10 px-2.5 py-1.5 text-xs text-green">
              {t("workout.progressHint")}
            </p>
          )}
          {exercise.suggestedWeight != null && (
            <p className="mb-2 text-xs text-yellow/90">
              {t("workout.suggestWeight")}: {exercise.suggestedWeight}{" "}
              {exercise.unit}
            </p>
          )}
          {exercise.note && (
            <p className="mb-2 text-xs leading-relaxed text-dim">{exercise.note}</p>
          )}

          <div className="space-y-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="rounded-md bg-surface2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dim">
                {t("workout.targetReps")}: {exercise.target_rep_lo}–{exercise.target_rep_hi}
              </span>
            </div>
            <div className="set-grid text-[10px] font-semibold uppercase tracking-wide text-dim">
              <span>#</span>
              <span>{exercise.unit || "kg"}</span>
              <span>{t("workout.reps")}</span>
              <span />
            </div>
            {exercise.sets.map((s) => (
              <div key={s.id} className="set-grid">
                <span className="num text-sm text-muted">{s.set_index}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={s.weight ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value;
                    onSetSave(s.id, {
                      weight: v === "" ? null : Number(v),
                    });
                  }}
                  className="h-11 min-w-0 rounded-lg border border-line-strong bg-bg px-2 text-center text-sm placeholder:text-dim"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={s.reps ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value;
                    onSetSave(s.id, {
                      reps: v === "" ? null : Number(v),
                    });
                  }}
                  className="h-11 min-w-0 rounded-lg border border-line-strong bg-bg px-2 text-center text-sm placeholder:text-dim"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = !s.completed;
                    onSetComplete(exercise, s.id, next);
                    if (next) onRestStart();
                  }}
                  className={cn(
                    "grid size-12 place-items-center rounded-2xl transition active:scale-95",
                    s.completed
                      ? "set-done-pop bg-green/20 text-green shadow-[inset_0_0_0_1px_rgba(61,214,140,0.35)]"
                      : "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                  )}
                  aria-label={t("workout.completeSet")}
                >
                  <Check className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}


/* ─── Modals ─── */

function SkipModal({
  t,
  busy,
  onClose,
  onPick,
}: {
  t: (k: string) => string;
  busy: boolean;
  onClose: () => void;
  onPick: (m: "skip_week" | "postpone_week") => void;
}) {
  const options = [
    {
      m: "postpone_week" as const,
      title: t("workout.skipTomorrow"),
      hint: t("workout.skipTomorrowHint"),
    },
    {
      m: "skip_week" as const,
      title: t("workout.skipWeek"),
      hint: t("workout.skipWeekHint"),
    },
  ];
  return (
    <Sheet title={t("workout.skipTitle")} onClose={onClose}>
      <p className="mb-3 text-sm text-muted">{t("workout.skipBody")}</p>
      <div className="space-y-2">
        {options.map((o) => (
          <button
            key={o.m}
            type="button"
            disabled={busy}
            onClick={() => onPick(o.m)}
            className="w-full rounded-2xl bg-surface2/80 px-3.5 py-3.5 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-surface disabled:opacity-50"
          >
            <p className="font-medium">{o.title}</p>
            <p className="mt-0.5 text-xs text-muted">{o.hint}</p>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

function SwapModal({
  exercise,
  t,
  onClose,
  onPick,
}: {
  exercise: WorkoutExerciseRow;
  t: (k: string) => string;
  onClose: () => void;
  onPick: (id: number, externalId?: string | null) => void;
}) {
  const [rows, setRows] = useState<ExerciseRow[]>([]);
  useEffect(() => {
    void similarExercises({
      data: { exerciseId: exercise.exercise_id, excludeIds: [exercise.exercise_id] },
    }).then(setRows);
  }, [exercise.exercise_id]);

  return (
    <Sheet title={t("workout.swapTitle")} onClose={onClose}>
      <p className="mb-2 text-xs text-muted">{t("workout.swapHint")}</p>
      <ul className="max-h-72 space-y-1 overflow-y-auto">
        {rows.map((r) => (
          <li key={`${r.id}-${r.external_id ?? r.name}`}>
            <button
              type="button"
              onClick={() =>
                onPick(r.id > 0 ? r.id : -1, r.id > 0 ? null : r.external_id)
              }
              className="flex w-full items-center justify-between rounded-lg border border-transparent bg-surface px-3 py-2.5 text-left text-sm hover:border-line"
            >
              <span className="truncate">{r.name}</span>
              <MuscleBadge group={r.muscle_group} size="xs" />
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

function AddExModal({
  t,
  onClose,
  onPick,
}: {
  t: (k: string) => string;
  onClose: () => void;
  onPick: (id: number) => void;
}) {
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [rows, setRows] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const tmr = window.setTimeout(() => {
      void searchExerciseCatalog({
        data: {
          q,
          muscleGroup: muscle === "all" ? undefined : muscle,
          limit: 100,
        },
      })
        .then((r) => {
          if (!cancelled) setRows(r);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(tmr);
    };
  }, [q, muscle]);

  async function pick(r: ExerciseRow) {
    try {
      if (r.id > 0) {
        onPick(r.id);
        return;
      }
      if (r.external_id) {
        const ad = await adoptDatasetExercise({
          data: { externalId: r.external_id },
        });
        onPick(ad.id);
        return;
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  const tabs = [
    ["all", "muscle.all"],
    ["gogus", "muscle.gogus"],
    ["sirt", "muscle.sirt"],
    ["omuz", "muscle.omuz"],
    ["kol", "muscle.kol"],
    ["bacak", "muscle.bacak"],
    ["core", "muscle.core"],
  ] as const;

  return (
    <Sheet title={t("workout.addExercise")} onClose={onClose}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("workout.searchExercises")}
        className="mb-2 h-12 w-full rounded-2xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        autoFocus
      />
      <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
        {tabs.map(([id, lab]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMuscle(id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold",
              muscle === id ? "bg-yellow text-bg" : "bg-surface2 text-muted",
            )}
          >
            {t(lab)}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="py-8 text-center text-xs text-muted">
          <div className="mx-auto h-10 w-full max-w-xs animate-pulse rounded-xl bg-surface2" />
        </p>
      ) : (
        <ul className="max-h-72 space-y-1 overflow-y-auto">
          {rows.map((r) => (
            <li key={`${r.id}-${r.external_id ?? r.name}`}>
              <button
                type="button"
                onClick={() => void pick(r)}
                className="flex w-full items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-left text-sm active:bg-yellow/10"
              >
                <span className="truncate">{r.name}</span>
                <MuscleBadge group={r.muscle_group} size="xs" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}


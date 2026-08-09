import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Check, ChevronDown, ChevronLeft, ChevronRight, Eraser, Info, MoreHorizontal, Plus, Save, Search, SkipForward, Trash2 } from "@/components/icons";
import { toast } from "sonner";
import { z } from "zod";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { LoadTagBadge } from "@/components/load-tag";
import { MuscleBadge, muscleLabel } from "@/components/muscle-badge";
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
import { btnClass } from "@/components/ui/btn";
import { AppSheet, Sheet } from "@/components/ui/sheet";
import { WorkoutSkeleton } from "@/components/ui/skeleton";
import { PrCelebration, type PrMoment } from "@/components/pr-celebration";
import { haptic } from "@/lib/haptics";
import { ComparisonStrip } from "@/components/workout/comparison-strip";
import { getProgramSocial } from "@/lib/server/benchmarks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDaysISO, cn, formatDate, todayISO } from "@/lib/utils";

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
  const qc = useQueryClient();
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
      // Quiet tip when cache says you're above median (PR overlay still wins visually)
      try {
        const all = qc.getQueriesData<{
          slices: {
            exerciseId: number;
            myPercentile: number | null;
            enough: boolean;
          }[];
        }>({ queryKey: ["bench", exercise.exercise_id] });
        let pct: number | null = null;
        for (const [, data] of all) {
          const s = data?.slices?.find(
            (x) => x.exerciseId === exercise.exercise_id,
          );
          if (s?.enough && s.myPercentile != null && s.myPercentile >= 50) {
            pct = s.myPercentile;
            break;
          }
        }
        if (pct != null) {
          window.setTimeout(() => {
            toast.message(
              t("compare.setAbove", { p: Math.max(1, 100 - pct!) }),
              { duration: 2200 },
            );
          }, 450);
        }
      } catch {
        /* ignore */
      }
    }
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell
      title={t("workout.title")}
      subtitle={programName ?? formatDate(date, locale)}
      restTimerActive={!!rest}
      actions={
        <span className="text-[11px] text-text-2">
          {saveState === "saving"
            ? t("common.saving")
            : saveState === "saved"
              ? t("common.saved")
              : ""}
        </span>
      }
    >
      <div className={cn("w-full min-w-0 space-y-3", workout && !needsProgram && "workout-finish-pad")}>
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
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
            <p className="font-display text-lg tracking-wide text-accent">
              {t("workout.noProgram")}
            </p>
            <p className="mt-1 text-sm text-text-2">{t("workout.noProgramHint")}</p>
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
        ) : needsProgram ? null : !workout ? (
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


function ProgramSocialLine({
  t,
}: {
  t: (k: string, vars?: Record<string, string | number>) => string;
}) {
  const q = useQuery({
    queryKey: ["program-social"] as const,
    queryFn: () => getProgramSocial(),
    staleTime: 5 * 60_000,
  });
  const [open, setOpen] = useState(false);
  if (!q.data || (q.data.count === 0 && q.data.todayDone === 0)) return null;
  const peers = q.data.peers ?? q.data.following ?? [];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-rule/70 bg-raised/30 px-2.5 py-2 text-left text-[11px] text-text-3 active:bg-raised/50"
      >
        {q.data.count > 0 ? (
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <span className="flex -space-x-1.5">
              {peers.slice(0, 4).map((f) => (
                <span
                  key={f.id}
                  className="grid size-5 place-items-center overflow-hidden rounded-full border border-sunken bg-accent/20 text-[8px] font-semibold text-accent"
                  title={f.name}
                >
                  {f.image ? (
                    <img src={f.image} alt="" className="size-full object-cover" />
                  ) : (
                    (f.name[0] ?? "?").toUpperCase()
                  )}
                </span>
              ))}
            </span>
            <span className="truncate font-medium text-text-2">
              {t("compare.programCount", { n: q.data.count })}
            </span>
          </span>
        ) : null}
        {q.data.todayDone > 0 ? (
          <span className="truncate">
            {t("compare.todayDone", { n: q.data.todayDone })}
          </span>
        ) : null}
      </button>
      {open ? (
        <AppSheet title={t("compare.peersTitle")} onClose={() => setOpen(false)}>
          {peers.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-3">
              {t("compare.needPool")}
            </p>
          ) : (
            <ul className="divide-y divide-rule">
              {peers.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {f.image ? (
                      <img src={f.image} alt="" className="size-full object-cover" />
                    ) : (
                      (f.name[0] ?? "?").toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {f.name}
                      {f.isFollowing ? (
                        <span className="ml-1.5 text-[10px] font-semibold text-accent">
                          ·
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[11px] text-text-3">
                      {t("compare.weekStreak", { w: f.week, s: f.streak })}
                    </p>
                  </div>
                  {f.username ? (
                    <Link
                      to="/u/$username"
                      params={{ username: f.username }}
                      className="text-xs font-medium text-accent"
                      onClick={() => setOpen(false)}
                    >
                      @{f.username}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </AppSheet>
      ) : null}
    </>
  );
}

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
  const days = useMemo(() => {
    const arr: string[] = [];
    for (let i = -7; i <= 14; i++) arr.push(addDaysISO(selected, i));
    return arr;
  }, [selected]);

  const scroller = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [legendOpen, setLegendOpen] = useState(false);

  const centerSelected = useCallback(() => {
    const root = scroller.current;
    const el = selectedRef.current;
    if (!root || !el) return;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta =
      elRect.left + elRect.width / 2 - (rootRect.left + rootRect.width / 2);
    root.scrollLeft += delta;
  }, []);

  useLayoutEffect(() => {
    centerSelected();
    const id = window.requestAnimationFrame(() => centerSelected());
    return () => window.cancelAnimationFrame(id);
  }, [selected, days, centerSelected]);

  function tone(d: string): "done" | "missed" | "planned" | "empty" {
    const info = statusMap.get(d);
    if (!info) return "empty";
    if (info.status === "completed") return "done";
    if (info.status === "skipped") return "missed";
    if (d < today && info.status === "planned") return "missed";
    return "planned";
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-xs font-medium text-text-2">
            {formatDate(selected, locale)}
          </p>
          <button
            type="button"
            onClick={() => setLegendOpen((v) => !v)}
            className="grid size-11 shrink-0 place-items-center rounded-full text-text-3 hover:bg-raised hover:text-text-2"
            aria-label={t("workout.legendHint")}
          >
            <Info className="size-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          {selected !== today ? (
            <button
              type="button"
              onClick={onGoToday}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-[11px] font-semibold text-accent"
            >
              {t("workout.today")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onSelect(addDaysISO(selected, -7))}
            className="grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised"
            aria-label="Prev week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelect(addDaysISO(selected, 7))}
            className="grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {legendOpen ? (
        <p className="px-0.5 text-[10px] leading-snug text-text-3">
          {t("workout.legendHint")}
        </p>
      ) : null}

      <div
        ref={scroller}
        className="flex flex-nowrap gap-1 overflow-x-auto overscroll-x-contain px-0.5 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              aria-current={isToday ? "date" : undefined}
              aria-pressed={isSel}
              className={cn(
                "relative flex w-11 shrink-0 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 transition active:scale-95",
                isSel
                  ? "bg-accent/15 text-accent shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
                  : "text-text-2 hover:bg-raised/60",
              )}
            >
              <span className="text-[9px] font-medium uppercase opacity-80">
                {dow}
              </span>
              <span className="num text-sm leading-none">{Number(dayNum)}</span>
              <span
                className={cn(
                  "mt-0.5 size-1.5 rounded-full",
                  tn === "done" && "bg-success",
                  tn === "missed" && "bg-danger",
                  tn === "planned" && "bg-accent",
                  tn === "empty" && "bg-edge",
                )}
              />
            </button>
          );
        })}
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
    <div className="rounded-xl border border-rule bg-sunken p-4">
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
          <p className="mt-4 text-xs text-text-2">{t("workout.orPickDay")}</p>
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

function muscleSummary(
  exercises: WorkoutExerciseRow[],
  t: (k: string) => string,
): string {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const e of exercises) {
    const g = e.muscle_group || "";
    if (!g || seen.has(g)) continue;
    seen.add(g);
    labels.push(muscleLabel(g, t as never));
    if (labels.length >= 4) break;
  }
  return labels.join(" · ");
}

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
  t: (k: string, vars?: Record<string, string | number>) => string;
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [finishConfirm, setFinishConfirm] = useState(false);
  const doneSets = workout.exercises.reduce(
    (n, e) => n + e.sets.filter((s) => s.completed).length,
    0,
  );
  const totalSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
  const doneEx = workout.exercises.filter(
    (e) => e.sets.length > 0 && e.sets.every((s) => s.completed),
  ).length;
  const totalEx = workout.exercises.length;
  const incompleteEx = totalEx - doneEx;
  const allSetsDone = totalSets > 0 && doneSets >= totalSets;
  const canFinish =
    workout.status !== "completed" &&
    workout.status !== "skipped" &&
    doneSets > 0;
  const focusLine = muscleSummary(workout.exercises, t);

  function requestFinish() {
    if (!canFinish) return;
    if (incompleteEx > 0) {
      setFinishConfirm(true);
      return;
    }
    onFinish();
  }

  return (
    <div className="space-y-2.5">
      {/* Single-line header + more menu */}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="min-w-0 truncate font-display text-xl tracking-wide text-accent">
              {workout.day_name.replace(/\s*\/\s*/g, " ")}
            </h2>
            <span className="num shrink-0 text-sm font-semibold text-text-2">
              {doneSets}/{totalSets || 0}
            </span>
          </div>
          {focusLine ? (
            <p className="truncate text-[11px] text-text-3">{focusLine}</p>
          ) : (
            <p className="text-[11px] text-text-3">
              {workout.status === "completed"
                ? t("workout.completed")
                : workout.status === "skipped"
                  ? t("workout.skipped")
                  : t("workout.planned")}
            </p>
          )}
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-xl bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-95"
            aria-label={t("program.more")}
          >
            <MoreHorizontal className="size-5" />
          </button>
          {moreOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label={t("common.close")}
                onClick={() => setMoreOpen(false)}
              />
              <div className="absolute right-0 top-[calc(100%+0.25rem)] z-50 w-52 overflow-hidden rounded-xl border border-rule bg-sunken shadow-xl">
                {workout.status === "skipped" ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                    onClick={() => {
                      setMoreOpen(false);
                      onUnskip();
                    }}
                  >
                    <ArrowLeftRight className="size-4 text-text-2" />
                    {t("workout.unskip")}
                  </button>
                ) : workout.status !== "completed" ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                    onClick={() => {
                      setMoreOpen(false);
                      onSkip();
                    }}
                  >
                    <SkipForward className="size-4 text-text-2" />
                    {t("workout.skip")}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                  onClick={() => {
                    setMoreOpen(false);
                    onAdd();
                  }}
                >
                  <Plus className="size-4 text-text-2" />
                  {t("workout.addExercise")}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                  disabled={savingProgram}
                  onClick={() => {
                    setMoreOpen(false);
                    onSaveProgram();
                  }}
                >
                  <Save className="size-4 text-text-2" />
                  {t("workout.saveToProgram")}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10"
                  onClick={() => {
                    setMoreOpen(false);
                    onClearFuture();
                  }}
                >
                  <Eraser className="size-4" />
                  {t("program.clearFuture")}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {workout.status === "skipped" ? (
        <p className="text-[11px] text-text-3">{t("workout.skippedHint")}</p>
      ) : null}

      <ProgramSocialLine t={t} />

      {workout.exercises.length === 0 ? (
        <p className="rounded-lg border border-rule bg-raised/40 p-4 text-sm text-text-2">
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

      {/* Sticky finish bar — sits flush above nav (no overlap) */}
      {workout.status !== "completed" && workout.status !== "skipped" ? (
        <div
          className="fixed inset-x-0 z-[45] mx-auto flex w-full max-w-[480px] items-center gap-3 border-t border-rule bg-sunken/95 px-3 py-2.5 backdrop-blur-md"
          style={{
            /* nav min-h-16 (4rem) + 1px rule gap — no overlap */
            bottom: "calc(4rem + 1px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="min-w-0 shrink-0">
            <p className="num text-sm font-semibold tabular-nums text-text">
              {doneSets}/{totalSets || 0}
            </p>
            <p className="text-[10px] text-text-3">{t("workout.setsLabel")}</p>
          </div>
          <button
            type="button"
            disabled={!canFinish}
            onClick={requestFinish}
            title={!canFinish ? t("workout.finishNeedSet") : undefined}
            className={cn(
              "flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold transition active:scale-[0.98]",
              !canFinish && "bg-raised text-text-3",
              canFinish && allSetsDone && "bg-primary text-on-primary shadow-[var(--shadow-primary)]",
              canFinish && !allSetsDone && "bg-raised text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
            )}
          >
            <Check className="size-4 shrink-0" />
            <span className="truncate">{t("workout.finish")}</span>
          </button>
        </div>
      ) : null}

      {finishConfirm ? (
        <AppSheet
          title={t("workout.finish")}
          onClose={() => setFinishConfirm(false)}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                className="h-11 flex-1 rounded-xl border border-rule text-sm font-semibold"
                onClick={() => setFinishConfirm(false)}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-on-primary"
                onClick={() => {
                  setFinishConfirm(false);
                  onFinish();
                }}
              >
                {t("workout.finishAnyway")}
              </button>
            </div>
          }
        >
          <p className="text-sm leading-relaxed text-text-2">
            {t("workout.finishIncomplete", { n: incompleteEx })}
          </p>
        </AppSheet>
      ) : null}
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
  t: (k: string, vars?: Record<string, string | number>) => string;
  onSetSave: (
    id: number,
    p: { weight?: number | null; reps?: number | null; completed?: boolean },
  ) => void;
  onSetComplete: (ex: WorkoutExerciseRow, setId: number, done: boolean) => void;
  onSwap: (ex: WorkoutExerciseRow) => void;
  onRemove: (ex: WorkoutExerciseRow) => void;
  onRest: (s: RestTimerState) => void;
}) {
  const defaultOpen = useMemo(() => {
    const firstOpen = exercises.find((e) => !e.sets.every((s) => s.completed));
    return firstOpen?.id ?? exercises[0]?.id ?? null;
  }, [exercises]);

  const [openId, setOpenId] = useState<number | null>(defaultOpen);
  const idsKey = exercises.map((e) => e.id).join(",");
  useEffect(() => {
    const firstOpen = exercises.find((e) => !e.sets.every((s) => s.completed));
    setOpenId(firstOpen?.id ?? exercises[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  function handleSetComplete(
    ex: WorkoutExerciseRow,
    setId: number,
    done: boolean,
  ) {
    onSetComplete(ex, setId, done);
    if (!done) return;
    // After complete, if all sets done → open next incomplete
    const nextSets = ex.sets.map((s) =>
      s.id === setId ? { ...s, completed: true } : s,
    );
    const allDone = nextSets.every((s) => s.completed);
    if (!allDone) return;
    const idx = exercises.findIndex((e) => e.id === ex.id);
    for (let i = idx + 1; i < exercises.length; i++) {
      const n = exercises[i]!;
      if (!n.sets.every((s) => s.completed)) {
        setOpenId(n.id);
        return;
      }
    }
  }

  return (
    <ul className="space-y-1.5">
      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.id}
          index={i + 1}
          exercise={ex}
          open={openId === ex.id}
          onToggle={() => setOpenId((cur) => (cur === ex.id ? null : ex.id))}
          t={t}
          onSetSave={onSetSave}
          onSetComplete={handleSetComplete}
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

function lastWeightForSet(
  exercise: WorkoutExerciseRow,
  setIndex: number,
): number | null {
  const last = exercise.lastTime?.sets;
  if (!last?.length) return null;
  const hit = last.find((s, i) => i + 1 === setIndex) ?? last[last.length - 1];
  return hit?.weight ?? null;
}

function lastRepsForSet(
  exercise: WorkoutExerciseRow,
  setIndex: number,
): number | null {
  const last = exercise.lastTime?.sets;
  if (!last?.length) return null;
  const hit = last.find((s, i) => i + 1 === setIndex) ?? last[last.length - 1];
  return hit?.reps ?? null;
}


function ExerciseActionMenu({
  t,
  hasNote,
  noteOpen,
  onNote,
  onSwap,
  onRemove,
}: {
  t: (k: string, vars?: Record<string, string | number>) => string;
  hasNote: boolean;
  noteOpen: boolean;
  onNote: () => void;
  onSwap: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised"
        aria-label={t("program.more")}
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label={t("common.close")}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+0.25rem)] z-50 w-44 overflow-hidden rounded-xl border border-rule bg-sunken shadow-xl">
            {hasNote ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
                onClick={() => {
                  setOpen(false);
                  onNote();
                }}
              >
                <Info className="size-4 text-text-2" />
                {noteOpen ? t("workout.hideNote") : t("workout.showNote")}
              </button>
            ) : null}
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-raised"
              onClick={() => {
                setOpen(false);
                onSwap();
              }}
            >
              <ArrowLeftRight className="size-4 text-text-2" />
              {t("workout.swap")}
            </button>
            <div className="border-t border-rule" />
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10"
              onClick={() => {
                setOpen(false);
                onRemove();
              }}
            >
              <Trash2 className="size-4" />
              {t("workout.removeExercise")}
            </button>
          </div>
        </>
      ) : null}
    </div>
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
  t: (k: string, vars?: Record<string, string | number>) => string;
  onSetSave: (
    id: number,
    p: { weight?: number | null; reps?: number | null; completed?: boolean },
  ) => void;
  onSetComplete: (ex: WorkoutExerciseRow, setId: number, done: boolean) => void;
  onSwap: () => void;
  onRemove: () => void;
  onRestStart: () => void;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [highlightSet, setHighlightSet] = useState<number | null>(null);
  const doneCount = exercise.sets.filter((s) => s.completed).length;
  const allDone = doneCount === exercise.sets.length && exercise.sets.length > 0;
  const topLast =
    exercise.lastTime?.sets.reduce<number | null>((m, s) => {
      if (s.weight == null) return m;
      return m == null || s.weight > m ? s.weight : m;
    }, null) ?? null;

  function repeatLast() {
    for (const s of exercise.sets) {
      const w = lastWeightForSet(exercise, s.set_index);
      const r = lastRepsForSet(exercise, s.set_index);
      if (w != null || r != null) {
        onSetSave(s.id, {
          ...(w != null ? { weight: w } : {}),
          ...(r != null ? { reps: r } : {}),
        });
      }
    }
  }

  return (
    <li
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-sunken transition",
        open ? "border-accent/40" : "border-rule/80",
        allDone && !open && "border-accent/30 bg-accent/5",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full items-center gap-2 px-2.5 py-2.5 text-left active:bg-raised/40"
        aria-expanded={open}
      >
        <span
          className={cn(
            "num grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold",
            allDone
              ? "bg-accent/20 text-accent"
              : open
                ? "bg-accent/20 text-accent"
                : "bg-raised text-text-2",
          )}
        >
          {allDone ? <Check className="size-3" /> : String(index).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {exercise.exercise_name}
        </span>
        <span className="num shrink-0 text-[11px] text-text-2">
          {exercise.target_sets}×{exercise.target_rep_lo}–{exercise.target_rep_hi}
        </span>
        <span className="num shrink-0 text-[11px] tabular-nums text-text-3">
          {doneCount}/{exercise.sets.length}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-text-3 transition-transform",
            open && "rotate-180 text-accent",
          )}
        />
      </button>

      {open ? (
        <div className="border-t border-rule/80 px-2.5 pb-2.5 pt-2">
          <div className="mb-1.5 flex items-center gap-1.5">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              <MuscleBadge group={exercise.muscle_group} size="xs" />
              {exercise.load_tag ? <LoadTagBadge tag={exercise.load_tag} /> : null}
            </div>
            <ExercisePreviewButton
              name={exercise.exercise_name}
              muscleGroup={exercise.muscle_group}
              compact
            />
            <ExerciseActionMenu
              t={t}
              hasNote={!!exercise.note}
              noteOpen={noteOpen}
              onNote={() => setNoteOpen((v) => !v)}
              onSwap={onSwap}
              onRemove={onRemove}
            />
          </div>

          {topLast != null ? (
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-[11px] text-text-3">
                {t("workout.lastKg", { w: topLast })}
              </p>
              <button
                type="button"
                onClick={repeatLast}
                className="inline-flex min-h-11 items-center rounded-full border border-rule px-3 text-[11px] font-semibold text-accent"
              >
                {t("workout.repeatLast")}
              </button>
            </div>
          ) : null}

          {noteOpen && exercise.note ? (
            <p className="mb-1.5 rounded-lg bg-raised/50 px-2 py-1.5 text-[11px] leading-relaxed text-text-2">
              {exercise.note}
            </p>
          ) : null}

          <div className="set-grid mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-text-3">
            <span>#</span>
            <span>{exercise.unit || "kg"}</span>
            <span>{t("workout.reps")}</span>
            <span />
          </div>
          {exercise.sets.map((s) => {
            const ghostW = lastWeightForSet(exercise, s.set_index);
            const ghostR = lastRepsForSet(exercise, s.set_index);
            const weightRequired = exercise.unit === "kg" || exercise.unit === "lb";
            const hasWeight = s.weight != null && Number(s.weight) > 0;
            const hasReps = s.reps != null && s.reps > 0;
            const canComplete = hasReps && (!weightRequired || hasWeight);
            const missingWeight = weightRequired && !hasWeight;
            const missingReps = !hasReps;
            return (
              <div key={s.id} className="set-grid">
                <span className="num text-xs text-text-3">{s.set_index}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={s.weight ?? ""}
                  placeholder={ghostW != null ? String(ghostW) : "—"}
                  data-set-weight={s.id}
                  onChange={(e) => {
                    const v = e.target.value;
                    onSetSave(s.id, { weight: v === "" ? null : Number(v) });
                  }}
                  className={cn(
                    "rounded-lg border bg-canvas px-1.5 text-center text-sm placeholder:text-text-3/70",
                    highlightSet === s.id && missingWeight
                      ? "border-danger"
                      : "border-edge",
                  )}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={s.reps ?? ""}
                  placeholder={ghostR != null ? String(ghostR) : "—"}
                  data-set-reps={s.id}
                  onChange={(e) => {
                    const v = e.target.value;
                    onSetSave(s.id, { reps: v === "" ? null : Number(v) });
                  }}
                  className={cn(
                    "rounded-lg border bg-canvas px-1.5 text-center text-sm placeholder:text-text-3/70",
                    highlightSet === s.id && missingReps
                      ? "border-danger"
                      : "border-edge",
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (s.completed) {
                      onSetComplete(exercise, s.id, false);
                      return;
                    }
                    if (!canComplete) {
                      setHighlightSet(s.id);
                      const el = document.querySelector<HTMLInputElement>(
                        missingWeight
                          ? `[data-set-weight="${s.id}"]`
                          : `[data-set-reps="${s.id}"]`,
                      );
                      el?.focus();
                      return;
                    }
                    onSetComplete(exercise, s.id, true);
                    onRestStart();
                    setHighlightSet(null);
                  }}
                  className={cn(
                    "set-check grid place-items-center rounded-xl transition active:scale-95",
                    s.completed
                      ? "set-done-pop bg-accent/20 text-accent"
                      : "bg-raised text-text-2",
                    !s.completed && !canComplete && "opacity-50",
                  )}
                  aria-label={t("workout.completeSet")}
                >
                  <Check className="size-4" />
                </button>
              </div>
            );
          })}
          <ComparisonStrip exerciseId={exercise.exercise_id} />
        </div>
      ) : null}
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
      <p className="mb-3 text-sm text-text-2">{t("workout.skipBody")}</p>
      <div className="space-y-2">
        {options.map((o) => (
          <button
            key={o.m}
            type="button"
            disabled={busy}
            onClick={() => onPick(o.m)}
            className="w-full rounded-2xl bg-raised/80 px-3.5 py-3.5 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-sunken disabled:opacity-50"
          >
            <p className="font-medium">{o.title}</p>
            <p className="mt-0.5 text-xs text-text-2">{o.hint}</p>
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
      <p className="mb-2 text-xs text-text-2">{t("workout.swapHint")}</p>
      <ul className="max-h-72 space-y-1 overflow-y-auto">
        {rows.map((r) => (
          <li key={`${r.id}-${r.external_id ?? r.name}`}>
            <button
              type="button"
              onClick={() =>
                onPick(r.id > 0 ? r.id : -1, r.id > 0 ? null : r.external_id)
              }
              className="flex w-full items-center justify-between rounded-lg border border-transparent bg-sunken px-3 py-2.5 text-left text-sm hover:border-rule"
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
        className="mb-2 h-12 w-full rounded-2xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
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
              muscle === id ? "bg-primary text-on-primary" : "bg-raised text-text-2",
            )}
          >
            {t(lab)}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="py-8 text-center text-xs text-text-2">
          <div className="mx-auto h-10 w-full max-w-xs animate-pulse rounded-xl bg-raised" />
        </p>
      ) : (
        <ul className="max-h-72 space-y-1 overflow-y-auto">
          {rows.map((r) => (
            <li key={`${r.id}-${r.external_id ?? r.name}`}>
              <button
                type="button"
                onClick={() => void pick(r)}
                className="flex w-full items-center justify-between rounded-xl bg-sunken px-3 py-2.5 text-left text-sm active:bg-accent/10"
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


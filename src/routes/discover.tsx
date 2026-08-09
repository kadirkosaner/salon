import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Dumbbell, Search, Sparkles, TrendingUp, UserPlus, Users, X } from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/section";
import { MuscleBadge } from "@/components/muscle-badge";
import { ProgramCardSkeleton } from "@/components/ui/skeleton";
import {
  DetailModal,
  ProgramCard,
  StartProgramModal,
  type Pending,
} from "@/components/discover-panel";
import {
  cloneProgram,
  listDiscoverPrograms,
  type PublicProgramCard,
} from "@/lib/server/share";
import { generateWorkouts } from "@/lib/server/workouts";
import {
  followUser,
  unfollowUser,
  type PublicUserCard,
} from "@/lib/server/social";
import { getSuggestedAthletes } from "@/lib/server/activity";
import { searchExerciseCatalog } from "@/lib/server/exercises";
import {
  getDiscoverHome,
  unifiedSearch,
  type UnifiedSearchResult,
} from "@/lib/server/discover";
import {
  emptyFilters,
  hasActiveFilters,
  matchesFilters,
  type DiscoverFilters,
  type ProgramEquipment,
  type ProgramGoal,
  type ProgramLevel,
} from "@/lib/program-tags";
import { useI18n, useT } from "@/lib/i18n/provider";
import { addDaysISO, cn, todayISO } from "@/lib/utils";
import { dowLong } from "@/lib/utils";
import { copyText } from "@/lib/clipboard";
import { qk } from "@/lib/query-keys";
import { Spinner } from "@/components/ui/spinner";
import { ExercisePreviewModal } from "@/components/exercise-preview";
import { AppSheet } from "@/components/ui/sheet";
import { z } from "zod";

const tabSchema = z.object({
  tab: z.enum(["forYou", "programs", "people", "exercises"]).optional(),
});

export const Route = createFileRoute("/discover")({
  validateSearch: tabSchema,
  component: DiscoverPage,
});

const RECENT_KEY = "salon.recent_searches";
const SUGGESTED_Q = ["squat", "bench", "full body", "push", "pull", "admin"];

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is string => typeof x === "string").slice(0, 8);
  } catch {
    return [];
  }
}

function pushRecent(q: string) {
  const t = q.trim();
  if (t.length < 2) return;
  try {
    const next = [t, ...loadRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(
      0,
      8,
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function DiscoverPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const t = useT();
  const { locale } = useI18n();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<UnifiedSearchResult | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [filters, setFilters] = useState<DiscoverFilters>(emptyFilters());
  const [pending, setPending] = useState<Pending | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [cloning, setCloning] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [previewEx, setPreviewEx] = useState<{
    name: string;
    form_cues?: string | null;
    gif_url?: string | null;
    image_url?: string | null;
    muscle_group?: string | null;
  } | null>(null);
  const search = Route.useSearch();
  const tab = search.tab ?? "forYou";
  const raceRef = useRef(0);

  function setTab(next: "forYou" | "programs" | "people" | "exercises") {
    void navigate({
      to: "/discover",
      search: next === "forYou" ? {} : { tab: next },
      replace: true,
    });
  }

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // 250ms debounce
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(q.trim()), 250);
    return () => window.clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (debounced.length < 1) {
      setResults(null);
      setSearching(false);
      return;
    }
    const ticket = ++raceRef.current;
    setSearching(true);
    void unifiedSearch({ data: { q: debounced, locale } })
      .then((r) => {
        if (ticket !== raceRef.current) return;
        setResults(r);
        pushRecent(debounced);
        setRecent(loadRecent());
      })
      .catch(() => {
        if (ticket !== raceRef.current) return;
        toast.error(t("common.error"));
      })
      .finally(() => {
        if (ticket === raceRef.current) setSearching(false);
      });
  }, [debounced, t, locale]);

  const homeQuery = useQuery({
    queryKey: [...qk.discoverHome, locale] as const,
    queryFn: () => getDiscoverHome({ data: { locale } }),
    enabled: !!user?.id && debounced.length < 1 && tab === "forYou",
  });

  const programsQuery = useQuery({
    queryKey: [...qk.discover, "all", locale] as const,
    queryFn: () => listDiscoverPrograms({ data: { locale } }),
    enabled: !!user?.id && debounced.length < 1 && tab === "programs",
  });

  const peopleQuery = useQuery({
    queryKey: ["discover-people"] as const,
    queryFn: () => getSuggestedAthletes({ data: { limit: 40 } }),
    enabled: !!user?.id && debounced.length < 1 && tab === "people",
  });

  const exercisesQuery = useQuery({
    queryKey: ["discover-exercises", muscleFilter] as const,
    queryFn: () =>
      searchExerciseCatalog({
        data: {
          muscleGroup: muscleFilter ?? undefined,
          limit: 80,
        },
      }),
    enabled: !!user?.id && debounced.length < 1 && tab === "exercises",
  });

  const runClone = useCallback(
    async (
      p: Pending,
      opts: { startDate: string; startSourceDayId?: number },
    ) => {
      setCloning(true);
      setPending(null);
      try {
        const r =
          p.kind === "code"
            ? await cloneProgram({
                data: {
                  shareCode: p.shareCode,
                  setActive: true,
                  startDate: opts.startDate,
                  startSourceDayId: opts.startSourceDayId,
                },
              })
            : await cloneProgram({
                data: {
                  programId: p.id,
                  setActive: true,
                  name: p.name,
                  startDate: opts.startDate,
                  startSourceDayId: opts.startSourceDayId,
                },
              });
        const from = opts.startDate > todayISO() ? opts.startDate : todayISO();
        try {
          await generateWorkouts({
            data: {
              fromDate: from,
              weeks: 4,
              untilDate: addDaysISO(from, 28),
            },
          });
        } catch {
          /* horizon fills later */
        }
        const dayHint = r.startDayName
          ? ` · ${r.startDayName} → ${dowLong(r.startDow, locale)}`
          : "";
        toast.success(t("discover.activated", { name: r.name, day: dayHint }));
        void navigate({ to: "/program" });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : t("common.error"));
      } finally {
        setCloning(false);
      }
    },
    [navigate, t, locale],
  );

  async function copyCode(codeStr: string) {
    const ok = await copyText(codeStr);
    if (ok) toast.success(`${t("common.copied")}: ${codeStr}`);
    else toast.message(t("program.codeLabel", { code: codeStr }));
  }

  async function toggleFollow(id: string, isFollowing: boolean) {
    if (isFollowing && !confirm(t("profile.unfollowConfirm"))) return;
    setResults((prev) =>
      prev
        ? {
            ...prev,
            people: prev.people.map((r) =>
              r.id === id
                ? {
                    ...r,
                    is_following: !isFollowing,
                    followers: r.followers + (isFollowing ? -1 : 1),
                  }
                : r,
            ),
          }
        : prev,
    );
    try {
      if (isFollowing) await unfollowUser({ data: id });
      else {
        await followUser({ data: id });
        try {
          if (navigator.vibrate) navigator.vibrate(12);
        } catch {
          /* ignore */
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
      void homeQuery.refetch();
      void peopleQuery.refetch();
    }
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const searchingMode = debounced.length >= 1;
  const shelves = homeQuery.data;

  function filterList(list: PublicProgramCard[]) {
    if (!hasActiveFilters(filters)) return list;
    return list.filter((p) => matchesFilters(p.tags, p.day_count, filters));
  }

  return (
    <AppShell title={t("discover.title")} subtitle={t("discover.subtitle")}>
      <div className="w-full min-w-0 space-y-4">
        {/* Unified search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              // delay so chip click still registers
              window.setTimeout(() => setSearchFocused(false), 180);
            }}
            placeholder={t("discover.searchPlaceholder")}
            className="h-12 w-full rounded-xl border border-edge bg-raised py-2 pl-10 pr-10 text-sm"
            autoComplete="off"
            enterKeyHint="search"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-text-2"
              aria-label={t("common.close")}
            >
              <X className="size-4" />
            </button>
          ) : null}
          {searching ? (
            <Spinner className="absolute right-10 top-1/2 size-4 -translate-y-1/2 text-accent" />
          ) : null}
        </div>

        {/* Share code is handled via main search (see unifiedSearch shareCodeHit) */}

        {/* Filters — wrap, not horizontal rail */}
        {!searchingMode ? (
          <>
            {tab === "forYou" || tab === "programs" ? (
              <FilterChips filters={filters} setFilters={setFilters} t={t} />
            ) : null}
            <div className="flex gap-4 overflow-x-auto border-b border-rule text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(
                [
                  ["forYou", t("discover.tabForYou")],
                  ["programs", t("discover.tabPrograms")],
                  ["people", t("discover.tabPeople")],
                  ["exercises", t("discover.tabExercises")],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "relative -mb-px shrink-0 pb-2 font-medium transition",
                    tab === id
                      ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent"
                      : "text-text-2",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {searchingMode ? (
          <SearchResults
            results={results}
            searching={searching}
            t={t}
            onFollow={toggleFollow}
            onOpenProgram={(id) => setDetailId(id)}
            onOpenExercise={(e) => setPreviewEx(e)}
            onCloneProgram={(p) =>
              setPending({ kind: "id", id: p.id, name: p.name })
            }
            onCopyCode={(c) => void copyCode(c)}
            cloning={cloning}
          />
        ) : (
          <>
            {/* Recent + suggested only while search focused */}
            {searchFocused && !searchingMode && (recent.length > 0 || SUGGESTED_Q.length > 0) ? (
              <div className="space-y-2">
                {recent.length > 0 ? (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
                      {t("discover.recent")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {recent.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setQ(r)}
                          className="rounded-full border border-rule bg-raised px-3 py-1.5 text-xs font-medium"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
                    {t("discover.suggested")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_Q.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setQ(r)}
                        className="rounded-full border border-edge bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "forYou" ? (
              homeQuery.isLoading ? (
                <ProgramCardSkeleton />
              ) : homeQuery.isError || !shelves ? (
                <p className="py-8 text-center text-sm text-text-2">
                  {t("common.error")}
                </p>
              ) : hasActiveFilters(filters) ? (
                (() => {
                  const seen = new Set<number>();
                  const combined: PublicProgramCard[] = [];
                  for (const list of [
                    shelves.featured,
                    shelves.topCloned,
                    shelves.fromFollowing,
                    shelves.forLevel,
                  ]) {
                    for (const p of filterList(list)) {
                      if (seen.has(p.id)) continue;
                      seen.add(p.id);
                      combined.push(p);
                    }
                  }
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                          {t("discover.resultsCount", { n: combined.length })}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setFilters(emptyFilters())}
                          className="text-xs font-medium text-accent"
                        >
                          {t("discover.clearAllFilters")}
                        </button>
                      </div>
                      {combined.length === 0 ? (
                        <p className="py-8 text-center text-sm text-text-2">
                          {t("discover.shelfEmpty")}
                        </p>
                      ) : (
                        <ul className="divide-y divide-rule border-t border-rule">
                          {combined.map((p, i) => (
                            <li key={p.id}>
                              <ProgramCard
                                rank={i + 1}
                                p={p}
                                busy={cloning}
                                onOpen={() => setDetailId(p.id)}
                                onClone={() =>
                                  setPending({ kind: "id", id: p.id, name: p.name })
                                }
                                onCopyCode={() =>
                                  p.share_code && void copyCode(p.share_code)
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-5">
                  <Shelf
                    title={t("discover.featuredWeek")}
                    icon={<Sparkles className="size-4 text-accent" />}
                    items={filterList(shelves.featured)}
                    cloning={cloning}
                    onOpen={setDetailId}
                    onClone={(p) =>
                      setPending({ kind: "id", id: p.id, name: p.name })
                    }
                    onCopyCode={(c) => void copyCode(c)}
                    empty={t("discover.shelfEmpty")}
                  />
                  <Shelf
                    title={t("discover.newest")}
                    icon={<TrendingUp className="size-4 text-info" />}
                    items={filterList(shelves.topCloned)}
                    cloning={cloning}
                    onOpen={setDetailId}
                    onClone={(p) =>
                      setPending({ kind: "id", id: p.id, name: p.name })
                    }
                    onCopyCode={(c) => void copyCode(c)}
                    empty={t("discover.shelfEmpty")}
                    horizontal
                  />
                  <Shelf
                    title={t("discover.followSection")}
                    icon={<Users className="size-4 text-success" />}
                    items={filterList(shelves.fromFollowing)}
                    cloning={cloning}
                    onOpen={setDetailId}
                    onClone={(p) =>
                      setPending({ kind: "id", id: p.id, name: p.name })
                    }
                    onCopyCode={(c) => void copyCode(c)}
                    empty={t("discover.followingEmpty")}
                    horizontal
                  />
                  <Shelf
                    title={
                      shelves.levelHint === "baslangic"
                        ? t("discover.forBeginner")
                        : shelves.levelHint === "orta"
                          ? t("discover.forMid")
                          : t("discover.forAdv")
                    }
                    icon={<BookOpen className="size-4 text-warning" />}
                    items={filterList(shelves.forLevel)}
                    cloning={cloning}
                    onOpen={setDetailId}
                    onClone={(p) =>
                      setPending({ kind: "id", id: p.id, name: p.name })
                    }
                    onCopyCode={(c) => void copyCode(c)}
                    empty={t("discover.shelfEmpty")}
                    horizontal
                  />
                </div>
              )
            ) : null}

            {tab === "programs" ? (
              programsQuery.isLoading ? (
                <ProgramCardSkeleton />
              ) : (
                (() => {
                  const list = filterList(programsQuery.data ?? []);
                  return (
                    <div className="space-y-2">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                        {t("discover.programs")} · {list.length}
                      </h3>
                      {list.length === 0 ? (
                        <p className="py-8 text-center text-sm text-text-2">
                          {t("discover.shelfEmpty")}
                        </p>
                      ) : (
                        <ul className="divide-y divide-rule border-t border-rule">
                          {list.map((p, i) => (
                            <li key={p.id}>
                              <ProgramCard
                                rank={i + 1}
                                p={p}
                                busy={cloning}
                                onOpen={() => setDetailId(p.id)}
                                onClone={() =>
                                  setPending({ kind: "id", id: p.id, name: p.name })
                                }
                                onCopyCode={() =>
                                  p.share_code && void copyCode(p.share_code)
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()
              )
            ) : null}

            {tab === "people" ? (
              peopleQuery.isLoading ? (
                <ProgramCardSkeleton />
              ) : (peopleQuery.data ?? []).length === 0 ? (
                <p className="py-8 text-center text-sm text-text-2">
                  {t("discover.shelfEmpty")}
                </p>
              ) : (
                <ul className="space-y-2">
                  {(peopleQuery.data ?? []).map((r) => (
                    <PersonRow
                      key={r.id}
                      r={{
                        id: r.id,
                        name: r.name,
                        username: r.username,
                        image: r.image,
                        followers: r.followers,
                        following: 0,
                        is_following: r.is_following,
                        follows_you: false,
                        is_self: false,
                        public_programs: r.public_programs,
                      }}
                      t={t}
                      onFollow={(id, following) => void toggleFollow(id, following)}
                    />
                  ))}
                </ul>
              )
            ) : null}

            {tab === "exercises" ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      [null, t("muscle.all")],
                      ["gogus", t("muscle.gogus")],
                      ["sirt", t("muscle.sirt")],
                      ["omuz", t("muscle.omuz")],
                      ["kol", t("muscle.kol")],
                      ["bacak", t("muscle.bacak")],
                      ["core", t("muscle.core")],
                    ] as const
                  ).map(([id, lab]) => (
                    <button
                      key={lab}
                      type="button"
                      onClick={() => setMuscleFilter(id)}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-3 text-xs font-semibold",
                        muscleFilter === id
                          ? "bg-primary text-on-primary"
                          : "border border-rule bg-raised text-text-2",
                      )}
                    >
                      {lab}
                    </button>
                  ))}
                </div>
                {exercisesQuery.isLoading ? (
                  <ProgramCardSkeleton />
                ) : (
                  <ul className="divide-y divide-rule rounded-xl border border-rule bg-raised/40">
                    {(exercisesQuery.data ?? []).map((e, i) => (
                      <li key={`${e.id}-${e.name}-${i}`}>
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewEx({
                              name: e.name,
                              form_cues: e.form_cues,
                              gif_url: e.gif_url,
                              image_url: e.image_url,
                              muscle_group: e.muscle_group,
                            })
                          }
                          className="flex h-14 w-full items-center gap-3 px-3 text-left active:bg-sunken"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                            <Dumbbell className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {e.name}
                          </span>
                          <MuscleBadge group={e.muscle_group} size="xs" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

          </>
        )}
      </div>

      {detailId != null && (
        <DetailModal
          id={detailId}
          busy={cloning}
          onClose={() => setDetailId(null)}
          onClone={(name) => {
            setDetailId(null);
            setPending({ kind: "id", id: detailId, name });
          }}
        />
      )}
      {pending && (
        <StartProgramModal
          pending={pending}
          busy={cloning}
          onCancel={() => setPending(null)}
          onConfirm={(opts) => void runClone(pending, opts)}
        />
      )}
      {previewEx ? (
        <ExercisePreviewModal
          name={previewEx.name}
          formCues={previewEx.form_cues}
          gifUrl={previewEx.gif_url}
          imageUrl={previewEx.image_url}
          muscleGroup={previewEx.muscle_group}
          onClose={() => setPreviewEx(null)}
        />
      ) : null}
    </AppShell>
  );
}

function FilterChips({
  filters,
  setFilters,
  t,
}: {
  filters: DiscoverFilters;
  setFilters: (f: DiscoverFilters) => void;
  t: (k: string, vars?: Record<string, string | number>) => string;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = [
    filters.days,
    filters.level,
    filters.goal,
    filters.equipment,
  ].filter((x) => x != null).length;

  function toggleDays(d: number) {
    setFilters({ ...filters, days: filters.days === d ? null : d });
  }
  function toggleLevel(l: ProgramLevel) {
    setFilters({ ...filters, level: filters.level === l ? null : l });
  }
  function toggleGoal(g: ProgramGoal) {
    setFilters({ ...filters, goal: filters.goal === g ? null : g });
  }
  function toggleEq(e: ProgramEquipment) {
    setFilters({ ...filters, equipment: filters.equipment === e ? null : e });
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95",
      active
        ? "bg-primary text-on-primary"
        : "border border-rule bg-raised text-text-2",
    );

  const tags: { key: string; label: string; clear: () => void }[] = [];
  if (filters.days != null) {
    tags.push({
      key: "days",
      label: `${filters.days} ${t("feed.days")}`,
      clear: () => setFilters({ ...filters, days: null }),
    });
  }
  if (filters.level) {
    const map = {
      baslangic: "discover.levelBeginner",
      orta: "discover.levelMid",
      ileri: "discover.levelAdv",
    } as const;
    tags.push({
      key: "level",
      label: t(map[filters.level]),
      clear: () => setFilters({ ...filters, level: null }),
    });
  }
  if (filters.goal) {
    const map = {
      guc: "discover.goalStrength",
      hipertrofi: "discover.goalHyper",
      kilo: "discover.goalFat",
    } as const;
    tags.push({
      key: "goal",
      label: t(map[filters.goal]),
      clear: () => setFilters({ ...filters, goal: null }),
    });
  }
  if (filters.equipment) {
    const map: Record<string, string> = {
      barbell: t("discover.eq.barbell"),
      dumbbell: t("discover.eq.dumbbell"),
      makine: t("discover.eq.machine"),
      vucut: t("discover.eq.bodyweight"),
    };
    tags.push({
      key: "eq",
      label: map[filters.equipment] ?? filters.equipment,
      clear: () => setFilters({ ...filters, equipment: null }),
    });
  }

  return (
    <div className="flex min-h-[38px] flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold",
          activeCount > 0
            ? "bg-primary text-on-primary"
            : "border border-rule bg-raised text-text-2",
        )}
      >
        {activeCount > 0
          ? t("discover.filtersCount", { n: activeCount })
          : t("discover.filters")}
      </button>
      {tags.map((tag) => (
        <button
          key={tag.key}
          type="button"
          onClick={tag.clear}
          className="inline-flex h-9 items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 text-xs font-medium text-accent"
        >
          {tag.label}
          <X className="size-3" />
        </button>
      ))}
      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => setFilters(emptyFilters())}
          className="text-xs font-medium text-text-2 underline-offset-2 hover:underline"
        >
          {t("discover.clearAllFilters")}
        </button>
      ) : null}

      {open ? (
        <AppSheet title={t("discover.filters")} onClose={() => setOpen(false)}>
          <div className="space-y-4 pb-2">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3">
                {t("discover.filterDays")}
              </p>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5, 6].map((d) => (
                  <button key={d} type="button" className={chip(filters.days === d)} onClick={() => toggleDays(d)}>
                    {d} {t("feed.days")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3">
                {t("discover.filterLevel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["baslangic", "discover.levelBeginner"],
                    ["orta", "discover.levelMid"],
                    ["ileri", "discover.levelAdv"],
                  ] as const
                ).map(([k, label]) => (
                  <button key={k} type="button" className={chip(filters.level === k)} onClick={() => toggleLevel(k)}>
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3">
                {t("discover.filterGoal")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["guc", "discover.goalStrength"],
                    ["hipertrofi", "discover.goalHyper"],
                    ["kilo", "discover.goalFat"],
                  ] as const
                ).map(([k, label]) => (
                  <button key={k} type="button" className={chip(filters.goal === k)} onClick={() => toggleGoal(k)}>
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-3">
                {t("discover.filterEquipment")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["barbell", t("discover.eq.barbell")],
                    ["dumbbell", t("discover.eq.dumbbell")],
                    ["makine", t("discover.eq.machine")],
                    ["vucut", t("discover.eq.bodyweight")],
                  ] as const
                ).map(([k, label]) => (
                  <button key={k} type="button" className={chip(filters.equipment === k)} onClick={() => toggleEq(k)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters(filters) ? (
              <button type="button" className="w-full py-2 text-sm text-text-2" onClick={() => setFilters(emptyFilters())}>
                {t("discover.clearFilters")}
              </button>
            ) : null}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center rounded-[var(--radius-btn)] bg-primary font-semibold text-on-primary"
              onClick={() => setOpen(false)}
            >
              {t("common.done")}
            </button>
          </div>
        </AppSheet>
      ) : null}
    </div>
  );
}

function Shelf({
  title,
  icon,
  items,
  cloning,
  onOpen,
  onClone,
  onCopyCode,
}: {
  title: string;
  icon: React.ReactNode;
  items: PublicProgramCard[];
  cloning: boolean;
  onOpen: (id: number) => void;
  onClone: (p: PublicProgramCard) => void;
  onCopyCode: (c: string) => void;
  empty?: string;
  horizontal?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {icon}
        {title}
      </h3>
      <ul className="divide-y divide-rule border-t border-rule">
        {items.map((p, i) => (
          <li key={p.id}>
            <ProgramCard
              rank={i + 1}
              p={p}
              busy={cloning}
              onOpen={() => onOpen(p.id)}
              onClone={() => onClone(p)}
              onCopyCode={() => p.share_code && onCopyCode(p.share_code)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SearchResults({
  results,
  searching,
  t,
  onFollow,
  onOpenProgram,
  onOpenExercise,
  onCloneProgram,
  onCopyCode,
  cloning,
}: {
  results: UnifiedSearchResult | null;
  searching: boolean;
  t: (k: string, vars?: Record<string, string | number>) => string;
  onFollow: (id: string, following: boolean) => void;
  onOpenProgram: (id: number) => void;
  onOpenExercise: (e: {
    name: string;
    form_cues?: string | null;
    gif_url?: string | null;
    image_url?: string | null;
    muscle_group?: string | null;
  }) => void;
  onCloneProgram: (p: PublicProgramCard) => void;
  onCopyCode: (c: string) => void;
  cloning: boolean;
}) {
  if (!results && searching) {
    return (
      <div className="flex justify-center py-10">
        <div className="mx-auto space-y-3 p-4 w-full max-w-md">
          <div className="h-24 animate-pulse rounded-2xl bg-raised" />
          <div className="h-24 animate-pulse rounded-2xl bg-raised" />
          <div className="h-24 animate-pulse rounded-2xl bg-raised" />
        </div>
      </div>
    );
  }
  if (!results) return null;

  const empty =
    !results.shareCodeHit &&
    results.people.length === 0 &&
    results.programs.length === 0 &&
    results.exercises.length === 0;

  if (empty && !searching) {
    if (results.shareCodeMiss) {
      return (
        <EmptyState
          icon={Search}
          title={t("discover.codeNotFound")}
          hint={t("discover.codeNotFoundHint")}
        />
      );
    }
    return (
      <EmptyState
        icon={Search}
        title={t("discover.noResults")}
        hint={t("discover.noResultsHint")}
      />
    );
  }

  return (
    <div className="space-y-5">
      {results.shareCodeHit ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="size-3.5" />
            {t("discover.shareCodeGroup")}
            {results.shareCodeQuery ? (
              <span className="num tracking-widest text-text-2">
                · {results.shareCodeQuery}
              </span>
            ) : null}
          </h3>
          <ProgramCard
            p={results.shareCodeHit}
            busy={cloning}
            onOpen={() => onOpenProgram(results.shareCodeHit!.id)}
            onClone={() => onCloneProgram(results.shareCodeHit!)}
            onCopyCode={() =>
              results.shareCodeHit!.share_code &&
              onCopyCode(results.shareCodeHit!.share_code)
            }
          />
        </section>
      ) : results.shareCodeMiss ? (
        <EmptyState
          icon={Search}
          title={t("discover.codeNotFound")}
          hint={t("discover.codeNotFoundHint")}
        />
      ) : null}

      {results.people.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            <Users className="size-3.5" />
            {t("discover.people")} · {results.people.length}
          </h3>
          <ul className="space-y-2">
            {results.people.slice(0, 5).map((r) => (
              <PersonRow key={r.id} r={r} t={t} onFollow={onFollow} />
            ))}
          </ul>
        </section>
      ) : null}

      {results.programs.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            <BookOpen className="size-3.5" />
            {t("discover.programs")} · {results.programs.length}
          </h3>
          <div className="space-y-2.5">
            {results.programs.slice(0, 5).map((p) => (
              <ProgramCard
                key={p.id}
                p={p}
                busy={cloning}
                onOpen={() => onOpenProgram(p.id)}
                onClone={() => onCloneProgram(p)}
                onCopyCode={() => p.share_code && onCopyCode(p.share_code)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {results.exercises.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            <Dumbbell className="size-3.5" />
            {t("discover.exercises")} · {results.exercises.length}
          </h3>
          <ul className="divide-y divide-rule rounded-xl border border-rule bg-raised/40">
            {results.exercises.slice(0, 5).map((e, i) => (
              <li key={`${e.name}-${i}`}>
                <button
                  type="button"
                  onClick={() =>
                    onOpenExercise({
                      name: e.name,
                      form_cues: e.detail,
                      muscle_group: e.muscle_group,
                    })
                  }
                  className="flex h-14 w-full items-center gap-3 px-3 text-left active:bg-sunken"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                    <Dumbbell className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {e.name}
                  </span>
                  <MuscleBadge group={e.muscle_group} size="xs" />
                </button>
              </li>
            ))}
          </ul>
          {results.exercises.length > 5 ? (
            <p className="mt-1 text-center text-[11px] text-text-2">
              +{results.exercises.length - 5} · {t("discover.searchAll")}
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function PersonRow({
  r,
  t,
  onFollow,
}: {
  r: PublicUserCard;
  t: (k: string, vars?: Record<string, string | number>) => string;
  onFollow: (id: string, following: boolean) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-rule bg-raised/40 px-3 py-2.5">
      <Link
        to="/u/$username"
        params={{ username: r.username || r.id }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 font-display text-sm text-accent">
          {r.image ? (
            <img src={r.image} alt="" className="size-full object-cover" />
          ) : (
            r.name
              .split(/\s+/)
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{r.name}</span>
          <span className="text-[11px] text-text-2">
            {r.username ? `@${r.username}` : ""}
            {r.username ? " · " : ""}
            {r.followers} {t("profile.followers").toLowerCase()}
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => void onFollow(r.id, r.is_following)}
        className={cn(
          "flex h-9 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold",
          r.is_following ? "border border-rule text-text-2" : "bg-primary text-on-primary",
        )}
      >
        {r.is_following ? (
          t("profile.followingBtn")
        ) : (
          <>
            <UserPlus className="size-3.5" /> {t("profile.follow")}
          </>
        )}
      </button>
    </li>
  );
}

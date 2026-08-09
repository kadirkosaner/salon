import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Dumbbell,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/section";
import { ProgramCardSkeleton } from "@/components/ui/skeleton";
import {
  DetailModal,
  ProgramCard,
  StartProgramModal,
  type Pending,
} from "@/components/discover-panel";
import {
  cloneProgram,
  type PublicProgramCard,
} from "@/lib/server/share";
import { generateWorkouts } from "@/lib/server/workouts";
import {
  followUser,
  unfollowUser,
  type PublicUserCard,
} from "@/lib/server/social";
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
import { useT } from "@/lib/i18n/provider";
import { addDaysISO, cn, todayISO } from "@/lib/utils";
import { DOW_LABELS } from "@/data/library";
import { copyText } from "@/lib/clipboard";
import { qk } from "@/lib/query-keys";

export const Route = createFileRoute("/kesfet")({ component: DiscoverPage });

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
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<UnifiedSearchResult | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [filters, setFilters] = useState<DiscoverFilters>(emptyFilters());
  const [code, setCode] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [cloning, setCloning] = useState(false);
  const raceRef = useRef(0);

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
    void unifiedSearch({ data: { q: debounced } })
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
  }, [debounced, t]);

  const homeQuery = useQuery({
    queryKey: qk.discoverHome,
    queryFn: () => getDiscoverHome(),
    enabled: !!user?.id && debounced.length < 1,
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
          ? ` · ${r.startDayName} → ${DOW_LABELS[r.startDow] ?? ""}`
          : "";
        toast.success(`“${r.name}” aktif${dayHint}`);
        void navigate({ to: "/program" });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : t("common.error"));
      } finally {
        setCloning(false);
      }
    },
    [navigate, t],
  );

  async function copyCode(codeStr: string) {
    const ok = await copyText(codeStr);
    if (ok) toast.success(`${t("common.copied")}: ${codeStr}`);
    else toast.message(`Kod: ${codeStr}`);
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
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("discover.searchPlaceholder")}
            className="h-12 w-full rounded-xl border border-line-strong bg-surface2 py-2 pl-10 pr-10 text-sm"
            autoComplete="off"
            enterKeyHint="search"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted"
              aria-label={t("common.close")}
            >
              <X className="size-4" />
            </button>
          ) : null}
          {searching ? (
            <Loader2 className="absolute right-10 top-1/2 size-4 -translate-y-1/2 animate-spin text-yellow" />
          ) : null}
        </div>

        {/* Share code row */}
        {!searchingMode ? (
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t("discover.codePlaceholder")}
              className="num h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface2 px-3 tracking-widest"
              maxLength={8}
            />
            <button
              type="button"
              disabled={cloning}
              onClick={() => {
                const c = code.trim();
                if (c.length < 4) {
                  toast.error(t("discover.codeHint"));
                  return;
                }
                setPending({ kind: "code", name: c, shareCode: c });
              }}
              className="h-11 shrink-0 rounded-lg bg-yellow px-3.5 text-sm font-semibold text-bg disabled:opacity-60"
            >
              {t("discover.addCode")}
            </button>
          </div>
        ) : null}

        {/* Filters */}
        {!searchingMode ? (
          <FilterChips filters={filters} setFilters={setFilters} t={t} />
        ) : null}

        {searchingMode ? (
          <SearchResults
            results={results}
            searching={searching}
            t={t}
            onFollow={toggleFollow}
            onOpenProgram={(id) => setDetailId(id)}
            onCloneProgram={(p) =>
              setPending({ kind: "id", id: p.id, name: p.name })
            }
            onCopyCode={(c) => void copyCode(c)}
            cloning={cloning}
          />
        ) : (
          <>
            {/* Recent + suggested when idle */}
            {(recent.length > 0 || SUGGESTED_Q.length > 0) && (
              <div className="space-y-2">
                {recent.length > 0 ? (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {t("discover.recent")}
                    </p>
                    <div className="scroll-rail-wrap">
                      <div className="scroll-rail">
                        {recent.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setQ(r)}
                            className="shrink-0 rounded-full border border-line bg-surface2 px-3 py-1.5 text-xs font-medium"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {t("discover.suggested")}
                  </p>
                  <div className="scroll-rail-wrap">
                    <div className="scroll-rail">
                      {SUGGESTED_Q.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setQ(r)}
                          className="shrink-0 rounded-full border border-line-strong bg-yellow/10 px-3 py-1.5 text-xs font-medium text-yellow"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {homeQuery.isLoading || !shelves ? (
              <ProgramCardSkeleton />
            ) : (
              <div className="space-y-5">
                <Shelf
                  title={t("discover.featured")}
                  icon={<Sparkles className="size-4 text-yellow" />}
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
                  title={t("discover.topCloned")}
                  icon={<TrendingUp className="size-4 text-softblue" />}
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
                  title={t("discover.fromFollowing")}
                  icon={<Users className="size-4 text-green" />}
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
                  icon={<BookOpen className="size-4 text-orange" />}
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
            )}
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
  t: (k: string) => string;
}) {
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
      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95",
      active
        ? "bg-yellow text-bg"
        : "border border-line bg-surface2 text-muted",
    );

  return (
    <div className="space-y-2">
      <div className="scroll-rail-wrap">
        <div className="scroll-rail">
          <span className="shrink-0 self-center text-[10px] font-semibold uppercase tracking-wider text-dim">
            {t("discover.filterDays")}
          </span>
          {[3, 4, 6].map((d) => (
            <button
              key={d}
              type="button"
              className={chip(filters.days === d)}
              onClick={() => toggleDays(d)}
            >
              {d} {t("feed.days")}
            </button>
          ))}
          <span className="mx-1 shrink-0 self-center text-dim">·</span>
          <span className="shrink-0 self-center text-[10px] font-semibold uppercase tracking-wider text-dim">
            {t("discover.filterLevel")}
          </span>
          {(
            [
              ["baslangic", "discover.levelBeginner"],
              ["orta", "discover.levelMid"],
              ["ileri", "discover.levelAdv"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={chip(filters.level === k)}
              onClick={() => toggleLevel(k)}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </div>
      <div className="scroll-rail-wrap">
        <div className="scroll-rail">
          <span className="shrink-0 self-center text-[10px] font-semibold uppercase tracking-wider text-dim">
            {t("discover.filterGoal")}
          </span>
          {(
            [
              ["guc", "discover.goalStrength"],
              ["hipertrofi", "discover.goalHyper"],
              ["kilo", "discover.goalFat"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={chip(filters.goal === k)}
              onClick={() => toggleGoal(k)}
            >
              {t(label)}
            </button>
          ))}
          <span className="mx-1 shrink-0 self-center text-dim">·</span>
          {(
            [
              ["barbell", "Halter"],
              ["dumbbell", "Dambıl"],
              ["makine", "Makine"],
              ["vucut", "Vücut"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={chip(filters.equipment === k)}
              onClick={() => toggleEq(k)}
            >
              {label}
            </button>
          ))}
          {hasActiveFilters(filters) ? (
            <button
              type="button"
              className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-muted"
              onClick={() => setFilters(emptyFilters())}
            >
              {t("discover.clearFilters")}
            </button>
          ) : null}
        </div>
      </div>
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
  empty,
  horizontal,
}: {
  title: string;
  icon: React.ReactNode;
  items: PublicProgramCard[];
  cloning: boolean;
  onOpen: (id: number) => void;
  onClone: (p: PublicProgramCard) => void;
  onCopyCode: (c: string) => void;
  empty: string;
  horizontal?: boolean;
}) {
  return (
    <section>
      <h3 className="font-display mb-2 flex items-center gap-2 text-base tracking-wide">
        {icon}
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-xs text-muted">
          {empty}
        </p>
      ) : horizontal ? (
        <div className="scroll-rail-wrap">
          <div className="scroll-rail">
            {items.map((p) => (
              <div key={p.id} className="w-[16.5rem] shrink-0">
                <ProgramCard
                  p={p}
                  busy={cloning}
                  onOpen={() => onOpen(p.id)}
                  onClone={() => onClone(p)}
                  onCopyCode={() => p.share_code && onCopyCode(p.share_code)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((p) => (
            <ProgramCard
              key={p.id}
              p={p}
              busy={cloning}
              onOpen={() => onOpen(p.id)}
              onClone={() => onClone(p)}
              onCopyCode={() => p.share_code && onCopyCode(p.share_code)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SearchResults({
  results,
  searching,
  t,
  onFollow,
  onOpenProgram,
  onCloneProgram,
  onCopyCode,
  cloning,
}: {
  results: UnifiedSearchResult | null;
  searching: boolean;
  t: (k: string) => string;
  onFollow: (id: string, following: boolean) => void;
  onOpenProgram: (id: number) => void;
  onCloneProgram: (p: PublicProgramCard) => void;
  onCopyCode: (c: string) => void;
  cloning: boolean;
}) {
  if (!results && searching) {
    return (
      <div className="flex justify-center py-10">
        <div className="mx-auto space-y-3 p-4 w-full max-w-md">
          <div className="h-24 animate-pulse rounded-2xl bg-surface2" />
          <div className="h-24 animate-pulse rounded-2xl bg-surface2" />
          <div className="h-24 animate-pulse rounded-2xl bg-surface2" />
        </div>
      </div>
    );
  }
  if (!results) return null;

  const empty =
    results.people.length === 0 &&
    results.programs.length === 0 &&
    results.exercises.length === 0;

  if (empty && !searching) {
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
      {results.people.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Users className="size-3.5" />
            {t("discover.people")}
          </h3>
          <ul className="space-y-2">
            {results.people.map((r) => (
              <PersonRow key={r.id} r={r} t={t} onFollow={onFollow} />
            ))}
          </ul>
        </section>
      ) : null}

      {results.programs.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <BookOpen className="size-3.5" />
            {t("discover.programs")}
          </h3>
          <div className="space-y-2.5">
            {results.programs.map((p) => (
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
          <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Dumbbell className="size-3.5" />
            {t("discover.exercises")}
          </h3>
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface2/40">
            {results.exercises.map((e, i) => (
              <li
                key={`${e.name}-${i}`}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-yellow/10 text-yellow">
                  <Dumbbell className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {e.name}
                  </span>
                  <span className="text-[11px] text-muted">
                    {e.muscle_group}
                    {e.detail ? ` · ${e.detail}` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
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
  t: (k: string) => string;
  onFollow: (id: string, following: boolean) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-2.5">
      <Link
        to="/u/$username"
        params={{ username: r.username || r.id }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow/15 font-display text-sm text-yellow">
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
          <span className="text-[11px] text-muted">
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
          r.is_following ? "border border-line text-muted" : "bg-yellow text-bg",
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

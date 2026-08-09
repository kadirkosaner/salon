import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ChevronRight,
  RefreshCw,
  Users,
} from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/section";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import {
  followUser,
} from "@/lib/server/social";
import {
  getDiscoverFeed,
  getFeed,
  getSuggestedAthletes,
  type FeedItem,
} from "@/lib/server/activity";
import { getDashboard } from "@/lib/server/dashboard";
import { listDiscoverPrograms } from "@/lib/server/share";
import { useI18n } from "@/lib/i18n/provider";
import { qk } from "@/lib/query-keys";
import { cn, formatDate } from "@/lib/utils";
import { WeeklyVolume } from "@/components/ui/weekly-volume";

const CommentSheet = lazy(() =>
  import("@/components/feed/comment-sheet").then((m) => ({
    default: m.CommentSheet,
  })),
);
const FeedEmptyDiscover = lazy(() =>
  import("@/components/feed/empty-discover").then((m) => ({
    default: m.FeedEmptyDiscover,
  })),
);
const ActivityCard = lazy(() =>
  import("@/components/feed/activity-card").then((m) => ({
    default: m.ActivityCard,
  })),
);
const ComposePost = lazy(() =>
  import("@/components/feed/compose-post").then((m) => ({
    default: m.ComposePost,
  })),
);

export const Route = createFileRoute("/")({ component: FeedPage });

function FeedPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [commentItem, setCommentItem] = useState<FeedItem | null>(null);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStart = useRef<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const feedQuery = useInfiniteQuery({
    queryKey: qk.feed,
    queryFn: ({ pageParam }) =>
      getFeed({
        data: { cursor: pageParam as string | undefined, limit: 12 },
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: { nextCursor: string | null }) =>
      last.nextCursor ?? undefined,
    enabled: !!userId,
  });

  const items: FeedItem[] =
    feedQuery.data?.pages.flatMap((p: { items: FeedItem[] }) => p.items) ?? [];
  const empty = !feedQuery.isLoading && items.length === 0;

  const dashQuery = useQuery({
    queryKey: qk.dashboard,
    queryFn: () => getDashboard(),
    enabled: !!userId,
  });

  const suggestedQuery = useQuery({
    queryKey: qk.suggested,
    queryFn: () => getSuggestedAthletes(),
    enabled: !!userId && empty,
  });

  const discoverQuery = useQuery({
    queryKey: [...qk.feed, "discover"] as const,
    queryFn: () => getDiscoverFeed(),
    enabled: !!userId && empty,
  });

  const programsQuery = useQuery({
    queryKey: [...qk.discover, locale] as const,
    queryFn: () => listDiscoverPrograms({ data: { locale } }),
    enabled: !!userId && empty,
  });

  const hasNextPage = feedQuery.hasNextPage;
  const isFetchingNextPage = feedQuery.isFetchingNextPage;
  const fetchNextPage = feedQuery.fetchNextPage;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, items.length]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await qc.invalidateQueries({ queryKey: qk.feed });
      await feedQuery.refetch();
    } finally {
      setRefreshing(false);
      setPullY(0);
    }
  }, [qc, feedQuery]);

  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY <= 0) touchStart.current = e.touches[0]!.clientY;
    else touchStart.current = null;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStart.current == null) return;
    const dy = e.touches[0]!.clientY - touchStart.current;
    if (dy > 0 && window.scrollY <= 0) setPullY(Math.min(72, dy * 0.45));
  }
  async function onTouchEnd() {
    if (pullY > 48) await refresh();
    else setPullY(0);
    touchStart.current = null;
  }

  async function follow(id: string) {
    try {
      await followUser({ data: id });
      toast.success(t("common.success"));
      void qc.invalidateQueries({ queryKey: qk.suggested });
      void qc.invalidateQueries({ queryKey: qk.feed });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const greeting = user.displayName?.split(" ")[0] ?? t("common.athlete");
  const next = dashQuery.data?.next;

  return (
    <AppShell title={t("feed.title")} subtitle={t("panel.hello", { name: greeting })}>
      <div
        className="w-full min-w-0 space-y-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => void onTouchEnd()}
      >
        {/* pull indicator */}
        <div
          className="flex items-center justify-center overflow-hidden text-xs text-text-2 transition-all"
          style={{ height: pullY || (refreshing ? 28 : 0) }}
        >
          <RefreshCw
            className={cn("size-4", (refreshing || pullY > 48) && "animate-spin text-accent")}
          />
        </div>

        <Suspense
          fallback={
            <div className="h-20 animate-pulse rounded-2xl bg-raised" aria-busy="true" />
          }
        >
          <ComposePost
            onPosted={() => {
              void qc.invalidateQueries({ queryKey: qk.feed });
            }}
          />
        </Suspense>

        {/* Compact next session row */}
        <button
          type="button"
          onClick={() => {
            if (next) navigate({ to: "/antrenman", search: { date: next.date } });
            else navigate({ to: "/antrenman" });
          }}
          className="flex w-full items-center gap-3 border-y border-rule py-3 text-left transition active:bg-raised/40"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-3">
              {t("panel.next")}
            </p>
            {next ? (
              <p className="mt-0.5 truncate text-sm font-semibold">
                {next.day_name}
                <span className="font-normal text-text-2">
                  {" · "}
                  {formatDate(next.date, locale)}
                  {" · "}
                  {next.exercise_count} {t("feed.exercises")}
                </span>
              </p>
            ) : (
              <p className="mt-0.5 text-sm font-medium text-text-2">
                {t("feed.planWorkout")}
              </p>
            )}
          </div>
          <ChevronRight className="size-5 shrink-0 text-text-3" />
        </button>

        {dashQuery.data?.hasActiveProgram && dashQuery.data?.week ? (
          <WeeklyVolume
            current={dashQuery.data.week.volume}
            target={Math.max(dashQuery.data.week.volume * 1.2, 10000)}
            sessionsLeft={Math.max(
              0,
              (dashQuery.data.week.planned ?? 0) -
                (dashQuery.data.week.completed ?? 0),
            )}
            unitLabel="kg"
          />
        ) : null}

        {feedQuery.isLoading ? (
          <DashboardSkeleton />
        ) : empty ? (
          <div className="space-y-5">
            <EmptyState
              icon={Users}
              title={t("feed.emptyTitle")}
              hint={t("feed.emptyHint")}
              actionLabel={t("nav.discover")}
              actionTo="/kesfet"
            />

            <Suspense
              fallback={
                <div className="space-y-3" aria-busy="true">
                  <div className="h-16 animate-pulse rounded-xl bg-raised" />
                  <div className="h-16 animate-pulse rounded-xl bg-raised" />
                </div>
              }
            >
              <FeedEmptyDiscover
                t={t}
                suggested={suggestedQuery.data ?? []}
                discoverItems={discoverQuery.data ?? []}
                programs={programsQuery.data ?? []}
                onFollow={(id) => void follow(id)}
                onComment={setCommentItem}
              />
            </Suspense>
          </div>
        ) : (
          <div className="space-y-3">
            <Suspense
              fallback={
                <div className="space-y-3" aria-busy="true">
                  <div className="h-28 animate-pulse rounded-2xl bg-raised" />
                  <div className="h-28 animate-pulse rounded-2xl bg-raised" />
                </div>
              }
            >
              {items.map((item) => (
                <ActivityCard
                  key={item.id}
                  item={item}
                  t={t}
                  onComment={setCommentItem}
                  onRemoved={() => void qc.invalidateQueries({ queryKey: qk.feed })}
                />
              ))}
            </Suspense>
            <div ref={sentinelRef} className="flex justify-center py-3">
              {feedQuery.isFetchingNextPage ? (
                <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-raised" aria-hidden />
              ) : feedQuery.hasNextPage ? (
                <span className="text-xs text-text-3">{t("feed.loadMore")}</span>
              ) : (
                <span className="text-xs text-text-3">{t("feed.end")}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {commentItem ? (
        <Suspense fallback={null}>
          <CommentSheet
            item={commentItem}
            t={t}
            onClose={() => setCommentItem(null)}
            onAdded={() => {
              void qc.invalidateQueries({ queryKey: qk.feed });
            }}
          />
        </Suspense>
      ) : null}
    </AppShell>
  );
}

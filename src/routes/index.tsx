import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Flame, Loader2, Trophy, Weight } from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState, PageSection, StatTile } from "@/components/ui/section";
import {
  ProgressAreaChart,
  VolumeBarChart,
  formatChartDate,
} from "@/components/ui/charts";
import { getDashboard, getExerciseProgress } from "@/lib/server/dashboard";
import { MAIN_LIFTS } from "@/data/library";
import { cn, formatDateTR } from "@/lib/utils";
import { AppSelect } from "@/components/ui/select";
import { qk } from "@/lib/query-keys";

export const Route = createFileRoute("/")({ component: DashboardPage });

type ChartMode = "volume" | "progress";

function DashboardPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const [chartMode, setChartMode] = useState<ChartMode>("volume");
  const [progressName, setProgressName] = useState<string>(MAIN_LIFTS[0]);
  const navigate = useNavigate();

  const dashQuery = useQuery({
    queryKey: qk.dashboard,
    queryFn: () => getDashboard(),
    enabled: !!userId,
  });
  const data = dashQuery.data ?? null;
  const loading = dashQuery.isLoading;

  const progressQuery = useQuery({
    queryKey: [...qk.dashboard, "progress", progressName] as const,
    queryFn: () => getExerciseProgress({ data: progressName }),
    enabled: !!userId && !!progressName,
    initialData: () =>
      data && progressName === (data.progressExercise || MAIN_LIFTS[0])
        ? data.progress
        : undefined,
  });
  const progress = progressQuery.data ?? [];

  useEffect(() => {
    if (data?.progressExercise) setProgressName(data.progressExercise);
  }, [data?.progressExercise]);

  function changeProgress(name: string) {
    setProgressName(name);
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const greeting = user.displayName?.split(" ")[0] ?? "Sporcu";

  return (
    <AppShell title="Panel" subtitle={`Merhaba, ${greeting}`}>
      {loading || !data ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-yellow" />
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-4">
          <button
            type="button"
            onClick={() => {
              if (data.next) navigate({ to: "/antrenman", search: { date: data.next.date } });
              else navigate({ to: "/antrenman" });
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-yellow/30 bg-gradient-to-br from-yellow/12 via-surface to-surface p-4 text-left transition active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow">
                Sıradaki
              </p>
              {data.next ? (
                <>
                  <p className="font-display mt-1 truncate text-3xl leading-none tracking-wide">
                    {data.next.day_name}
                  </p>
                  <p className="mt-1.5 text-sm text-muted">
                    {formatDateTR(data.next.date)} · {data.next.exercise_count} hareket
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display mt-1 text-2xl">Antrenman planla</p>
                  <p className="mt-1 text-sm text-muted">Takvimden başla</p>
                </>
              )}
            </div>
            <ChevronRight className="size-5 shrink-0 text-yellow" />
          </button>

          <div className="grid grid-cols-3 gap-2">
            <StatTile
              label="Hafta"
              value={`${data.week.completed}/${data.week.planned || 6}`}
              hint="seans"
            />
            <StatTile
              label="Tonaj"
              value={
                data.week.volume >= 1000
                  ? `${(data.week.volume / 1000).toFixed(1)}t`
                  : String(data.week.volume)
              }
              hint="bu hafta"
              icon={<Weight className="size-3.5 text-yellow" />}
            />
            <StatTile
              label="Seri"
              value={`${data.streak}`}
              hint="hafta"
              icon={<Flame className="size-3.5 text-orange" />}
            />
          </div>

          {/* One chart card, two modes — less clutter */}
          <PageSection
            title="Grafikler"
            description={
              chartMode === "volume"
                ? "Son 12 hafta antrenman hacmi"
                : "Hareket max ağırlık trendi"
            }
            action={
              <div className="flex rounded-lg border border-line bg-surface2 p-0.5">
                <button
                  type="button"
                  onClick={() => setChartMode("volume")}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-[11px] font-semibold",
                    chartMode === "volume" ? "bg-yellow text-bg" : "text-muted",
                  )}
                >
                  Hacim
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode("progress")}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-[11px] font-semibold",
                    chartMode === "progress" ? "bg-yellow text-bg" : "text-muted",
                  )}
                >
                  İlerleme
                </button>
              </div>
            }
          >
            {chartMode === "volume" ? (
              <VolumeBarChart
                data={data.volumeByWeek}
                emptyHint="Antrenman bitirdikçe dolacak."
              />
            ) : (
              <div className="space-y-3">
                <AppSelect
                  value={progressName}
                  onValueChange={(v) => void changeProgress(v)}
                  options={MAIN_LIFTS.map((n) => ({ value: n, label: n }))}
                  triggerClassName="h-10 rounded-lg"
                  aria-label="İlerleme hareketi"
                />
                <ProgressAreaChart
                  data={progress}
                  xKey="date"
                  yKey="weight"
                  valueLabel="Max"
                  valueUnit="kg"
                  xFormatter={formatChartDate}
                  emptyHint="Bu hareket için set tamamla."
                />
              </div>
            )}
          </PageSection>

          {data.records.length > 0 && (
            <PageSection title="Rekorlar">
              <ul className="divide-y divide-line">
                {data.records.slice(0, 5).map((r) => (
                  <li key={r.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <Trophy className="size-4 shrink-0 text-yellow" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-[11px] text-muted">{formatDateTR(r.date)}</p>
                    </div>
                    <span className="num text-xl text-yellow">{r.weight}</span>
                    <span className="text-xs text-muted">kg</span>
                  </li>
                ))}
              </ul>
            </PageSection>
          )}

          <PageSection title="Son seanslar">
            {data.recent.length === 0 ? (
              <EmptyState hint="Henüz antrenman yok." />
            ) : (
              <ul className="space-y-2">
                {data.recent.slice(0, 5).map((w) => (
                  <li key={w.id}>
                    <Link
                      to="/antrenman"
                      search={{ date: w.date }}
                      className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface2/30 px-3 py-3 transition hover:border-yellow/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-display truncate text-lg leading-none">{w.day_name}</p>
                        <p className="mt-1 text-xs text-muted">
                          {formatDateTR(w.date)} ·{" "}
                          {w.status === "completed"
                            ? "Tamamlandı"
                            : w.status === "skipped"
                              ? "Atlandı"
                              : "Planlandı"}
                        </p>
                      </div>
                      <span className="num shrink-0 text-sm text-muted">
                        {w.tonnage > 0 ? `${w.tonnage.toLocaleString("tr-TR")}` : "—"}
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-dim" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>
        </div>
      )}
    </AppShell>
  );
}

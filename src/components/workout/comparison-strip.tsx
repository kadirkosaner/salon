import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  getExerciseBenchmarks,
  type BenchmarkSlice,
} from "@/lib/server/benchmarks";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

/** Lazy benchmark strip for one open exercise card. */
export function ComparisonStrip({ exerciseId }: { exerciseId: number }) {
  const t = useT();
  const q = useQuery({
    queryKey: ["bench", exerciseId] as const,
    queryFn: () =>
      getExerciseBenchmarks({
        data: { exerciseIds: [exerciseId], filters: { measure: "relative" } },
      }),
    staleTime: 5 * 60_000,
  });

  if (q.isLoading) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2 text-[11px] text-text-3">
        <Spinner className="size-3.5" /> …
      </div>
    );
  }
  if (!q.data?.optedIn) return null;
  if (!q.data.hasBodyWeight) {
    return (
      <div className="mt-2 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2 text-[11px] text-text-2">
        {t("compare.needWeight")}{" "}
        <Link to="/olculer" className="font-semibold text-accent">
          {t("compare.openMeasures")}
        </Link>
      </div>
    );
  }

  const slice = q.data.slices.find((s) => s.exerciseId === exerciseId);
  if (!slice) return null;
  return <StripBody slice={slice} t={t} />;
}

function StripBody({
  slice,
  t,
}: {
  slice: BenchmarkSlice;
  t: (k: string, vars?: Record<string, string | number>) => string;
}) {
  if (!slice.enough) {
    return (
      <div className="mt-2 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2 text-[11px] text-text-3">
        {t("compare.needPool")}
      </div>
    );
  }

  const p10 = slice.p10 ?? 0;
  const p50 = slice.p50 ?? 0;
  const p90 = slice.p90 ?? 1;
  const mine = slice.myValue;
  const span = Math.max(p90 - p10, 0.001);
  const medPos = Math.min(100, Math.max(0, ((p50 - p10) / span) * 100));
  const myPos =
    mine != null
      ? Math.min(100, Math.max(0, ((mine - p10) / span) * 100))
      : null;

  const fmt = (v: number) =>
    slice.measure === "relative" ? `${v.toFixed(2)}×` : `${Math.round(v)}`;

  return (
    <div className="mt-2 space-y-1.5 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2 text-[10px] text-text-3">
        <span className="truncate font-medium">
          {t("compare.title", { n: slice.pool })}
        </span>
        {slice.myPercentile != null ? (
          <span className="shrink-0 font-semibold text-accent">
            {t("compare.top", { p: 100 - slice.myPercentile })}
          </span>
        ) : null}
      </div>
      {slice.widened ? (
        <p className="text-[10px] text-text-3">{t("compare.widened")}</p>
      ) : null}
      <div className="relative h-2 rounded-full bg-edge/40">
        <span
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-text-3"
          style={{ left: `calc(${medPos}% - 3px)` }}
          title={t("compare.median")}
        />
        {myPos != null ? (
          <span
            className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
            style={{ left: `calc(${myPos}% - 5px)` }}
            title={t("compare.you")}
          />
        ) : null}
      </div>
      <div className="flex justify-between text-[10px] tabular-nums text-text-3">
        <span>{fmt(p10)}</span>
        <span className={cn(mine != null && "text-accent font-semibold")}>
          {mine != null ? fmt(mine) : "—"}
        </span>
        <span>{fmt(p90)}</span>
      </div>
    </div>
  );
}

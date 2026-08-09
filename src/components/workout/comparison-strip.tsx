import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getExerciseBenchmarks } from "@/lib/server/benchmarks";
import { useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useUnitSystem } from "@/lib/use-unit-system";
import { displayWeight, weightUnit } from "@/lib/units";

/**
 * Lightweight in-session “what’s the best on this lift?” strip.
 * Absolute weights only — fun, not a science panel. Labels follow unit system.
 */
export function ComparisonStrip({ exerciseId }: { exerciseId: number }) {
  const t = useT();
  const unitSystem = useUnitSystem();
  const unit = weightUnit(unitSystem);

  const q = useQuery({
    queryKey: ["bench", exerciseId, "best"] as const,
    queryFn: () =>
      getExerciseBenchmarks({
        data: {
          exerciseIds: [exerciseId],
          filters: { measure: "absolute" },
        },
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

  const slice = q.data.slices.find((s) => s.exerciseId === exerciseId);
  if (!slice) return null;

  if (!slice.enough || slice.best == null) {
    return (
      <div className="mt-2 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2">
        <p className="text-[11px] leading-snug text-text-3">
          {t("compare.needPool")}
        </p>
      </div>
    );
  }

  const best = displayWeight(slice.best, unitSystem) ?? 0;
  const mine =
    slice.myValue != null ? displayWeight(slice.myValue, unitSystem) : null;
  const youAreBest =
    slice.myValue != null && slice.myValue >= slice.best - 0.05;
  const topPct =
    slice.myPercentile != null
      ? Math.max(1, 100 - slice.myPercentile)
      : null;

  return (
    <div className="mt-2 space-y-1 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-3">
        {t("compare.funTitle")}
      </p>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-text">
          {t("compare.bestKg", { n: Math.round(best), unit })}
        </p>
        {mine != null ? (
          <p
            className={cn(
              "num text-sm font-semibold",
              youAreBest ? "text-accent" : "text-text-2",
            )}
          >
            {youAreBest
              ? t("compare.youBest")
              : t("compare.youKg", { n: Math.round(mine), unit })}
          </p>
        ) : (
          <p className="text-[11px] text-text-3">{t("compare.logToJoin")}</p>
        )}
      </div>
      {youAreBest ? (
        <p className="text-[11px] font-medium text-accent">
          {t("compare.funCrown")}
        </p>
      ) : topPct != null && topPct <= 50 ? (
        <p className="text-[11px] text-text-2">
          {t("compare.top", { p: topPct })}
        </p>
      ) : mine != null ? (
        <p className="text-[11px] text-text-3">{t("compare.funChase")}</p>
      ) : null}
      {slice.pool > 0 ? (
        <p className="text-[10px] text-text-3">
          {t("compare.poolPeople", { n: slice.pool })}
        </p>
      ) : null}
      {!q.data.hasBodyWeight ? (
        <Link
          to="/measurements"
          className="inline-flex min-h-10 items-center text-[11px] font-semibold text-accent"
        >
          {t("compare.openMeasures")}
        </Link>
      ) : null}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "@/components/icons";
import {
  getExerciseBenchmarks,
  type BenchmarkSlice,
} from "@/lib/server/benchmarks";
import { useT } from "@/lib/i18n/provider";
import { AppSheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type CompareFilters = {
  measure: "relative" | "absolute";
  weightBand?: { min: number; max: number };
  ageMin?: number;
  ageMax?: number;
  sex?: "female" | "male";
};

const WEIGHT_BANDS: { id: string; min: number; max: number; label: string }[] = [
  { id: "u60", min: 40, max: 60, label: "≤60" },
  { id: "60-75", min: 60, max: 75, label: "60–75" },
  { id: "75-90", min: 75, max: 90, label: "75–90" },
  { id: "90+", min: 90, max: 200, label: "90+" },
];

const AGE_BANDS: { id: string; min: number; max: number; label: string }[] = [
  { id: "18-24", min: 18, max: 24, label: "18–24" },
  { id: "25-34", min: 25, max: 34, label: "25–34" },
  { id: "35-44", min: 35, max: 44, label: "35–44" },
  { id: "45+", min: 45, max: 100, label: "45+" },
];

function demoCount(f: CompareFilters): number {
  let n = 0;
  if (f.weightBand) n++;
  if (f.ageMin != null || f.ageMax != null) n++;
  if (f.sex) n++;
  return n;
}

/** Lazy benchmark strip for one open exercise card. */
export function ComparisonStrip({ exerciseId }: { exerciseId: number }) {
  const t = useT();
  const [filters, setFilters] = useState<CompareFilters>({
    measure: "relative",
  });
  const [classOpen, setClassOpen] = useState(false);

  const q = useQuery({
    queryKey: ["bench", exerciseId, filters] as const,
    queryFn: () =>
      getExerciseBenchmarks({
        data: { exerciseIds: [exerciseId], filters },
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
  const activeDemo = demoCount(filters);

  return (
    <div className="mt-2 space-y-1.5 rounded-lg border border-rule/60 bg-raised/30 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[10px] font-medium text-text-3">
          {filters.measure === "relative"
            ? t("compare.relative")
            : t("compare.absolute")}
          {slice ? ` · ${slice.pool}` : ""}
        </p>
        <button
          type="button"
          onClick={() => setClassOpen(true)}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rule px-2 py-0.5 text-[10px] font-semibold text-text-2"
        >
          {t("compare.class")}
          {activeDemo > 0 ? (
            <span className="grid size-4 place-items-center rounded-full bg-accent text-[9px] text-on-primary">
              {activeDemo}
            </span>
          ) : (
            <ChevronDown className="size-3" />
          )}
        </button>
      </div>

      {!q.data.hasBodyWeight && filters.measure === "relative" ? (
        <p className="text-[11px] text-text-2">
          {t("compare.needWeight")}{" "}
          <Link to="/olculer" className="font-semibold text-accent">
            {t("compare.openMeasures")}
          </Link>
        </p>
      ) : slice ? (
        <StripBody slice={slice} t={t} />
      ) : null}

      {classOpen ? (
        <ClassSheet
          filters={filters}
          hasBodyWeight={q.data.hasBodyWeight}
          onClose={() => setClassOpen(false)}
          onApply={(f) => {
            setFilters(f);
            setClassOpen(false);
          }}
          t={t}
        />
      ) : null}
    </div>
  );
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
      <p className="text-[11px] text-text-3">{t("compare.needPool")}</p>
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[10px] text-text-3">
        <span className="truncate">
          {t("compare.title", { n: slice.pool })}
        </span>
        {slice.myPercentile != null ? (
          <span className="shrink-0 font-semibold text-accent">
            {t("compare.top", { p: Math.max(1, 100 - slice.myPercentile) })}
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
        <span className={cn(mine != null && "font-semibold text-accent")}>
          {mine != null ? fmt(mine) : "—"}
        </span>
        <span>{fmt(p90)}</span>
      </div>
    </div>
  );
}

function ClassSheet({
  filters,
  hasBodyWeight,
  onClose,
  onApply,
  t,
}: {
  filters: CompareFilters;
  hasBodyWeight: boolean;
  onClose: () => void;
  onApply: (f: CompareFilters) => void;
  t: (k: string, vars?: Record<string, string | number>) => string;
}) {
  const [draft, setDraft] = useState<CompareFilters>(filters);

  function setDemo(
    patch: Partial<CompareFilters>,
    kind: "weight" | "age" | "sex",
  ) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      // max 2 demographic filters
      const keys: ("weight" | "age" | "sex")[] = [];
      if (next.weightBand) keys.push("weight");
      if (next.ageMin != null || next.ageMax != null) keys.push("age");
      if (next.sex) keys.push("sex");
      if (keys.length <= 2) return next;
      // drop oldest kind not being set now
      const drop = keys.find((k) => k !== kind);
      if (drop === "weight") next.weightBand = undefined;
      if (drop === "age") {
        next.ageMin = undefined;
        next.ageMax = undefined;
      }
      if (drop === "sex") next.sex = undefined;
      return next;
    });
  }

  const weightId = useMemo(() => {
    if (!draft.weightBand) return null;
    return (
      WEIGHT_BANDS.find(
        (b) =>
          b.min === draft.weightBand!.min && b.max === draft.weightBand!.max,
      )?.id ?? null
    );
  }, [draft.weightBand]);

  const ageId = useMemo(() => {
    if (draft.ageMin == null) return null;
    return (
      AGE_BANDS.find(
        (b) => b.min === draft.ageMin && b.max === draft.ageMax,
      )?.id ?? null
    );
  }, [draft.ageMin, draft.ageMax]);

  return (
    <AppSheet
      title={t("compare.class")}
      onClose={onClose}
      nested
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            className="h-11 flex-1 rounded-xl border border-rule text-sm font-semibold text-text-2"
            onClick={() =>
              setDraft({ measure: draft.measure })
            }
          >
            {t("compare.clear")}
          </button>
          <button
            type="button"
            className="h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-on-primary"
            onClick={() => onApply(draft)}
          >
            {t("common.apply")}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            {t("compare.measure")}
          </p>
          <div className="flex gap-1.5">
            {(["relative", "absolute"] as const).map((m) => (
              <button
                key={m}
                type="button"
                disabled={m === "relative" && !hasBodyWeight}
                onClick={() => setDraft((d) => ({ ...d, measure: m }))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  draft.measure === m
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-rule bg-raised text-text-2",
                  m === "relative" && !hasBodyWeight && "opacity-40",
                )}
              >
                {m === "relative" ? t("compare.relative") : t("compare.absolute")}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            {t("compare.weightClass")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {WEIGHT_BANDS.map((b) => (
              <button
                key={b.id}
                type="button"
                disabled={!hasBodyWeight}
                onClick={() =>
                  setDemo(
                    weightId === b.id
                      ? { weightBand: undefined }
                      : { weightBand: { min: b.min, max: b.max } },
                    "weight",
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  weightId === b.id
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-rule bg-raised text-text-2",
                  !hasBodyWeight && "opacity-40",
                )}
              >
                {b.label} kg
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            {t("compare.age")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {AGE_BANDS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  setDemo(
                    ageId === b.id
                      ? { ageMin: undefined, ageMax: undefined }
                      : { ageMin: b.min, ageMax: b.max },
                    "age",
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  ageId === b.id
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-rule bg-raised text-text-2",
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            {t("compare.sex")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["female", t("profile.sexFemale")],
                ["male", t("profile.sexMale")],
              ] as const
            ).map(([id, lab]) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setDemo(
                    draft.sex === id ? { sex: undefined } : { sex: id },
                    "sex",
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  draft.sex === id
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-rule bg-raised text-text-2",
                )}
              >
                {lab}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-text-3">{t("compare.filterHint")}</p>
        </section>
      </div>
    </AppSheet>
  );
}

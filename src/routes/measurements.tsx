import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Minus, Plus, Scale, Trash2, TrendingDown, TrendingUp } from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState, PageSection } from "@/components/ui/section";
import { PageSkeleton } from "@/components/ui/skeleton";
const ProgressAreaChart = lazy(() =>
  import("@/components/ui/charts").then((m) => ({ default: m.ProgressAreaChart })),
);
const MultiLineChart = lazy(() =>
  import("@/components/ui/charts").then((m) => ({ default: m.MultiLineChart })),
);

import {
  deleteMeasurement,
  listMeasurements,
  saveMeasurement,
} from "@/lib/server/measurements";
import { cn, formatChartDate, formatDate, todayISO } from "@/lib/utils";
import { qk } from "@/lib/query-keys";
import { useI18n, useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";
import { useUnitSystem } from "@/lib/use-unit-system";
import {
  displayLength,
  displayWeight,
  lengthUnit,
  toStorageLength,
  toStorageWeight,
  weightUnit,
  type UnitSystem,
} from "@/lib/units";

export const Route = createFileRoute("/measurements")({ component: MeasurementsPage });

type Tab = "today" | "charts" | "history";

type MetricKey = "body_weight" | "waist" | "chest" | "arm" | "thigh";

function metricsFor(
  t: (k: string) => string,
  system: UnitSystem,
): {
  key: MetricKey;
  label: string;
  unit: string;
  form: "weight" | "circ";
}[] {
  const wu = weightUnit(system);
  const lu = lengthUnit(system);
  return [
    { key: "body_weight", label: t("measure.weight"), unit: wu, form: "weight" },
    { key: "waist", label: t("measure.waist"), unit: lu, form: "circ" },
    { key: "chest", label: t("measure.chest"), unit: lu, form: "circ" },
    { key: "arm", label: t("measure.arm"), unit: lu, form: "circ" },
    { key: "thigh", label: t("measure.thigh"), unit: lu, form: "circ" },
  ];
}

function num(v: string | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function deltaOf(
  a: number | null | undefined,
  b: number | null | undefined,
): number | null {
  if (a == null || b == null) return null;
  return Math.round((a - b) * 10) / 10;
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return "";
  return String(n);
}

function MeasurementsPage() {
  const t = useT();
  const { locale } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const unitSystem = useUnitSystem(!!userId);
  const wu = weightUnit(unitSystem);
  const lu = lengthUnit(unitSystem);
  const METRICS = metricsFor(t, unitSystem);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("charts");
  const [date, setDate] = useState(todayISO());
  const [bw, setBw] = useState("");
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arm, setArm] = useState("");
  const [thigh, setThigh] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [show, setShow] = useState({
    waist: true,
    chest: true,
    arm: true,
    thigh: true,
  });

  const listQuery = useQuery({
    queryKey: qk.measurements,
    queryFn: () => listMeasurements(),
    enabled: !!userId,
  });
  const rows = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  const loading = listQuery.isLoading;

  async function reload() {
    await queryClient.invalidateQueries({ queryKey: qk.measurements });
  }

  // Prefill today's form from latest snapshot (display units)
  useEffect(() => {
    if (rows.length === 0 || prefilled) return;
    const latest = [...rows].sort((a, b) => b.date.localeCompare(a.date))[0]!;
    if (date !== todayISO()) return;
    if (!bw && latest.body_weight) {
      setBw(fmtNum(displayWeight(Number(latest.body_weight), unitSystem)));
    }
    if (!waist && latest.waist) {
      setWaist(fmtNum(displayLength(Number(latest.waist), unitSystem)));
    }
    if (!chest && latest.chest) {
      setChest(fmtNum(displayLength(Number(latest.chest), unitSystem)));
    }
    if (!arm && latest.arm) {
      setArm(fmtNum(displayLength(Number(latest.arm), unitSystem)));
    }
    if (!thigh && latest.thigh) {
      setThigh(fmtNum(displayLength(Number(latest.thigh), unitSystem)));
    }
    setPrefilled(true);
  }, [rows, unitSystem, date, prefilled, bw, waist, chest, arm, thigh]);

  const chronological = useMemo(
    () => [...rows].sort((a, b) => a.date.localeCompare(b.date)),
    [rows],
  );

  const latest = chronological[chronological.length - 1];
  const prev =
    chronological.length >= 2 ? chronological[chronological.length - 2] : null;

  const weightNow = displayWeight(num(latest?.body_weight), unitSystem);
  const weightPrev = displayWeight(num(prev?.body_weight), unitSystem);
  const weightDelta = deltaOf(weightNow, weightPrev);

  const first = chronological[0];
  const totalWeightDelta = deltaOf(
    weightNow,
    displayWeight(num(first?.body_weight), unitSystem),
  );

  const weightSeries = chronological
    .filter((r) => r.body_weight != null)
    .map((r) => ({
      date: r.date,
      body_weight: displayWeight(Number(r.body_weight), unitSystem) ?? 0,
    }));

  const measureSeries = chronological.map((r) => ({
    date: r.date,
    waist: displayLength(r.waist != null ? Number(r.waist) : null, unitSystem),
    chest: displayLength(r.chest != null ? Number(r.chest) : null, unitSystem),
    arm: displayLength(r.arm != null ? Number(r.arm) : null, unitSystem),
    thigh: displayLength(r.thigh != null ? Number(r.thigh) : null, unitSystem),
  }));

  const circCards = METRICS.filter((m) => m.form === "circ").map((m) => {
    const cur = displayLength(
      latest?.[m.key] != null ? Number(latest[m.key]) : null,
      unitSystem,
    );
    const before = displayLength(
      prev?.[m.key] != null ? Number(prev[m.key]) : null,
      unitSystem,
    );
    return {
      ...m,
      value: cur,
      delta: deltaOf(cur, before),
    };
  });

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!bw && !waist && !chest && !arm && !thigh) {
      toast.error(t("measure.needValue"));
      return;
    }
    setSaving(true);
    try {
      const bwN = bw === "" ? null : Number(bw);
      const waistN = waist === "" ? null : Number(waist);
      const chestN = chest === "" ? null : Number(chest);
      const armN = arm === "" ? null : Number(arm);
      const thighN = thigh === "" ? null : Number(thigh);
      await saveMeasurement({
        data: {
          date,
          body_weight:
            bwN == null || !Number.isFinite(bwN)
              ? null
              : toStorageWeight(bwN, unitSystem),
          waist:
            waistN == null || !Number.isFinite(waistN)
              ? null
              : toStorageLength(waistN, unitSystem),
          chest:
            chestN == null || !Number.isFinite(chestN)
              ? null
              : toStorageLength(chestN, unitSystem),
          arm:
            armN == null || !Number.isFinite(armN)
              ? null
              : toStorageLength(armN, unitSystem),
          thigh:
            thighN == null || !Number.isFinite(thighN)
              ? null
              : toStorageLength(thighN, unitSystem),
        },
      });
      toast.success(t("measure.saved"));
      setPrefilled(false);
      await reload();
      setTab("charts");
    } catch {
      toast.error(t("measure.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell title={t("measure.title")} subtitle={t("measure.subtitle")}>
      {loading ? (
        <PageSkeleton rows={3} />
      ) : (
        <div className="w-full min-w-0 space-y-4">
          {/* Hero snapshot */}
          <div className="relative overflow-hidden rounded-2xl border border-rule bg-sunken">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,194,48,0.12),transparent_55%)]" />
            <div className="relative p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                    {t("measure.lastWeight")}
                  </p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="num font-display text-5xl leading-none tracking-wide text-accent">
                      {weightNow != null ? weightNow : t("measure.noValue")}
                    </span>
                    {weightNow != null && (
                      <span className="mb-1 text-sm text-text-2">{wu}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-text-2">
                    {latest
                      ? formatDate(latest.date, locale)
                      : t("measure.noRecordsHint")}
                    {rows.length > 0 ? ` · ${t("measure.recordsCount", { n: rows.length })}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <DeltaPill value={weightDelta} unit={wu} label={t("measure.prev")} />
                  {totalWeightDelta != null && chronological.length > 2 && (
                    <DeltaPill
                      value={totalWeightDelta}
                      unit={wu}
                      label={t("measure.total")}
                      subtle
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setTab("today")}
                    className="mt-1 flex h-10 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-on-primary"
                  >
                    <Plus className="size-3.5" />
                    {t("measure.new")}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {circCards.map((c) => (
                  <div
                    key={c.key}
                    className="rounded-xl border border-rule/80 bg-canvas/40 px-3 py-2.5"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wide text-text-3">
                      {c.label}
                    </p>
                    <p className="num mt-0.5 text-lg font-semibold text-text">
                      {c.value != null ? c.value : "—"}
                      {c.value != null && (
                        <span className="ml-0.5 text-[11px] font-normal text-text-2">
                          {c.unit}
                        </span>
                      )}
                    </p>
                    {c.delta != null && (
                      <p
                        className={cn(
                          "num mt-0.5 text-[11px]",
                          c.delta < 0
                            ? "text-success"
                            : c.delta > 0
                              ? "text-warning"
                              : "text-text-2",
                        )}
                      >
                        {c.delta > 0 ? "+" : ""}
                        {c.delta} {c.unit}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-xl border border-rule bg-sunken p-1">
            {(
              [
                ["charts", t("measure.summary")],
                ["today", t("measure.entry")],
                ["history", t("measure.history")],
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "h-10 rounded-lg text-sm font-semibold transition",
                  tab === k ? "bg-primary text-on-primary" : "text-text-2 hover:text-text",
                )}
              >
                {lab}
              </button>
            ))}
          </div>

          {tab === "today" && (
            <PageSection
              title={t("measure.enter")}
              description={t("measure.overwriteHint")}
            >
              <form onSubmit={onSave} className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs text-text-2">{t("measure.date")}</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 w-full rounded-lg border border-rule bg-raised px-3"
                    required
                  />
                </label>

                <div className="rounded-xl border border-accent/25 bg-accent/5 p-3">
                  <div className="mb-2 flex items-center gap-2 text-accent">
                    <Scale className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {t("measure.bodyWeight")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={bw}
                      onChange={(e) => setBw(e.target.value)}
                      placeholder={t("measure.weightPlaceholder")}
                      className="num h-14 min-w-0 flex-1 rounded-lg border border-accent/30 bg-raised px-3 text-2xl text-accent"
                    />
                    <span className="shrink-0 text-sm text-text-2">{wu}</span>
                  </div>
                </div>

                <p className="text-[11px] font-medium uppercase tracking-wide text-text-3">
                  {t("measure.girthsOptional")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={t("measure.waist")} value={waist} onChange={setWaist} unit={lu} />
                  <Num label={t("measure.chest")} value={chest} onChange={setChest} unit={lu} />
                  <Num label={t("measure.arm")} value={arm} onChange={setArm} unit={lu} />
                  <Num label={t("measure.thigh")} value={thigh} onChange={setThigh} unit={lu} />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary disabled:opacity-60"
                >
                  {saving ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  {t("common.save")}
                </button>
              </form>
            </PageSection>
          )}

          {tab === "charts" && (
            <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-raised" />}>
            <>
              {rows.length === 0 ? (
                <EmptyState
                  icon={Scale}
                  title={t("measure.empty")}
                  hint={t("measure.chartEmptyHint")}
                />
              ) : (
                <>
                  <PageSection
                    title={t("measure.weightTrend")}
                    description={
                      weightSeries.length > 1
                        ? t("measure.nPoints", { n: weightSeries.length })
                        : t("measure.moreData")
                    }
                  >
                    <ProgressAreaChart
                      data={weightSeries}
                      xKey="date"
                      yKey="body_weight"
                      valueLabel={t("measure.weight")}
                      valueUnit={wu}
                      xFormatter={formatChartDate}
                      emptyHint={t("measure.chartEmptyHint")}
                    />
                  </PageSection>

                  <PageSection
                    title={t("measure.girth")}
                    description={t("measure.toggleSeries")}
                    action={
                      <div className="flex flex-wrap justify-end gap-1">
                        {(
                          [
                            ["waist", t("measure.waist"), "#E07B1F"],
                            ["chest", t("measure.chest"), "#2F6FD0"],
                            ["arm", t("measure.arm"), "#2E9E5B"],
                            ["thigh", t("measure.thigh"), "#D9312B"],
                          ] as const
                        ).map(([k, lab, color]) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() =>
                              setShow((s) => ({ ...s, [k]: !s[k] }))
                            }
                            className={cn(
                              "rounded-full border px-2 py-1 text-[11px] font-medium",
                              show[k] ? "text-on-primary" : "border-rule text-text-2",
                            )}
                            style={
                              show[k]
                                ? {
                                    backgroundColor: color,
                                    borderColor: color,
                                  }
                                : undefined
                            }
                          >
                            {lab}
                          </button>
                        ))}
                      </div>
                    }
                  >
                    <MultiLineChart
                      data={measureSeries}
                      xKey="date"
                      xFormatter={formatChartDate}
                      series={[
                        {
                          key: "waist",
                          label: t("measure.waist"),
                          color: "#E07B1F",
                          visible: show.waist,
                        },
                        {
                          key: "chest",
                          label: t("measure.chest"),
                          color: "#2F6FD0",
                          visible: show.chest,
                        },
                        {
                          key: "arm",
                          label: t("measure.arm"),
                          color: "#2E9E5B",
                          visible: show.arm,
                        },
                        {
                          key: "thigh",
                          label: t("measure.thigh"),
                          color: "#D9312B",
                          visible: show.thigh,
                        },
                      ]}
                    />
                  </PageSection>
                </>
              )}
            </>
            </Suspense>
          )}

          {tab === "history" && (
            <PageSection title={t("measure.history")} description={t("measure.historyDesc")}>
              {rows.length === 0 ? (
                <EmptyState
                  icon={Scale}
                  title={t("measure.empty")}
                  hint={t("measure.historyEmptyHint")}
                />
              ) : (
                <ul className="divide-y divide-rule">
                  {[...rows]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((r, idx, arr) => {
                      const older = arr[idx + 1];
                      const wDisp = displayWeight(num(r.body_weight), unitSystem);
                      const wOld = displayWeight(
                        num(older?.body_weight),
                        unitSystem,
                      );
                      const dW = deltaOf(wDisp, wOld);
                      return (
                        <li
                          key={r.id}
                          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-raised">
                            {dW == null || dW === 0 ? (
                              <Minus className="size-4 text-text-2" />
                            ) : dW < 0 ? (
                              <TrendingDown className="size-4 text-success" />
                            ) : (
                              <TrendingUp className="size-4 text-warning" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                              <p className="font-medium">
                                {formatDate(r.date, locale)}
                              </p>
                              {wDisp != null && (
                                <p className="num text-sm text-accent">
                                  {wDisp} {wu}
                                  {dW != null && dW !== 0 && (
                                    <span className="ml-1 text-[11px] text-text-2">
                                      ({dW > 0 ? "+" : ""}
                                      {dW})
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                            <p className="mt-0.5 truncate text-xs text-text-2">
                              {[
                                r.waist != null &&
                                  `${t("measure.waist")} ${displayLength(Number(r.waist), unitSystem)} ${lu}`,
                                r.chest != null &&
                                  `${t("measure.chest")} ${displayLength(Number(r.chest), unitSystem)} ${lu}`,
                                r.arm != null &&
                                  `${t("measure.arm")} ${displayLength(Number(r.arm), unitSystem)} ${lu}`,
                                r.thigh != null &&
                                  `${t("measure.thigh")} ${displayLength(Number(r.thigh), unitSystem)} ${lu}`,
                              ]
                                .filter(Boolean)
                                .join(" · ") || t("measure.weightOnly")}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="grid size-10 place-items-center rounded-lg border border-rule text-danger"
                            onClick={() => {
                              if (!confirm(t("measure.deleteConfirm"))) return;
                              void deleteMeasurement({ data: r.id })
                                .then(reload)
                                .then(() => toast.success(t("common.deleted")));
                            }}
                            aria-label={t("common.delete")}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      );
                    })}
                </ul>
              )}
            </PageSection>
          )}
        </div>
      )}
    </AppShell>
  );
}

function DeltaPill({
  value,
  unit,
  label,
  subtle,
}: {
  value: number | null;
  unit: string;
  label: string;
  subtle?: boolean;
}) {
  if (value == null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-text-3",
          subtle ? "bg-transparent" : "bg-raised",
        )}
      >
        {label}
      </span>
    );
  }
  const up = value > 0;
  const down = value < 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        down && "bg-success/15 text-success",
        up && "bg-warning/15 text-warning",
        !up && !down && "bg-raised text-text-2",
        subtle && "opacity-80",
      )}
    >
      {down ? (
        <ArrowDownRight className="size-3" />
      ) : up ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <Minus className="size-3" />
      )}
      {value > 0 ? "+" : ""}
      {value} {unit}
      <span className="font-normal opacity-70">{label}</span>
    </span>
  );
}

function Num({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-text-2">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="num h-12 min-w-0 flex-1 rounded-lg border border-rule bg-raised px-3"
        />
        <span className="shrink-0 text-xs text-text-3">{unit}</span>
      </div>
    </label>
  );
}

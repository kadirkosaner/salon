import { useI18n, useT } from "@/lib/i18n/provider";
import { cn, formatDate } from "@/lib/utils";

export type HeatDay = { date: string; count: number };

/** Number of week columns (one cell per week — not per day). */
const HEAT_WEEKS = 12;

type HeatWeek = {
  /** Monday ISO of the week */
  start: string;
  end: string;
  count: number;
  /** future / incomplete trailing week */
  partial: boolean;
};

function isoOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeekMonday(d: Date): Date {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const dow = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - dow);
  return x;
}

/** Weekly contribution strip — one cell per week for the last ~12 weeks. */
export function WorkoutHeatmap({
  days,
  label,
}: {
  days: HeatDay[];
  label?: string;
}) {
  const t = useT();
  const { locale } = useI18n();
  const title = label ?? t("heatmap.last6mo");
  const byDate = new Map(days.map((d) => [d.date, d.count]));

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const thisWeekStart = startOfWeekMonday(today);

  const weeks: HeatWeek[] = [];
  for (let i = HEAT_WEEKS - 1; i >= 0; i--) {
    const start = new Date(thisWeekStart);
    start.setDate(start.getDate() - 7 * i);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    let count = 0;
    const cursor = new Date(start);
    for (let d = 0; d < 7; d++) {
      if (cursor <= today) {
        count += byDate.get(isoOf(cursor)) ?? 0;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push({
      start: isoOf(start),
      end: isoOf(end),
      count,
      partial: end > today,
    });
  }

  function cellClass(count: number) {
    if (count === 0) return "bg-raised";
    if (count === 1) return "bg-accent/25";
    if (count === 2) return "bg-accent/40";
    if (count === 3) return "bg-accent/55";
    if (count >= 4) return "bg-accent/75";
    return "bg-raised";
  }

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
          {title}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-text-3">
          <span>{t("heatmap.low")}</span>
          <span className="size-2.5 rounded-sm bg-raised" />
          <span className="size-2.5 rounded-sm bg-accent/25" />
          <span className="size-2.5 rounded-sm bg-accent/55" />
          <span className="size-2.5 rounded-sm bg-accent/75" />
          <span>{t("heatmap.high")}</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        {weeks.map((w) => (
          <div key={w.start} className="min-w-0 flex-1">
            <div
              title={t("heatmap.weekTitle", {
                date: formatDate(w.start, locale),
                count: w.count,
              })}
              className={cn(
                "mx-auto aspect-square w-full max-w-8 rounded-md",
                cellClass(w.count),
                w.partial && w.count === 0 && "opacity-70",
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-text-3">
        <span>{formatDate(weeks[0]!.start, locale)}</span>
        <span>{t("heatmap.thisWeek")}</span>
      </div>
    </div>
  );
}

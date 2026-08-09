import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export type HeatDay = { date: string; count: number };

/** GitHub-style contribution grid for last ~26 weeks of workouts. */
export function WorkoutHeatmap({
  days,
  label,
}: {
  days: HeatDay[];
  label?: string;
}) {
  const t = useT();
  const title = label ?? t("heatmap.last6mo");
  const byDate = new Map(days.map((d) => [d.date, d.count]));
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 7 * 25);
  const dow = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dow);

  const weeks: HeatDay[][] = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    const week: HeatDay[] = [];
    for (let i = 0; i < 7; i++) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, "0");
      const d = String(cursor.getDate()).padStart(2, "0");
      const iso = `${y}-${m}-${d}`;
      const future = cursor > today;
      week.push({ date: iso, count: future ? -1 : (byDate.get(iso) ?? 0) });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  function cellClass(count: number) {
    if (count < 0) return "bg-transparent";
    if (count === 0) return "bg-raised";
    if (count === 1) return "bg-accent/25";
    if (count === 2) return "bg-accent/45";
    if (count >= 3) return "bg-accent/75";
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
          <span className="size-2.5 rounded-sm bg-accent/45" />
          <span className="size-2.5 rounded-sm bg-accent/75" />
          <span>{t("heatmap.high")}</span>
        </div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={
                    day.count < 0
                      ? undefined
                      : t("heatmap.sessionTitle", {
                          date: day.date,
                          count: day.count,
                        })
                  }
                  className={cn(
                    "size-[11px] rounded-[2px] sm:size-3",
                    cellClass(day.count),
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/provider";

/** Hedefli haftalık hacim — big number + progress + caption. */
export function WeeklyVolume({
  current,
  target,
  sessionsLeft,
  unitLabel,
  className,
}: {
  current: number;
  target: number;
  sessionsLeft?: number;
  unitLabel?: string;
  className?: string;
}) {
  const t = useT();
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const left =
    sessionsLeft !== undefined
      ? t("home.sessionsLeft", { n: sessionsLeft })
      : null;

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-2">
        {t("home.weeklyVolume")}
      </p>
      <div className="flex items-end gap-2">
        <p className="num text-4xl leading-none tracking-tight text-text">
          {formatCompact(current)}
        </p>
        {unitLabel ? (
          <span className="mb-1 text-sm text-text-2">{unitLabel}</span>
        ) : null}
        <span className="mb-1 text-sm text-text-3">
          / {formatCompact(target)}
        </span>
      </div>
      <div className="progress-track w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-text-2">
        {t("home.goalPercent", { pct })}
        {left ? <span className="text-text-3"> · {left}</span> : null}
      </p>
    </div>
  );
}

function formatCompact(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(Math.round(n));
}

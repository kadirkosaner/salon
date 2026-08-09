import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/provider";

/** Weekly volume — volume only (no invented goal). */
export function WeeklyVolume({
  current,
  target: _target,
  sessionsLeft,
  unitLabel,
  className,
}: {
  current: number;
  target?: number;
  sessionsLeft?: number;
  unitLabel?: string;
  className?: string;
}) {
  const t = useT();
  const left =
    sessionsLeft !== undefined
      ? sessionsLeft === 1
        ? t("home.sessionsLeftOne")
        : t("home.sessionsLeft", { n: sessionsLeft })
      : null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-2">
        {t("home.weeklyVolume")}
      </p>
      <div className="flex items-end gap-2">
        <p className="num text-3xl leading-none tracking-tight text-text sm:text-4xl">
          {formatCompact(current)}
        </p>
        {unitLabel ? (
          <span className="mb-1 text-sm text-text-2">{unitLabel}</span>
        ) : null}
      </div>
      {left ? <p className="text-xs text-text-3">{left}</p> : null}
    </div>
  );
}

function formatCompact(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(Math.round(n));
}

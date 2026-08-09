import { cn } from "@/lib/utils";

/** Progress track with 7-bar sparkline — last bar accent-highlighted. */
export function SparklineTrack({
  name,
  value,
  previous,
  bars,
  unit,
  className,
}: {
  name: string;
  value: number;
  previous?: number | null;
  /** Up to 7 values; last is current week. */
  bars: number[];
  unit?: string;
  className?: string;
}) {
  const series = bars.slice(-7);
  while (series.length < 7) series.unshift(0);
  const max = Math.max(1, ...series);
  const delta =
    previous != null && previous !== 0
      ? value - previous
      : previous === 0
        ? value
        : null;
  const deltaLabel =
    delta == null
      ? null
      : delta > 0
        ? `+${fmt(delta)}${unit ? ` ${unit}` : ""}`
        : delta < 0
          ? `${fmt(delta)}${unit ? ` ${unit}` : ""}`
          : "·";

  return (
    <div className={cn("flex items-center gap-3 py-2", className)}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{name}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="num text-lg leading-none tabular-nums text-text">
            {fmt(value)}
            {unit ? (
              <span className="ms-1 text-xs font-normal text-text-2">{unit}</span>
            ) : null}
          </span>
          {deltaLabel ? (
            <span
              className={cn(
                "text-xs tabular-nums",
                delta != null && delta > 0
                  ? "text-success"
                  : delta != null && delta < 0
                    ? "text-danger"
                    : "text-text-3",
              )}
            >
              {deltaLabel}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex h-8 items-end gap-0.5" aria-hidden>
        {series.map((v, i) => {
          const h = Math.max(2, Math.round((v / max) * 32));
          const last = i === series.length - 1;
          return (
            <span
              key={i}
              className={cn(
                "w-1.5 rounded-sm",
                last ? "bg-accent" : "bg-rule",
              )}
              style={{ height: h }}
            />
          );
        })}
      </div>
    </div>
  );
}

function fmt(n: number) {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1);
}

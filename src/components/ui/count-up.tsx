import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Short roll-up for stats (tonnage, streak, followers).
 * Respects prefers-reduced-motion via CSS / no-op when reduced.
 */
export function CountUp({
  value,
  className,
  duration = 500,
  decimals = 0,
}: {
  value: number;
  className?: string;
  duration?: number;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const preferReduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (preferReduce || !Number.isFinite(value)) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const e = 1 - (1 - t) ** 3;
      const cur = from + (to - from) * e;
      setDisplay(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, preferReduce]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : String(Math.round(display));

  return (
    <span className={cn("num tabular-nums", className)}>{formatted}</span>
  );
}

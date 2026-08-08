import { MUSCLE_LABELS, type MuscleGroup } from "@/data/library";
import { cn } from "@/lib/utils";

const TONE: Partial<Record<string, string>> = {
  gogus: "border-red/30 bg-red/10 text-red",
  sirt: "border-softblue/30 bg-softblue/10 text-softblue",
  omuz: "border-yellow/30 bg-yellow/10 text-yellow",
  kol: "border-purple-400/30 bg-purple-400/10 text-purple-300",
  bacak: "border-green/30 bg-green/10 text-green",
  trapez: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  core: "border-line bg-surface2 text-muted",
  diger: "border-line bg-surface2 text-dim",
};

export function muscleLabel(group: string | null | undefined): string {
  if (!group) return MUSCLE_LABELS.diger;
  return MUSCLE_LABELS[group as MuscleGroup] ?? group;
}

export function MuscleBadge({
  group,
  className,
  size = "sm",
}: {
  group?: string | null;
  className?: string;
  size?: "sm" | "xs";
}) {
  const key = group || "diger";
  const label = muscleLabel(key);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        TONE[key] ?? TONE.diger,
        className,
      )}
    >
      {label}
    </span>
  );
}

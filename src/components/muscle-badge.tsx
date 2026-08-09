import { MUSCLE_KEYS, type MuscleGroup } from "@/data/library";
import { useT } from "@/lib/i18n/provider";
import type { MessageKey } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const TONE: Partial<Record<string, string>> = {
  gogus: "border-red/30 bg-red/10 text-red",
  sirt: "border-softblue/30 bg-softblue/10 text-softblue",
  omuz: "border-yellow/30 bg-yellow/10 text-yellow",
  kol: "border-blue/30 bg-blue/10 text-blue",
  bacak: "border-green/30 bg-green/10 text-green",
  trapez: "border-orange/30 bg-orange/10 text-orange",
  core: "border-line bg-surface2 text-muted",
  diger: "border-line bg-surface2 text-dim",
};

export function muscleLabel(
  group: string | null | undefined,
  t: (k: MessageKey) => string,
): string {
  if (!group) return t("muscle.diger");
  const key = MUSCLE_KEYS[group as MuscleGroup];
  return key ? t(key) : group;
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
  const t = useT();
  const slug = group || "diger";
  const label = muscleLabel(slug, t);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        TONE[slug] ?? TONE.diger,
        className,
      )}
    >
      {label}
    </span>
  );
}

import { MUSCLE_KEYS, type MuscleGroup } from "@/data/library";
import { useT } from "@/lib/i18n/provider";
import type { MessageKey } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

/** Semantic status colors only — muscle groups stay neutral by default. */
const TONE: Partial<Record<string, string>> = {
  gogus: "border-rule bg-raised text-text-2",
  sirt: "border-rule bg-raised text-text-2",
  omuz: "border-rule bg-raised text-text-2",
  kol: "border-rule bg-raised text-text-2",
  bacak: "border-rule bg-raised text-text-2",
  trapez: "border-rule bg-raised text-text-2",
  core: "border-rule bg-raised text-text-2",
  diger: "border-rule bg-raised text-text-3",
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

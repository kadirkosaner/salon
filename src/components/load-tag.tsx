import { LOAD_TAG_KEYS, type LoadTag } from "@/data/library";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/** Load tags are labels, not alerts — never use danger/success. */
const TONE: Record<string, string> = {
  agir: "border-rule bg-raised text-text font-semibold",
  orta_agir: "border-rule bg-raised text-text",
  orta: "border-rule bg-raised/80 text-text-2",
  orta_hafif: "border-rule bg-raised/60 text-text-2",
  hafif: "border-rule bg-raised/40 text-text-3",
};

export function LoadTagBadge({ tag, className }: { tag: string; className?: string }) {
  const t = useT();
  const key = LOAD_TAG_KEYS[tag as LoadTag];
  const label = key ? t(key) : tag;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        TONE[tag] ?? "border-rule bg-raised text-text-2",
        className,
      )}
    >
      {label}
    </span>
  );
}

import { LOAD_TAG_KEYS, type LoadTag } from "@/data/library";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  agir: "bg-danger/15 text-danger border-danger/30",
  orta_agir: "bg-warning/15 text-warning border-warning/30",
  orta: "bg-accent/15 text-accent border-accent/30",
  orta_hafif: "bg-info/15 text-info border-info/30",
  hafif: "bg-info/15 text-info border-info/30",
};

export function LoadTagBadge({ tag, className }: { tag: string; className?: string }) {
  const t = useT();
  const key = LOAD_TAG_KEYS[tag as LoadTag];
  const label = key ? t(key) : tag;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        COLORS[tag] ?? "bg-raised text-text-2 border-rule",
        className,
      )}
    >
      {label}
    </span>
  );
}

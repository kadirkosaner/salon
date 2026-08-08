import { LOAD_TAG_LABELS, type LoadTag } from "@/data/library";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  agir: "bg-red/15 text-red border-red/30",
  orta_agir: "bg-orange/15 text-orange border-orange/30",
  orta: "bg-yellow/15 text-yellow border-yellow/30",
  orta_hafif: "bg-softblue/15 text-softblue border-softblue/30",
  hafif: "bg-blue/15 text-blue border-blue/30",
};

export function LoadTagBadge({ tag, className }: { tag: string; className?: string }) {
  const label = LOAD_TAG_LABELS[tag as LoadTag] ?? tag;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        COLORS[tag] ?? "bg-surface2 text-muted border-line",
        className,
      )}
    >
      {label}
    </span>
  );
}

import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { btnClass } from "@/components/ui/btn";

/**
 * Premium empty state: icon + short copy + single clear CTA.
 * Never leave the user wondering "what now?".
 */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  actionLabel,
  actionTo,
  onAction,
  className,
}: {
  icon?: LucideIcon;
  title?: string;
  hint: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl px-5 py-10 text-center",
        "bg-raised/40 shadow-[var(--shadow-highlight)]",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]">
          <Icon className="size-7" />
        </span>
      ) : null}
      {title ? (
        <p className="font-display text-xl tracking-wide text-text">{title}</p>
      ) : null}
      <p className="max-w-xs text-sm leading-relaxed text-text-2">{hint}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className={btnClass("primary", "mt-1 min-w-[10rem]")}>
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction && !actionTo ? (
        <button
          type="button"
          onClick={onAction}
          className={btnClass("primary", "mt-1 min-w-[10rem]")}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

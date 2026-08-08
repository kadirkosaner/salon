import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-line bg-surface p-3.5 sm:p-4",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-display text-lg tracking-wide text-text sm:text-xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
  icon,
  onClick,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  accent?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "min-w-0 rounded-xl border p-3 text-left transition",
        accent
          ? "border-yellow/35 bg-yellow/10 hover:border-yellow/50"
          : "border-line bg-surface hover:border-line",
        onClick && "active:scale-[0.99]",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        {icon}
      </div>
      <p
        className={cn(
          "font-display mt-1.5 truncate text-2xl leading-none tracking-wide sm:text-3xl",
          accent ? "text-yellow" : "text-text",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 truncate text-xs text-muted">{hint}</p> : null}
    </Comp>
  );
}

export function MenuRow({
  to,
  icon: Icon,
  label,
  hint,
  onClick,
  danger,
  trailing,
}: {
  to?: string;
  icon: LucideIcon;
  label: string;
  hint?: string;
  onClick?: () => void;
  danger?: boolean;
  trailing?: React.ReactNode;
}) {
  const className = cn(
    "flex w-full min-w-0 items-center gap-3 rounded-xl border border-line bg-surface px-3 py-3 text-left transition hover:border-yellow/30 active:bg-surface2",
    danger && "hover:border-red/40",
  );

  const body = (
    <>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-lg",
          danger ? "bg-red/10 text-red" : "bg-surface2 text-yellow",
        )}
      >
        <Icon className="size-5" />

      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            danger ? "text-red" : "text-text",
          )}
        >
          {label}
        </span>
        {hint ? (
          <span
            className={cn(
              "mt-0.5 block text-xs text-muted",
              hint.length > 28 ? "break-all whitespace-normal leading-snug" : "truncate",
            )}
          >
            {hint}
          </span>
        ) : null}
      </span>
      {trailing ?? (
        <ChevronRight className={cn("size-4 shrink-0", danger ? "text-red/50" : "text-dim")} />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}

export function EmptyState({ title, hint }: { title?: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line px-4 py-8 text-center">
      {title ? <p className="text-sm font-medium text-text">{title}</p> : null}
      <p className="max-w-xs text-sm text-muted">{hint}</p>
    </div>
  );
}

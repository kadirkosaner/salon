import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";

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
        "card-surface min-w-0 overflow-hidden p-3.5 sm:p-4",
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
              <p className="mt-0.5 text-xs leading-relaxed text-text-2">{description}</p>
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
  countValue,
  countDecimals,
  hint,
  icon,
  onClick,
  accent,
}: {
  label: string;
  /** Display string when not using countValue */
  value?: React.ReactNode;
  /** Numeric value for roll-up animation */
  countValue?: number;
  countDecimals?: number;
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
        "min-w-0 rounded-xl p-3 text-left transition active:scale-[0.96]",
        accent
          ? "card-accent"
          : "card-surface hover:brightness-110",
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-text-2">
          {label}
        </p>
        {icon}
      </div>
      <p
        className={cn(
          "font-display mt-1.5 truncate text-2xl leading-none tracking-wide sm:text-3xl",
          accent ? "text-accent" : "text-text",
        )}
      >
        {countValue != null ? (
          <CountUp value={countValue} decimals={countDecimals ?? 0} />
        ) : (
          value
        )}
      </p>
      {hint ? <p className="mt-1 truncate text-xs text-text-2">{hint}</p> : null}
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
    "card-surface flex w-full min-w-0 items-center gap-3 px-3 py-3 text-left transition active:scale-[0.98] hover:brightness-110",
    danger && "hover:shadow-[0_0_0_1px_rgba(240,113,120,0.35)]",
  );

  const body = (
    <>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-lg",
          danger ? "bg-danger/10 text-danger" : "bg-raised text-accent",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            danger ? "text-danger" : "text-text",
          )}
        >
          {label}
        </span>
        {hint ? (
          <span
            className={cn(
              "mt-0.5 block text-xs text-text-2",
              hint.length > 28 ? "break-all whitespace-normal leading-snug" : "truncate",
            )}
          >
            {hint}
          </span>
        ) : null}
      </span>
      {trailing ?? (
        <ChevronRight className={cn("size-4 shrink-0", danger ? "text-danger/50" : "text-text-3")} />
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

export { EmptyState } from "@/components/ui/empty-state";

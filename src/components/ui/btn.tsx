import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[var(--shadow-primary)] active:opacity-90",
  secondary:
    "bg-raised text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.25)] active:bg-sunken",
  soft:
    "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)] active:bg-accent/18",
  ghost:
    "bg-white/[0.04] text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-white/[0.07] active:text-text",
  danger:
    "bg-danger/12 text-danger shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_30%,transparent)] active:bg-danger/18",
  icon:
    "bg-raised text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-sunken active:text-text",
};

export function btnClass(
  variant: Variant = "secondary",
  className?: string,
  opts?: { size?: "md" | "lg" | "icon" | "sm" },
) {
  const size = opts?.size ?? (variant === "icon" ? "icon" : "md");
  const sizes = {
    sm: "min-h-10 px-3.5 text-xs gap-1.5 rounded-[var(--radius-btn)]",
    md: "min-h-12 px-4 text-sm gap-2 rounded-[var(--radius-btn)]",
    lg: "min-h-[3.25rem] px-5 text-[15px] gap-2 rounded-[var(--radius-btn)]",
    icon: "size-12 shrink-0 rounded-[var(--radius-btn)] p-0",
  } as const;

  return cn(
    "inline-flex items-center justify-center font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    sizes[size],
    variants[variant],
    className,
  );
}

export function Btn({
  variant = "secondary",
  size,
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "md" | "lg" | "icon" | "sm";
}) {
  return (
    <button
      type={type}
      className={btnClass(variant, className, {
        size: size ?? (variant === "icon" ? "icon" : "md"),
      })}
      {...props}
    />
  );
}

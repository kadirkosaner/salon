import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-yellow text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:bg-yellow/90",
  secondary:
    "bg-surface2 text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.25)] active:bg-surface",
  soft:
    "bg-yellow/12 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.28)] active:bg-yellow/18",
  ghost:
    "bg-white/[0.04] text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-white/[0.07] active:text-text",
  danger:
    "bg-red/12 text-red shadow-[inset_0_0_0_1px_rgba(240,113,120,0.3)] active:bg-red/18",
  icon:
    "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:bg-surface active:text-text",
};

export function btnClass(
  variant: Variant = "secondary",
  className?: string,
  opts?: { size?: "md" | "lg" | "icon" | "sm" },
) {
  const size = opts?.size ?? (variant === "icon" ? "icon" : "md");
  const sizes = {
    sm: "min-h-10 px-3.5 text-xs gap-1.5 rounded-xl",
    md: "min-h-12 px-4 text-sm gap-2 rounded-2xl",
    lg: "min-h-[3.25rem] px-5 text-[15px] gap-2 rounded-2xl",
    icon: "size-12 shrink-0 rounded-2xl p-0",
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

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/**
 * Dark-theme select (Radix). Replaces native <select> which opens a white OS list.
 * Item values must be non-empty strings (use a sentinel like "__none__" for empty).
 */
export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  triggerClassName,
  disabled,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-md border border-edge bg-raised px-3 text-left text-sm text-text",
          "outline-none transition active:scale-[0.99]",
          "data-[placeholder]:text-text-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName,
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-4 shrink-0 text-text-2" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-[80] max-h-72 overflow-hidden rounded-xl border border-rule bg-raised",
            "shadow-[0_12px_40px_rgba(0,0,0,0.55)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "w-[var(--radix-select-trigger-width)]",
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-8 pr-3 text-sm text-text outline-none",
                  "data-[highlighted]:bg-accent/15 data-[highlighted]:text-accent",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                )}
              >
                <span className="absolute left-2.5 flex size-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-3.5 text-accent" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

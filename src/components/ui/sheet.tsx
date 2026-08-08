import { Drawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-first bottom sheet (vaul).
 * Drop-in for the old Modal/Sheet pattern: render when open, call onClose to dismiss.
 * Provides: drag handle, focus trap, Escape, scroll lock, backdrop scale.
 */
export function AppSheet({
  title,
  children,
  onClose,
  open = true,
  className,
  contentClassName,
}: {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  open?: boolean;
  className?: string;
  contentClassName?: string;
}) {
  const hasTitle = title != null && title !== "";

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      shouldScaleBackground
      setBackgroundColorOnScale={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] w-full max-w-[480px] flex-col outline-none",
            "rounded-t-[1.25rem] bg-elevated",
            "shadow-[var(--shadow-sheet)]",
            className,
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex justify-center pt-2.5 pb-1">
            <Drawer.Handle className="mx-auto !h-1 !w-10 !rounded-full !bg-line-strong" />
          </div>

          <div className="flex items-start justify-between gap-3 border-b border-line/80 px-4 pb-3 pt-1">
            <Drawer.Title
              className={cn(
                "font-display min-w-0 flex-1 text-xl tracking-wide text-text",
                !hasTitle && "sr-only",
              )}
            >
              {hasTitle ? title : "Dialog"}
            </Drawer.Title>
            <Drawer.Close
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-surface2 text-muted shadow-[var(--shadow-highlight)] active:scale-95 active:bg-surface"
              aria-label="Kapat"
            >
              <X className="size-5" />
            </Drawer.Close>
          </div>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain p-4",
              contentClassName,
            )}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/** @deprecated Use AppSheet — kept for call-site compatibility */
export function Modal(props: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return <AppSheet {...props} />;
}

/** Alias used in workout route */
export function Sheet(props: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return <AppSheet {...props} />;
}

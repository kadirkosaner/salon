import { Drawer } from "vaul";
import { X } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Mobile-first bottom sheet (vaul).
 * Drop-in for the old Modal/Sheet pattern: render when open, call onClose to dismiss.
 * Nested drawers (sheet-inside-sheet) must pass nested — uses Drawer.NestedRoot.
 */
export function AppSheet({
  title,
  children,
  onClose,
  open = true,
  className,
  contentClassName,
  nested = false,
  dismissible = true,
  showClose = true,
  footer,
}: {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  open?: boolean;
  className?: string;
  contentClassName?: string;
  /** Use when this sheet opens above another AppSheet (vaul NestedRoot). */
  nested?: boolean;
  /** false = cannot dismiss via drag/backdrop/Escape (e.g. username claim). */
  dismissible?: boolean;
  showClose?: boolean;
  /** Sticky footer below scroll area (primary CTA, etc.). */
  footer?: React.ReactNode;
}) {
  const hasTitle = title != null && title !== "";
  const Root = nested ? Drawer.NestedRoot : Drawer.Root;

  return (
    <Root
      open={open}
      onOpenChange={(next) => {
        if (!next && dismissible) onClose();
      }}
      dismissible={dismissible}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] w-full max-w-[480px] flex-col outline-none",
            "rounded-t-[1.25rem] bg-raised",
            "shadow-[var(--shadow-sheet)]",
            className,
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          onPointerDownOutside={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
          }}
        >
          <div className="flex justify-center pt-2.5 pb-1">
            {dismissible ? (
              <Drawer.Handle className="mx-auto !h-1 !w-10 !rounded-full !bg-edge" />
            ) : (
              <span className="h-1 w-10 rounded-full bg-edge" aria-hidden />
            )}
          </div>

          <div className="flex items-start justify-between gap-3 border-b border-rule/80 px-4 pb-3 pt-1">
            <Drawer.Title
              className={cn(
                "font-display min-w-0 flex-1 text-xl tracking-wide text-text",
                !hasTitle && "sr-only",
              )}
            >
              {hasTitle ? title : "Dialog"}
            </Drawer.Title>
            {showClose && dismissible ? (
              <Drawer.Close
                type="button"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-raised text-text-2 shadow-[var(--shadow-highlight)] active:scale-95 active:bg-sunken"
                aria-label="Kapat"
              >
                <X className="size-5" />
              </Drawer.Close>
            ) : (
              <span className="size-11 shrink-0" aria-hidden />
            )}
          </div>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain p-4",
              contentClassName,
            )}
          >
            {children}
          </div>
          {footer ? (
            <div className="shrink-0 border-t border-rule/80 bg-raised px-4 py-3">
              {footer}
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Root>
  );
}

/** @deprecated Use AppSheet — kept for call-site compatibility */
export function Modal(props: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  nested?: boolean;
}) {
  return <AppSheet {...props} />;
}

/** Alias used in workout route */
export function Sheet(props: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  nested?: boolean;
}) {
  return <AppSheet {...props} />;
}

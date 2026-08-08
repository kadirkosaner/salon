import { useState } from "react";
import { toast } from "sonner";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { btnClass } from "@/components/ui/btn";
import { updateMyProfile } from "@/lib/server/social";
import { isValidUsername, normalizeUsername, usernameError } from "@/lib/username";
import { cn } from "@/lib/utils";

/** First-login sheet: confirm or change auto-generated username. Not dismissible. */
export function UsernameClaimSheet({
  initial,
  t,
  onDone,
}: {
  initial: string;
  t: (k: string) => string;
  onDone: (username: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const err = usernameError(normalizeUsername(value), t);

  async function save(confirmOnly = false) {
    setSaving(true);
    try {
      if (confirmOnly) {
        await updateMyProfile({ data: { confirm_username: true } });
        onDone(initial);
        toast.success(t("common.saved"));
        return;
      }
      const u = normalizeUsername(value);
      if (!isValidUsername(u)) {
        toast.error(err || t("profile.usernameInvalid"));
        return;
      }
      const hub = await updateMyProfile({ data: { username: u } });
      onDone(hub.username);
      toast.success(t("common.saved"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer.Root open dismissible={false} shouldScaleBackground setBackgroundColorOnScale={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] w-full max-w-[480px] flex-col outline-none",
            "rounded-t-[1.25rem] bg-elevated shadow-[var(--shadow-sheet)]",
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex justify-center pt-2.5 pb-1">
            <span className="h-1 w-10 rounded-full bg-line-strong" />
          </div>
          <div className="flex items-start justify-between gap-3 border-b border-line/80 px-4 pb-3 pt-1">
            <Drawer.Title className="font-display text-xl tracking-wide">
              {t("profile.claimTitle")}
            </Drawer.Title>
            {/* no close — must choose */}
            <span className="size-11" aria-hidden />
          </div>
          <div className="space-y-4 overflow-y-auto p-4">
            <p className="text-sm leading-relaxed text-muted">
              {t("profile.claimHint")}
            </p>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted">
                {t("profile.username")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-muted">@</span>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value.toLowerCase())}
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-12 min-w-0 flex-1 rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                />
              </div>
              {err ? (
                <p className="text-xs text-red">{err}</p>
              ) : (
                <p className="text-xs text-dim">3–20 · a-z, 0-9, _</p>
              )}
            </label>
            <button
              type="button"
              disabled={saving || !!err}
              onClick={() => void save(false)}
              className={btnClass("primary", "w-full")}
            >
              {t("profile.claimSave")}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save(true)}
              className={btnClass("ghost", "w-full")}
            >
              {t("profile.claimKeep")} @{initial}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

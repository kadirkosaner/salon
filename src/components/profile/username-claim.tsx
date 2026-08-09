import { useState } from "react";
import { toast } from "sonner";
import { btnClass } from "@/components/ui/btn";
import { AppSheet } from "@/components/ui/sheet";
import { updateMyProfile } from "@/lib/server/social";
import { isValidUsername, normalizeUsername, usernameError } from "@/lib/username";

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
    <AppSheet
      title={t("profile.claimTitle")}
      onClose={() => {}}
      dismissible={false}
      showClose={false}
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-text-2">
          {t("profile.claimHint")}
        </p>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">
            {t("profile.username")}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-text-2">@</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value.toLowerCase())}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="h-12 min-w-0 flex-1 rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            />
          </div>
          {err ? (
            <p className="text-xs text-danger">{err}</p>
          ) : (
            <p className="text-xs text-text-3">3–20 · a-z, 0-9, _</p>
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
    </AppSheet>
  );
}

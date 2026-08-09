import { useEffect, useState } from "react";
import { ImagePlus, Send, X } from "@/components/icons";
import { toast } from "sonner";
import {
  createPost,
  listMyRecentWorkouts,
} from "@/lib/server/posts";
import { useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function ComposePost({ onPosted }: { onPosted: () => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [workouts, setWorkouts] = useState<
    { id: number; day_name: string; date: string }[]
  >([]);
  const [attachId, setAttachId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    void listMyRecentWorkouts()
      .then(setWorkouts)
      .catch(() => setWorkouts([]));
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) {
      toast.error(t("post.empty"));
      return;
    }
    setBusy(true);
    try {
      await createPost({
        data: {
          body: text,
          attachedWorkoutId: attachId,
        },
      });
      setBody("");
      setAttachId(null);
      setOpen(false);
      toast.success(t("post.published"));
      onPosted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-rule bg-sunken px-3.5 py-3 text-left transition active:scale-[0.99]"
      >
        <span className="grid size-9 place-items-center rounded-full bg-accent/15 text-accent">
          <ImagePlus className="size-4" />
        </span>
        <span className="text-sm text-text-2">{t("post.compose")}</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="rounded-2xl border border-accent/25 bg-sunken p-3 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-3">
          {t("post.compose")}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid size-8 place-items-center rounded-lg text-text-2"
          aria-label={t("common.close")}
        >
          <X className="size-4" />
        </button>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value.slice(0, 500))}
        rows={3}
        maxLength={500}
        placeholder={t("post.placeholder")}
        className="w-full resize-none rounded-xl border border-rule bg-raised px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-accent/40"
        autoFocus
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="num text-[10px] text-text-3">{body.length}/500</p>
        <div className="flex items-center gap-2">
          {workouts.length > 0 ? (
            <select
              value={attachId ?? ""}
              onChange={(e) =>
                setAttachId(e.target.value ? Number(e.target.value) : null)
              }
              className="h-9 max-w-[10rem] truncate rounded-lg border border-rule bg-raised px-2 text-xs"
              aria-label={t("post.attachWorkout")}
            >
              <option value="">{t("post.noAttach")}</option>
              {workouts.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.day_name} · {w.date}
                </option>
              ))}
            </select>
          ) : null}
          <button
            type="submit"
            disabled={busy || !body.trim()}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-semibold text-on-primary disabled:opacity-50",
            )}
          >
            {busy ? <Spinner className="size-3.5" /> : <Send className="size-3.5" />}
            {t("post.publish")}
          </button>
        </div>
      </div>
    </form>
  );
}

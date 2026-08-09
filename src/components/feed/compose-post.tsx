import { useEffect, useRef, useState } from "react";
import { Dumbbell, Send } from "@/components/icons";
import { toast } from "sonner";
import { createPost, listMyRecentWorkouts } from "@/lib/server/posts";
import { useT } from "@/lib/i18n/provider";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { AppSheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * Twitter-style composer: compact feed trigger → full sheet with large
 * textarea, optional workout attach chips, sticky Post button.
 */
export function ComposePost({ onPosted }: { onPosted: () => void }) {
  const t = useT();
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [workouts, setWorkouts] = useState<
    { id: number; day_name: string; date: string }[]
  >([]);
  const [attachId, setAttachId] = useState<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const initials = (user?.displayName || user?.primaryEmail || "S")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avatar = user?.profileImageUrl;

  useEffect(() => {
    if (!open) return;
    void listMyRecentWorkouts()
      .then(setWorkouts)
      .catch(() => setWorkouts([]));
    // focus after sheet paint
    const id = window.setTimeout(() => taRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  function close() {
    if (busy) return;
    setOpen(false);
  }

  async function submit() {
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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <>
      {/* Compact Twitter-like trigger — stays in feed flow */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-rule bg-sunken/80 px-3.5 py-3 text-left transition hover:bg-raised active:scale-[0.99]"
      >
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent">
          {avatar ? (
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <span className="min-w-0 flex-1 text-[15px] text-text-2">
          {t("post.compose")}
        </span>
      </button>

      {open ? (
        <AppSheet
          title={t("post.composeTitle")}
          onClose={close}
          className="max-h-[92dvh]"
          contentClassName="!p-0"
          footer={
            <div className="flex items-center justify-between gap-3">
              <p className="num text-[11px] text-text-3">{body.length}/500</p>
              <button
                type="button"
                disabled={busy || !body.trim()}
                onClick={() => void submit()}
                className={cn(
                  "inline-flex h-11 min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.98] disabled:opacity-45",
                )}
              >
                {busy ? (
                  <Spinner className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
                {t("post.publish")}
              </button>
            </div>
          }
        >
          <div className="flex gap-3 px-4 pt-1 pb-3">
            <span className="mt-1 grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent">
              {avatar ? (
                <img src={avatar} alt="" className="size-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <textarea
              ref={taRef}
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 500))}
              onKeyDown={onKeyDown}
              rows={6}
              maxLength={500}
              placeholder={t("post.placeholder")}
              className="min-h-[9rem] w-full flex-1 resize-none bg-transparent py-2 text-[16px] leading-relaxed text-text outline-none placeholder:text-text-3"
            />
          </div>

          {workouts.length > 0 ? (
            <div className="border-t border-rule px-4 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
                {t("post.attachWorkout")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setAttachId(null)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    attachId == null
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-rule bg-raised text-text-2",
                  )}
                >
                  {t("post.noAttach")}
                </button>
                {workouts.map((w) => {
                  const on = attachId === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setAttachId(on ? null : w.id)}
                      className={cn(
                        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        on
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-rule bg-raised text-text-2",
                      )}
                    >
                      <Dumbbell className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {w.day_name} · {w.date.slice(5)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </AppSheet>
      ) : null}
    </>
  );
}

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { AppSheet } from "@/components/ui/sheet";
import {
  addComment,
  listComments,
  type FeedItem,
} from "@/lib/server/activity";
import { relativeTime } from "@/lib/relative-time";
import { Spinner } from "@/components/ui/spinner";

type Comment = {
  id: number;
  body: string;
  created_at: string;
  user_id: string;
  name: string;
  username: string | null;
  image: string | null;
};

export function CommentSheet({
  item,
  t,
  onClose,
  onAdded,
}: {
  item: FeedItem;
  t: (k: string) => string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [rows, setRows] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listComments({ data: item.id })
      .then((r) => {
        if (!cancelled) setRows(r as Comment[]);
      })
      .catch(() => {
        if (!cancelled) toast.error(t("common.error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [item.id, t]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    try {
      await addComment({ data: { eventId: item.id, body: text } });
      setBody("");
      const r = await listComments({ data: item.id });
      setRows(r as Comment[]);
      onAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <AppSheet title={t("feed.comments")} onClose={onClose}>
      <div className="flex min-h-[40vh] flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-3">
          {loading ? (
            <div className="space-y-3 py-2" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="size-8 shrink-0 animate-pulse rounded-full bg-surface2" />
                  <div className="h-14 min-w-0 flex-1 animate-pulse rounded-xl bg-surface2" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              {t("feed.noComments")}
            </p>
          ) : (
            rows.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow/15 text-[11px] font-semibold text-yellow">
                  {c.image ? (
                    <img src={c.image} alt="" className="size-full object-cover" />
                  ) : (
                    (c.name[0] ?? "?").toUpperCase()
                  )}
                </span>
                <div className="min-w-0 flex-1 rounded-xl bg-surface2/60 px-3 py-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold">{c.name}</span>
                    <span className="text-[10px] text-dim">
                      {relativeTime(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug">{c.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={(e) => void send(e)} className="flex gap-2 border-t border-line pt-3">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={280}
            placeholder={t("feed.commentPlaceholder")}
            className="h-11 min-w-0 flex-1 rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-yellow text-bg disabled:opacity-50"
          >
            {sending ? (
              <Spinner className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
      </div>
    </AppSheet>
  );
}

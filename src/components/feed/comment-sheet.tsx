import { useEffect, useMemo, useState } from "react";
import { Heart, HeartSolid, Send } from "@/components/icons";

import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { AppSheet } from "@/components/ui/sheet";
import {
  addComment,
  likeComment,
  listComments,
  unlikeComment,
  type FeedItem,
} from "@/lib/server/activity";
import { relativeTime } from "@/lib/relative-time";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type Comment = {
  id: number;
  body: string;
  created_at: string;
  edited_at: string | null;
  parent_id: number | null;
  user_id: string;
  name: string;
  username: string | null;
  image: string | null;
  like_count: number;
  liked_by_me: boolean;
  verified?: boolean;
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
  const { locale } = useI18n();
  const [rows, setRows] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  async function reload() {
    const r = await listComments({ data: item.id });
    setRows(r as Comment[]);
  }

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

  const tree = useMemo(() => {
    const roots = rows.filter((c) => !c.parent_id);
    const byParent = new Map<number, Comment[]>();
    for (const c of rows) {
      if (c.parent_id) {
        const list = byParent.get(c.parent_id) ?? [];
        list.push(c);
        byParent.set(c.parent_id, list);
      }
    }
    return { roots, byParent };
  }, [rows]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    try {
      await addComment({
        data: {
          eventId: item.id,
          body: text,
          parentId: replyTo?.id ?? null,
        },
      });
      setBody("");
      setReplyTo(null);
      await reload();
      onAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSending(false);
    }
  }

  async function toggleLike(c: Comment) {
    const next = !c.liked_by_me;
    setRows((prev) =>
      prev.map((x) =>
        x.id === c.id
          ? {
              ...x,
              liked_by_me: next,
              like_count: x.like_count + (next ? 1 : -1),
            }
          : x,
      ),
    );
    try {
      if (next) await likeComment({ data: c.id });
      else await unlikeComment({ data: c.id });
    } catch {
      setRows((prev) =>
        prev.map((x) =>
          x.id === c.id
            ? {
                ...x,
                liked_by_me: !next,
                like_count: x.like_count + (next ? -1 : 1),
              }
            : x,
        ),
      );
    }
  }

  function CommentRow({ c, depth }: { c: Comment; depth: number }) {
    const kids = tree.byParent.get(c.id) ?? [];
    return (
      <div className={cn(depth > 0 && "ms-8 border-s border-rule/60 ps-3")}>
        <div className="flex gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-[11px] font-semibold text-accent">
            {c.image ? (
              <img src={c.image} alt="" className="size-full object-cover" />
            ) : (
              (c.name || "?")[0]
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <Link
                to="/u/$username"
                params={{ username: c.username || c.user_id }}
                className="text-sm font-semibold hover:underline"
              >
                {c.name}
              </Link>
              {c.verified ? (
                <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-on-primary">
                  ✓
                </span>
              ) : null}
              <span className="text-[11px] text-text-3">
                {relativeTime(c.created_at, locale)}
                {c.edited_at ? ` · ${t("post.edited")}` : ""}
              </span>
            </div>
            <p className="mt-0.5 whitespace-pre-wrap text-sm leading-snug">{c.body}</p>
            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void toggleLike(c)}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-medium",
                  c.liked_by_me ? "text-danger" : "text-text-2",
                )}
              >
                {c.liked_by_me ? <HeartSolid className="size-3" /> : <Heart className="size-3" />}
                {c.like_count > 0 ? c.like_count : t("post.likeComment")}
              </button>
              {depth === 0 ? (
                <button
                  type="button"
                  onClick={() => setReplyTo(c)}
                  className="inline-flex min-h-11 items-center text-[11px] font-medium text-text-2"
                >
                  {t("post.reply")}
                </button>
              ) : null}
              {/* owner delete not wired without current user id; keep simple */}
            </div>
          </div>
        </div>
        {kids.length > 0 ? (
          <div className="mt-2 space-y-2">
            {kids.map((k) => (
              <CommentRow key={k.id} c={k} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <AppSheet title={t("feed.comments")} onClose={onClose}>
      <div className="flex min-h-[40vh] flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-3">
          {loading ? (
            <div className="space-y-3 py-2" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="size-8 shrink-0 animate-pulse rounded-full bg-raised" />
                  <div className="h-14 min-w-0 flex-1 animate-pulse rounded-xl bg-raised" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-2">
              {t("feed.noComments")}
            </p>
          ) : (
            tree.roots.map((c) => <CommentRow key={c.id} c={c} depth={0} />)
          )}
        </div>

        <form
          onSubmit={(e) => void send(e)}
          className="sticky bottom-0 border-t border-rule bg-sunken pt-2"
        >
          {replyTo ? (
            <div className="mb-1.5 flex items-center justify-between rounded-lg bg-raised px-2 py-1 text-[11px] text-text-2">
              <span>
                {t("post.reply")} · {replyTo.name}
              </span>
              <button type="button" onClick={() => setReplyTo(null)}>
                ×
              </button>
            </div>
          ) : null}
          <div className="flex items-end gap-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 500))}
              rows={2}
              maxLength={500}
              placeholder={t("feed.commentPlaceholder")}
              className="min-h-11 flex-1 resize-none rounded-xl border border-rule bg-raised px-3 py-2 text-sm outline-none focus:border-accent/40"
            />
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="grid size-11 place-items-center rounded-xl bg-primary text-on-primary disabled:opacity-50"
              aria-label={t("common.save")}
            >
              {sending ? <Spinner className="size-4" /> : <Send className="size-4" />}
            </button>
          </div>
        </form>
      </div>
    </AppSheet>
  );
}

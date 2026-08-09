import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import {
  listNotifications,
  markNotificationsRead,
  type NotificationRow,
} from "@/lib/server/notifications";
import { useI18n } from "@/lib/i18n/provider";
import { relativeTime } from "@/lib/relative-time";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bildirimler")({
  component: NotificationsPage,
});

function labelFor(
  n: NotificationRow,
  t: (k: string, v?: Record<string, string | number>) => string,
) {
  const name = n.actor.name;
  if (n.others > 0 && n.type === "like") {
    return t("notifications.likeGroup", { name, n: n.others });
  }
  switch (n.type) {
    case "like":
      return t("notifications.like", { name });
    case "comment":
      return t("notifications.comment", { name });
    case "reply":
      return t("notifications.reply", { name });
    case "follow":
      return t("notifications.follow", { name });
    case "mention":
      return t("notifications.mention", { name });
    case "comment_like":
      return t("notifications.commentLike", { name });
    default:
      return name;
  }
}

function NotificationsPage() {
  const { user, isPending } = useCurrentUserState();
  const { t, locale } = useI18n();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await listNotifications({ data: { limit: 40 } });
      setItems(r.items);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  async function markAll() {
    try {
      await markNotificationsRead({ data: { all: true } });
      setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
    } catch {
      toast.error(t("common.error"));
    }
  }

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell
      title={t("notifications.title")}
      actions={
        items.some((n) => !n.read_at) ? (
          <button
            type="button"
            onClick={() => void markAll()}
            className="inline-flex items-center gap-1 rounded-xl bg-surface2 px-2.5 py-1.5 text-xs font-medium text-muted"
          >
            <CheckCheck className="size-3.5" />
            {t("notifications.markAll")}
          </button>
        ) : null
      }
    >
      <div className="space-y-2 px-1 pb-24 pt-2">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-6 text-yellow" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
            <Bell className="size-8 text-dim" />
            <p className="text-sm text-muted">{t("notifications.empty")}</p>
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex gap-3 rounded-2xl border border-line px-3 py-3",
                n.read_at ? "bg-surface" : "bg-yellow/8 border-yellow/25",
              )}
            >
              <Link
                to="/u/$username"
                params={{ username: n.actor.username || n.actor.id }}
                className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow/15 text-xs font-semibold text-yellow"
              >
                {n.actor.image ? (
                  <img src={n.actor.image} alt="" className="size-full object-cover" />
                ) : (
                  (n.actor.name || "?")[0]
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{labelFor(n, t)}</p>
                <p className="mt-0.5 text-[11px] text-dim">
                  {relativeTime(n.created_at, locale)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

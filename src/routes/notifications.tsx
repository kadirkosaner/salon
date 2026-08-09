import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "@/components/icons";
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
import { qk } from "@/lib/query-keys";

export const Route = createFileRoute("/notifications")({
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

function hrefFor(n: NotificationRow): {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
} {
  if (n.type === "follow" || n.subject_type === "user") {
    return {
      to: "/u/$username",
      params: { username: n.actor.username || n.actor.id },
    };
  }
  if (n.activity_id != null) {
    return { to: "/", search: { activity: String(n.activity_id) } };
  }
  if (n.subject_type === "post") {
    return { to: "/", search: { post: n.subject_id } };
  }
  return {
    to: "/u/$username",
    params: { username: n.actor.username || n.actor.id },
  };
}

function NotificationsPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const listQuery = useQuery({
    queryKey: qk.notifications,
    queryFn: () => listNotifications({ data: { limit: 40 } }),
    enabled: !!userId,
    staleTime: 15_000,
  });

  const items = listQuery.data?.items ?? [];
  const loading = listQuery.isLoading;

  async function markAll() {
    try {
      await markNotificationsRead({ data: { all: true } });
      qc.setQueryData(qk.notifications, (prev: { items: NotificationRow[] } | undefined) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((n) => ({
                ...n,
                read_at: n.read_at ?? new Date().toISOString(),
              })),
            }
          : prev,
      );
      void qc.invalidateQueries({ queryKey: [...qk.settings, "notif-count"] });
    } catch {
      toast.error(t("common.error"));
    }
  }

  async function openItem(n: NotificationRow) {
    if (!n.read_at) {
      const now = new Date().toISOString();
      qc.setQueryData(qk.notifications, (prev: { items: NotificationRow[] } | undefined) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((x) =>
                x.id === n.id ? { ...x, read_at: now } : x,
              ),
            }
          : prev,
      );
      void markNotificationsRead({ data: { ids: [n.id] } })
        .then(() => {
          void qc.invalidateQueries({ queryKey: [...qk.settings, "notif-count"] });
        })
        .catch(() => {});
    }
    const dest = hrefFor(n);
    if (dest.to === "/u/$username" && dest.params) {
      void navigate({ to: "/u/$username", params: dest.params as { username: string } });
    } else if (dest.to === "/") {
      void navigate({
        to: "/",
        search: {
          activity: dest.search?.activity,
          post: dest.search?.post,
        },
      });
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
            className="inline-flex items-center gap-1 rounded-xl bg-raised px-2.5 py-1.5 text-xs font-medium text-text-2"
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
            <Spinner className="size-6 text-accent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
            <Bell className="size-8 text-text-3" />
            <p className="text-sm text-text-2">{t("notifications.empty")}</p>
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => void openItem(n)}
              className={cn(
                "flex w-full gap-3 rounded-2xl border border-rule px-3 py-3 text-left transition active:scale-[0.99]",
                n.read_at ? "bg-sunken" : "bg-accent/8 border-accent/25",
              )}
            >
              <Link
                to="/u/$username"
                params={{ username: n.actor.username || n.actor.id }}
                onClick={(e) => e.stopPropagation()}
                className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-xs font-semibold text-accent"
              >
                {n.actor.image ? (
                  <img src={n.actor.image} alt="" className="size-full object-cover" />
                ) : (
                  (n.actor.name || "?")[0]
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{labelFor(n, t)}</p>
                <p className="mt-0.5 text-[11px] text-text-3">
                  {relativeTime(n.created_at, locale)}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </AppShell>
  );
}

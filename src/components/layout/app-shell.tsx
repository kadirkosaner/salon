import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/i18n/provider";
import { getUnreadNotificationCount } from "@/lib/server/notifications";
import { qk } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

/** Phone-frame column width — desktop stays a centered mobile shell. */
const SHELL_MAX = "max-w-[480px]";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
  restTimerActive,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  restTimerActive?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useCurrentUser();
  const t = useT();
  const { data: notifData } = useQuery({
    queryKey: [...qk.settings, "notif-count"] as const,
    queryFn: () => getUnreadNotificationCount(),
    enabled: !!user?.id,
    refetchInterval: 60_000,
  });
  const unread = notifData?.count ?? 0;


  const LEFT_NAV = [
    { to: "/", label: t("nav.panel"), icon: LayoutDashboard },
    { to: "/antrenman", label: t("nav.workout"), icon: CalendarDays },
  ] as const;

  const RIGHT_NAV = [
    { to: "/program", label: t("nav.program"), icon: Dumbbell },
  ] as const;

  const initials = (user?.displayName || user?.primaryEmail || "S")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onSettings = pathname === "/ayarlar";
  const searchActive = pathname === "/kesfet";
  const onProfile = pathname === "/profil" || pathname.startsWith("/u/");

  function navOn(to: string) {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(to + "/");
  }

  return (
    <div className="min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full overflow-x-clip bg-bg text-text">
      {/* Centered phone column — no separate desktop layout */}
      <div
        className={cn(
          "relative mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full flex-col",
          SHELL_MAX,
          "border-x border-line/70 bg-bg shadow-[0_0_40px_rgba(0,0,0,0.35)]",
        )}
      >
        <header className="sticky top-[var(--grok-banner-h,0px)] z-30 border-b border-line/80 bg-bg/95 backdrop-blur-md">
          <div className="flex w-full items-center gap-2 px-3 py-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-yellow/15 text-yellow ring-1 ring-yellow/15">
                <Activity className="size-5" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <p className="font-display truncate text-lg leading-none tracking-wide">
                  {title ?? t("app.name")}
                </p>
                {subtitle ? (
                  <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <Link
                to="/bildirimler"
                className={cn(
                  "relative grid size-12 place-items-center rounded-2xl transition active:scale-95",
                  pathname === "/bildirimler"
                    ? "bg-yellow/15 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]"
                    : "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:text-text",
                )}
                aria-label={t("nav.notifications")}
              >
                <Bell className="size-5" strokeWidth={pathname === "/bildirimler" ? 2.4 : 2} />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-red px-1 text-[9px] font-bold leading-4 text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                ) : null}
              </Link>
              <Link
                to="/ayarlar"
                className={cn(
                  "grid size-12 place-items-center rounded-2xl transition active:scale-95",
                  onSettings
                    ? "bg-yellow/15 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]"
                    : "bg-surface2 text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:text-text",
                )}
                aria-label={t("nav.settings")}
              >
                <Settings className="size-5" strokeWidth={onSettings ? 2.4 : 2} />
              </Link>
            </div>
          </div>
        </header>

        <main
          className={cn(
            "min-w-0 w-full flex-1 px-3 pt-3",
            restTimerActive ? "rest-timer-pad" : "app-pad-bottom",
          )}
        >
          {children}
        </main>

        <nav
          className={cn(
            "fixed bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md",
            "left-1/2 w-full -translate-x-1/2",
            SHELL_MAX,
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="grid w-full grid-cols-5 items-end">
            {LEFT_NAV.map((item) => {
              const isOn = navOn(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
                    isOn ? "text-yellow" : "text-muted hover:text-text",
                  )}
                >
                  {isOn && (
                    <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-yellow" />
                  )}
                  <Icon className="size-5 shrink-0" strokeWidth={isOn ? 2.4 : 2} />
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              );
            })}

            <div className="relative flex min-h-16 items-center justify-center">
              <Link
                to="/kesfet"
                aria-label={t("nav.discover")}
                className={cn(
                  "grid size-14 place-items-center rounded-full shadow-lg shadow-black/40 ring-4 ring-bg transition -translate-y-3",
                  searchActive
                    ? "bg-yellow text-bg"
                    : "bg-yellow/90 text-bg hover:bg-yellow",
                )}
              >
                <Search className="size-6" strokeWidth={2.5} />
              </Link>
            </div>

            {RIGHT_NAV.map((item) => {
              const isOn = navOn(item.to) && !searchActive;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
                    isOn ? "text-yellow" : "text-muted hover:text-text",
                  )}
                >
                  {isOn && (
                    <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-yellow" />
                  )}
                  <Icon className="size-5 shrink-0" strokeWidth={isOn ? 2.4 : 2} />
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              );
            })}

            <Link
              to="/profil"
              aria-label={t("nav.profile")}
              className={cn(
                "relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
                onProfile ? "text-yellow" : "text-muted hover:text-text",
              )}
            >
              {onProfile && (
                <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-yellow" />
              )}
              <span
                className={cn(
                  "grid size-7 place-items-center overflow-hidden rounded-full font-display text-[11px]",
                  onProfile
                    ? "bg-yellow/20 text-yellow ring-2 ring-yellow/50"
                    : "bg-surface2 text-muted ring-1 ring-line",
                )}
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt=""
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </span>
              <span className="max-w-full truncate">{t("nav.profile")}</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export function AuthGateSkeleton() {
  return (
    <div className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg px-6">
      <div className="mx-auto w-full max-w-[480px] space-y-3 px-6">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-lg bg-surface2" />
        <div className="h-4 animate-pulse rounded bg-surface2" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface2" />
      </div>
    </div>
  );
}

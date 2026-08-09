import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AtSign,
  Eye,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Globe,
  KeyRound,
  LogOut,
  Palette,
  Scale,
  Trash2,
  Vibrate,
} from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authClient, signOut } from "@/lib/auth/client";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale, MessageKey } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import {
  deleteMyAccount,
  exportMyData,
  getSettings,
  updateSettings,
} from "@/lib/server/settings";
import { setHapticEnabled } from "@/lib/haptics";
import {
  getMyProfileHub,
  type ProfileHub,
} from "@/lib/server/social";
import { setComparisonOptIn, getComparisonOptIn } from "@/lib/server/benchmarks";
import { Spinner } from "@/components/ui/spinner";
import { useTheme } from "@/lib/theme/provider";
import {
  accentsFor,
  type AccentId,
  DEFAULT_ACCENT,
  type ThemeId,
} from "@/lib/theme/tokens";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type Panel =
  | "menu"
  | "password"
  | "language"
  | "timezone"
  | "units"
  | "appearance"
  | "delete";

function SettingsPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const { t, locale, setLocale, locales } = useI18n();
  const { theme, accent, setThemeAndAccent } = useTheme();
  const [panel, setPanel] = useState<Panel>("menu");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [timeZone, setTimeZone] = useState("Europe/Istanbul");
  const [savingTz, setSavingTz] = useState(false);
  const [compareOpt, setCompareOpt] = useState(true);
  const [hub, setHub] = useState<ProfileHub | null>(null);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [hapticOn, setHapticOn] = useState(true);
  const [notifOn, setNotifOn] = useState(true);
  const [deleteWord, setDeleteWord] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [_exporting, setExporting] = useState(false);


  useEffect(() => {
    if (!user?.id) return;
    void getSettings()
      .then((st) => {
        if (st.timeZone) setTimeZone(st.timeZone);
        setHapticOn(st.hapticEnabled !== false);
        setHapticEnabled(st.hapticEnabled !== false);
        setNotifOn(st.notificationsEnabled !== false);
        if (st.unitSystem) setUnitSystem(st.unitSystem);
        if (st.theme) {
          setThemeAndAccent(
            st.theme as ThemeId,
            (st.accent as AccentId) || DEFAULT_ACCENT[st.theme as ThemeId],
          );
        }
      })
      .catch(() => {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) setTimeZone(tz);
        } catch {
          /* keep default */
        }
      });
    void getMyProfileHub()
      .then((h) => {
        setHub(h);
      })
      .catch(() => {});
    void getComparisonOptIn()
      .then((r) => {
        setCompareOpt(r.optIn !== false);
      })
      .catch(() => {});
  }, [user?.id, setThemeAndAccent]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const initials = (user.displayName || user.primaryEmail || "S")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const currentLang =
    locales.find((l) => l.id === locale)?.native ?? locale.toUpperCase();

  const avatarSrc = hub?.image || user.profileImageUrl;

  const themeLabel =
    theme === "carbon" ? t("settings.themeCarbon") : t("settings.themeObsidian");
  const accentList = accentsFor(theme);
  const accentLabel = t(
    (accentList.find((a) => a.id === accent)?.labelKey ??
      "settings.accentPirinc") as MessageKey,
  );

  async function persistTheme(nextTheme: ThemeId, nextAccent: AccentId) {
    setThemeAndAccent(nextTheme, nextAccent);
    try {
      await updateSettings({
        data: { theme: nextTheme, accent: nextAccent },
      });
    } catch {
      /* local still has it */
    }
  }


  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t("settings.newPassword") + " · 8+");
      return;
    }
    if (newPassword !== newPassword2) {
      toast.error(t("common.error"));
      return;
    }
    if (!currentPassword) {
      toast.error(t("settings.currentPassword"));
      return;
    }
    setSavingPw(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });
      if (error) {
        toast.error(t("common.error"));
        return;
      }
      toast.success(t("common.saved"));
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
      setPanel("menu");
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSavingPw(false);
    }
  }

  async function copyEmail() {
    const mail = user?.primaryEmail;
    if (!mail) return;
    try {
      await navigator.clipboard.writeText(mail);
      toast.success(t("common.copied"));
    } catch {
      toast.message(mail);
    }
  }

  async function saveTz(tz: string) {
    setSavingTz(true);
    try {
      await updateSettings({ data: { timeZone: tz } });
      setTimeZone(tz);
      toast.success(t("common.saved"));
      setPanel("menu");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSavingTz(false);
    }
  }


  const COMMON_TZ = [
    "Europe/Istanbul",
    "Europe/Berlin",
    "Europe/London",
    "Europe/Moscow",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Dubai",
    "Asia/Tokyo",
    "UTC",
  ] as const;

  const tzList = Array.from(
    new Set(
      [
        timeZone,
        ...COMMON_TZ,
        (() => {
          try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
          } catch {
            return null;
          }
        })(),
      ].filter(Boolean) as string[],
    ),
  );

  async function doExport() {
    setExporting(true);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `salon-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t("settings.exportDone"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setExporting(false);
    }
  }

  async function doDeleteAccount() {
    if (deleteWord !== "DELETE") {
      toast.error(t("settings.deleteConfirmWord"));
      return;
    }
    if (!confirm(t("settings.deleteWarn"))) return;
    setDeleting(true);
    try {
      await deleteMyAccount({ data: { confirm: "DELETE" } });
      toast.success(t("common.success"));
      await signOut("/login");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell title={t("settings.title")} subtitle={t("settings.subtitle")}>
      <div className="w-full min-w-0 space-y-5">
        {panel === "menu" && (
          <>
            <div className="overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3.5 px-4 py-4">
                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/15 font-display text-xl text-accent">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="size-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold">
                    {user.displayName || "—"}
                  </p>
                  {hub?.username ? (
                    <p className="text-sm text-accent">@{hub.username}</p>
                  ) : null}
                  {user.primaryEmail ? (
                    <button
                      type="button"
                      onClick={() => void copyEmail()}
                      className="mt-0.5 flex max-w-full items-center gap-1.5 text-left"
                    >
                      <span className="truncate text-sm text-text-2">
                        {user.primaryEmail}
                      </span>
                      <Copy className="size-3.5 shrink-0 text-text-3" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <SettingsGroup label={t("settings.account")}>
              <SettingsRow
                icon={AtSign}
                label={t("profile.editProfile")}
                value={hub ? `@${hub.username}` : undefined}
                onClick={() => void navigate({ to: "/profile/edit" })}
              />
              <SettingsRow
                icon={KeyRound}
                label={t("settings.changePassword")}
                onClick={() => setPanel("password")}
                last
              />
            </SettingsGroup>

            <SettingsGroup label={t("settings.preferences")}>
              <SettingsRow
                icon={Palette}
                label={t("settings.appearance")}
                value={`${themeLabel} · ${accentLabel}`}
                onClick={() => setPanel("appearance")}
              />
              <SettingsRow
                icon={Globe}
                label={t("settings.language")}
                value={currentLang}
                onClick={() => setPanel("language")}
              />
              <SettingsRow
                icon={Clock}
                label={t("settings.timezone")}
                value={timeZone}
                onClick={() => setPanel("timezone")}
              />
              <SettingsRow
                icon={Scale}
                label={t("settings.units")}
                value={
                  unitSystem === "imperial"
                    ? t("settings.unitsImperial")
                    : t("settings.unitsMetric")
                }
                onClick={() => setPanel("units")}
              />
              <SettingsRow
                icon={Vibrate}
                label={t("settings.haptic")}
                value={hapticOn ? t("settings.hapticOn") : t("settings.hapticOff")}
                onClick={() => {
                  const next = !hapticOn;
                  setHapticOn(next);
                  setHapticEnabled(next);
                  void updateSettings({ data: { hapticEnabled: next } }).then(
                    () => toast.success(t("common.saved")),
                  );
                }}
              />
              <SettingsRow
                icon={Bell}
                label={t("settings.notifications")}
                value={
                  notifOn
                    ? t("settings.notificationsOn")
                    : t("settings.notificationsOff")
                }
                onClick={() => {
                  const next = !notifOn;
                  setNotifOn(next);
                  void updateSettings({ data: { notificationsEnabled: next } })
                    .then(() => toast.success(t("common.saved")))
                    .catch(() => {
                      setNotifOn(!next);
                      toast.error(t("common.error"));
                    });
                }}
                last
              />
            </SettingsGroup>

            <SettingsGroup label={t("settings.privacy")}>
              <SettingsRow
                icon={Eye}
                label={t("compare.optIn")}
                value={compareOpt ? t("common.yes") : t("common.no")}
                onClick={() => {
                  const next = !compareOpt;
                  setCompareOpt(next);
                  void setComparisonOptIn({ data: { optIn: next } })
                    .then(() => toast.success(t("common.saved")))
                    .catch(() => {
                      setCompareOpt(!next);
                      toast.error(t("common.error"));
                    });
                }}
              />
              <p className="-mt-1 px-4 pb-2 text-[11px] leading-relaxed text-text-3">
                {t("compare.optInHint")}
              </p>
              <SettingsRow
                icon={Download}
                label={t("settings.export")}
                onClick={() => void doExport()}
              />
              <SettingsRow
                icon={Trash2}
                label={t("settings.deleteAccount")}
                danger
                onClick={() => setPanel("delete")}
                last
              />
            </SettingsGroup>

            <button
              type="button"
              onClick={() => void signOut("/login")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-danger/10 text-sm font-semibold text-danger shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_25%,transparent)] active:scale-[0.99]"
            >
              <LogOut className="size-4" />
              {t("auth.logout")}
            </button>
          </>
        )}

        {panel === "appearance" && (
          <SubPanel title={t("settings.appearance")} onBack={() => setPanel("menu")}>
            <p className="mb-3 px-1 text-xs text-text-2">{t("settings.appearanceHint")}</p>

            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-2">
              {t("settings.theme")}
            </p>
            <div
              role="group"
              aria-label={t("settings.theme")}
              className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-raised p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            >
              {(["obsidian", "carbon"] as const).map((id) => {
                const active = theme === id;
                const label =
                  id === "obsidian"
                    ? t("settings.themeObsidian")
                    : t("settings.themeCarbon");
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => void persistTheme(id, DEFAULT_ACCENT[id])}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-primary text-on-primary"
                        : "text-text-2 active:bg-sunken",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-2">
              {t("settings.accent")}
            </p>
            <div
              className="flex flex-wrap gap-3 px-1"
              role="group"
              aria-label={t("settings.accent")}
            >
              {accentList.map((a) => {
                const active = accent === a.id;
                const label = t(a.labelKey as MessageKey);
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={label}
                    aria-pressed={active}
                    onClick={() => void persistTheme(theme, a.id)}
                    className={cn(
                      "size-10 rounded-full transition",
                      active
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-canvas"
                        : "ring-1 ring-edge",
                    )}
                    style={{ background: a.hex }}
                  />
                );
              })}
            </div>
          </SubPanel>
        )}

        {panel === "timezone" && (
          <SubPanel title={t("settings.timezone")} onBack={() => setPanel("menu")}>
            <p className="mb-3 px-1 text-xs text-text-2">{t("settings.timezoneHint")}</p>
            <div className="overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              {tzList.map((tz, i) => {
                const active = timeZone === tz;
                return (
                  <button
                    key={tz}
                    type="button"
                    disabled={savingTz}
                    onClick={() => void saveTz(tz)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-raised",
                      i > 0 && "border-t border-rule/60",
                    )}
                  >
                    <span className={cn(active && "font-semibold text-accent")}>
                      {tz}
                    </span>
                    {active ? <Check className="size-4 text-accent" /> : null}
                  </button>
                );
              })}
            </div>
          </SubPanel>
        )}

        {panel === "password" && (
          <SubPanel title={t("settings.changePassword")} onBack={() => setPanel("menu")}>
            <form onSubmit={(e) => void savePassword(e)} className="space-y-3">
              <input
                type="password"
                placeholder={t("settings.currentPassword")}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <input
                type="password"
                placeholder={t("settings.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <input
                type="password"
                placeholder={t("settings.newPasswordAgain")}
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className="h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <button
                type="submit"
                disabled={savingPw}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary disabled:opacity-60"
              >
                {savingPw ? <Spinner className="size-4" /> : null}
                {t("common.save")}
              </button>
            </form>
          </SubPanel>
        )}

        {panel === "language" && (
          <SubPanel title={t("settings.language")} onBack={() => setPanel("menu")}>
            <p className="mb-3 px-1 text-xs text-text-2">{t("settings.languageHint")}</p>
            <div className="overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              {locales.map((l, i) => {
                const active = locale === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setLocale(l.id as Locale);
                      toast.success(t("common.saved"));
                      setPanel("menu");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-raised",
                      i > 0 && "border-t border-rule/60",
                    )}
                  >
                    <span className={cn(active && "font-semibold text-accent")}>
                      {l.native}
                    </span>
                    {active ? <Check className="size-4 text-accent" /> : null}
                  </button>
                );
              })}
            </div>
          </SubPanel>
        )}

        {panel === "units" && (
          <SubPanel title={t("settings.units")} onBack={() => setPanel("menu")}>
            <div className="space-y-2">
              {(
                [
                  ["metric", t("settings.unitsMetric")],
                  ["imperial", t("settings.unitsImperial")],
                ] as const
              ).map(([k, lab]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setUnitSystem(k);
                    void updateSettings({ data: { unitSystem: k } }).then(() => {
                      toast.success(t("common.saved"));
                      setPanel("menu");
                    });
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left",
                    unitSystem === k
                      ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
                      : "bg-raised/50",
                  )}
                >
                  <span className="text-sm font-medium">{lab}</span>
                  {unitSystem === k ? (
                    <Check className="ml-auto size-4 text-accent" />
                  ) : null}
                </button>
              ))}
            </div>
          </SubPanel>
        )}

        {panel === "delete" && (
          <SubPanel title={t("settings.deleteAccount")} onBack={() => setPanel("menu")}>
            <div className="space-y-3 rounded-2xl border border-danger/30 bg-danger/5 p-4">
              <p className="text-sm leading-relaxed text-text-2">
                {t("settings.deleteWarn")}
              </p>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-text-2">
                  {t("settings.deleteConfirmWord")}
                </span>
                <input
                  value={deleteWord}
                  onChange={(e) => setDeleteWord(e.target.value)}
                  className="h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                disabled={deleting || deleteWord !== "DELETE"}
                onClick={() => void doDeleteAccount()}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-danger font-semibold text-on-primary disabled:opacity-50"
              >
                {deleting ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
                {t("settings.deleteAccount")}
              </button>
            </div>
          </SubPanel>
        )}
      </div>
    </AppShell>
  );
}

function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-2">
        {label}
      </p>
      <div className="overflow-hidden rounded-2xl bg-sunken shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  value,
  onClick,
  last,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  onClick: () => void;
  last?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-raised",
        !last && "border-b border-rule/60",
      )}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-lg bg-raised",
          danger ? "text-danger" : "text-accent",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm font-medium",
            danger && "text-danger",
          )}
        >
          {label}
        </span>
        {value ? (
          <span className="mt-0.5 block truncate text-xs text-text-2">{value}</span>
        ) : null}
      </span>
      <ChevronRight className="size-4 shrink-0 text-text-3" />
    </button>
  );
}

function SubPanel({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-medium text-accent"
      >
        <ChevronLeft className="size-4" />
        {title}
      </button>
      {children}
    </div>
  );
}


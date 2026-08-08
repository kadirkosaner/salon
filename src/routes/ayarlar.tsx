import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  KeyRound,
  Loader2,
  LogOut,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authClient, signOut } from "@/lib/auth/client";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ayarlar")({ component: SettingsPage });

type Panel = "menu" | "name" | "password" | "language";

function SettingsPage() {
  const { user, isPending } = useCurrentUserState();
  const { t, locale, setLocale, locales } = useI18n();
  const [panel, setPanel] = useState<Panel>("menu");
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user?.displayName]);

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

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2) {
      toast.error(t("common.error"));
      return;
    }
    setSavingName(true);
    try {
      const { error } = await authClient.updateUser({ name: n });
      if (error) {
        toast.error(error.message || t("common.error"));
        return;
      }
      toast.success(t("common.saved"));
      await authClient.getSession();
      setPanel("menu");
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSavingName(false);
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

  return (
    <AppShell title={t("settings.title")} subtitle={t("settings.subtitle")}>
      <div className="w-full min-w-0 space-y-5">
        {panel === "menu" && (
          <>
            {/* Identity — not a shortcut list */}
            <div className="overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3.5 px-4 py-4">
                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-yellow/15 font-display text-xl text-yellow">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold">
                    {user.displayName || "—"}
                  </p>
                  {user.primaryEmail ? (
                    <button
                      type="button"
                      onClick={() => void copyEmail()}
                      className="mt-0.5 flex max-w-full items-center gap-1.5 text-left"
                    >
                      <span className="truncate text-sm text-muted">
                        {user.primaryEmail}
                      </span>
                      <Copy className="size-3.5 shrink-0 text-dim" />
                    </button>
                  ) : null}
                  <p className="mt-1 text-[11px] text-dim">
                    {t("settings.emailHint")}
                  </p>
                </div>
              </div>
            </div>

            {/* Account group — iOS-style inset list */}
            <SettingsGroup label={t("settings.account")}>
              <SettingsRow
                icon={UserRound}
                label={t("settings.displayName")}
                value={user.displayName ?? undefined}
                onClick={() => setPanel("name")}
              />
              <SettingsRow
                icon={KeyRound}
                label={t("settings.changePassword")}
                onClick={() => setPanel("password")}
                last
              />
            </SettingsGroup>

            {/* Language — single row, drill-in (not a button grid) */}
            <SettingsGroup label={t("settings.language")}>
              <SettingsRow
                icon={Globe}
                label={t("settings.language")}
                value={currentLang}
                onClick={() => setPanel("language")}
                last
              />
            </SettingsGroup>

            {/* Sign out alone */}
            <button
              type="button"
              onClick={() => void signOut("/login")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red/10 text-sm font-semibold text-red shadow-[inset_0_0_0_1px_rgba(240,113,120,0.25)] active:scale-[0.99]"
            >
              <LogOut className="size-4" />
              {t("auth.logout")}
            </button>
          </>
        )}

        {panel === "language" && (
          <SubPanel title={t("settings.language")} onBack={() => setPanel("menu")}>
            <p className="mb-3 px-1 text-xs text-muted">
              {t("settings.languageHint")}
            </p>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              {locales.map((l, i) => {
                const active = locale === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setLocale(l.id as Locale);
                      setPanel("menu");
                    }}
                    className={cn(
                      "flex min-h-14 w-full items-center gap-3 px-4 text-left active:bg-surface2",
                      i > 0 && "border-t border-line/80",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium">
                        {l.native}
                      </span>
                      <span className="block text-xs text-muted">{l.label}</span>
                    </span>
                    {active ? (
                      <Check className="size-5 shrink-0 text-yellow" strokeWidth={2.5} />
                    ) : (
                      <span className="size-5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </SubPanel>
        )}

        {panel === "name" && (
          <SubPanel
            title={t("settings.displayName")}
            onBack={() => setPanel("menu")}
          >
            <form onSubmit={saveName} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-2xl bg-surface2 px-4 text-[15px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] outline-none focus:shadow-[inset_0_0_0_1px_rgba(245,197,66,0.45)]"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={savingName}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] disabled:opacity-60"
              >
                {savingName ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t("common.save")
                )}
              </button>
            </form>
          </SubPanel>
        )}

        {panel === "password" && (
          <SubPanel
            title={t("settings.changePassword")}
            onBack={() => setPanel("menu")}
          >
            <form onSubmit={savePassword} className="space-y-3">
              <Field
                label={t("settings.currentPassword")}
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />
              <Field
                label={t("settings.newPassword")}
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <Field
                label={t("settings.newPasswordAgain")}
                type="password"
                value={newPassword2}
                onChange={setNewPassword2}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={savingPw}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] disabled:opacity-60"
              >
                {savingPw ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t("common.save")
                )}
              </button>
            </form>
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
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-dim">
        {label}
      </p>
      <div className="overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
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
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[3.25rem] w-full items-center gap-3 px-3.5 text-left active:bg-surface2",
        !last && "border-b border-line/80",
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface2 text-yellow">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1 text-[15px] font-medium">{label}</span>
      {value ? (
        <span className="max-w-[40%] truncate text-sm text-muted">{value}</span>
      ) : null}
      <ChevronRight className="size-4 shrink-0 text-dim" />
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
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex min-h-11 items-center gap-1 text-sm font-medium text-yellow"
      >
        <ChevronLeft className="size-5" />
        {title}
      </button>
      {children}
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="px-0.5 text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="h-12 w-full rounded-2xl bg-surface2 px-4 text-[15px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] outline-none focus:shadow-[inset_0_0_0_1px_rgba(245,197,66,0.45)]"
      />
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AtSign,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  Globe,
  KeyRound,
  Loader2,
  LogOut,
  Scale,
  Trash2,
  UserRound,
  Vibrate,
} from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authClient, signOut } from "@/lib/auth/client";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";
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
  updateMyProfile,
  type ProfileHub,
} from "@/lib/server/social";
import { isValidUsername, normalizeUsername } from "@/lib/username";

export const Route = createFileRoute("/ayarlar")({ component: SettingsPage });

type Panel =
  | "menu"
  | "name"
  | "password"
  | "language"
  | "timezone"
  | "profile"
  | "units"
  | "delete";

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
  const [timeZone, setTimeZone] = useState("Europe/Istanbul");
  const [savingTz, setSavingTz] = useState(false);
  const [hub, setHub] = useState<ProfileHub | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] =
    useState<ProfileHub["visibility"]>("public");
  const [measuresPublic, setMeasuresPublic] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [hapticOn, setHapticOn] = useState(true);
  const [notifOn, setNotifOn] = useState(true);
  const [deleteWord, setDeleteWord] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user?.displayName]);

  useEffect(() => {
    if (!user) return;
    void getSettings()
      .then((st) => {
        if (st.timeZone) setTimeZone(st.timeZone);
        setHapticOn(st.hapticEnabled !== false);
        setHapticEnabled(st.hapticEnabled !== false);
        setNotifOn(st.notificationsEnabled !== false);
        if (st.unitSystem) setUnitSystem(st.unitSystem);
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
        setUsername(h.username);
        setBio(h.bio ?? "");
        setVisibility(h.visibility);
        setMeasuresPublic(h.measures_public);
      })
      .catch(() => {});
  }, [user]);

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

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const u = normalizeUsername(username);
    if (!isValidUsername(u)) {
      toast.error(t("profile.usernameInvalid"));
      return;
    }
    setSavingProfile(true);
    try {
      const h = await updateMyProfile({
        data: {
          username: u,
          bio: bio.trim() || null,
          visibility,
          measures_public: measuresPublic,
        },
      });
      setHub(h);
      setUsername(h.username);
      toast.success(t("common.saved"));
      setPanel("menu");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSavingProfile(false);
    }
  }

  async function onAvatarFile(file: File | null) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(t("common.error"));
      return;
    }
    try {
      const dataUrl = await compressImage(file, 256, 0.82);
      setSavingProfile(true);
      const h = await updateMyProfile({ data: { avatar_url: dataUrl } });
      setHub(h);
      toast.success(t("common.saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSavingProfile(false);
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
            <div className="overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3.5 px-4 py-4">
                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-yellow/15 font-display text-xl text-yellow">
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
                    <p className="text-sm text-yellow">@{hub.username}</p>
                  ) : null}
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
                </div>
              </div>
            </div>

            <SettingsGroup label={t("settings.account")}>
              <SettingsRow
                icon={AtSign}
                label={t("profile.editProfile")}
                value={hub ? `@${hub.username}` : undefined}
                onClick={() => setPanel("profile")}
              />
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

            <SettingsGroup label={t("settings.preferences")}>
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
                value={notifOn ? t("settings.hapticOn") : t("settings.hapticOff")}
                onClick={() => {
                  const next = !notifOn;
                  setNotifOn(next);
                  void updateSettings({
                    data: { notificationsEnabled: next },
                  }).then(() => toast.success(t("common.saved")));
                }}
                last
              />
            </SettingsGroup>

            <SettingsGroup label={t("settings.danger")}>
              <SettingsRow
                icon={Download}
                label={t("settings.export")}
                onClick={() => void doExport()}
              />
              <SettingsRow
                icon={Trash2}
                label={t("settings.deleteAccount")}
                onClick={() => setPanel("delete")}
                last
              />
            </SettingsGroup>

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

        {panel === "profile" && (
          <SubPanel title={t("profile.editProfile")} onBack={() => setPanel("menu")}>
            <form onSubmit={(e) => void saveProfile(e)} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-yellow/15 font-display text-xl text-yellow">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="size-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <label className="cursor-pointer text-sm font-semibold text-yellow">
                  {t("profile.avatar")}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => void onAvatarFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted">{t("profile.username")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted">@</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    maxLength={20}
                    className="h-12 min-w-0 flex-1 rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted">
                  {t("profile.bio")} ({bio.length}/160)
                </span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 160))}
                  rows={3}
                  className="w-full resize-none rounded-xl bg-surface2 px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                />
              </label>

              <fieldset className="space-y-2">
                <legend className="flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Eye className="size-3.5" /> {t("profile.visibility")}
                </legend>
                {(
                  [
                    ["public", t("profile.visibilityPublic")],
                    ["followers", t("profile.visibilityFollowers")],
                    ["private", t("profile.visibilityPrivate")],
                  ] as const
                ).map(([k, lab]) => (
                  <label
                    key={k}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3",
                      visibility === k
                        ? "bg-yellow/10 shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]"
                        : "bg-surface2/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="vis"
                      checked={visibility === k}
                      onChange={() => setVisibility(k)}
                      className="accent-yellow"
                    />
                    <span className="text-sm">{lab}</span>
                  </label>
                ))}
              </fieldset>

              <label className="flex items-center justify-between gap-3 rounded-xl bg-surface2/50 px-3 py-3">
                <span className="text-sm">{t("profile.measuresPublic")}</span>
                <input
                  type="checkbox"
                  checked={measuresPublic}
                  onChange={(e) => setMeasuresPublic(e.target.checked)}
                  className="size-5 accent-yellow"
                />
              </label>

              <button
                type="submit"
                disabled={savingProfile}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60"
              >
                {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
                {t("common.save")}
              </button>
            </form>
          </SubPanel>
        )}

        {panel === "timezone" && (
          <SubPanel title={t("settings.timezone")} onBack={() => setPanel("menu")}>
            <p className="mb-3 px-1 text-xs text-muted">
              {t("settings.timezoneHint")}
            </p>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              {tzList.map((tz, i) => {
                const active = timeZone === tz;
                return (
                  <button
                    key={tz}
                    type="button"
                    disabled={savingTz}
                    onClick={() => void saveTz(tz)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-surface2",
                      i > 0 && "border-t border-line/60",
                    )}
                  >
                    <span className={cn(active && "font-semibold text-yellow")}>
                      {tz}
                    </span>
                    {active ? <Check className="size-4 text-yellow" /> : null}
                  </button>
                );
              })}
            </div>
          </SubPanel>
        )}

        {panel === "name" && (
          <SubPanel title={t("settings.displayName")} onBack={() => setPanel("menu")}>
            <form onSubmit={(e) => void saveName(e)} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <button
                type="submit"
                disabled={savingName}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60"
              >
                {savingName ? <Loader2 className="size-4 animate-spin" /> : null}
                {t("common.save")}
              </button>
            </form>
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
                className="h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <input
                type="password"
                placeholder={t("settings.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <input
                type="password"
                placeholder={t("settings.newPasswordAgain")}
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className="h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              />
              <button
                type="submit"
                disabled={savingPw}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow font-semibold text-bg disabled:opacity-60"
              >
                {savingPw ? <Loader2 className="size-4 animate-spin" /> : null}
                {t("common.save")}
              </button>
            </form>
          </SubPanel>
        )}

        {panel === "language" && (
          <SubPanel title={t("settings.language")} onBack={() => setPanel("menu")}>
            <p className="mb-3 px-1 text-xs text-muted">{t("settings.languageHint")}</p>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
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
                      "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm active:bg-surface2",
                      i > 0 && "border-t border-line/60",
                    )}
                  >
                    <span className={cn(active && "font-semibold text-yellow")}>
                      {l.native}
                    </span>
                    {active ? <Check className="size-4 text-yellow" /> : null}
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
                      ? "bg-yellow/10 shadow-[inset_0_0_0_1px_rgba(245,197,66,0.35)]"
                      : "bg-surface2/50",
                  )}
                >
                  <span className="text-sm font-medium">{lab}</span>
                  {unitSystem === k ? (
                    <Check className="ml-auto size-4 text-yellow" />
                  ) : null}
                </button>
              ))}
            </div>
          </SubPanel>
        )}

        {panel === "delete" && (
          <SubPanel
            title={t("settings.deleteAccount")}
            onBack={() => setPanel("menu")}
          >
            <div className="space-y-3 rounded-2xl border border-red/30 bg-red/5 p-4">
              <p className="text-sm leading-relaxed text-muted">
                {t("settings.deleteWarn")}
              </p>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted">
                  {t("settings.deleteConfirmWord")}
                </span>
                <input
                  value={deleteWord}
                  onChange={(e) => setDeleteWord(e.target.value)}
                  className="h-12 w-full rounded-xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                disabled={deleting || deleteWord !== "DELETE"}
                onClick={() => void doDeleteAccount()}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red font-semibold text-white disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
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
      <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
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
        "flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-surface2",
        !last && "border-b border-line/60",
      )}
    >
      <span className="grid size-9 place-items-center rounded-lg bg-surface2 text-yellow">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {value ? (
          <span className="mt-0.5 block truncate text-xs text-muted">{value}</span>
        ) : null}
      </span>
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
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-medium text-yellow"
      >
        <ChevronLeft className="size-4" />
        {title}
      </button>
      {children}
    </div>
  );
}

function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

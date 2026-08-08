import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Flame, Loader2, Ruler, UserPlus, Users, Weight } from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState, PageSection, StatTile } from "@/components/ui/section";
import { btnClass } from "@/components/ui/btn";
import { useI18n } from "@/lib/i18n/provider";
import {
  followUser,
  getMyProfileHub,
  listFollowers,
  listFollowing,
  unfollowUser,
  type ProfileHub,
} from "@/lib/server/social";
import { cn, formatDateTR } from "@/lib/utils";

export const Route = createFileRoute("/profil")({ component: ProfilePage });

type Tab = "overview" | "activity" | "following";

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const { t } = useI18n();
  const [hub, setHub] = useState<ProfileHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [following, setFollowing] = useState<
    { id: string; name: string; image: string | null; followers: number }[]
  >([]);
  const [followers, setFollowers] = useState<
    { id: string; name: string; image: string | null; is_following: boolean }[]
  >([]);
  const [friendsLoading, setFriendsLoading] = useState(false);

  const reload = useCallback(async () => {
    setHub(await getMyProfileHub());
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    reload()
      .catch(() => {
        if (!cancelled) toast.error(t("common.error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reload, t]);

  const loadFriends = useCallback(async () => {
    setFriendsLoading(true);
    try {
      const [f1, f2] = await Promise.all([listFollowing(), listFollowers()]);
      setFollowing(f1);
      setFollowers(f2);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setFriendsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (tab === "following") void loadFriends();
  }, [tab, loadFriends]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const initials = (user.displayName || user.primaryEmail || "S")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function toggleFollow(id: string, isFollowing: boolean) {
    try {
      if (isFollowing) {
        await unfollowUser({ data: id });
        toast.success(t("common.success"));
      } else {
        await followUser({ data: id });
        toast.success(t("common.success"));
      }
      await Promise.all([loadFriends(), reload()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  return (
    <AppShell
      title={t("profile.title")}
      subtitle={hub?.active_program ?? t("profile.noProgram")}
    >
      {loading || !hub ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-yellow" />
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="h-20 bg-gradient-to-br from-yellow/25 via-yellow/5 to-transparent sm:h-24" />
            <div className="relative px-4 pb-4">
              <div className="-mt-10 flex items-end justify-between gap-3">
                <div className="grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-4 border-surface bg-yellow/15 font-display text-2xl text-yellow shadow-lg">
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
                <Link
                  to="/ayarlar"
                  className={btnClass("soft", undefined, { size: "sm" })}
                >
                  {t("profile.edit")}
                </Link>
              </div>
              <h1 className="font-display mt-3 text-2xl tracking-wide">
                {user.displayName ?? "—"}
              </h1>
              {/* Email is private — only in Settings */}
              {hub.active_program ? (
                <p className="mt-1 text-xs text-yellow">{hub.active_program}</p>
              ) : (
                <p className="mt-1 text-xs text-dim">{t("profile.noProgram")}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => setTab("following")}
                  className="hover:underline"
                >
                  <span className="num font-semibold text-text">
                    {hub.following}
                  </span>{" "}
                  <span className="text-muted">{t("profile.following").toLowerCase()}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("following")}
                  className="hover:underline"
                >
                  <span className="num font-semibold text-text">
                    {hub.followers}
                  </span>{" "}
                  <span className="text-muted">·</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile
              label={t("profile.streak")}
              value={String(hub.streak)}
              hint={t("profile.weekUnit")}
              accent
              icon={<Flame className="size-3.5 text-orange" />}
            />
            <StatTile
              label={t("profile.sessions")}
              value={String(hub.total_sessions)}
            />
            <StatTile
              label={t("profile.volume")}
              value={
                hub.total_volume >= 1000
                  ? `${(hub.total_volume / 1000).toFixed(1)}k`
                  : String(hub.total_volume)
              }
              hint="kg"
              icon={<Weight className="size-3.5 text-muted" />}
            />
            <StatTile
              label={t("profile.thisWeek")}
              value={String(hub.week_sessions)}
              hint={`${hub.week_volume} kg`}
            />
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            {(
              [
                ["overview", t("profile.overview")],
                ["activity", t("profile.activity")],
                ["following", t("profile.following")],
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "h-11 rounded-xl text-sm font-semibold transition active:scale-[0.98]",
                  tab === k
                    ? "bg-yellow text-bg shadow-[0_2px_10px_rgba(245,197,66,0.25)]"
                    : "text-muted",
                )}
              >
                {lab}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <>
              <PageSection
                title={t("profile.measures")}
                action={
                  <Link
                    to="/olculer"
                    className="flex items-center gap-1 text-xs font-medium text-yellow"
                  >
                    <Ruler className="size-3.5" /> {t("common.edit")}
                  </Link>
                }
              >
                {!hub.measurement ? (
                  <EmptyState hint={t("nav.measurements")} />
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted">
                      {formatDateTR(hub.measurement.date)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <MeasureChip
                        label={t("common.weight")}
                        value={hub.measurement.body_weight}
                        unit="kg"
                        accent
                      />
                      <MeasureChip label="Bel" value={hub.measurement.waist} unit="cm" />
                      <MeasureChip label="Göğüs" value={hub.measurement.chest} unit="cm" />
                      <MeasureChip label="Kol" value={hub.measurement.arm} unit="cm" />
                      <MeasureChip label="Uyluk" value={hub.measurement.thigh} unit="cm" />
                    </div>
                  </div>
                )}
              </PageSection>

              <PageSection title={t("profile.recent")}>
                {hub.recent.length === 0 ? (
                  <EmptyState hint={t("workout.emptyDay")} />
                ) : (
                  <ul className="divide-y divide-line">
                    {hub.recent.slice(0, 4).map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{r.day_name}</p>
                          <p className="text-xs text-muted">{formatDateTR(r.date)}</p>
                        </div>
                        <span className="num shrink-0 text-sm text-yellow">
                          {r.tonnage > 0 ? `${r.tonnage} kg` : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </PageSection>
            </>
          )}

          {tab === "activity" && (
            <PageSection title={t("profile.history")}>
              {hub.recent.length === 0 ? (
                <EmptyState hint={t("workout.emptyDay")} />
              ) : (
                <ul className="space-y-2">
                  {hub.recent.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-3 rounded-xl bg-surface2/40 px-3 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-yellow/10">
                        <Flame className="size-4 text-yellow" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{r.day_name}</p>
                        <p className="text-xs text-muted">{formatDateTR(r.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="num text-sm text-yellow">
                          {r.tonnage > 0 ? r.tonnage : "—"}
                        </p>
                        <p className="text-[10px] text-dim">kg</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PageSection>
          )}

          {tab === "following" && (
            <div className="space-y-4">
              <Link
                to="/kesfet"
                className={btnClass("soft", "w-full")}
              >
                <UserPlus className="size-4" />
                {t("profile.searchPeople")}
              </Link>
              {friendsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-yellow" />
                </div>
              ) : (
                <>
                  <PageSection
                    title={`${t("profile.following")} (${following.length})`}
                    action={<Users className="size-4 text-muted" />}
                  >
                    {following.length === 0 ? (
                      <EmptyState hint={t("profile.searchPeople")} />
                    ) : (
                      <ul className="space-y-2">
                        {following.map((f) => (
                          <FriendRow
                            key={f.id}
                            id={f.id}
                            name={f.name}
                            image={f.image}
                            onToggle={() => void toggleFollow(f.id, true)}
                            following
                          />
                        ))}
                      </ul>
                    )}
                  </PageSection>
                  <PageSection title={`${t("profile.followers")} (${followers.length})`}>
                    {followers.length === 0 ? (
                      <EmptyState hint="—" />
                    ) : (
                      <ul className="space-y-2">
                        {followers.map((f) => (
                          <FriendRow
                            key={f.id}
                            id={f.id}
                            name={f.name}
                            image={f.image}
                            onToggle={() =>
                              void toggleFollow(f.id, f.is_following)
                            }
                            following={f.is_following}
                          />
                        ))}
                      </ul>
                    )}
                  </PageSection>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

function MeasureChip({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: number | string | null | undefined;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2.5",
        accent
          ? "bg-yellow/10 shadow-[inset_0_0_0_1px_rgba(245,197,66,0.25)]"
          : "bg-surface2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
      )}
    >
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("num text-lg", accent ? "text-yellow" : "text-text")}>
        {value != null && value !== "" ? value : "—"}{" "}
        <span className="text-xs text-dim">{unit}</span>
      </p>
    </div>
  );
}

function FriendRow({
  id,
  name,
  image,
  following,
  onToggle,
}: {
  id: string;
  name: string;
  image: string | null;
  following: boolean;
  onToggle: () => void;
}) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <li className="flex items-center gap-3 rounded-xl bg-surface2/40 px-3 py-2.5">
      <Link to="/u/$userId" params={{ userId: id }} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid size-10 place-items-center overflow-hidden rounded-full bg-yellow/15 font-display text-sm text-yellow">
          {image ? (
            <img src={image} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <span className="truncate font-medium">{name}</span>
      </Link>
      <button
        type="button"
        onClick={onToggle}
        className={btnClass(following ? "ghost" : "soft", undefined, { size: "sm" })}
      >
        {following ? "✓" : "+"}
      </button>
    </li>
  );
}

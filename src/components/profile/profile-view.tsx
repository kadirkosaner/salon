import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Download,
  Dumbbell,
  Flame,
  Lock,
  Ruler,
  Trophy,
  UserMinus,
  UserPlus,
  Weight,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageSection, StatTile } from "@/components/ui/section";
import { btnClass } from "@/components/ui/btn";
import { WorkoutHeatmap } from "@/components/profile/heatmap";
import {
  followUser,
  unfollowUser,
  type ProfileHub,
} from "@/lib/server/social";
import { cloneProgram } from "@/lib/server/share";
import { cn, formatDate } from "@/lib/utils";

type Tab = "activity" | "programs" | "stats";

export function ProfileView({
  hub,
  t,
  onChanged,
}: {
  hub: ProfileHub;
  t: (k: string) => string;
  onChanged?: () => void;
}) {
  const [tab, setTab] = useState<Tab>("activity");
  const [busy, setBusy] = useState(false);
  const [following, setFollowing] = useState(hub.is_following);
  const [followers, setFollowers] = useState(hub.followers);

  const initials = (hub.name || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function toggleFollow() {
    if (hub.is_self) return;
    const next = !following;
    if (!next && !confirm(t("profile.unfollowConfirm"))) return;
    setFollowing(next);
    setFollowers((n) => n + (next ? 1 : -1));
    setBusy(true);
    try {
      if (next) await followUser({ data: hub.id });
      else await unfollowUser({ data: hub.id });
      onChanged?.();
    } catch (e) {
      setFollowing(!next);
      setFollowers((n) => n + (next ? -1 : 1));
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function adopt(programId: number, name: string) {
    if (!confirm(`“${name}” programını almak mevcut programını değiştirebilir. Devam?`))
      return;
    setBusy(true);
    try {
      const r = await cloneProgram({ data: { programId, setActive: true } });
      toast.success(`“${r.name}” aktif programın`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  if (hub.restricted) {
    return (
      <div className="w-full min-w-0 space-y-4">
        <Header hub={hub} initials={initials} t={t} following={following} busy={busy} onFollow={() => void toggleFollow()} />
        <EmptyState
          icon={Lock}
          title={t("profile.private")}
          hint={t("profile.privateHint")}
        />
      </div>
    );
  }

  return (
    <div className="stagger-in w-full min-w-0 space-y-4">
      <Header
        hub={hub}
        initials={initials}
        t={t}
        following={following}
        followers={followers}
        busy={busy}
        onFollow={() => void toggleFollow()}
      />

      <div className="card-surface p-3">
        <WorkoutHeatmap days={hub.heatmap} label={t("profile.heatmap")} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatTile
          label={t("profile.followers")}
          countValue={followers}
          onClick={() => setTab("activity")}
        />
        <StatTile
          label={t("profile.following")}
          countValue={hub.following}
        />
        <StatTile
          label={t("profile.sessions")}
          countValue={hub.total_sessions}
          onClick={() => setTab("stats")}
        />
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        {(
          [
            ["activity", t("profile.activity")],
            ["programs", t("profile.programs")],
            ["stats", t("profile.stats")],
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

      {tab === "activity" && (
        <PageSection title={t("profile.history")}>
          {hub.recent.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title={t("workout.emptyDay")}
              hint={
                hub.is_self
                  ? "Tamamladığın seanslar burada listelenir."
                  : "Bu sporcu henüz antrenman paylaşmadı."
              }
              actionLabel={hub.is_self ? t("nav.workout") : undefined}
              actionTo={hub.is_self ? "/antrenman" : undefined}
            />
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
                    <p className="text-xs text-muted">{formatDate(r.date)}</p>
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

      {tab === "programs" && (
        <PageSection title={t("profile.programs")}>
          {hub.programs.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t("profile.noPublicPrograms")}
              hint={
                hub.is_self
                  ? "Programını herkese açık yaparak paylaş."
                  : "Bu sporcu henüz program yayınlamadı."
              }
              actionLabel={hub.is_self ? t("nav.program") : undefined}
              actionTo={hub.is_self ? "/program" : undefined}
            />
          ) : (
            <ul className="space-y-2">
              {hub.programs.map((p) => (
                <li
                  key={p.id}
                  className="flex min-w-0 items-center gap-3 rounded-xl bg-surface2/40 px-3 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.day_count} gün · {p.clone_count} kopya
                    </p>
                  </div>
                  {!hub.is_self && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void adopt(p.id, p.name)}
                      className={btnClass("primary", undefined, { size: "sm" })}
                    >
                      <Download className="size-3.5" /> {t("common.copy")}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </PageSection>
      )}

      {tab === "stats" && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <StatTile
              label={t("profile.streak")}
              countValue={hub.streak}
              hint={t("profile.weekUnit")}
              accent
              icon={<Flame className="size-3.5 text-orange" />}
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
          </div>

          <PageSection title={t("profile.records")}>
            {hub.records.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title={t("profile.noRecords")}
                hint="Set tamamladıkça rekorlar burada."
              />
            ) : (
              <ul className="divide-y divide-line">
                {hub.records.map((r) => (
                  <li
                    key={r.name}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <Trophy className="size-4 shrink-0 text-yellow" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-[11px] text-muted">
                        {formatDate(r.date)}
                      </p>
                    </div>
                    <span className="num text-xl text-yellow">{r.weight}</span>
                    <span className="text-xs text-muted">kg</span>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>

          <PageSection
            title={t("profile.measures")}
            action={
              hub.is_self ? (
                <Link
                  to="/olculer"
                  className="flex items-center gap-1 text-xs font-medium text-yellow"
                >
                  <Ruler className="size-3.5" /> {t("common.edit")}
                </Link>
              ) : null
            }
          >
            {!hub.measurement ? (
              <EmptyState
                icon={Ruler}
                title={t("nav.measurements")}
                hint={
                  hub.is_self
                    ? "İlk ölçünü kaydet."
                    : "Ölçüler gizli veya yok."
                }
                actionLabel={hub.is_self ? t("nav.measurements") : undefined}
                actionTo={hub.is_self ? "/olculer" : undefined}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted">
                  {formatDate(hub.measurement.date)}
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {hub.measurement.body_weight != null && (
                    <span className="num rounded-full border border-yellow/30 bg-yellow/10 px-2.5 py-1 text-yellow">
                      {hub.measurement.body_weight} kg
                    </span>
                  )}
                  {hub.measurement.waist != null && (
                    <span className="rounded-full border border-line px-2.5 py-1 text-muted">
                      Bel {hub.measurement.waist}
                    </span>
                  )}
                  {hub.measurement.chest != null && (
                    <span className="rounded-full border border-line px-2.5 py-1 text-muted">
                      Göğüs {hub.measurement.chest}
                    </span>
                  )}
                  {hub.measurement.arm != null && (
                    <span className="rounded-full border border-line px-2.5 py-1 text-muted">
                      Kol {hub.measurement.arm}
                    </span>
                  )}
                  {hub.measurement.thigh != null && (
                    <span className="rounded-full border border-line px-2.5 py-1 text-muted">
                      Uyluk {hub.measurement.thigh}
                    </span>
                  )}
                </div>
              </div>
            )}
          </PageSection>
        </>
      )}
    </div>
  );
}

function Header({
  hub,
  initials,
  t,
  following,
  followers,
  busy,
  onFollow,
}: {
  hub: ProfileHub;
  initials: string;
  t: (k: string) => string;
  following: boolean;
  followers?: number;
  busy: boolean;
  onFollow: () => void;
}) {
  return (
    <div className="card-surface relative overflow-hidden">
      <div className="h-20 bg-gradient-to-br from-yellow/25 via-yellow/5 to-transparent sm:h-24" />
      <div className="relative px-4 pb-4">
        <div className="-mt-10 flex items-end justify-between gap-3">
          <div className="grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-4 border-surface bg-yellow/15 font-display text-2xl text-yellow shadow-lg">
            {hub.image ? (
              <img src={hub.image} alt="" className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {hub.is_self ? (
            <Link to="/ayarlar" className={btnClass("soft", undefined, { size: "sm" })}>
              {t("profile.edit")}
            </Link>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={onFollow}
              className={cn(
                "mb-1 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold disabled:opacity-60",
                following
                  ? "border border-line text-muted"
                  : "bg-yellow text-bg",
              )}
            >
              {following ? (
                <>
                  <UserMinus className="size-3.5" /> {t("profile.followingBtn")}
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" /> {t("profile.follow")}
                </>
              )}
            </button>
          )}
        </div>

        <h1 className="font-display mt-3 text-2xl tracking-wide">{hub.name}</h1>
        <p className="mt-0.5 text-sm text-yellow">@{hub.username}</p>
        {hub.bio ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{hub.bio}</p>
        ) : null}
        {hub.follows_you ? (
          <span className="mt-2 inline-block rounded-full bg-surface2 px-2 py-0.5 text-[11px] font-medium text-muted">
            {t("profile.followsYou")}
          </span>
        ) : null}
        {hub.active_program && !hub.restricted ? (
          <p className="mt-2 text-xs text-yellow">{hub.active_program}</p>
        ) : null}

        {!hub.restricted && (
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span>
              <span className="num font-semibold text-text">
                {followers ?? hub.followers}
              </span>{" "}
              <span className="text-muted">{t("profile.followers").toLowerCase()}</span>
            </span>
            <span>
              <span className="num font-semibold text-text">{hub.following}</span>{" "}
              <span className="text-muted">{t("profile.following").toLowerCase()}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

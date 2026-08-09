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
  X,
} from "@/components/icons";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/section";
import { WorkoutHeatmap } from "@/components/profile/heatmap";
import {
  followUser,
  unfollowUser,
  type ProfileHub,
} from "@/lib/server/social";
import { cloneProgram } from "@/lib/server/share";
import { DetailModal } from "@/components/discover-panel";
import { cn, formatDate } from "@/lib/utils";

type Tab = "activity" | "programs" | "stats";

function ageFromBirth(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

function formatHeight(
  cm: number | null | undefined,
  unit: "metric" | "imperial",
): string | null {
  if (cm == null || !Number.isFinite(cm)) return null;
  if (unit === "imperial") {
    const totalIn = cm / 2.54;
    const ft = Math.floor(totalIn / 12);
    const inch = Math.round(totalIn - ft * 12);
    return `${ft}'${inch}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function ProfileView({
  hub,
  t,
  onChanged,
}: {
  hub: ProfileHub;
  t: (k: string, vars?: Record<string, string | number>) => string;
  onChanged?: () => void;
}) {
  const [tab, setTab] = useState<Tab>("activity");
  const [busy, setBusy] = useState(false);
  const [following, setFollowing] = useState(hub.is_following);
  const [followers, setFollowers] = useState(hub.followers);
  const [dismissPick, setDismissPick] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

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

  async function adopt(programId: number, _name: string) {
    if (!confirm(t("profile.cloneConfirm"))) return;
    setBusy(true);
    try {
      const r = await cloneProgram({ data: { programId, setActive: true } });
      toast.success(t("profile.programActive", { name: r.name }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  if (hub.restricted) {
    return (
      <div className="w-full min-w-0 space-y-4">
        <IdentityRow
          hub={hub}
          initials={initials}
          t={t}
          following={following}
          followers={followers}
          busy={busy}
          onFollow={() => void toggleFollow()}
        />
        <EmptyState
          icon={Lock}
          title={t("profile.private")}
          hint={t("profile.privateHint")}
        />
      </div>
    );
  }

  const heatHasData = hub.heatmap.some((d) => d.count > 0);
  const age = ageFromBirth(hub.birth_date);
  const heightLabel = formatHeight(hub.height_cm, hub.unit_system);

  return (
    <div className="stagger-in w-full min-w-0 space-y-0 pb-2">
      {hub.is_self && !hub.username_confirmed && !dismissPick ? (
        <div className="mb-3 flex items-center gap-2 border border-accent/25 bg-accent/10 px-3 py-2.5 text-xs text-text">
          <Link to="/profil/duzenle" className="min-w-0 flex-1 font-medium text-accent">
            {t("profile.pickUsername")}
          </Link>
          <button
            type="button"
            onClick={() => setDismissPick(true)}
            className="grid size-8 place-items-center text-text-2"
            aria-label={t("common.close")}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : null}

      <IdentityRow
        hub={hub}
        initials={initials}
        t={t}
        following={following}
        followers={followers}
        busy={busy}
        onFollow={() => void toggleFollow()}
      />

      {(age != null || hub.sex || heightLabel) && (
        <p className="border-b border-rule px-0 py-2 text-xs text-text-2">
          {[
            age != null ? t("profile.ageYears", { n: age }) : null,
            hub.sex && hub.sex !== "unspecified"
              ? t(`profile.sex.${hub.sex}`)
              : null,
            heightLabel,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {heatHasData ? (
        <div className="border-b border-rule py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            {t("profile.heatmap")}
          </p>
          <WorkoutHeatmap days={hub.heatmap} label={t("profile.heatmap")} />
        </div>
      ) : hub.is_self ? (
        <p className="border-b border-rule py-2 text-xs text-text-3">
          {t("profile.heatmapEmpty")}
        </p>
      ) : null}

      {/* Tabs — underline style like Discover */}
      <div className="flex gap-4 overflow-x-auto border-b border-rule text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              "relative -mb-px shrink-0 pb-2.5 pt-3 font-medium transition",
              tab === k
                ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent"
                : "text-text-2",
            )}
          >
            {lab}
          </button>
        ))}
      </div>

      {tab === "activity" && (
        <div className="space-y-3">
          {hub.recent.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={Dumbbell}
                title={t("workout.emptyDay")}
                hint={
                  hub.is_self
                    ? t("profile.activityEmptyHint")
                    : t("profile.activityEmptyOther")
                }
                actionLabel={hub.is_self ? t("nav.workout") : undefined}
                actionTo={hub.is_self ? "/antrenman" : undefined}
              />
            </div>
          ) : (
            <ul className="divide-y divide-rule">
              {hub.recent.map((r) => (
                <li key={r.id}>
                  <div className="flex w-full items-center gap-3 py-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Flame className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.day_name}</p>
                      <p className="text-[11px] text-text-2">{formatDate(r.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="num text-sm text-accent">
                        {r.tonnage > 0 ? r.tonnage : "—"}
                      </p>
                      <p className="text-[10px] text-text-3">kg</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "programs" && (
        <div>
          {hub.programs.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={BookOpen}
                title={t("profile.noPublicPrograms")}
                hint={
                  hub.is_self
                    ? t("profile.programsEmptyHint")
                    : t("profile.programsEmptyOther")
                }
                actionLabel={hub.is_self ? t("nav.program") : undefined}
                actionTo={hub.is_self ? "/program" : undefined}
              />
            </div>
          ) : (
            <>
              <ul className="divide-y divide-rule">
              {hub.programs.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailId(p.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 py-3 text-left active:bg-sunken/60"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                      <BookOpen className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {p.name}
                      </span>
                      <span className="block text-[11px] text-text-2">
                        {t("discover.daysShort", { n: p.day_count })}
                        {p.clone_count > 0
                          ? ` · ${t("discover.clones", { n: p.clone_count })}`
                          : ""}
                      </span>
                    </span>
                    {hub.is_self ? (
                      <span className="shrink-0 text-xs font-medium text-accent">
                        {t("discover.inspect")}
                      </span>
                    ) : null}
                  </button>
                  {!hub.is_self ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void adopt(p.id, p.name)}
                      className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-on-primary disabled:opacity-60"
                    >
                      <Download className="size-3.5" /> {t("common.copy")}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {detailId != null ? (
              <DetailModal
                id={detailId}
                busy={busy}
                onClose={() => setDetailId(null)}
                onClone={(name) => {
                  const id = detailId;
                  setDetailId(null);
                  void adopt(id, name);
                }}
              />
            ) : null}
            </>
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="divide-y divide-rule">
          <div className="grid grid-cols-2 gap-x-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                {t("profile.streak")}
              </p>
              <p className="num mt-0.5 text-2xl text-accent">{hub.streak}</p>
              <p className="text-[11px] text-text-3">{t("profile.weekUnit")}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                {t("profile.volume")}
              </p>
              <p className="num mt-0.5 text-2xl text-text">
                {hub.total_volume >= 1000
                  ? `${(hub.total_volume / 1000).toFixed(1)}k`
                  : hub.total_volume}
              </p>
              <p className="text-[11px] text-text-3">kg</p>
            </div>
          </div>

          <div className="py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
              {t("profile.records")}
            </p>
            {hub.records.length === 0 ? (
              <p className="text-xs text-text-3">{t("profile.recordsEmptyHint")}</p>
            ) : (
              <ul className="divide-y divide-rule/60">
                {hub.records.map((r) => (
                  <li key={r.name} className="flex items-center gap-3 py-2.5">
                    <Trophy className="size-4 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-[11px] text-text-2">{formatDate(r.date)}</p>
                    </div>
                    <span className="num text-lg text-accent">{r.weight}</span>
                    <span className="text-xs text-text-2">kg</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="py-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                {t("profile.measures")}
              </p>
              {hub.is_self ? (
                <Link
                  to="/olculer"
                  className="flex items-center gap-1 text-xs font-medium text-accent"
                >
                  <Ruler className="size-3.5" /> {t("common.edit")}
                </Link>
              ) : null}
            </div>
            {!hub.measurement ? (
              <p className="text-xs text-text-3">
                {hub.is_self
                  ? t("profile.measuresEmptySelf")
                  : t("profile.measuresEmptyHint")}
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-text-2">{formatDate(hub.measurement.date)}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {hub.measurement.body_weight != null && (
                    <span className="num rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
                      {hub.measurement.body_weight} kg
                    </span>
                  )}
                  {hub.measurement.waist != null && (
                    <span className="rounded-full border border-rule px-2.5 py-1 text-text-2">
                      {t("measure.waist")} {hub.measurement.waist}
                    </span>
                  )}
                  {hub.measurement.chest != null && (
                    <span className="rounded-full border border-rule px-2.5 py-1 text-text-2">
                      {t("measure.chest")} {hub.measurement.chest}
                    </span>
                  )}
                  {hub.measurement.arm != null && (
                    <span className="rounded-full border border-rule px-2.5 py-1 text-text-2">
                      {t("measure.arm")} {hub.measurement.arm}
                    </span>
                  )}
                  {hub.measurement.thigh != null && (
                    <span className="rounded-full border border-rule px-2.5 py-1 text-text-2">
                      {t("measure.thigh")} {hub.measurement.thigh}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IdentityRow({
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
    <div className="border-b border-rule pb-3">
      <div className="flex items-start gap-3">
        <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/15 font-display text-xl text-accent">
          {hub.image ? (
            <img src={hub.image} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-base font-semibold leading-tight">
                <span className="truncate">{hub.name}</span>
                {hub.verified ? (
                  <span
                    className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary"
                    title="Verified"
                  >
                    ✓
                  </span>
                ) : null}
              </h1>
              <p className="text-sm text-accent">@{hub.username}</p>
            </div>
            {hub.is_self ? (
              <Link
                to="/profil/duzenle"
                className="inline-flex h-11 shrink-0 items-center rounded-full border border-rule px-3 text-xs font-semibold text-text-2"
              >
                {t("profile.edit")}
              </Link>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={onFollow}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-semibold disabled:opacity-60",
                  following
                    ? "border border-rule text-text-2"
                    : "bg-primary text-on-primary",
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
          {hub.bio ? (
            <p className="mt-1.5 break-words text-sm leading-relaxed text-text-2">{hub.bio}</p>
          ) : null}
          {hub.follows_you ? (
            <span className="mt-1.5 inline-block rounded-full bg-raised px-2 py-0.5 text-[11px] font-medium text-text-2">
              {t("profile.followsYou")}
            </span>
          ) : null}
        </div>
      </div>

      {!hub.restricted && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>
            <span className="num font-semibold text-text">
              {followers ?? hub.followers}
            </span>{" "}
            <span className="text-text-2">{t("profile.followers").toLowerCase()}</span>
          </span>
          <span>
            <span className="num font-semibold text-text">{hub.following}</span>{" "}
            <span className="text-text-2">{t("profile.following").toLowerCase()}</span>
          </span>
          <span>
            <span className="num font-semibold text-text">{hub.total_sessions}</span>{" "}
            <span className="text-text-2">{t("profile.sessions").toLowerCase()}</span>
          </span>
        </div>
      )}
    </div>
  );
}

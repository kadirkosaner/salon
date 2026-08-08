import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Flame,
  Loader2,
  UserMinus,
  UserPlus,
  Weight,
} from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { EmptyState, PageSection, StatTile } from "@/components/ui/section";
import {
  followUser,
  getUserProfile,
  unfollowUser,
  type ProfileHub,
} from "@/lib/server/social";
import { cloneProgram } from "@/lib/server/share";
import { cn, formatDateTR } from "@/lib/utils";

export const Route = createFileRoute("/u/$userId")({ component: PublicProfilePage });

function PublicProfilePage() {
  const { userId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const me = user?.id;
  const [data, setData] = useState<ProfileHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getUserProfile({ data: userId }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Profil yok");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!me) return;
    void reload();
  }, [me, reload]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const initials = (data?.name || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function toggleFollow() {
    if (!data || data.is_self) return;
    setBusy(true);
    try {
      if (data.is_following) {
        await unfollowUser({ data: data.id });
        toast.success("Takipten çıkıldı");
      } else {
        await followUser({ data: data.id });
        toast.success("Takip ediliyor");
      }
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "İşlem başarısız");
    } finally {
      setBusy(false);
    }
  }

  async function adopt(programId: number, name: string) {
    if (!confirm(`“${name}” programını seçmek mevcut programını siler. Devam?`)) return;
    setBusy(true);
    try {
      const r = await cloneProgram({ data: { programId, setActive: true } });
      toast.success(`“${r.name}” aktif programın`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Alınamadı");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Profil" subtitle={data?.name ?? "…"}>
      {loading || !data ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-yellow" />
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="h-20 bg-gradient-to-br from-yellow/25 via-yellow/5 to-transparent" />
            <div className="relative px-4 pb-5">
              <div className="-mt-10 flex items-end justify-between gap-3">
                <div className="grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-4 border-surface bg-yellow/15 font-display text-2xl text-yellow">
                  {data.image ? (
                    <img src={data.image} alt="" className="size-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                {data.is_self ? (
                  <Link
                    to="/profil"
                    className="mb-1 h-9 rounded-full border border-line px-3.5 text-xs font-semibold"
                  >
                    Senin profilin
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void toggleFollow()}
                    className={cn(
                      "mb-1 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold disabled:opacity-60",
                      data.is_following
                        ? "border border-line text-muted"
                        : "bg-yellow text-bg",
                    )}
                  >
                    {data.is_following ? (
                      <>
                        <UserMinus className="size-3.5" /> Takipten çık
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-3.5" /> Takip et
                      </>
                    )}
                  </button>
                )}
              </div>
              <h1 className="font-display mt-3 text-2xl tracking-wide">{data.name}</h1>
              {data.active_program ? (
                <p className="mt-1 text-xs text-yellow">{data.active_program}</p>
              ) : null}
              <p className="mt-2 text-sm text-muted">
                <span className="num font-semibold text-text">{data.following}</span> takip
                {" · "}
                <span className="num font-semibold text-text">{data.followers}</span> takipçi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile
              label="Seri"
              value={String(data.streak)}
              hint="hafta"
              accent
              icon={<Flame className="size-3.5 text-orange" />}
            />
            <StatTile label="Seans" value={String(data.total_sessions)} hint="toplam" />
            <StatTile
              label="Tonaj"
              value={
                data.total_volume >= 1000
                  ? `${(data.total_volume / 1000).toFixed(1)}k`
                  : String(data.total_volume)
              }
              hint="kg"
              icon={<Weight className="size-3.5 text-muted" />}
            />
            <StatTile
              label="Bu hafta"
              value={String(data.week_sessions)}
              hint={`${data.week_volume} kg`}
            />
          </div>

          {data.measurement && (
            <PageSection title="Vücut">
              <p className="mb-2 text-xs text-muted">
                Son · {formatDateTR(data.measurement.date)}
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                {data.measurement.body_weight != null && (
                  <span className="rounded-full border border-yellow/30 bg-yellow/10 px-2.5 py-1 num text-yellow">
                    {data.measurement.body_weight} kg
                  </span>
                )}
                {data.measurement.waist != null && (
                  <span className="rounded-full border border-line px-2.5 py-1 text-muted">
                    Bel {data.measurement.waist}
                  </span>
                )}
                {data.measurement.chest != null && (
                  <span className="rounded-full border border-line px-2.5 py-1 text-muted">
                    Göğüs {data.measurement.chest}
                  </span>
                )}
              </div>
            </PageSection>
          )}

          <PageSection title="Son seanslar">
            {data.recent.length === 0 ? (
              <EmptyState hint="Henüz aktivite yok." />
            ) : (
              <ul className="divide-y divide-line">
                {data.recent.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.day_name}</p>
                      <p className="text-xs text-muted">{formatDateTR(r.date)}</p>
                    </div>
                    <span className="num text-sm text-yellow">
                      {r.tonnage > 0 ? `${r.tonnage} kg` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>

          <PageSection title="Paylaştığı programlar">
            {data.programs.length === 0 ? (
              <EmptyState hint="Herkese açık program yok." />
            ) : (
              <ul className="space-y-2">
                {data.programs.map((p) => (
                  <li
                    key={p.id}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-muted">
                        {p.day_count} gün · {p.clone_count} kopya
                      </p>
                    </div>
                    {!data.is_self && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void adopt(p.id, p.name)}
                        className="flex h-10 shrink-0 items-center gap-1 rounded-lg bg-yellow px-3 text-xs font-semibold text-bg"
                      >
                        <Download className="size-3.5" /> Al
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </PageSection>
        </div>
      )}
    </AppShell>
  );
}

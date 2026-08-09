import { useCallback, useEffect, useState } from "react";
import { BookOpen, Copy, Download, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { ExercisePreviewButton } from "@/components/exercise-preview";
import { LoadTagBadge } from "@/components/load-tag";
import { EmptyState } from "@/components/ui/section";
import { ProgramCardSkeleton } from "@/components/ui/skeleton";
import {
  cloneProgram,
  getPublicProgramDetail,
  listDiscoverPrograms,
  type PublicProgramCard,
} from "@/lib/server/share";
import { generateWorkouts } from "@/lib/server/workouts";
import { DOW_LABELS, DOW_SHORT } from "@/data/library";
import { copyText } from "@/lib/clipboard";
import { todayISO, addDaysISO, cn, isoDow } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { AppSheet } from "@/components/ui/sheet";

export type Pending = {
  kind: "id" | "code";
  id?: number;
  name: string;
  shareCode?: string;
};

/** Discover UI — catalog + share code. */
export function DiscoverPanel({ onCloned }: { onCloned: () => void }) {
  const [list, setList] = useState<PublicProgramCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [code, setCode] = useState("");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [cloning, setCloning] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setList(await listDiscoverPrograms());
    } catch {
      toast.error("Liste yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function runClone(
    p: Pending,
    opts: { startDate: string; startSourceDayId?: number },
  ) {
    setCloning(true);
    setPending(null);
    try {
      const r =
        p.kind === "code"
          ? await cloneProgram({
              data: {
                shareCode: p.shareCode,
                setActive: true,
                startDate: opts.startDate,
                startSourceDayId: opts.startSourceDayId,
              },
            })
          : await cloneProgram({
              data: {
                programId: p.id,
                setActive: true,
                name: p.name,
                startDate: opts.startDate,
                startSourceDayId: opts.startSourceDayId,
              },
            });

      const from = opts.startDate > todayISO() ? opts.startDate : todayISO();
      try {
        await generateWorkouts({
          data: {
            fromDate: from,
            weeks: 4,
            untilDate: addDaysISO(from, 28),
          },
        });
      } catch {
        /* horizon also fills when antrenman opens */
      }

      const dayHint = r.startDayName
        ? ` · ${r.startDayName} → ${DOW_LABELS[r.startDow] ?? ""}`
        : "";
      toast.success(`“${r.name}” aktif${dayHint}`);
      onCloned();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Eklenemedi");
    } finally {
      setCloning(false);
    }
  }

  async function copyCode(codeStr: string) {
    const ok = await copyText(codeStr);
    if (ok) toast.success(`Kod kopyalandı: ${codeStr}`);
    else
      toast.message(`Kod: ${codeStr}`, {
        description: "Manuel kopyala (ortam panoyu engelledi)",
      });
  }

  const filtered = list.filter((p) => {
    if (!q.trim()) return true;
    const hay =
      `${p.name} ${p.description ?? ""} ${p.tags ?? ""} ${p.author_name}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });
  const catalog = filtered.filter((p) => p.is_catalog);
  const community = filtered.filter((p) => !p.is_catalog);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="rounded-xl border border-line bg-surface p-3">
        <p className="text-xs leading-relaxed text-muted">
          Katalogdan al veya arkadaş kodu gir. Başlangıç günü ve hangi seansla
          başlayacağını sen seçersin.
        </p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara…"
            className="h-11 w-full rounded-lg border border-line bg-surface2 py-2 pl-10 pr-3 text-sm"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Kod"
            className="num h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface2 px-3 tracking-widest"
            maxLength={8}
          />
          <button
            type="button"
            disabled={cloning}
            onClick={() => {
              const c = code.trim();
              if (c.length < 4) {
                toast.error("Paylaşım kodunu gir");
                return;
              }
              const match = list.find(
                (p) => p.share_code?.toUpperCase() === c.toUpperCase(),
              );
              setPending({
                kind: "code",
                name: match?.name ?? c,
                shareCode: c,
                id: match?.id,
              });
            }}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-yellow px-3.5 text-sm font-semibold text-bg disabled:opacity-60"
          >
            {cloning ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            Ekle
          </button>
        </div>
      </div>

      {loading ? (
        <ProgramCardSkeleton />
      ) : (
        <>
          <SectionHead
            icon={<BookOpen className="size-4 text-yellow" />}
            title="Katalog"
          />
          {catalog.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Katalog boş"
              hint="Yakında hazır programlar eklenecek."
            />
          ) : (
            <div className="space-y-2.5">
              {catalog.map((p) => (
                <ProgramCard
                  key={p.id}
                  p={p}
                  busy={cloning}
                  onOpen={() => setDetailId(p.id)}
                  onClone={() =>
                    setPending({ kind: "id", id: p.id, name: p.name })
                  }
                  onCopyCode={() => void copyCode(p.share_code!)}
                />
              ))}
            </div>
          )}

          <SectionHead
            icon={<Users className="size-4 text-softblue" />}
            title="Topluluk"
          />
          {community.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Henüz paylaşım yok"
              hint="Program’dan Paylaş ile topluluğa ekle."
              actionLabel="Programa git"
              actionTo="/program"
            />
          ) : (
            <div className="space-y-2.5">
              {community.map((p) => (
                <ProgramCard
                  key={p.id}
                  p={p}
                  busy={cloning}
                  onOpen={() => setDetailId(p.id)}
                  onClone={() =>
                    setPending({ kind: "id", id: p.id, name: p.name })
                  }
                  onCopyCode={() => void copyCode(p.share_code!)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {detailId != null && (
        <DetailModal
          id={detailId}
          busy={cloning}
          onClose={() => setDetailId(null)}
          onClone={(name) => {
            setDetailId(null);
            setPending({ kind: "id", id: detailId, name });
          }}
        />
      )}

      {pending && (
        <StartProgramModal
          pending={pending}
          busy={cloning}
          onCancel={() => setPending(null)}
          onConfirm={(opts) => void runClone(pending, opts)}
        />
      )}
    </div>
  );
}

export function StartProgramModal({
  pending,
  busy,
  onCancel,
  onConfirm,
}: {
  pending: Pending;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (opts: { startDate: string; startSourceDayId?: number }) => void;
}) {
  const [startDate, setStartDate] = useState(todayISO());
  const [startDayId, setStartDayId] = useState<number | null>(null);
  const [days, setDays] = useState<
    Array<{ id: number; dow: number; name: string; focus: string | null }>
  >([]);
  const [loadingDays, setLoadingDays] = useState(true);

  useEffect(() => {
    let c = false;
    setLoadingDays(true);
    const id = pending.id;
    if (!id) {
      // code-only without list match — still allow date, first session default server-side
      setDays([]);
      setLoadingDays(false);
      return;
    }
    void getPublicProgramDetail({ data: id })
      .then((d) => {
        if (c) return;
        setDays(d.days.map((x) => ({ id: x.id, dow: x.dow, name: x.name, focus: x.focus })));
        // default: session that matches today's DOW, else first
        const tod = isoDow(todayISO());
        const match = d.days.find((x) => x.dow === tod);
        setStartDayId(match?.id ?? d.days[0]?.id ?? null);
      })
      .catch(() => {
        if (!c) setDays([]);
      })
      .finally(() => {
        if (!c) setLoadingDays(false);
      });
    return () => {
      c = true;
    };
  }, [pending.id]);

  const previewDow = isoDow(startDate);
  const selected = days.find((d) => d.id === startDayId);

  return (
    <AppSheet title="Programı başlat" onClose={onCancel}>
        <p className="-mt-1 mb-3 text-sm text-muted">
          <span className="font-medium text-text">“{pending.name}”</span>
        </p>

        <label className="mt-4 block space-y-1.5">
          <span className="text-xs font-semibold text-muted">
            Başlangıç günü
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-12 w-full rounded-2xl bg-surface2 px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          />
          <p className="text-[11px] text-dim">
            {DOW_LABELS[previewDow]} · seanslar bu günden itibaren planlanır
          </p>
        </label>

        <div className="mt-4 space-y-1.5">
          <span className="text-xs font-semibold text-muted">
            Hangi seansla başlansın?
          </span>
          {loadingDays ? (
            <div className="space-y-2 py-2" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface2" />
              ))}
            </div>
          ) : days.length === 0 ? (
            <p className="rounded-xl bg-surface2 px-3 py-3 text-xs text-muted">
              Seans listesi yok — programın ilk günüyle başlar.
            </p>
          ) : (
            <ul className="max-h-52 space-y-1.5 overflow-y-auto">
              {days.map((d) => {
                const active = startDayId === d.id;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setStartDayId(d.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left text-sm active:scale-[0.99]",
                        active
                          ? "bg-yellow/15 text-yellow shadow-[inset_0_0_0_1px_rgba(245,197,66,0.4)]"
                          : "bg-surface2 text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold">{d.name}</span>
                        {d.focus ? (
                          <span className="block text-[11px] text-muted">
                            {d.focus}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-[11px] text-dim">
                        {DOW_SHORT[d.dow] ?? DOW_LABELS[d.dow]?.slice(0, 2)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {selected && (
            <p className="text-[11px] leading-relaxed text-muted">
              <span className="text-yellow">{selected.name}</span> →{" "}
              {DOW_LABELS[previewDow]} ({startDate}) gününe oturur; diğer seanslar
              aralıkları korunarak kayar.
            </p>
          )}
        </div>

        <ul className="mt-3 space-y-1 text-xs text-muted">
          <li>• Eski program silinir (üst üste binmez)</li>
          <li className="text-green">• Geçmiş tamamlanan antrenmanlar kalır</li>
        </ul>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={busy || !startDate}
            onClick={() =>
              onConfirm({
                startDate,
                startSourceDayId: startDayId ?? undefined,
              })
            }
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            Başlat
          </button>
        </div>
    </AppSheet>
  );
}

function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="font-display flex items-center gap-2 text-base tracking-wide text-text">
      {icon}
      {title}
    </h3>
  );
}

export function ProgramCard({
  p,
  busy,
  onOpen,
  onClone,
  onCopyCode,
}: {
  p: PublicProgramCard;
  busy: boolean;
  onOpen: () => void;
  onClone: () => void;
  onCopyCode: () => void;
}) {
  return (
    <article className="min-w-0 rounded-xl border border-line bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display truncate text-lg tracking-wide">{p.name}</p>
          <p className="text-[11px] text-muted">
            {p.author_name} · {p.day_count} gün · {p.exercise_count} hareket
          </p>
        </div>
        {p.is_catalog && (
          <span className="shrink-0 rounded-full bg-yellow/12 px-2 py-0.5 text-[10px] font-semibold text-yellow">
            Salon
          </span>
        )}
      </div>
      {p.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
          {p.description}
        </p>
      )}
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="h-12 flex-1 rounded-2xl bg-surface2 text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]"
        >
          İncele
        </button>
        {!p.is_own && (
          <button
            type="button"
            disabled={busy}
            onClick={onClone}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-yellow text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(245,197,66,0.28)] active:scale-[0.98] disabled:opacity-60"
          >
            <Download className="size-3.5" />
            Seç
          </button>
        )}
        {p.share_code && (
          <button
            type="button"
            className="num flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-surface2 px-3 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:text-yellow"
            onClick={onCopyCode}
            aria-label="Kodu kopyala"
          >
            <Copy className="size-3.5" />
            {p.share_code}
          </button>
        )}
      </div>
    </article>
  );
}

export function DetailModal({
  id,
  busy,
  onClose,
  onClone,
}: {
  id: number;
  busy: boolean;
  onClose: () => void;
  onClone: (name: string) => void;
}) {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getPublicProgramDetail>
  > | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    getPublicProgramDetail({ data: id })
      .then((d) => {
        if (!c) setData(d);
      })
      .catch((e) => {
        if (!c) setErr(e instanceof Error ? e.message : "Hata");
      });
    return () => {
      c = true;
    };
  }, [id]);

  return (
    <AppSheet title={data?.name ?? "Program"} onClose={onClose}>
        {!data && !err && (
          <div className="space-y-3 py-6" aria-busy="true">
            <div className="h-8 w-2/3 animate-pulse rounded-lg bg-surface2" />
            <div className="h-24 animate-pulse rounded-2xl bg-surface2" />
            <div className="h-24 animate-pulse rounded-2xl bg-surface2" />
          </div>
        )}
        {err && <p className="py-8 text-center text-sm text-red">{err}</p>}
        {data && (
          <>
            <p className="-mt-1 mb-2 text-xs text-muted">{data.author_name}</p>
            {data.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {data.description}
              </p>
            )}
            <div className="mt-4 space-y-3">
              {data.days.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-line bg-surface2/40 p-3"
                >
                  <p className="font-display text-base">
                    {d.name}{" "}
                    <span className="text-xs font-sans text-muted">
                      {DOW_LABELS[d.dow]}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-2">
                    {d.exercises.map((ex) => (
                      <li
                        key={ex.id}
                        className="border-t border-line/50 pt-2 first:border-0 first:pt-0"
                      >
                        <p className="text-sm font-medium">{ex.exercise_name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="num text-sm text-yellow">
                            {ex.sets}×{ex.rep_lo}-{ex.rep_hi}
                          </span>
                          <LoadTagBadge tag={ex.load_tag} />
                          <ExercisePreviewButton
                            name={ex.exercise_name}
                            formCues={ex.form_cues}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {!data.is_own && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onClone(data.name)}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-yellow font-semibold text-bg disabled:opacity-60"
              >
                {busy ? (
                  <Spinner className="size-4" />
                ) : (
                  <Download className="size-4" />
                )}
                Seç — başlangıç ayarla
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-2 h-11 w-full rounded-lg border border-line text-sm text-muted"
            >
              Kapat
            </button>
          </>
        )}
    </AppSheet>
  );
}

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Download, Search, Users } from "@/components/icons";
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
import { copyText } from "@/lib/clipboard";
import { todayISO, addDaysISO, cn, isoDow } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useI18n, useT } from "@/lib/i18n/provider";
import { dowLong, dowShort } from "@/lib/utils";
import { AppSheet } from "@/components/ui/sheet";

export type Pending = {
  kind: "id" | "code";
  id?: number;
  name: string;
  shareCode?: string;
};

/** Discover UI — catalog + share code. */
export function DiscoverPanel({ onCloned }: { onCloned: () => void }) {
  const t = useT();
  const { locale } = useI18n();
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
      setList(await listDiscoverPrograms({ data: { locale } }));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t, locale]);

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
        ? ` · ${r.startDayName} → ${dowLong(Number(r.startDow) || 1, locale)}`
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
    if (ok) toast.success(t("discover.codeCopied"));
    else
      toast.message(t("discover.codeLabel", { code: codeStr }), {
        description: t("discover.copyBlocked"),
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
      <div className="rounded-xl border border-rule bg-sunken p-3">
        <p className="text-xs leading-relaxed text-text-2">
          {t("discover.panelHint", { startDay: t("discover.startDay") })}
        </p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("discover.searchShort")}
            className="h-11 w-full rounded-lg border border-rule bg-raised py-2 pl-10 pr-3 text-sm"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t("discover.codeShort")}
            className="num h-11 min-w-0 flex-1 rounded-lg border border-rule bg-raised px-3 tracking-widest"
            maxLength={8}
          />
          <button
            type="button"
            disabled={cloning}
            onClick={() => {
              const c = code.trim();
              if (c.length < 4) {
                toast.error(t("common.error"));
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
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-on-primary disabled:opacity-60"
          >
            {cloning ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            {t("discover.addCode")}
          </button>
        </div>
      </div>

      {loading ? (
        <ProgramCardSkeleton />
      ) : (
        <>
          <SectionHead
            icon={<BookOpen className="size-4 text-accent" />}
            title={t("discover.catalogSection")}
          />
          {catalog.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t("discover.catalogEmpty")}
              hint={t("discover.catalogEmptyHint")}
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
            icon={<Users className="size-4 text-info" />}
            title={t("discover.communitySection")}
          />
          {community.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("discover.communityEmpty")}
              hint={t("discover.communityEmptyHint")}
              actionLabel={t("discover.goToProgram")}
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
  const t = useT();
  const { locale } = useI18n();
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
    void getPublicProgramDetail({ data: { id, locale } })
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
  }, [pending.id, locale]);

  const previewDow = isoDow(startDate);
  const selected = days.find((d) => d.id === startDayId);

  return (
    <AppSheet title={t("discover.startProgram")} onClose={onCancel}>
        <p className="-mt-1 mb-3 text-sm text-text-2">
          <span className="font-medium text-text">“{pending.name}”</span>
        </p>

        <label className="mt-4 block space-y-1.5">
          <span className="text-xs font-semibold text-text-2">
            {t("discover.startDay")}
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-12 w-full rounded-2xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          />
          <p className="text-[11px] text-text-3">
            {dowLong(previewDow, locale)} · {t("discover.schedFrom")}
          </p>
        </label>

        <div className="mt-4 space-y-1.5">
          <span className="text-xs font-semibold text-text-2">
            {t("discover.whichSession")}
          </span>
          {loadingDays ? (
            <div className="space-y-2 py-2" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-2xl bg-raised" />
              ))}
            </div>
          ) : days.length === 0 ? (
            <p className="rounded-xl bg-raised px-3 py-3 text-xs text-text-2">
              {t("discover.noSessionList")}
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
                          ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
                          : "bg-raised text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold">{d.name}</span>
                        {d.focus ? (
                          <span className="block text-[11px] text-text-2">
                            {d.focus}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-[11px] text-text-3">
                        {dowShort(d.dow, locale)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {selected && (
            <p className="text-[11px] leading-relaxed text-text-2">
              {t("discover.sessionMaps", { name: selected.name, dow: dowLong(previewDow, locale), date: startDate })}
            </p>
          )}
        </div>

        <ul className="mt-3 space-y-1 text-xs text-text-2">
          <li>• {t("discover.oldProgramRemoved")}</li>
          <li className="text-success">• {t("discover.historyKept")}</li>
        </ul>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="h-12 flex-1 rounded-2xl bg-raised text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98]"
          >
            {t("common.cancel")}
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
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            {t("discover.start")}
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

/** Week dots — dayCount training days distributed across Mon–Sun. */
export function WeekStrip({ dayCount }: { dayCount: number }) {
  const n = Math.max(0, Math.min(7, dayCount));
  const filled = new Set<number>();
  if (n === 1) filled.add(0);
  else if (n > 1) {
    for (let i = 0; i < n; i++) {
      filled.add(Math.round((i * 6) / (n - 1)));
    }
  }
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 7 }, (_, i) => (
        <span
          key={i}
          className={
            filled.has(i)
              ? "size-1.5 rounded-full bg-accent"
              : "size-1.5 rounded-full border border-edge bg-transparent"
          }
        />
      ))}
    </div>
  );
}

/** Dense edge-to-edge row. Tap opens detail — does not clone. */
export function ProgramRow({
  rank,
  p,
  onOpen,
}: {
  rank?: number;
  p: PublicProgramCard;
  onOpen: () => void;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 py-3 text-left active:bg-raised/40"
    >
      {rank != null ? (
        <span className="num w-5 shrink-0 text-xs tabular-nums text-text-3">
          {String(rank).padStart(2, "0")}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-text">{p.name}</span>
          {p.is_catalog ? (
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-accent">
              Salon
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] tabular-nums text-text-2">
          <span>{t("discover.daysShort", { n: p.day_count })}</span>
          <span className="text-text-3">·</span>
          <span>{t("discover.exercisesShort", { n: p.exercise_count })}</span>
          {p.clone_count > 0 ? (
            <>
              <span className="text-text-3">·</span>
              <span className="num">
                {t("discover.clones", { n: p.clone_count.toLocaleString() })}
              </span>
            </>
          ) : null}
          {!p.is_catalog && p.author_name ? (
            <>
              <span className="text-text-3">·</span>
              <span className="truncate">{p.author_name}</span>
            </>
          ) : null}
        </span>
        <div className="mt-1.5">
          <WeekStrip dayCount={p.day_count} />
        </div>
      </span>
    </button>
  );
}

/** Card API kept; renders dense row (clone only in detail sheet). */
export function ProgramCard({
  p,
  busy: _busy,
  onOpen,
  onClone: _onClone,
  onCopyCode: _onCopyCode,
  rank,
}: {
  p: PublicProgramCard;
  busy: boolean;
  onOpen: () => void;
  onClone: () => void;
  onCopyCode: () => void;
  rank?: number;
}) {
  return <ProgramRow rank={rank} p={p} onOpen={onOpen} />;
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
  const t = useT();
  const { locale } = useI18n();
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getPublicProgramDetail>
  > | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    getPublicProgramDetail({ data: { id, locale } })
      .then((d) => {
        if (!c) setData(d);
      })
      .catch((e) => {
        if (!c) setErr(e instanceof Error ? e.message : "Hata");
      });
    return () => {
      c = true;
    };
  }, [id, locale]);

  return (
    <AppSheet
      title={data?.name ?? "Program"}
      onClose={onClose}
      footer={
        data && !data.is_own ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onClone(data.name)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            {t("discover.selectToStart")}
          </button>
        ) : null
      }
    >
        {!data && !err && (
          <div className="space-y-3 py-6" aria-busy="true">
            <div className="h-8 w-2/3 animate-pulse rounded-lg bg-raised" />
            <div className="h-24 animate-pulse rounded-2xl bg-raised" />
            <div className="h-24 animate-pulse rounded-2xl bg-raised" />
          </div>
        )}
        {err && <p className="py-8 text-center text-sm text-danger">{err}</p>}
        {data && (
          <>
            <p className="-mt-1 mb-2 text-xs text-text-2">{data.author_name}</p>
            {data.description && (
              <p className="mt-2 text-sm leading-relaxed text-text-2">
                {data.description}
              </p>
            )}
            <div className="mt-4 space-y-3">
              {data.days.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-rule bg-raised/40 p-3"
                >
                  <p className="font-display text-base">
                    {d.name}{" "}
                    <span className="text-xs font-sans text-text-2">
                      {dowLong(d.dow, locale)}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-2">
                    {d.exercises.map((ex) => (
                      <li
                        key={ex.id}
                        className="border-t border-rule/50 pt-2 first:border-0 first:pt-0"
                      >
                        <p className="text-sm font-medium">{ex.exercise_name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="num text-sm text-accent">
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
          </>
        )}
    </AppSheet>
  );
}

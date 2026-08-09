import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Trophy, X } from "@/components/icons";
import { toast } from "sonner";
import { renderShareCard, shareOrDownload } from "@/lib/share-card";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export type PrMoment = {
  exercise_name: string;
  weight: number;
  prev_weight: number | null;
  unit: string;
};

export function PrCelebration({
  pr,
  username,
  displayName,
  t,
  onClose,
  onShared,
}: {
  pr: PrMoment;
  username?: string | null;
  displayName?: string | null;
  t: (k: string) => string;
  onClose: () => void;
  onShared?: () => void;
}) {
  const [sharing, setSharing] = useState(false);
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    haptic.pr();
  }, []);

  const delta =
    pr.prev_weight != null && pr.prev_weight > 0
      ? pr.weight - pr.prev_weight
      : null;

  async function share() {
    setSharing(true);
    try {
      const blob = await renderShareCard({
        kind: "pr",
        title: pr.exercise_name,
        subtitle: t("pr.cardSubtitle"),
        stats: [
          {
            label: t("pr.newWeight"),
            value: `${pr.weight} ${pr.unit}`,
          },
          ...(delta != null
            ? [
                {
                  label: t("pr.delta"),
                  value: `+${delta % 1 ? delta.toFixed(1) : delta} ${pr.unit}`,
                },
              ]
            : []),
        ],
        username,
        displayName,
      });
      const result = await shareOrDownload(
        blob,
        `salon-pr-${pr.exercise_name.replace(/\s+/g, "-").toLowerCase()}.png`,
        `🏆 ${pr.exercise_name}: ${pr.weight}${pr.unit} — Salon`,
      );
      toast.success(
        result === "shared" ? t("pr.shared") : t("pr.downloaded"),
      );
      onShared?.();
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSharing(false);
    }
  }

  const node = (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("pr.title")}
    >
      {!reduced ? <Confetti /> : null}
      <div
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-accent/30 bg-sunken p-6 sm:rounded-3xl",
          !reduced && "animate-[fade-up_0.4s_ease]",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-xl text-text-2"
          aria-label={t("common.close")}
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-primary text-on-primary shadow-[var(--shadow-primary)]">
            <Trophy className="size-8" />
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            {t("pr.badge")}
          </p>
          <h2 className="font-display mt-2 text-3xl tracking-wide">{pr.exercise_name}</h2>
          <p className="num mt-3 text-5xl leading-none text-accent">
            {pr.weight}
            <span className="ml-1 text-lg font-sans text-text-2">{pr.unit}</span>
          </p>
          {delta != null ? (
            <p className="mt-2 text-sm font-semibold text-success">
              +{delta % 1 ? delta.toFixed(1) : delta} {pr.unit}{" "}
              <span className="font-normal text-text-2">{t("pr.vsPrev")}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-text-2">{t("pr.firstRecord")}</p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-2xl bg-raised text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          >
            {t("pr.continue")}
          </button>
          <button
            type="button"
            disabled={sharing}
            onClick={() => void share()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-on-primary shadow-[var(--shadow-primary)] disabled:opacity-60"
          >
            <Share2 className="size-4" />
            {t("pr.share")}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: `${(i % 12) * 0.05}s`,
        color: ["#f5c542", "#3dd68c", "#f07178", "#6ea8fe", "#e8e8ea"][i % 5],
        rot: `${(i * 47) % 360}deg`,
        dur: `${1.8 + (i % 5) * 0.15}s`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-12px] block size-2.5 rounded-[2px] opacity-90"
          style={{
            left: p.left,
            background: p.color,
            transform: `rotate(${p.rot})`,
            animation: `confetti-fall ${p.dur} linear ${p.delay} forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

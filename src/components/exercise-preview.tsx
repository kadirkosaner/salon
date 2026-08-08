import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { getExercisePreview } from "@/data/exercise-previews";
import { getExerciseMedia } from "@/lib/server/exercises";
import { mediaSrc } from "@/lib/exercise-media";
import { BodyMuscleMap } from "@/components/body-muscle-map";
import { cn } from "@/lib/utils";

export function ExercisePreviewButton({
  name,
  formCues,
  gifUrl,
  imageUrl,
  muscleGroup,
  className,
}: {
  name: string;
  formCues?: string | null;
  gifUrl?: string | null;
  imageUrl?: string | null;
  muscleGroup?: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-surface2 px-3.5 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:bg-surface active:text-yellow",
          className,
        )}
        aria-label={`${name} önizleme`}
      >
        <Play className="size-3.5 fill-current" />
        Önizle
      </button>
      {open && (
        <ExercisePreviewModal
          name={name}
          formCues={formCues}
          gifUrl={gifUrl}
          imageUrl={imageUrl}
          muscleGroup={muscleGroup}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export function ExercisePreviewModal({
  name,
  formCues,
  gifUrl,
  imageUrl,
  muscleGroup,
  onClose,
}: {
  name: string;
  formCues?: string | null;
  gifUrl?: string | null;
  imageUrl?: string | null;
  muscleGroup?: string | null;
  onClose: () => void;
}) {
  const fallback = getExercisePreview(name, formCues);

  const [remote, setRemote] = useState<{
    gif_url: string | null;
    image_url: string | null;
    form_cues: string | null;
    default_note: string | null;
    muscle_group?: string;
  } | null>(null);
  const [loading, setLoading] = useState(!gifUrl && !imageUrl);

  // 0 = proxy gif, 1 = raw gif, 2 = proxy still, 3 = raw still, 4 = none
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setStage(0);
    // If props already have media, skip fetch
    if (gifUrl || imageUrl) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void getExerciseMedia({ data: name })
      .then((m) => {
        if (!cancelled && m) setRemote(m);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [name, gifUrl, imageUrl]);

  const gif = gifUrl || remote?.gif_url || null;
  const still = imageUrl || remote?.image_url || null;
  const group = remote?.muscle_group || muscleGroup || null;
  const cueSource =
    formCues || remote?.form_cues || remote?.default_note || "";
  const cueList = cueSource
    ? cueSource
        .split(/[|\n•·]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : fallback.cues;

  const displaySrc = (() => {
    if (stage === 0 && gif) return mediaSrc(gif, true);
    if (stage === 1 && gif) return mediaSrc(gif, false);
    if (stage === 2 && still) return mediaSrc(still, true);
    if (stage === 3 && still) return mediaSrc(still, false);
    return null;
  })();

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 sm:items-center sm:p-3">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Kapat"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line bg-surface sm:rounded-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>

        <div className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur">
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-tight tracking-wide text-yellow">
              {name}
            </p>
            <p className="mt-1 text-xs leading-snug text-muted">
              {fallback.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-muted active:bg-surface2"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
          <div className="overflow-hidden rounded-2xl border border-line bg-[#0a0a0c]">
            {loading ? (
              <div className="grid h-40 place-items-center text-xs text-muted">
                Yükleniyor…
              </div>
            ) : displaySrc ? (
              <img
                key={displaySrc}
                src={displaySrc}
                alt={name}
                className="mx-auto max-h-72 w-full bg-white object-contain"
                loading="eager"
                onError={() => setStage((s) => Math.min(4, s + 1))}
              />
            ) : (
              <div className="grid h-40 place-items-center px-4 text-center text-xs text-muted">
                Animasyon bulunamadı — kas haritası aşağıda
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-surface2/40 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">
              Çalışan bölgeler
            </p>
            <BodyMuscleMap
              exerciseName={name}
              muscleGroup={group}
              primary={fallback.primary}
              secondary={fallback.secondary ?? []}
            />
          </div>

          {cueList.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface2/40 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">
                Form / yönerge
              </p>
              <ul className="space-y-2">
                {cueList.map((c, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-snug text-muted"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-yellow" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

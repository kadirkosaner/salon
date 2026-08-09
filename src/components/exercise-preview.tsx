import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { AppSheet } from "@/components/ui/sheet";
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
    <AppSheet title={name} onClose={onClose} nested>
      <p className="-mt-1 mb-3 text-xs leading-snug text-muted">
        {fallback.summary}
      </p>
      <div className="space-y-4">
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
    </AppSheet>
  );
}

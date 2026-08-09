import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Dumbbell,
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Trophy,
} from "@/components/icons";
import { toast } from "sonner";
import {
  deleteActivity,
  likeActivity,
  unlikeActivity,
  type FeedItem,
} from "@/lib/server/activity";
import { relativeTime } from "@/lib/relative-time";
import { haptic } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { WorkoutDetailSheet } from "@/components/feed/workout-detail-sheet";

export function ActivityCard({
  item,
  t,
  onComment,
  onRemoved,
}: {
  item: FeedItem;
  t: (k: string) => string;
  onComment: (item: FeedItem) => void;
  onRemoved?: (id: number) => void;
}) {
  const { locale } = useI18n();
  const [liked, setLiked] = useState(item.liked_by_me);
  const [likes, setLikes] = useState(item.like_count);
  const [comments, setComments] = useState(item.comment_count);
  const [busy, setBusy] = useState(false);
  const [openWorkoutId, setOpenWorkoutId] = useState<number | null>(null);

  const initials = (item.author.name || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function toggleLike() {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    haptic.like();
    try {
      if (next) await likeActivity({ data: item.id });
      else await unlikeActivity({ data: item.id });
    } catch {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
      toast.error(t("common.error"));
    }
  }

  async function remove() {
    if (!item.is_mine) return;
    if (!confirm(t("feed.deleteConfirm"))) return;
    setBusy(true);
    try {
      await deleteActivity({ data: item.id });
      onRemoved?.(item.id);
      toast.success(t("common.success"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const text = shareText(item);
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success(t("common.copied"));
      }
    } catch {
      /* user cancel */
    }
  }

  return (
    <article
      className={cn(
        "card-surface overflow-hidden",
        item.type === "personal_record" &&
          "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]",
      )}
    >
      <div className="flex items-start gap-3 p-3.5 pb-2">
        <Link
          to="/u/$username"
          params={{ username: item.author.username || item.author.id }}
          className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 font-display text-sm text-accent"
        >
          {item.author.image ? (
            <img src={item.author.image} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <Link
              to="/u/$username"
              params={{ username: item.author.username || item.author.id }}
              className="truncate text-sm font-semibold hover:underline"
            >
              {item.author.name}
            </Link>
            {item.author_verified ? (
              <span
                className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary"
                title="Verified"
              >
                ✓
              </span>
            ) : null}
            {item.author.username ? (
              <span className="truncate text-xs text-text-2">
                @{item.author.username}
              </span>
            ) : null}
            <span className="shrink-0 text-[11px] text-text-3">
              · {relativeTime(item.created_at, locale)}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-text-3">
            {typeLabel(item.type, t)}
          </p>
        </div>
        {item.is_mine ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void remove()}
            className="grid size-9 place-items-center rounded-lg text-text-3 hover:text-danger"
            aria-label={t("common.delete")}
          >
            <Trash2 className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="px-3.5 pb-3">
        {renderBody(item, t, locale, (id) => setOpenWorkoutId(id))}
      </div>
      {openWorkoutId != null ? (
        <WorkoutDetailSheet
          workoutId={openWorkoutId}
          onClose={() => setOpenWorkoutId(null)}
        />
      ) : null}

      <div className="flex items-center gap-1 border-t border-rule/60 px-2 py-1.5">
        <button
          type="button"
          onClick={() => void toggleLike()}
          className={cn(
            "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition active:scale-[0.98]",
            liked ? "text-danger" : "text-text-2",
          )}
        >
          <Heart className={cn("size-4", liked && "fill-current")} />
          <span className="num">{likes}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onComment(item);
            setComments((c) => c); // keep
          }}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-text-2 transition active:scale-[0.98]"
        >
          <MessageCircle className="size-4" />
          <span className="num">{comments}</span>
        </button>
        <button
          type="button"
          onClick={() => void share()}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-text-2 transition active:scale-[0.98]"
        >
          <Share2 className="size-4" />
        </button>
      </div>
    </article>
  );
}

function typeLabel(type: FeedItem["type"], t: (k: string) => string) {
  switch (type) {
    case "workout_completed":
      return t("feed.typeWorkout");
    case "personal_record":
      return t("feed.typePr");
    case "program_published":
      return t("feed.typeProgram");
    case "streak_milestone":
      return t("feed.typeStreak");
    case "user_post":
      return t("feed.typePost");
    default:
      return "";
  }
}

function renderBody(
  item: FeedItem,
  t: (k: string) => string,
  locale: string,
  onOpenWorkout?: (id: number) => void,
) {
  const p = item.payload;
  if (item.type === "workout_completed") {
    const wid = item.subject_id ?? p.workout_id ?? null;
    return (
      <button
        type="button"
        onClick={() => wid != null && onOpenWorkout?.(wid)}
        className="flex w-full items-center gap-3 rounded-xl bg-raised/60 p-3 text-left transition active:scale-[0.99]"
      >
        <div className="grid size-11 place-items-center rounded-xl bg-accent/15">
          <Dumbbell className="size-5 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-xl leading-none">
            {String(p.day_name ?? t("feed.session"))}
          </p>
          <p className="mt-1 text-xs text-text-2">
            {Number(p.exercise_count ?? 0)} {t("feed.exercises")}
            {Number(p.tonnage) > 0
              ? ` · ${Number(p.tonnage).toLocaleString(locale === "en" ? "en-GB" : locale)} kg`
              : ""}
          </p>
        </div>
      </button>
    );
  }
  if (item.type === "personal_record") {
    const prev = p.prev_weight != null ? Number(p.prev_weight) : null;
    const w = Number(p.weight ?? 0);
    const wid = p.workout_id ?? null;
    return (
      <button
        type="button"
        onClick={() => wid != null && onOpenWorkout?.(wid)}
        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent p-4 text-left transition active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary text-on-primary">
            <Trophy className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              {t("feed.prBadge")}
            </p>
            <p className="mt-1 truncate font-medium">{String(p.exercise_name)}</p>
            <p className="num mt-1 text-3xl leading-none text-accent">
              {w}
              <span className="ml-1 text-sm font-sans text-text-2">kg</span>
            </p>
            {prev != null && prev > 0 ? (
              <p className="mt-1 text-xs text-text-2">
                +{(w - prev).toFixed(w % 1 || prev % 1 ? 1 : 0)} kg
              </p>
            ) : null}
          </div>
        </div>
      </button>
    );
  }
  if (item.type === "program_published") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-raised/60 p-3">
        <div className="grid size-11 place-items-center rounded-xl bg-info/15">
          <BookOpen className="size-5 text-info" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{String(p.name)}</p>
          <p className="mt-0.5 text-xs text-text-2">
            {Number(p.day_count ?? 0)} {t("feed.days")}
            {p.share_code ? ` · ${String(p.share_code)}` : ""}
          </p>
        </div>
      </div>
    );
  }
  if (item.type === "streak_milestone") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-warning/10 p-3">
        <div className="grid size-11 place-items-center rounded-xl bg-warning/20">
          <Flame className="size-5 text-warning" />
        </div>
        <div>
          <p className="font-display text-2xl text-warning">
            {Number(p.weeks)} {t("profile.weekUnit")}
          </p>
          <p className="text-xs text-text-2">{t("feed.streakHint")}</p>
        </div>
      </div>
    );
  }
  if (item.type === "user_post") {
    const body = String(p.body ?? "");
    const parts = body.split(/([@#][\w\u00C0-\u024F]+)/g);
    return (
      <div className="space-y-2">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith("@") && part.length > 1) {
              const u = part.slice(1);
              return (
                <Link
                  key={i}
                  to="/u/$username"
                  params={{ username: u }}
                  className="font-medium text-accent hover:underline"
                >
                  {part}
                </Link>
              );
            }
            if (part.startsWith("#") && part.length > 1) {
              return (
                <span key={i} className="font-medium text-info">
                  {part}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
        {p.workout ? (
          <button
            type="button"
            onClick={() =>
              p.workout_id != null && onOpenWorkout?.(p.workout_id)
            }
            className="flex w-full items-center gap-3 rounded-xl bg-raised/60 p-3 text-left"
          >
            <div className="grid size-10 place-items-center rounded-xl bg-accent/15">
              <Dumbbell className="size-4 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{String(p.workout.day_name)}</p>
              <p className="text-xs text-text-2">
                {p.workout.date}
                {Number(p.workout.exercise_count) > 0
                  ? ` · ${p.workout.exercise_count} ${t("feed.exercises")}`
                  : ""}
                {Number(p.workout.tonnage) > 0
                  ? ` · ${Number(p.workout.tonnage).toLocaleString(locale)} kg`
                  : ""}
              </p>
            </div>
          </button>
        ) : null}
        {p.program ? (
          <div className="flex items-center gap-3 rounded-xl bg-raised/60 p-3">
            <div className="grid size-10 place-items-center rounded-xl bg-info/15">
              <BookOpen className="size-4 text-info" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{String(p.program.name)}</p>
              <p className="text-xs text-text-2">
                {Number(p.program.day_count ?? 0)} {t("feed.days")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

function shareText(item: FeedItem): string {
  const p = item.payload;
  if (item.type === "user_post") {
    return `${item.author.name}: ${p.body ?? ""} — Salon`;
  }
  if (item.type === "personal_record") {
    return `🏆 ${p.exercise_name}: ${p.weight} kg — Salon`;
  }
  if (item.type === "workout_completed") {
    return `✅ ${p.day_name} · ${p.tonnage ?? 0} kg — Salon`;
  }
  if (item.type === "program_published") {
    return `📋 ${p.name} — Salon`;
  }
  return `Salon · ${item.author.name}`;
}

export function bumpCommentCount(
  setComments: React.Dispatch<React.SetStateAction<number>>,
) {
  setComments((c) => c + 1);
}

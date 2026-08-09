import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppSheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  getPublicWorkout,
  type PublicWorkoutView,
} from "@/lib/server/workouts";
import { useI18n } from "@/lib/i18n/provider";
import { formatDate } from "@/lib/utils";

export function WorkoutDetailSheet({
  workoutId,
  onClose,
}: {
  workoutId: number;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const [data, setData] = useState<PublicWorkoutView | null | undefined>(
    undefined,
  );
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    setData(undefined);
    setErr(null);
    void getPublicWorkout({ data: workoutId })
      .then((d) => {
        if (!c) setData(d);
      })
      .catch((e) => {
        if (!c) {
          setData(null);
          setErr(e instanceof Error ? e.message : t("common.error"));
        }
      });
    return () => {
      c = true;
    };
  }, [workoutId, t]);

  const title =
    data === undefined
      ? t("common.loading")
      : data
        ? data.day_name
        : t("feed.typeWorkout");

  return (
    <AppSheet title={title} onClose={onClose}>
      {data === undefined ? (
        <div className="flex justify-center py-10">
          <Spinner className="size-6 text-accent" />
        </div>
      ) : data == null ? (
        <p className="py-8 text-center text-sm text-text-2">
          {err ?? t("feed.workoutGone")}
        </p>
      ) : (
        <div className="space-y-4 pb-2">
          <div>
            <p className="text-xs text-text-2">
              {formatDate(data.date, locale)}
              {data.tonnage > 0
                ? ` · ${data.tonnage.toLocaleString(locale)} kg`
                : ""}
            </p>
            {data.program && data.program.is_public ? (
              <p className="mt-1 text-xs text-accent">
                {data.program.name}
              </p>
            ) : null}
          </div>

          <ul className="divide-y divide-rule border-t border-rule">
            {data.exercises.map((ex) => (
              <li key={ex.id} className="py-3">
                <p className="text-sm font-semibold">{ex.name}</p>
                <ul className="mt-1.5 space-y-0.5">
                  {ex.sets.map((s) => (
                    <li
                      key={s.set_index}
                      className="num flex items-center gap-2 text-xs text-text-2"
                    >
                      <span className="w-6 text-text-3">{s.set_index}</span>
                      <span>
                        {s.weight != null ? `${s.weight} kg` : "—"}
                        {" × "}
                        {s.reps != null ? s.reps : "—"}
                      </span>
                      {!s.completed ? (
                        <span className="text-text-3">·</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {data.is_owner ? (
            <Link
              to="/antrenman"
              search={{ date: data.date }}
              className="flex h-11 items-center justify-center rounded-xl border border-edge text-sm font-semibold"
              onClick={onClose}
            >
              {t("workout.title")}
            </Link>
          ) : null}
        </div>
      )}
    </AppSheet>
  );
}

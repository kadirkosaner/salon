import { Pause, Play, Plus, X } from "@/components/icons";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/provider";

export type RestTimerState = {
  seconds: number;
  exerciseName: string;
} | null;

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.stop(ctx.currentTime + 0.4);
    setTimeout(() => void ctx.close(), 500);
  } catch {
    /* ignore */
  }
}

export function RestTimerBar({
  state,
  onClose,
}: {
  state: RestTimerState;
  onClose: () => void;
}) {
  const t = useT();
  const [left, setLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalRef = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!state) return;
    setLeft(state.seconds);
    totalRef.current = state.seconds;
    setPaused(false);
    firedRef.current = false;
  }, [state]);

  useEffect(() => {
    if (!state || paused) return;
    if (left <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        beep();
        try {
          navigator.vibrate?.(200);
        } catch {
          /* ignore */
        }
      }
      return;
    }
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [state, left, paused]);

  if (!state) return null;

  const total = totalRef.current || state.seconds || 1;
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div
      className="fixed inset-x-0 z-50 border-t border-rule bg-raised shadow-2xl"
      style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="h-1 bg-rule">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 linear",
            left === 0 ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-text-2">
            {t("rest.label", { name: state.exerciseName })}
          </p>
          <p className={cn("num text-3xl leading-none tracking-wide", left === 0 && "text-success")}>
            {left === 0 ? t("rest.ready") : `${mm}:${ss}`}
          </p>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md border border-rule bg-sunken text-text"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t("rest.resume") : t("rest.pause")}
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md border border-rule bg-sunken text-text"
          onClick={() => setLeft((s) => s + 30)}
          aria-label={t("rest.add30")}
        >
          <Plus className="size-4" />
          <span className="sr-only">+30</span>
        </button>
        <span className="num text-xs text-text-2">+30</span>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md border border-rule bg-sunken text-text-2"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

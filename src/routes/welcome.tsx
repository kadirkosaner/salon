import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  Scale,
  Sparkles,
  Users,
} from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n, useT } from "@/lib/i18n/provider";
import { useTheme } from "@/lib/theme/provider";
import {
  accentsFor,
  DEFAULT_ACCENT,
  type AccentId,
  type ThemeId,
} from "@/lib/theme/tokens";
import {
  completeOnboarding,
  getOnboardingPrograms,
  getOnboardingStatus,
  saveOnboardingAppearance,
  saveOnboardingWeight,
  type OnboardingStatus,
} from "@/lib/server/onboarding";
import { cloneProgram } from "@/lib/server/share";
import { updateSettings } from "@/lib/server/settings";
import {
  DetailModal,
  ProgramRow,
  StartProgramModal,
  type Pending,
} from "@/components/discover-panel";
import { AppSheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { cn, todayISO } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n/messages";
import { LOCALES, type Locale } from "@/lib/i18n/messages";

export const Route = createFileRoute("/welcome")({
  component: OnboardingPage,
});

type StepId = "welcome" | "weight" | "appearance" | "program" | "ready";

const LS_WELCOME = "salon.onboarding.welcomeSeen";
const LS_APPEAR = "salon.onboarding.appearanceDone";

function OnboardingPage() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const { locale, setLocale } = useI18n();
  const qc = useQueryClient();
  const { theme, accent, setThemeAndAccent } = useTheme();
  // Prevent <Navigate to="/"> from racing the intentional exit destination.
  const exitingRef = useRef(false);

  const statusQ = useQuery({
    queryKey: ["onboarding", "status", user?.id] as const,
    queryFn: () => getOnboardingStatus(),
    enabled: !!user?.id,
  });

  const status = statusQ.data;

  if (!isPending && user && status?.onboarded && !exitingRef.current) {
    return <Navigate to="/" />;
  }
  if (isPending) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-canvas">
        <Spinner className="size-6 text-accent" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if ((statusQ.isLoading || !status) && !exitingRef.current) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-canvas">
        <Spinner className="size-6 text-accent" />
      </div>
    );
  }
  if (!status) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-canvas">
        <Spinner className="size-6 text-accent" />
      </div>
    );
  }

  async function finish(dest: "workout" | "discover" | "home") {
    exitingRef.current = true;
    await completeOnboarding();
    // Drop cached gate/status so protected routes don't bounce back here.
    await qc.invalidateQueries({ queryKey: ["onboarding"] });
    // Hard navigation avoids a race with <Navigate to="/"> after status flips.
    if (dest === "workout") {
      window.location.assign(`/workout?date=${todayISO()}`);
    } else if (dest === "discover") {
      window.location.assign("/discover");
    } else {
      window.location.assign("/");
    }
  }

  return (
    <OnboardingFlow
      key={user.id}
      status={status}
      locale={locale}
      setLocale={setLocale}
      theme={theme}
      accent={accent}
      setThemeAndAccent={setThemeAndAccent}
      t={t}
      onDone={(dest) => finish(dest)}
      onSkip={() => finish("home")}
      refreshStatus={() =>
        void qc.invalidateQueries({ queryKey: ["onboarding", "status"] })
      }
    />
  );
}

/** Remaining steps from saved progress — computed once when flow mounts. */
function buildSteps(status: OnboardingStatus): StepId[] {
  const welcomeSeen =
    typeof window !== "undefined" &&
    window.localStorage.getItem(LS_WELCOME) === "1";
  const appearDone =
    typeof window !== "undefined" &&
    window.localStorage.getItem(LS_APPEAR) === "1";

  const steps: StepId[] = [];
  if (!welcomeSeen && !status.hasWeight) steps.push("welcome");
  if (!status.hasWeight) steps.push("weight");
  if (!appearDone) steps.push("appearance");
  if (!status.hasProgram) steps.push("program");
  steps.push("ready");
  return steps;
}

function OnboardingFlow({
  status,
  locale,
  setLocale,
  theme,
  accent,
  setThemeAndAccent,
  t,
  onDone,
  onSkip,
  refreshStatus,
}: {
  status: OnboardingStatus;
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: ThemeId;
  accent: AccentId;
  setThemeAndAccent: (t: ThemeId, a?: AccentId) => void;
  t: (k: MessageKey, vars?: Record<string, string | number>) => string;
  onDone: (dest: "workout" | "discover") => Promise<void>;
  onSkip: () => Promise<void>;
  refreshStatus: () => void;
}) {
  // Freeze step list for this session so saving weight/etc. doesn't shrink
  // the list and skip appearance/program (idx would land on "ready").
  const [steps] = useState(() => buildSteps(status));
  const [idx, setIdx] = useState(0);
  const step = steps[Math.min(idx, steps.length - 1)] ?? "ready";
  const [busy, setBusy] = useState(false);
  const [pickedProgram, setPickedProgram] = useState(false);
  const [tz] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );

  const [unit, setUnit] = useState<"metric" | "imperial">(status.unitSystem);
  const [weight, setWeight] = useState(
    status.weightKg != null
      ? String(
          status.unitSystem === "imperial"
            ? Math.round(status.weightKg / 0.453592)
            : status.weightKg,
        )
      : "",
  );
  const [weightErr, setWeightErr] = useState<string | null>(null);

  const [localTheme, setLocalTheme] = useState<ThemeId>(
    status.theme || theme || "obsidian",
  );
  const [localAccent, setLocalAccent] = useState<AccentId>(
    (status.accent as AccentId) || accent || DEFAULT_ACCENT.obsidian,
  );

  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [cloning, setCloning] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [skipWarn, setSkipWarn] = useState(false);

  const progQ = useQuery({
    queryKey: ["onboarding", "programs", daysPerWeek, locale] as const,
    queryFn: () =>
      getOnboardingPrograms({
        data: { daysPerWeek, locale },
      }),
    enabled: step === "program",
  });

  // Live theme preview only on the appearance step — avoid render loops.
  useEffect(() => {
    if (step !== "appearance") return;
    setThemeAndAccent(localTheme, localAccent);
  }, [step, localTheme, localAccent, setThemeAndAccent]);

  function goNext() {
    setIdx((i) => Math.min(i + 1, steps.length - 1));
  }
  function goBack() {
    setIdx((i) => Math.max(i - 1, 0));
  }

  async function submitWeight() {
    setWeightErr(null);
    const n = Number(weight);
    if (!Number.isFinite(n)) {
      setWeightErr(t("onboard.weightInvalid"));
      return;
    }
    const kg = unit === "imperial" ? n * 0.453592 : n;
    if (kg < 20 || kg > 400) {
      setWeightErr(t("onboard.weightRange"));
      return;
    }
    setBusy(true);
    try {
      await saveOnboardingWeight({
        data: {
          weightKg: n,
          unitSystem: unit,
        },
      });
      refreshStatus();
      goNext();
    } catch {
      toast.error(t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function submitAppearance() {
    setBusy(true);
    try {
      await saveOnboardingAppearance({
        data: { theme: localTheme, accent: localAccent },
      });
      try {
        await updateSettings({
          data: {
            theme: localTheme,
            accent: localAccent,
            timeZone: tz,
          },
        });
      } catch {
        /* settings may not accept all fields */
      }
      window.localStorage.setItem(LS_APPEAR, "1");
      refreshStatus();
      goNext();
    } catch {
      toast.error(t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function runClone(
    p: Pending,
    opts: { startDate: string; startSourceDayId?: number },
  ) {
    setCloning(true);
    setPending(null);
    try {
      await cloneProgram({
        data: {
          programId: p.id,
          setActive: true,
          name: p.name,
          startDate: opts.startDate,
          startSourceDayId: opts.startSourceDayId,
        },
      });
      setPickedProgram(true);
      toast.success(t("onboard.programPicked"));
      refreshStatus();
      setIdx(steps.length - 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setCloning(false);
    }
  }

  const progress = ((idx + 1) / steps.length) * 100;
  const canBack = idx > 0 && step !== "ready";

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col bg-canvas text-text">
      <header className="flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {canBack ? (
          <button
            type="button"
            onClick={goBack}
            className="grid size-11 place-items-center rounded-full text-text-2 hover:bg-raised"
            aria-label={t("common.back")}
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <span className="size-11" />
        )}
        <div className="min-w-0 flex-1">
          <div className="h-1 overflow-hidden rounded-full bg-rule">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {step !== "ready" ? (
          <button
            type="button"
            onClick={() => void onSkip()}
            className="min-h-11 shrink-0 px-2 text-xs font-semibold text-text-3 hover:text-text-2"
          >
            {t("onboard.skip")}
          </button>
        ) : (
          <span className="w-16" />
        )}
      </header>

      <main className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        {step === "welcome" && (
          <WelcomeStep
            t={t}
            name={status.displayName}
            onStart={() => {
              window.localStorage.setItem(LS_WELCOME, "1");
              goNext();
            }}
          />
        )}
        {step === "weight" && (
          <WeightStep
            t={t}
            unit={unit}
            setUnit={setUnit}
            weight={weight}
            setWeight={setWeight}
            err={weightErr}
            busy={busy}
            onContinue={() => void submitWeight()}
          />
        )}
        {step === "appearance" && (
          <AppearanceStep
            t={t}
            locale={locale}
            tz={tz}
            theme={localTheme}
            accent={localAccent}
            setTheme={(th) => {
              setLocalTheme(th);
              setLocalAccent(DEFAULT_ACCENT[th]);
            }}
            setAccent={setLocalAccent}
            onOpenLang={() => setLangOpen(true)}
            busy={busy}
            onContinue={() => void submitAppearance()}
          />
        )}
        {step === "program" && (
          <ProgramStep
            t={t}
            daysPerWeek={daysPerWeek}
            setDaysPerWeek={setDaysPerWeek}
            programs={progQ.data ?? []}
            loading={progQ.isLoading}
            cloning={cloning}
            onOpen={(id) => setDetailId(id)}
            onSkipProgram={() => setSkipWarn(true)}
            onBrowseAll={() => {
              void onDone("discover");
            }}
          />
        )}
        {step === "ready" && (
          <ReadyStep
            t={t}
            hasProgram={pickedProgram || status.hasProgram}
            busy={busy}
            onGo={async () => {
              setBusy(true);
              try {
                await onDone(
                  pickedProgram || status.hasProgram ? "workout" : "discover",
                );
              } finally {
                setBusy(false);
              }
            }}
          />
        )}
      </main>

      {detailId != null ? (
        <DetailModal
          id={detailId}
          busy={cloning}
          onClose={() => setDetailId(null)}
          onClone={(name) => {
            setPending({ kind: "id", id: detailId, name });
            setDetailId(null);
          }}
        />
      ) : null}
      {pending ? (
        <StartProgramModal
          pending={pending}
          busy={cloning}
          onCancel={() => setPending(null)}
          onConfirm={(opts) => void runClone(pending, opts)}
        />
      ) : null}

      {langOpen ? (
        <AppSheet title={t("settings.language")} onClose={() => setLangOpen(false)}>
          <ul className="divide-y divide-rule">
            {LOCALES.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  className={cn(
                    "flex min-h-11 w-full items-center px-1 py-3 text-left text-sm",
                    l.id === locale && "font-semibold text-accent",
                  )}
                  onClick={() => {
                    setLocale(l.id);
                    setLangOpen(false);
                  }}
                >
                  {l.native}
                </button>
              </li>
            ))}
          </ul>
        </AppSheet>
      ) : null}

      {skipWarn ? (
        <AppSheet
          title={t("onboard.noProgramTitle")}
          onClose={() => setSkipWarn(false)}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                className="h-11 flex-1 rounded-xl border border-rule text-sm font-semibold"
                onClick={() => setSkipWarn(false)}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-on-primary"
                onClick={() => {
                  setSkipWarn(false);
                  setIdx(steps.length - 1);
                }}
              >
                {t("onboard.continueWithout")}
              </button>
            </div>
          }
        >
          <p className="text-sm leading-relaxed text-text-2">
            {t("onboard.noProgramHint")}
          </p>
        </AppSheet>
      ) : null}
    </div>
  );
}

function WelcomeStep({
  t,
  name,
  onStart,
}: {
  t: (k: MessageKey, vars?: Record<string, string | number>) => string;
  name: string | null;
  onStart: () => void;
}) {
  const points = [
    { icon: Activity, text: t("onboard.valueLog") },
    { icon: BarChart3, text: t("onboard.valueCompare") },
    { icon: Users, text: t("onboard.valueFollow") },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div>
          <p className="text-sm text-text-3">{t("app.name")}</p>
          <h1 className="font-display mt-1 text-3xl tracking-wide text-text">
            {name
              ? t("onboard.welcomeName", { name: name.split(" ")[0]! })
              : t("onboard.welcome")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-2">
            {t("onboard.welcomeHint")}
          </p>
        </div>
        <ul className="space-y-3">
          {points.map((p) => (
            <li
              key={p.text}
              className="flex items-center gap-3 rounded-2xl border border-rule bg-sunken px-3 py-3"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-accent/15 text-accent">
                <p.icon className="size-5" />
              </span>
              <span className="text-sm font-medium">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <PrimaryBtn onClick={onStart}>{t("onboard.start")}</PrimaryBtn>
    </div>
  );
}

function WeightStep({
  t,
  unit,
  setUnit,
  weight,
  setWeight,
  err,
  busy,
  onContinue,
}: {
  t: (k: MessageKey) => string;
  unit: "metric" | "imperial";
  setUnit: (u: "metric" | "imperial") => void;
  weight: string;
  setWeight: (v: string) => void;
  err: string | null;
  busy: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 pt-4">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent">
            <Scale className="size-6" />
          </span>
          <h1 className="font-display mt-4 text-2xl tracking-wide">
            {t("onboard.weightTitle")}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-2">
            {t("onboard.weightWhy")}
          </p>
        </div>
        <div className="flex gap-2">
          {(
            [
              ["metric", "kg"],
              ["imperial", "lb"],
            ] as const
          ).map(([id, lab]) => (
            <button
              key={id}
              type="button"
              onClick={() => setUnit(id)}
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center rounded-full border text-sm font-semibold",
                unit === id
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-rule bg-raised text-text-2",
              )}
            >
              {lab}
            </button>
          ))}
        </div>
        <div>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "75" : "165"}
            autoFocus
            className={cn(
              "num h-14 w-full rounded-2xl border bg-sunken px-4 text-center text-3xl outline-none",
              err ? "border-danger" : "border-rule focus:border-accent/50",
            )}
          />
          {err ? (
            <p className="mt-2 text-center text-xs text-danger">{err}</p>
          ) : null}
        </div>
      </div>
      <PrimaryBtn disabled={busy || !weight.trim()} onClick={onContinue}>
        {busy ? <Spinner className="size-4" /> : null}
        {t("onboard.continue")}
      </PrimaryBtn>
    </div>
  );
}

function AppearanceStep({
  t,
  locale,
  tz,
  theme,
  accent,
  setTheme,
  setAccent,
  onOpenLang,
  busy,
  onContinue,
}: {
  t: (k: MessageKey) => string;
  locale: string;
  tz: string;
  theme: ThemeId;
  accent: AccentId;
  setTheme: (t: ThemeId) => void;
  setAccent: (a: AccentId) => void;
  onOpenLang: () => void;
  busy: boolean;
  onContinue: () => void;
}) {
  const list = accentsFor(theme);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pt-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">
            {t("onboard.lookTitle")}
          </h1>
          <p className="mt-1.5 text-sm text-text-2">{t("onboard.lookHint")}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["obsidian", t("settings.themeObsidian")],
              ["carbon", t("settings.themeCarbon")],
            ] as const
          ).map(([id, lab]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                "overflow-hidden rounded-2xl border text-left transition",
                theme === id
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-rule",
              )}
            >
              <div
                className={cn(
                  "h-16 w-full",
                  id === "obsidian" ? "bg-[#12100e]" : "bg-[#0a0a0b]",
                )}
              >
                <div className="flex h-full items-end gap-1 p-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      background:
                        id === "obsidian" ? "#B9A177" : "#D6FF3F",
                    }}
                  />
                  <span className="h-3 flex-1 rounded-sm bg-white/10" />
                </div>
              </div>
              <p className="px-3 py-2.5 text-sm font-semibold">{lab}</p>
            </button>
          ))}
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            {t("settings.accent")}
          </p>
          <div className="flex flex-wrap gap-2">
            {list.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccent(a.id)}
                className={cn(
                  "grid size-11 place-items-center rounded-full border-2 transition",
                  accent === a.id ? "border-text" : "border-transparent",
                )}
                aria-label={a.id}
              >
                <span
                  className="size-8 rounded-full"
                  style={{ background: a.hex }}
                />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenLang}
          className="flex min-h-11 items-center justify-between rounded-2xl border border-rule bg-sunken px-3 text-left text-sm"
        >
          <span className="text-text-2">
            {locale} · {tz}
          </span>
          <span className="font-semibold text-accent">{t("onboard.change")}</span>
        </button>
      </div>
      <PrimaryBtn disabled={busy} onClick={onContinue}>
        {busy ? <Spinner className="size-4" /> : null}
        {t("onboard.continue")}
      </PrimaryBtn>
    </div>
  );
}

function ProgramStep({
  t,
  daysPerWeek,
  setDaysPerWeek,
  programs,
  loading,
  cloning,
  onOpen,
  onSkipProgram,
  onBrowseAll,
}: {
  t: (k: MessageKey, vars?: Record<string, string | number>) => string;
  daysPerWeek: number;
  setDaysPerWeek: (n: number) => void;
  programs: import("@/lib/server/share").PublicProgramCard[];
  loading: boolean;
  cloning: boolean;
  onOpen: (id: number) => void;
  onSkipProgram: () => void;
  onBrowseAll: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pt-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">
            {t("onboard.programTitle")}
          </h1>
          <p className="mt-1.5 text-sm text-text-2">{t("onboard.programHint")}</p>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            {t("onboard.daysPerWeek")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDaysPerWeek(n)}
                className={cn(
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold",
                  daysPerWeek === n
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-rule bg-raised text-text-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-rule rounded-2xl border border-rule bg-sunken/40">
          {loading ? (
            <div className="grid place-items-center py-10">
              <Spinner className="size-5 text-accent" />
            </div>
          ) : (
            programs.map((p, i) => (
              <ProgramRow
                key={p.id}
                rank={i + 1}
                p={p}
                onOpen={() => onOpen(p.id)}
              />
            ))
          )}
        </div>
        <button
          type="button"
          className="py-2 text-center text-sm font-semibold text-accent"
          onClick={onBrowseAll}
        >
          {t("onboard.seeAll")}
        </button>
      </div>
      <button
        type="button"
        disabled={cloning}
        onClick={onSkipProgram}
        className="mt-2 min-h-11 text-sm font-semibold text-text-3"
      >
        {t("onboard.continueWithout")}
      </button>
    </div>
  );
}

function ReadyStep({
  t,
  hasProgram,
  busy,
  onGo,
}: {
  t: (k: MessageKey) => string;
  hasProgram: boolean;
  busy: boolean;
  onGo: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-accent/15 text-accent">
          <Sparkles className="size-8" />
        </span>
        <h1 className="font-display text-3xl tracking-wide">
          {t("onboard.readyTitle")}
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-text-2">
          {hasProgram ? t("onboard.readyWithProgram") : t("onboard.readyNoProgram")}
        </p>
      </div>
      <PrimaryBtn disabled={busy} onClick={onGo}>
        {busy ? <Spinner className="size-4" /> : null}
        {hasProgram ? t("onboard.goWorkout") : t("onboard.goDiscover")}
      </PrimaryBtn>
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-on-primary shadow-[var(--shadow-primary)] active:scale-[0.99] disabled:opacity-45"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {children}
    </button>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BodyChart,
  ViewSide,
  type BodyState,
  type MuscleId,
} from "body-muscles";
import { cn } from "@/lib/utils";

/** High-level regions we resolve from exercise metadata */
export type BodyRegion =
  | "chest"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "back"
  | "lats"
  | "traps"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

const LABEL_TR: Record<BodyRegion, string> = {
  chest: "Göğüs",
  shoulders: "Omuz",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Ön kol",
  abs: "Karın",
  obliques: "Yan karın",
  back: "Sırt",
  lats: "Lat",
  traps: "Trapez",
  glutes: "Kalça",
  quads: "Ön bacak",
  hamstrings: "Arka bacak",
  calves: "Baldır",
};

/** Salon dark-theme colors (override library slate palette) */
const C = {
  base: "#1e1e28", // silhouette base (non-interactive underlay)
  idle: "#343444", // inactive muscle
  secondary: "#e8a838", // yardımcı — amber
  primary: "#f04444", // ana — red
  primaryStroke: "#ffd666",
  idleStroke: "#1a1a22",
};

/** Map our regions → body-muscles MuscleIds (bilateral) */
const REGION_TO_MUSCLES: Record<BodyRegion, MuscleId[]> = {
  chest: [
    "chest-upper-left",
    "chest-upper-right",
    "chest-lower-left",
    "chest-lower-right",
  ],
  shoulders: [
    "shoulder-front-left",
    "shoulder-front-right",
    "shoulder-side-left",
    "shoulder-side-right",
    "deltoid-rear-left",
    "deltoid-rear-right",
  ],
  biceps: ["biceps-left", "biceps-right"],
  triceps: [
    "triceps-long-left",
    "triceps-lateral-left",
    "triceps-long-right",
    "triceps-lateral-right",
  ],
  forearms: [
    "forearm-left",
    "forearm-right",
    "forearm-flexors-left",
    "forearm-extensors-left",
    "forearm-flexors-right",
    "forearm-extensors-right",
  ],
  abs: [
    "abs-upper-left",
    "abs-upper-right",
    "abs-lower-left",
    "abs-lower-right",
  ],
  obliques: ["obliques-left", "obliques-right"],
  back: [
    "lats-upper-left",
    "lats-mid-left",
    "lats-lower-left",
    "lats-upper-right",
    "lats-mid-right",
    "lats-lower-right",
    "lower-back-erectors-left",
    "lower-back-erectors-right",
    "lower-back-ql-left",
    "lower-back-ql-right",
    "spine",
  ],
  lats: [
    "lats-upper-left",
    "lats-mid-left",
    "lats-lower-left",
    "lats-upper-right",
    "lats-mid-right",
    "lats-lower-right",
  ],
  traps: [
    "traps-upper-left",
    "traps-mid-left",
    "traps-lower-left",
    "traps-upper-right",
    "traps-mid-right",
    "traps-lower-right",
  ],
  glutes: [
    "gluteus-maximus-left",
    "gluteus-maximus-right",
    "gluteus-medius-left",
    "gluteus-medius-right",
  ],
  quads: ["quads-left", "quads-right"],
  hamstrings: [
    "hamstrings-medial-left",
    "hamstrings-lateral-left",
    "hamstrings-medial-right",
    "hamstrings-lateral-right",
  ],
  calves: [
    "calves-gastroc-medial-left",
    "calves-gastroc-lateral-left",
    "calves-soleus-left",
    "calves-gastroc-medial-right",
    "calves-gastroc-lateral-right",
    "calves-soleus-right",
  ],
};

const REAR_DELT: MuscleId[] = ["deltoid-rear-left", "deltoid-rear-right"];
const SIDE_DELT: MuscleId[] = ["shoulder-side-left", "shoulder-side-right"];
const FRONT_DELT: MuscleId[] = ["shoulder-front-left", "shoulder-front-right"];
const UPPER_CHEST: MuscleId[] = ["chest-upper-left", "chest-upper-right"];
const LOWER_CHEST: MuscleId[] = ["chest-lower-left", "chest-lower-right"];

type MusclePlan = {
  primary: BodyRegion[];
  secondary: BodyRegion[];
  primaryIds?: MuscleId[];
  secondaryIds?: MuscleId[];
};

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Name-first mapping — specific before general.
 */
export function planMuscles(
  exerciseName: string,
  muscleGroup?: string | null,
  previewPrimary: string[] = [],
  previewSecondary: string[] = [],
): MusclePlan {
  const n = exerciseName
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");

  if (/face\s*pull|rear\s*delt|arka\s*omuz|reverse\s*fly|rear\s*delt\s*fly/.test(n)) {
    return {
      primary: ["shoulders"],
      secondary: ["traps", "back"],
      primaryIds: REAR_DELT,
      secondaryIds: [
        ...REGION_TO_MUSCLES.traps.slice(0, 4),
        "lats-upper-left",
        "lats-upper-right",
      ],
    };
  }
  if (/lateral\s*raise|side\s*raise|yan\s*acis|yan\s*omuz/.test(n)) {
    return { primary: ["shoulders"], secondary: [], primaryIds: SIDE_DELT };
  }
  if (/front\s*raise/.test(n)) {
    return { primary: ["shoulders"], secondary: [], primaryIds: FRONT_DELT };
  }
  if (/incline.*(?:bench|press|fly)|(?:bench|press|fly).*incline|ust\s*gogus/.test(n)) {
    return {
      primary: ["chest"],
      secondary: ["shoulders", "triceps"],
      primaryIds: UPPER_CHEST,
      secondaryIds: [...FRONT_DELT, ...REGION_TO_MUSCLES.triceps],
    };
  }
  if (/decline.*(?:bench|press)|(?:bench|press).*decline/.test(n)) {
    return {
      primary: ["chest"],
      secondary: ["shoulders", "triceps"],
      primaryIds: LOWER_CHEST,
      secondaryIds: [...FRONT_DELT, ...REGION_TO_MUSCLES.triceps],
    };
  }
  if (
    /bench\s*press|chest\s*press|gogus\s*pres|dumbbell\s*press(?!.*shoulder)|barbell\s*bench|push.?up|sinav|fly|pec\s*deck|cable\s*fly/.test(
      n,
    ) &&
    !/shoulder|overhead|ohp|military|arnold/.test(n)
  ) {
    return {
      primary: ["chest"],
      secondary: ["shoulders", "triceps"],
      primaryIds: [...UPPER_CHEST, ...LOWER_CHEST],
      secondaryIds: [...FRONT_DELT, ...REGION_TO_MUSCLES.triceps],
    };
  }
  if (
    /shoulder\s*press|overhead\s*press|military\s*press|ohp|arnold\s*press|omuz\s*pres|dikey\s*pres/.test(
      n,
    )
  ) {
    return {
      primary: ["shoulders"],
      secondary: ["triceps", "traps"],
      primaryIds: [...FRONT_DELT, ...SIDE_DELT],
      secondaryIds: [...REGION_TO_MUSCLES.triceps, ...REGION_TO_MUSCLES.traps],
    };
  }
  if (/shrug|trapez|trap\s*bar\s*shrug/.test(n) && !/deadlift/.test(n)) {
    return { primary: ["traps"], secondary: ["forearms"] };
  }
  if (
    /lat\s*pulldown|pull[\s-]?up|chin[\s-]?up|pulldown|barfiks|straight[\s-]?arm\s*pull/.test(
      n,
    )
  ) {
    return {
      primary: ["lats", "back"],
      secondary: ["biceps", "shoulders"],
      primaryIds: REGION_TO_MUSCLES.lats,
      secondaryIds: [...REGION_TO_MUSCLES.biceps, ...REAR_DELT],
    };
  }
  if (/row|cekis|cikis|cift\s*kol|t[\s-]?bar|pendlay/.test(n)) {
    return {
      primary: ["back", "lats"],
      secondary: ["biceps", "shoulders", "traps"],
      secondaryIds: [
        ...REGION_TO_MUSCLES.biceps,
        ...REAR_DELT,
        ...REGION_TO_MUSCLES.traps,
      ],
    };
  }
  if (/romanian|rdl|stiff[\s-]?leg|good\s*morning/.test(n)) {
    return {
      primary: ["hamstrings", "glutes"],
      secondary: ["back"],
      secondaryIds: [
        "lower-back-erectors-left",
        "lower-back-erectors-right",
        "spine",
      ],
    };
  }
  if (/deadlift|olu\s*kaldir|sumo\s*dead/.test(n)) {
    return {
      primary: ["hamstrings", "glutes", "back"],
      secondary: ["traps", "forearms", "quads"],
    };
  }
  if (/hip\s*thrust|glute\s*bridge|kalca/.test(n)) {
    return { primary: ["glutes"], secondary: ["hamstrings"] };
  }
  if (/leg\s*curl|hamstring\s*curl|bacak\s*buku/.test(n)) {
    return { primary: ["hamstrings"], secondary: [] };
  }
  if (/leg\s*extension|quad\s*extension|bacak\s*acma|bacak\s*ekstans/.test(n)) {
    return { primary: ["quads"], secondary: [] };
  }
  if (/calf|baldır|baldir|soleus|gastroc/.test(n)) {
    return { primary: ["calves"], secondary: [] };
  }
  if (
    /squat|leg\s*press|lunge|split\s*squat|hack\s*squat|goblet|bulgarian/.test(n)
  ) {
    return {
      primary: ["quads", "glutes"],
      secondary: ["hamstrings", "calves"],
    };
  }
  if (
    /triceps|triseps|pushdown|skull\s*crusher|overhead\s*extension|dip(?!.*belt)/.test(
      n,
    ) &&
    !/bench|chest/.test(n)
  ) {
    if (/chest\s*dip|gogus.*dip/.test(n)) {
      return { primary: ["chest", "triceps"], secondary: ["shoulders"] };
    }
    return { primary: ["triceps"], secondary: [] };
  }
  if (/dip/.test(n)) {
    return { primary: ["chest", "triceps"], secondary: ["shoulders"] };
  }
  if (
    /curl|biceps|biseps|hammer\s*curl|preacher|koncentras/.test(n) &&
    !/leg\s*curl|hamstring/.test(n)
  ) {
    return { primary: ["biceps"], secondary: ["forearms"] };
  }
  if (/farmer|carry|suitcase|yuru|walk/.test(n)) {
    return {
      primary: ["forearms", "traps"],
      secondary: ["abs", "shoulders"],
    };
  }
  if (/pallof|side\s*bend|oblique|yan\s*karın|yan\s*karin|woodchop/.test(n)) {
    return { primary: ["obliques", "abs"], secondary: [] };
  }
  if (
    /plank|mekik|crunch|sit[\s-]?up|leg\s*raise|knee\s*raise|abs|karın|karin|makas|flutter|heel\s*touch|topuk/.test(
      n,
    )
  ) {
    return { primary: ["abs"], secondary: ["obliques"] };
  }
  if (/kablo\s*crunch|cable\s*crunch/.test(n)) {
    return { primary: ["abs"], secondary: [] };
  }

  const fromLabels = (labels: string[], into: BodyRegion[]) => {
    for (const raw of labels) {
      const k = raw.toLocaleLowerCase("tr-TR");
      if (/tüm|tum|full|vücut|vucut/.test(k)) continue;
      if (/göğüs|gogus|chest|pec/.test(k)) into.push("chest");
      else if (/arka omuz|rear/.test(k)) into.push("shoulders");
      else if (/yan omuz|omuz|shoulder|delt/.test(k)) into.push("shoulders");
      else if (/triceps|triseps/.test(k)) into.push("triceps");
      else if (/biceps|biseps/.test(k)) into.push("biceps");
      else if (/ön kol|forearm/.test(k)) into.push("forearms");
      else if (/trapez|trap/.test(k)) into.push("traps");
      else if (/lat/.test(k)) into.push("lats");
      else if (/sırt|sirt|back/.test(k)) into.push("back");
      else if (/karın|karin|abs|core/.test(k)) into.push("abs");
      else if (/oblique|yan karın/.test(k)) into.push("obliques");
      else if (/kalça|kalca|glute/.test(k)) into.push("glutes");
      else if (/hamstring|arka bacak/.test(k)) into.push("hamstrings");
      else if (/baldır|baldir|calf/.test(k)) into.push("calves");
      else if (/quad|ön bacak|bacak/.test(k)) into.push("quads");
    }
  };

  const pri: BodyRegion[] = [];
  const sec: BodyRegion[] = [];
  fromLabels(previewPrimary, pri);
  fromLabels(previewSecondary, sec);

  if (pri.length === 0 && muscleGroup) {
    const g: Record<string, BodyRegion[]> = {
      gogus: ["chest"],
      sirt: ["back", "lats"],
      omuz: ["shoulders"],
      kol: [],
      bacak: ["quads"],
      trapez: ["traps"],
      core: ["abs"],
      diger: [],
    };
    (g[muscleGroup] ?? []).forEach((r) => pri.push(r));
  }

  if (pri.length && sec.length === 0) {
    if (pri.includes("chest")) sec.push("shoulders", "triceps");
    if (pri.includes("lats") || pri.includes("back")) sec.push("biceps");
    if (pri.includes("shoulders") && !pri.includes("chest")) sec.push("triceps");
    if (pri.includes("quads")) sec.push("glutes");
  }

  const priU = uniq(pri);
  const secU = uniq(sec).filter((r) => !priU.includes(r));
  return { primary: priU, secondary: secU };
}

export function resolveRegions(
  primary: string[] = [],
  secondary: string[] = [],
  muscleGroup?: string | null,
  exerciseName?: string,
): { primary: BodyRegion[]; secondary: BodyRegion[] } {
  const plan = planMuscles(exerciseName ?? "", muscleGroup, primary, secondary);
  return { primary: plan.primary, secondary: plan.secondary };
}

function buildBodyState(plan: MusclePlan): BodyState {
  const state: BodyState = {};
  const paint = (ids: MuscleId[], intensity: number, selected: boolean) => {
    for (const id of ids) {
      const prev = state[id];
      if (!prev || prev.intensity < intensity) {
        state[id] = { intensity, selected };
      }
    }
  };
  const expand = (regions: BodyRegion[], override?: MuscleId[]) => {
    if (override && override.length) return override;
    return regions.flatMap((r) => REGION_TO_MUSCLES[r] ?? []);
  };
  paint(expand(plan.secondary, plan.secondaryIds), 4, false);
  paint(expand(plan.primary, plan.primaryIds), 9, true);
  return state;
}

/** Recolor library SVG for dark UI — only active muscles pop */
function paintSalonTheme(root: HTMLElement, bodyState: BodyState) {
  const svg = root.querySelector("svg");
  if (!svg) return;

  // Underlay (non-interactive) silhouette
  svg.querySelectorAll("path:not(.body-chart-muscle)").forEach((el) => {
    el.setAttribute("fill", C.base);
    el.setAttribute("stroke", "none");
    (el as SVGElement).style.fillOpacity = "1";
  });

  // Interactive muscles — match by aria-label title text is weak;
  // use current library fill intensity: re-apply from bodyState via title node
  svg.querySelectorAll("path.body-chart-muscle").forEach((el) => {
    const title = el.querySelector("title")?.textContent?.trim() ?? "";
    // Map display name → id via bodyState keys is hard; use data from refresh
    // Library stores intensity in aria-label: "... - intensity 9"
    const aria = el.getAttribute("aria-label") || "";
    const intenMatch = aria.match(/intensity\s+(\d+)/i);
    const intensity = intenMatch ? Number(intenMatch[1]) : 0;
    const selected = /\(selected\)/i.test(aria);

    if (intensity >= 7 || selected) {
      el.setAttribute("fill", C.primary);
      el.setAttribute("stroke", C.primaryStroke);
      el.setAttribute("stroke-width", "0.35");
      (el as SVGElement).style.fillOpacity = "1";
      (el as SVGElement).style.filter = "none";
    } else if (intensity >= 1) {
      el.setAttribute("fill", C.secondary);
      el.setAttribute("stroke", C.idleStroke);
      el.setAttribute("stroke-width", "0.15");
      (el as SVGElement).style.fillOpacity = "0.95";
      (el as SVGElement).style.filter = "none";
    } else {
      el.setAttribute("fill", C.idle);
      el.setAttribute("stroke", C.idleStroke);
      el.setAttribute("stroke-width", "0.08");
      (el as SVGElement).style.fillOpacity = "1";
      (el as SVGElement).style.filter = "none";
    }
    // silence unused
    void title;
    void bodyState;
  });
}

function ChartPane({
  view,
  bodyState,
  stateKey,
  label,
}: {
  view: ViewSide;
  bodyState: BodyState;
  stateKey: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const chart = new BodyChart(ref.current, {
      view,
      bodyState,
      showViewLabel: false,
      enableTransitions: false,
      ariaLabel: label,
      className: "body-muscles-chart",
    });
    // Library paints light slate — recolor for dark app
    paintSalonTheme(ref.current, bodyState);

    // Hover reverts library colors — re-apply theme on mouse leave
    const root = ref.current;
    const retheme = () => paintSalonTheme(root, bodyState);
    root.addEventListener("mouseleave", retheme);
    root.addEventListener("click", () => requestAnimationFrame(retheme));

    return () => {
      root.removeEventListener("mouseleave", retheme);
      chart.destroy();
    };
  }, [view, stateKey, label, bodyState]);

  return (
    <div className="muscle-pane rounded-xl border border-rule bg-[#121218] p-1.5">
      <p className="mb-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-text-3">
        {label}
      </p>
      <div
        ref={ref}
        className="muscle-chart-host mx-auto h-[260px] w-full max-w-[160px] sm:h-[300px] sm:max-w-[180px]"
      />
    </div>
  );
}

export function BodyMuscleMap({
  primary = [],
  secondary = [],
  exerciseName = "",
  muscleGroup = null,
  className,
}: {
  primary?: string[];
  secondary?: string[];
  exerciseName?: string;
  muscleGroup?: string | null;
  className?: string;
}) {
  const plan = useMemo(() => {
    if (exerciseName) {
      return planMuscles(exerciseName, muscleGroup, primary, secondary);
    }
    const asRegions = (xs: string[]): BodyRegion[] =>
      xs.filter((x): x is BodyRegion => x in LABEL_TR);
    return {
      primary: asRegions(primary),
      secondary: asRegions(secondary),
    };
  }, [exerciseName, muscleGroup, primary, secondary]);

  const [tab, setTab] = useState<"both" | "front" | "back">("both");
  const bodyState = useMemo(() => buildBodyState(plan), [plan]);
  const stateKey = useMemo(
    () =>
      Object.entries(bodyState)
        .map(([k, v]) => `${k}:${v?.intensity}`)
        .sort()
        .join("|"),
    [bodyState],
  );

  const labels = [
    ...plan.primary.map((r) => ({ r, level: "primary" as const })),
    ...plan.secondary.map((r) => ({ r, level: "secondary" as const })),
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex justify-center gap-1.5">
        {(
          [
            { id: "both", label: "Ön+Arka" },
            { id: "front", label: "Ön" },
            { id: "back", label: "Arka" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-9 rounded-full border px-3 text-[11px] font-semibold",
              tab === t.id
                ? "border-accent bg-accent/15 text-accent"
                : "border-rule text-text-2",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {plan.primary.length === 0 ? (
        <p className="rounded-lg border border-rule bg-raised/40 px-3 py-4 text-center text-xs text-text-2">
          Bu hareket için net kas eşlemesi yok.
        </p>
      ) : (
        <div
          className={cn(
            "grid gap-2",
            tab === "both" ? "grid-cols-2" : "grid-cols-1 place-items-center",
          )}
        >
          {(tab === "both" || tab === "front") && (
            <ChartPane
              view={ViewSide.FRONT}
              bodyState={bodyState}
              stateKey={stateKey}
              label="Ön"
            />
          )}
          {(tab === "both" || tab === "back") && (
            <ChartPane
              view={ViewSide.BACK}
              bodyState={bodyState}
              stateKey={stateKey}
              label="Arka"
            />
          )}
        </div>
      )}

      {labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {labels.map(({ r, level }) => (
            <span
              key={`${level}-${r}`}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                level === "primary"
                  ? "border-danger/50 bg-danger/15 text-danger"
                  : "border-accent/40 bg-accent/10 text-accent",
              )}
            >
              {level === "primary" ? "● " : "○ "}
              {LABEL_TR[r]}
              {level === "primary" ? " (ana)" : " (yardımcı)"}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-text-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#f04444]" /> Ana
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#e8a838]" /> Yardımcı
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#343444]" /> Pasif
        </span>
      </div>
      <p className="mt-1 text-center text-[9px] text-text-3">
        Harita:{" "}
        <a
          href="https://github.com/vulovix/body-muscles"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-line hover:text-text-2"
        >
          body-muscles
        </a>
      </p>
    </div>
  );
}

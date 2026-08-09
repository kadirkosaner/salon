import { withTransaction, type Sql } from "@/lib/db";
import {
  DEFAULT_PROGRAM,
  DEFAULT_PROGRAM_DESCRIPTION,
  DEFAULT_PROGRAM_NAME,
  type LoadTag,
  type ProgramDaySeed,
  type ProgramExerciseSeed,
} from "@/data/library";
import { ensureExerciseLibrary } from "./seed";
import { CATALOG_I18N } from "./catalog-i18n";

type CatalogProgram = {
  key: string;
  /** English name stored on programs (fallback locale). */
  name: string;
  description: string;
  name_tr: string;
  description_tr: string;
  tags: string;
  share_code: string;
  days: ProgramDaySeed[];
};

function ex(
  exercise: string,
  sets: number,
  rep_lo: number,
  rep_hi: number,
  rest_sec: number,
  load_tag: LoadTag,
  detail?: string,
): ProgramExerciseSeed {
  return { exercise, sets, rep_lo, rep_hi, rest_sec, load_tag, detail };
}

const CATALOG: CatalogProgram[] = [
  {
    key: "fullsplit6",
    name: "Full Split (6 days)",
    description:
      "Six-day push / pull / legs double split for advanced lifters. High volume with structured rest.",
    name_tr: DEFAULT_PROGRAM_NAME,
    description_tr: DEFAULT_PROGRAM_DESCRIPTION,
    tags: "katalog,fullsplit,6gun,ileri,guc,hipertrofi,barbell,dumbbell",
    share_code: "FULL6X",
    days: DEFAULT_PROGRAM,
  },
  {
    key: "full3",
    name: "Full Body (3 days)",
    description:
      "Beginner-friendly full body on Mon / Wed / Fri. Balanced push, pull and legs each session.",
    name_tr: "Full Body (3 gün)",
    description_tr:
      "Başlangıç ve yoğun tempo için. Pazartesi / Çarşamba / Cuma full body.",
    tags: "katalog,baslangic,fullbody,3gun,hipertrofi,kilo,dumbbell",
    share_code: "FULL3X",
    days: [
      {
        dow: 1,
        name: "FULL A",
        focus: "Push + legs + core",
        exercises: [
          ex("Squat", 3, 8, 10, 150, "agir"),
          ex("Dumbbell Bench Press", 3, 8, 10, 120, "orta_agir"),
          ex("Lat Pulldown", 3, 8, 12, 90, "orta"),
          ex("Seated Dumbbell Shoulder Press", 2, 10, 12, 90, "orta"),
          ex("Plank", 3, 20, 40, 60, "hafif"),
        ],
      },
      {
        dow: 3,
        name: "FULL B",
        focus: "Pull + hinge + arms",
        exercises: [
          ex("Romanian Deadlift", 3, 8, 10, 150, "agir"),
          ex("Chest-Supported Row", 3, 8, 10, 120, "orta_agir"),
          ex("Incline Dumbbell Press", 3, 8, 12, 90, "orta"),
          ex("Biceps Curl", 2, 10, 12, 60, "orta"),
          ex("Triceps Pushdown", 2, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "FULL C",
        focus: "Legs + shoulders + core",
        exercises: [
          ex("Leg Press", 3, 10, 12, 120, "orta_agir"),
          ex("Dumbbell Row", 3, 8, 12, 90, "orta"),
          ex("Lateral Raise", 3, 12, 15, 60, "hafif"),
          ex("Standing Calf Raise", 3, 12, 15, 60, "orta"),
          ex("Mekik", 3, 12, 15, 45, "hafif"),
        ],
      },
    ],
  },
  {
    key: "ul4",
    name: "Upper / Lower (4 days)",
    description:
      "Balanced four-day upper–lower split. Mon–Thu training, weekend free.",
    name_tr: "Upper / Lower (4 gün)",
    description_tr:
      "Dengeli 4 günlük üst-alt split. Pazartesi–Perşembe aktif, hafta sonu serbest.",
    tags: "katalog,upperlower,orta,4gun,guc,hipertrofi,barbell,dumbbell",
    share_code: "UL4DAY",
    days: [
      {
        dow: 1,
        name: "UPPER A",
        focus: "Chest · Back · Shoulders",
        exercises: [
          ex("Barbell Bench Press", 4, 5, 8, 150, "agir"),
          ex("Barbell Row", 4, 6, 8, 120, "agir"),
          ex("Seated Dumbbell Shoulder Press", 3, 8, 10, 90, "orta"),
          ex("Lat Pulldown", 3, 8, 12, 90, "orta"),
          ex("Biceps Curl", 2, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 2,
        name: "LOWER A",
        focus: "Squat pattern",
        exercises: [
          ex("Squat", 4, 5, 8, 180, "agir"),
          ex("Romanian Deadlift", 3, 8, 10, 120, "orta_agir"),
          ex("Leg Press", 3, 10, 12, 90, "orta"),
          ex("Standing Calf Raise", 4, 10, 15, 60, "orta"),
        ],
      },
      {
        dow: 4,
        name: "UPPER B",
        focus: "Volume upper",
        exercises: [
          ex("Incline Dumbbell Press", 4, 8, 12, 120, "orta_agir"),
          ex("Chest-Supported Row", 4, 8, 12, 90, "orta"),
          ex("Lateral Raise", 3, 12, 15, 60, "hafif"),
          ex("Face Pull", 3, 12, 15, 60, "hafif"),
          ex("Triceps Pushdown", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "LOWER B",
        focus: "Hinge + posterior",
        exercises: [
          ex("Deadlift", 3, 3, 5, 180, "agir"),
          ex("Hip Thrust", 3, 8, 12, 90, "orta_agir"),
          ex("Leg Curl", 3, 10, 12, 75, "orta"),
          ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta"),
        ],
      },
    ],
  },
  {
    key: "ppl6",
    name: "Push / Pull / Legs (6 days)",
    description:
      "Classic PPL twice per week. Advanced volume for strength and size.",
    name_tr: "Push / Pull / Legs (6 gün)",
    description_tr:
      "Klasik PPL, haftada iki tur. İleri seviye hacim — güç ve kas için.",
    tags: "katalog,ppl,6gun,ileri,guc,hipertrofi,barbell,dumbbell",
    share_code: "PPL6XX",
    days: [
      {
        dow: 1,
        name: "PUSH A",
        focus: "Horizontal push",
        exercises: [
          ex("Barbell Bench Press", 4, 5, 8, 150, "agir"),
          ex("Incline Dumbbell Press", 3, 8, 10, 120, "orta_agir"),
          ex("Standing Barbell Overhead Press", 3, 6, 8, 120, "orta_agir"),
          ex("Lateral Raise", 3, 12, 15, 60, "hafif"),
          ex("Triceps Pushdown", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 2,
        name: "PULL A",
        focus: "Vertical pull",
        exercises: [
          ex("Deadlift", 3, 3, 5, 180, "agir"),
          ex("Pull-up", 3, 5, 8, 120, "orta_agir"),
          ex("Chest-Supported Row", 3, 8, 10, 90, "orta"),
          ex("Face Pull", 3, 12, 15, 60, "hafif"),
          ex("Biceps Curl", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 3,
        name: "LEGS A",
        focus: "Squat focus",
        exercises: [
          ex("Squat", 4, 5, 8, 180, "agir"),
          ex("Romanian Deadlift", 3, 8, 10, 120, "orta_agir"),
          ex("Leg Press", 3, 10, 12, 90, "orta"),
          ex("Leg Curl", 3, 10, 12, 75, "orta"),
          ex("Standing Calf Raise", 4, 10, 15, 60, "orta"),
        ],
      },
      {
        dow: 4,
        name: "PUSH B",
        focus: "Vertical push",
        exercises: [
          ex("Standing Barbell Overhead Press", 4, 5, 8, 150, "agir"),
          ex("Dumbbell Bench Press", 3, 8, 10, 120, "orta_agir"),
          ex("Arnold Press", 3, 8, 12, 90, "orta"),
          ex("Cable Fly", 3, 12, 15, 60, "orta_hafif"),
          ex("Overhead Triceps Extension", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "PULL B",
        focus: "Horizontal pull",
        exercises: [
          ex("Barbell Row", 4, 6, 8, 120, "agir"),
          ex("Lat Pulldown", 3, 8, 12, 90, "orta"),
          ex("Dumbbell Row", 3, 8, 10, 90, "orta"),
          ex("Rear Delt Fly", 3, 12, 15, 60, "hafif"),
          ex("Hammer Curl", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 6,
        name: "LEGS B",
        focus: "Hinge + unilateral",
        exercises: [
          ex("Romanian Deadlift", 4, 6, 8, 150, "agir"),
          ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta_agir"),
          ex("Hip Thrust", 3, 8, 12, 90, "orta"),
          ex("Leg Extension", 3, 12, 15, 60, "orta"),
          ex("Seated Calf Raise", 4, 12, 15, 60, "orta"),
        ],
      },
    ],
  },
  {
    key: "bw3",
    name: "Bodyweight Starter (3 days)",
    description:
      "Minimal equipment. Three full-body sessions to build habit, core and relative strength.",
    name_tr: "Vücut Ağırlığı Başlangıç (3 gün)",
    description_tr:
      "Minimum ekipman. Alışkanlık, core ve göreli güç için haftada üç seans.",
    tags: "katalog,baslangic,fullbody,3gun,kilo,hipertrofi,vucut",
    share_code: "BW3DAY",
    days: [
      {
        dow: 1,
        name: "BW A",
        focus: "Push + core",
        exercises: [
          ex("Dips", 3, 6, 10, 90, "orta"),
          ex("Plank", 3, 30, 45, 60, "hafif"),
          ex("Mekik", 3, 12, 15, 45, "hafif"),
          ex("Makas", 3, 20, 30, 45, "hafif"),
          ex("Topuklara Dokunma", 3, 15, 20, 45, "hafif"),
        ],
      },
      {
        dow: 3,
        name: "BW B",
        focus: "Pull + legs",
        exercises: [
          ex("Pull-up", 3, 4, 8, 120, "orta_agir"),
          ex("Walking Lunge", 3, 10, 12, 75, "orta"),
          ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta"),
          ex("Hanging Leg Raise", 3, 8, 12, 60, "orta"),
          ex("Plank", 3, 30, 45, 60, "hafif"),
        ],
      },
      {
        dow: 5,
        name: "BW C",
        focus: "Full body circuit",
        exercises: [
          ex("Dips", 3, 6, 10, 75, "orta"),
          ex("Pull-up", 3, 4, 8, 90, "orta"),
          ex("Walking Lunge", 3, 12, 14, 75, "orta"),
          ex("Pallof Press", 3, 10, 12, 60, "orta_hafif"),
          ex("Mekik", 3, 15, 20, 45, "hafif"),
        ],
      },
    ],
  },
  {
    key: "db4hyp",
    name: "Dumbbell Hypertrophy (4 days)",
    description:
      "Four-day dumbbell-only plan for intermediate lifters chasing muscle growth.",
    name_tr: "Dambıl Hipertrofi (4 gün)",
    description_tr:
      "Sadece dambıl. Orta seviye, kas odaklı dört günlük plan.",
    tags: "katalog,orta,4gun,hipertrofi,dumbbell",
    share_code: "DB4HYP",
    days: [
      {
        dow: 1,
        name: "CHEST · TRICEPS",
        focus: "Push volume",
        exercises: [
          ex("Dumbbell Bench Press", 4, 8, 10, 120, "orta_agir"),
          ex("Incline Dumbbell Press", 3, 8, 12, 90, "orta"),
          ex("Incline Dumbbell Fly", 3, 12, 15, 60, "orta_hafif"),
          ex("Overhead Triceps Extension", 3, 10, 12, 60, "orta"),
          ex("Triceps Pushdown", 2, 12, 15, 60, "orta_hafif"),
        ],
      },
      {
        dow: 2,
        name: "BACK · BICEPS",
        focus: "Pull volume",
        exercises: [
          ex("Dumbbell Row", 4, 8, 10, 90, "orta_agir"),
          ex("Chest-Supported Row", 3, 8, 12, 90, "orta"),
          ex("Straight-Arm Pulldown", 3, 12, 15, 60, "orta"),
          ex("Biceps Curl", 3, 10, 12, 60, "orta"),
          ex("Hammer Curl", 2, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 4,
        name: "LEGS",
        focus: "Lower volume",
        exercises: [
          ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta_agir"),
          ex("Romanian Deadlift", 3, 8, 10, 120, "orta_agir"),
          ex("Walking Lunge", 3, 10, 12, 75, "orta"),
          ex("Hip Thrust", 3, 10, 12, 90, "orta"),
          ex("Standing Calf Raise", 4, 12, 15, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "SHOULDERS · ARMS",
        focus: "Delts + arms",
        exercises: [
          ex("Seated Dumbbell Shoulder Press", 4, 8, 10, 90, "orta_agir"),
          ex("Arnold Press", 3, 8, 12, 75, "orta"),
          ex("Lateral Raise", 3, 12, 15, 60, "hafif"),
          ex("Rear Delt Fly", 3, 12, 15, 60, "hafif"),
          ex("Biceps Curl", 2, 10, 12, 60, "orta"),
        ],
      },
    ],
  },
  {
    key: "str5",
    name: "Strength Builder (5 days)",
    description:
      "Five-day strength block focused on the big barbell lifts. Advanced.",
    name_tr: "Güç Blok (5 gün)",
    description_tr:
      "Beş günlük güç bloğu — ana bar hareketleri. İleri seviye.",
    tags: "katalog,ileri,5gun,guc,barbell",
    share_code: "STR5XX",
    days: [
      {
        dow: 1,
        name: "SQUAT DAY",
        focus: "Squat primary",
        exercises: [
          ex("Squat", 5, 3, 5, 180, "agir"),
          ex("Romanian Deadlift", 3, 6, 8, 150, "orta_agir"),
          ex("Leg Press", 3, 8, 10, 120, "orta"),
          ex("Standing Calf Raise", 4, 8, 12, 75, "orta"),
        ],
      },
      {
        dow: 2,
        name: "BENCH DAY",
        focus: "Bench primary",
        exercises: [
          ex("Barbell Bench Press", 5, 3, 5, 180, "agir"),
          ex("Incline Dumbbell Press", 3, 6, 8, 120, "orta_agir"),
          ex("Seated Dumbbell Shoulder Press", 3, 6, 8, 120, "orta"),
          ex("Triceps Pushdown", 3, 8, 10, 75, "orta"),
        ],
      },
      {
        dow: 3,
        name: "DEADLIFT DAY",
        focus: "Deadlift primary",
        exercises: [
          ex("Deadlift", 5, 2, 4, 200, "agir"),
          ex("Barbell Row", 4, 5, 8, 120, "agir"),
          ex("Lat Pulldown", 3, 6, 8, 90, "orta"),
          ex("Barbell Shrug", 3, 8, 10, 75, "orta"),
        ],
      },
      {
        dow: 5,
        name: "OVERHEAD DAY",
        focus: "Press primary",
        exercises: [
          ex("Standing Barbell Overhead Press", 5, 3, 5, 180, "agir"),
          ex("Dumbbell Bench Press", 3, 6, 8, 120, "orta_agir"),
          ex("Lateral Raise", 3, 10, 12, 60, "orta"),
          ex("Face Pull", 3, 12, 15, 60, "hafif"),
        ],
      },
      {
        dow: 6,
        name: "ACCESSORY",
        focus: "Volume assistance",
        exercises: [
          ex("Squat", 3, 6, 8, 150, "orta_agir"),
          ex("Chest-Supported Row", 3, 8, 10, 90, "orta"),
          ex("Hip Thrust", 3, 8, 10, 90, "orta"),
          ex("Biceps Curl", 3, 8, 10, 60, "orta"),
          ex("Plank", 3, 30, 45, 45, "hafif"),
        ],
      },
    ],
  },
  {
    key: "home2",
    name: "Home Minimal (2 days)",
    description:
      "Two short home sessions with dumbbells and bodyweight. Perfect for busy weeks.",
    name_tr: "Ev Minimal (2 gün)",
    description_tr:
      "İki kısa ev seansı — dambıl + vücut ağırlığı. Yoğun haftalar için.",
    tags: "katalog,baslangic,2gun,kilo,hipertrofi,dumbbell,vucut",
    share_code: "HOME2X",
    days: [
      {
        dow: 2,
        name: "HOME A",
        focus: "Full body A",
        exercises: [
          ex("Squat", 3, 10, 12, 90, "orta"),
          ex("Dumbbell Bench Press", 3, 8, 12, 90, "orta"),
          ex("Dumbbell Row", 3, 8, 12, 75, "orta"),
          ex("Seated Dumbbell Shoulder Press", 2, 10, 12, 75, "orta"),
          ex("Plank", 3, 30, 40, 45, "hafif"),
        ],
      },
      {
        dow: 5,
        name: "HOME B",
        focus: "Full body B",
        exercises: [
          ex("Romanian Deadlift", 3, 8, 10, 90, "orta"),
          ex("Walking Lunge", 3, 10, 12, 75, "orta"),
          ex("Incline Dumbbell Press", 3, 10, 12, 75, "orta"),
          ex("Dumbbell Row", 3, 10, 12, 75, "orta"),
          ex("Mekik", 3, 12, 15, 45, "hafif"),
        ],
      },
    ],
  },
  {
    key: "mach4",
    name: "Machine Circuit (4 days)",
    description:
      "Beginner machine-based split. Safe learning curve for gym newcomers.",
    name_tr: "Makine Devresi (4 gün)",
    description_tr:
      "Başlangıç makine split’i. Salona yeni başlayanlar için güvenli tempo.",
    tags: "katalog,baslangic,4gun,hipertrofi,kilo,makine",
    share_code: "MACH4X",
    days: [
      {
        dow: 1,
        name: "PUSH MACHINES",
        focus: "Chest · shoulders",
        exercises: [
          ex("Dumbbell Bench Press", 3, 10, 12, 90, "orta"),
          ex("Incline Dumbbell Press", 3, 10, 12, 90, "orta"),
          ex("Seated Dumbbell Shoulder Press", 3, 10, 12, 75, "orta"),
          ex("Lateral Raise", 3, 12, 15, 60, "hafif"),
          ex("Triceps Pushdown", 3, 12, 15, 60, "orta"),
        ],
      },
      {
        dow: 2,
        name: "PULL MACHINES",
        focus: "Back · arms",
        exercises: [
          ex("Lat Pulldown", 3, 10, 12, 90, "orta"),
          ex("Machine Row", 3, 10, 12, 90, "orta"),
          ex("Single-Arm Machine Row", 3, 10, 12, 75, "orta"),
          ex("Face Pull", 3, 12, 15, 60, "hafif"),
          ex("Biceps Curl", 3, 12, 15, 60, "orta"),
        ],
      },
      {
        dow: 4,
        name: "LEG MACHINES",
        focus: "Quads · hams",
        exercises: [
          ex("Leg Press", 4, 10, 12, 120, "orta_agir"),
          ex("Squat Machine", 3, 10, 12, 90, "orta"),
          ex("Leg Extension", 3, 12, 15, 60, "orta"),
          ex("Leg Curl", 3, 12, 15, 60, "orta"),
          ex("Seated Calf Raise", 4, 12, 15, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "CORE · CARRY",
        focus: "Core + finishers",
        exercises: [
          ex("Kablo Crunch", 3, 12, 15, 60, "orta"),
          ex("Pallof Press", 3, 10, 12, 60, "orta_hafif"),
          ex("Plank", 3, 30, 45, 45, "hafif"),
          ex("Farmer's Walk", 3, 30, 40, 75, "orta"),
          ex("Mekik", 3, 15, 20, 45, "hafif"),
        ],
      },
    ],
  },
  {
    key: "glute4",
    name: "Glute & Legs (4 days)",
    description:
      "Lower-body emphasis with two glute days and two full lower sessions. Intermediate.",
    name_tr: "Kalça & Bacak (4 gün)",
    description_tr:
      "Alt vücut odaklı — iki kalça günü, iki tam bacak. Orta seviye.",
    tags: "katalog,orta,4gun,hipertrofi,barbell,dumbbell",
    share_code: "GLUTE4",
    days: [
      {
        dow: 1,
        name: "SQUAT + GLUTE",
        focus: "Quads + glutes",
        exercises: [
          ex("Squat", 4, 6, 8, 150, "agir"),
          ex("Hip Thrust", 4, 8, 12, 90, "orta_agir"),
          ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta"),
          ex("Leg Extension", 3, 12, 15, 60, "orta"),
          ex("Standing Calf Raise", 3, 12, 15, 60, "orta"),
        ],
      },
      {
        dow: 2,
        name: "UPPER LIGHT",
        focus: "Maintain upper",
        exercises: [
          ex("Dumbbell Bench Press", 3, 8, 10, 90, "orta"),
          ex("Lat Pulldown", 3, 8, 12, 90, "orta"),
          ex("Seated Dumbbell Shoulder Press", 3, 10, 12, 75, "orta"),
          ex("Face Pull", 3, 12, 15, 60, "hafif"),
        ],
      },
      {
        dow: 4,
        name: "HINGE + GLUTE",
        focus: "Posterior chain",
        exercises: [
          ex("Romanian Deadlift", 4, 6, 8, 150, "agir"),
          ex("Hip Thrust", 4, 8, 10, 90, "orta_agir"),
          ex("Leg Curl", 3, 10, 12, 75, "orta"),
          ex("Walking Lunge", 3, 10, 12, 75, "orta"),
          ex("Seated Calf Raise", 3, 12, 15, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "FULL LOWER",
        focus: "Volume legs",
        exercises: [
          ex("Leg Press", 4, 10, 12, 120, "orta_agir"),
          ex("Squat Machine", 3, 10, 12, 90, "orta"),
          ex("Bulgarian Split Squat", 3, 10, 12, 75, "orta"),
          ex("Leg Curl", 3, 12, 15, 60, "orta"),
          ex("Standing Calf Raise", 4, 12, 15, 60, "orta"),
        ],
      },
    ],
  },
  {
    key: "ppl3",
    name: "PPL Starter (3 days)",
    description:
      "One push, one pull, one legs day. Intermediate bridge from full body.",
    name_tr: "PPL Başlangıç (3 gün)",
    description_tr:
      "Bir push, bir pull, bir bacak. Full body’den geçiş için orta seviye.",
    tags: "katalog,orta,3gun,guc,hipertrofi,barbell,dumbbell",
    share_code: "PPL3XX",
    days: [
      {
        dow: 1,
        name: "PUSH",
        focus: "Chest · shoulders · triceps",
        exercises: [
          ex("Barbell Bench Press", 4, 6, 8, 150, "agir"),
          ex("Seated Dumbbell Shoulder Press", 3, 8, 10, 90, "orta"),
          ex("Incline Dumbbell Press", 3, 8, 12, 90, "orta"),
          ex("Lateral Raise", 3, 12, 15, 60, "hafif"),
          ex("Triceps Pushdown", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 3,
        name: "PULL",
        focus: "Back · biceps",
        exercises: [
          ex("Barbell Row", 4, 6, 8, 120, "agir"),
          ex("Lat Pulldown", 3, 8, 12, 90, "orta"),
          ex("Chest-Supported Row", 3, 8, 10, 90, "orta"),
          ex("Face Pull", 3, 12, 15, 60, "hafif"),
          ex("Biceps Curl", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 5,
        name: "LEGS",
        focus: "Squat + hinge",
        exercises: [
          ex("Squat", 4, 6, 8, 150, "agir"),
          ex("Romanian Deadlift", 3, 8, 10, 120, "orta_agir"),
          ex("Leg Press", 3, 10, 12, 90, "orta"),
          ex("Leg Curl", 3, 10, 12, 75, "orta"),
          ex("Standing Calf Raise", 4, 10, 15, 60, "orta"),
        ],
      },
    ],
  },
  {
    key: "cond3",
    name: "Conditioning Full Body (3 days)",
    description:
      "Metabolic full-body days with carries and core. Fat-loss oriented, intermediate.",
    name_tr: "Kondisyon Full Body (3 gün)",
    description_tr:
      "Carry ve core ile metabolik full body. Kilo odaklı, orta seviye.",
    tags: "katalog,orta,3gun,kilo,hipertrofi,dumbbell,vucut",
    share_code: "COND3X",
    days: [
      {
        dow: 1,
        name: "COND A",
        focus: "Push + carry",
        exercises: [
          ex("Dumbbell Bench Press", 3, 10, 12, 75, "orta"),
          ex("Squat", 3, 10, 12, 75, "orta"),
          ex("Seated Dumbbell Shoulder Press", 3, 10, 12, 75, "orta"),
          ex("Farmer's Walk", 4, 30, 40, 60, "orta_agir"),
          ex("Plank", 3, 30, 45, 45, "hafif"),
        ],
      },
      {
        dow: 3,
        name: "COND B",
        focus: "Pull + core",
        exercises: [
          ex("Dumbbell Row", 3, 10, 12, 75, "orta"),
          ex("Romanian Deadlift", 3, 10, 12, 90, "orta"),
          ex("Lat Pulldown", 3, 10, 12, 75, "orta"),
          ex("Suitcase Carry", 3, 30, 40, 60, "orta"),
          ex("Hanging Leg Raise", 3, 8, 12, 45, "orta"),
        ],
      },
      {
        dow: 5,
        name: "COND C",
        focus: "Legs + finisher",
        exercises: [
          ex("Walking Lunge", 3, 12, 14, 75, "orta"),
          ex("Hip Thrust", 3, 10, 12, 75, "orta"),
          ex("Bulgarian Split Squat", 3, 10, 12, 75, "orta"),
          ex("Farmer's Walk", 3, 35, 45, 60, "orta_agir"),
          ex("Mekik", 3, 15, 20, 40, "hafif"),
        ],
      },
    ],
  },
  {
    key: "ath5",
    name: "Athletic Performance (5 days)",
    description:
      "Five-day mix of strength, unilateral work and core for athletic conditioning.",
    name_tr: "Atletik Performans (5 gün)",
    description_tr:
      "Beş günlük güç, tek bacak ve core karışımı — atletik kondisyon.",
    tags: "katalog,ileri,5gun,guc,hipertrofi,barbell,dumbbell,vucut",
    share_code: "ATH5XX",
    days: [
      {
        dow: 1,
        name: "POWER LOWER",
        focus: "Squat + power",
        exercises: [
          ex("Squat", 4, 4, 6, 180, "agir"),
          ex("Romanian Deadlift", 3, 6, 8, 120, "orta_agir"),
          ex("Walking Lunge", 3, 8, 10, 75, "orta"),
          ex("Standing Calf Raise", 3, 10, 12, 60, "orta"),
        ],
      },
      {
        dow: 2,
        name: "POWER UPPER",
        focus: "Press + pull",
        exercises: [
          ex("Barbell Bench Press", 4, 4, 6, 150, "agir"),
          ex("Barbell Row", 4, 5, 8, 120, "agir"),
          ex("Standing Barbell Overhead Press", 3, 5, 8, 120, "orta_agir"),
          ex("Pull-up", 3, 5, 8, 90, "orta"),
        ],
      },
      {
        dow: 3,
        name: "UNILATERAL",
        focus: "Single-leg + core",
        exercises: [
          ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta_agir"),
          ex("Single-Arm Machine Row", 3, 8, 10, 75, "orta"),
          ex("Pallof Press", 3, 10, 12, 60, "orta"),
          ex("Suitcase Carry", 3, 30, 40, 60, "orta"),
          ex("Plank", 3, 40, 50, 45, "hafif"),
        ],
      },
      {
        dow: 5,
        name: "STRENGTH MIX",
        focus: "Heavy accessories",
        exercises: [
          ex("Deadlift", 3, 3, 5, 180, "agir"),
          ex("Incline Dumbbell Press", 3, 6, 8, 120, "orta_agir"),
          ex("Chest-Supported Row", 3, 6, 8, 90, "orta"),
          ex("Hip Thrust", 3, 6, 8, 90, "orta"),
        ],
      },
      {
        dow: 6,
        name: "ENGINE",
        focus: "Conditioning finish",
        exercises: [
          ex("Farmer's Walk", 4, 40, 50, 75, "orta_agir"),
          ex("Walking Lunge", 3, 12, 14, 60, "orta"),
          ex("Dips", 3, 8, 12, 75, "orta"),
          ex("Hanging Leg Raise", 3, 10, 12, 45, "orta"),
          ex("Mekik", 3, 15, 20, 40, "hafif"),
        ],
      },
    ],
  },
];

/** Bump to force catalog rebuild on existing installs. */
const CATALOG_VERSION = "catalog-v3";

async function insertProgramDays(
  sql: Sql,
  programId: number,
  days: ProgramDaySeed[],
  byName: Map<string, number>,
) {
  for (let di = 0; di < days.length; di++) {
    const day = days[di]!;
    const dayRow = await sql<{ id: number }>`
      insert into program_days (program_id, dow, name, focus, sort)
      values (${programId}, ${day.dow}, ${day.name}, ${day.focus}, ${di})
      returning id
    `;
    const dayId = dayRow[0]!.id;
    for (let ei = 0; ei < day.exercises.length; ei++) {
      const pe = day.exercises[ei]!;
      const exerciseId = byName.get(pe.exercise);
      if (!exerciseId) continue;
      await sql`
        insert into program_exercises (
          program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
          rest_sec, load_tag, note, sort
        ) values (
          ${dayId}, ${exerciseId}, ${pe.detail ?? null}, ${pe.sets},
          ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec}, ${pe.load_tag},
          ${pe.note ?? null}, ${ei}
        )
      `;
    }
  }
}

async function upsertTranslations(
  sql: Sql,
  programId: number,
  cat: CatalogProgram,
) {
  try {
    const rows: { locale: string; name: string; description: string }[] = [
      { locale: "en", name: cat.name, description: cat.description },
      { locale: "tr", name: cat.name_tr, description: cat.description_tr },
    ];
    const extra = CATALOG_I18N[cat.key] ?? {};
    for (const [locale, copy] of Object.entries(extra)) {
      if (copy?.name) {
        rows.push({
          locale,
          name: copy.name,
          description: copy.description ?? cat.description,
        });
      }
    }
    for (const row of rows) {
      await sql`
        insert into program_translations (program_id, locale, name, description)
        values (${programId}, ${row.locale}, ${row.name}, ${row.description})
        on conflict (program_id, locale) do update set
          name = excluded.name,
          description = excluded.description
      `;
    }
  } catch {
    /* table may not exist until migration */
  }
}

const catalogGlobal = globalThis as typeof globalThis & {
  __ensureCatalogSeeded__?: Promise<void>;
  __ensureCatalogSeededVersion__?: string;
};

/** Seed / refresh Salon catalog (user_id = system). Rebuilds when CATALOG_VERSION changes. */
export async function ensureCatalogSeeded(_sql: Sql): Promise<void> {
  if (
    catalogGlobal.__ensureCatalogSeeded__ &&
    catalogGlobal.__ensureCatalogSeededVersion__ === CATALOG_VERSION
  ) {
    return catalogGlobal.__ensureCatalogSeeded__;
  }
  catalogGlobal.__ensureCatalogSeededVersion__ = CATALOG_VERSION;
  catalogGlobal.__ensureCatalogSeeded__ = (async () => {
    await withTransaction(async (sql) => {
      await ensureExerciseLibrary(sql);

      const lib2 = await sql<{ id: number; name: string }>`
        select id, name from exercises where owner_id is null
      `;
      const byName = new Map(lib2.map((e) => [e.name, e.id]));

      const keepCodes = CATALOG.map((c) => c.share_code);

      for (const cat of CATALOG) {
        const existing = await sql<{ id: number; tags: string | null }>`
          select id, tags from programs
          where user_id = 'system' and share_code = ${cat.share_code}
        `;

        if (existing.length > 0) {
          const id = existing[0]!.id;
          const tags = existing[0]!.tags ?? "";
          if (!tags.includes(CATALOG_VERSION)) {
            await sql`delete from program_days where program_id = ${id}`;
            await sql`
              update programs set
                name = ${cat.name},
                description = ${cat.description},
                tags = ${`${cat.tags},${CATALOG_VERSION}`},
                is_public = true
              where id = ${id}
            `;
            await insertProgramDays(sql, id, cat.days, byName);
          }
          await upsertTranslations(sql, id, cat);
          continue;
        }

        const prog = await sql<{ id: number }>`
          insert into programs (
            user_id, name, description, tags, is_active, valid_from,
            is_public, share_code, clone_count
          ) values (
            'system', ${cat.name}, ${cat.description},
            ${`${cat.tags},${CATALOG_VERSION}`},
            false, current_date, true, ${cat.share_code}, 0
          )
          returning id
        `;
        await insertProgramDays(sql, prog[0]!.id, cat.days, byName);
        await upsertTranslations(sql, prog[0]!.id, cat);
      }

      // Drop obsolete system catalog entries not in current list
      if (keepCodes.length > 0) {
        await sql`
          delete from programs
          where user_id = 'system'
            and share_code is not null
            and share_code <> all(${keepCodes}::text[])
        `;
      }
    });
  })().catch((err) => {
    catalogGlobal.__ensureCatalogSeeded__ = undefined;
    catalogGlobal.__ensureCatalogSeededVersion__ = undefined;
    throw err;
  });
  return catalogGlobal.__ensureCatalogSeeded__;
}

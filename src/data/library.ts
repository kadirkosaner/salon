/** Public exercise library + default program templates. */

export type MuscleGroup =
  | "gogus"
  | "sirt"
  | "omuz"
  | "kol"
  | "bacak"
  | "trapez"
  | "core"
  | "diger";

export type LoadTag = "agir" | "orta_agir" | "orta" | "orta_hafif" | "hafif";

export type ExerciseSeed = {
  name: string;
  detail?: string;
  unit?: "kg" | "m";
  muscle_group: MuscleGroup;
};

export const EXERCISE_LIBRARY: ExerciseSeed[] = [
  { name: "Dumbbell Bench Press", muscle_group: "gogus" },
  { name: "Incline Dumbbell Press", muscle_group: "gogus" },
  { name: "Seated Dumbbell Shoulder Press", muscle_group: "omuz" },
  { name: "Standing Dumbbell Shoulder Press", muscle_group: "omuz" },
  { name: "Arnold Press", muscle_group: "omuz" },
  { name: "Incline Dumbbell Fly", muscle_group: "gogus" },
  { name: "Cable Fly", muscle_group: "gogus" },
  { name: "Lateral Raise", muscle_group: "omuz" },
  { name: "Rear Delt Fly", muscle_group: "omuz" },
  { name: "Face Pull", muscle_group: "omuz" },
  { name: "Triceps Pushdown", muscle_group: "kol" },
  { name: "Overhead Triceps Extension", muscle_group: "kol" },
  { name: "Dips", muscle_group: "gogus" },
  { name: "Barbell Bench Press", muscle_group: "gogus" },
  { name: "Standing Barbell Overhead Press", muscle_group: "omuz" },
  { name: "Chest-Supported Row", muscle_group: "sirt" },
  { name: "Machine Row", muscle_group: "sirt" },
  { name: "Single-Arm Machine Row", muscle_group: "sirt" },
  { name: "Barbell Row", muscle_group: "sirt" },
  { name: "T-Bar Row", muscle_group: "sirt" },
  { name: "Dumbbell Row", muscle_group: "sirt" },
  { name: "Lat Pulldown", muscle_group: "sirt" },
  { name: "Pull-up", muscle_group: "sirt" },
  { name: "Straight-Arm Pulldown", muscle_group: "sirt" },
  { name: "Dumbbell Shrug", muscle_group: "trapez" },
  { name: "Barbell Shrug", muscle_group: "trapez" },
  { name: "Biceps Curl", muscle_group: "kol" },
  { name: "Hammer Curl", muscle_group: "kol" },
  { name: "Deadlift", muscle_group: "bacak" },
  { name: "Romanian Deadlift", muscle_group: "bacak" },
  { name: "Leg Press", muscle_group: "bacak" },
  { name: "Squat Machine", muscle_group: "bacak" },
  { name: "Squat", muscle_group: "bacak" },
  { name: "Walking Lunge", muscle_group: "bacak" },
  { name: "Bulgarian Split Squat", muscle_group: "bacak" },
  { name: "Hip Thrust", muscle_group: "bacak" },
  { name: "Leg Extension", muscle_group: "bacak" },
  { name: "Leg Curl", muscle_group: "bacak" },
  { name: "Standing Calf Raise", muscle_group: "bacak" },
  { name: "Seated Calf Raise", muscle_group: "bacak" },
  { name: "Leg Press Calf Raise", muscle_group: "bacak" },
  { name: "Farmer's Walk", unit: "m", muscle_group: "core" },
  { name: "Suitcase Carry", unit: "m", muscle_group: "core" },
  { name: "Ağırlıklı Side Bend", muscle_group: "core" },
  { name: "Pallof Press", muscle_group: "core" },
  { name: "Plank", muscle_group: "core" },
  { name: "Mekik", muscle_group: "core" },
  { name: "Topuklara Dokunma", muscle_group: "core" },
  { name: "Makas", muscle_group: "core" },
  { name: "Hanging Leg Raise", muscle_group: "core" },
  { name: "Kablo Crunch", muscle_group: "core" },
];

export type ProgramExerciseSeed = {
  exercise: string;
  detail?: string;
  sets: number;
  rep_lo: number;
  rep_hi: number;
  rest_sec: number;
  load_tag: LoadTag;
  note?: string;
};

export type ProgramDaySeed = {
  dow: number;
  name: string;
  focus: string;
  exercises: ProgramExerciseSeed[];
};

/** Kullanıcının FULL SPLIT 6 günlük programı (Pzt–Cmt, Paz dinlenme). */
export const DEFAULT_PROGRAM: ProgramDaySeed[] = [
  {
    dow: 1,
    name: "PUSH A",
    focus: "Göğüs · Omuz · Triceps",
    exercises: [
      {
        exercise: "Dumbbell Bench Press",
        sets: 4,
        rep_lo: 6,
        rep_hi: 8,
        rest_sec: 150,
        load_tag: "agir",
        note: "Günün ana hareketi. Dambılları kontrolsüz indirme. Spot yoksa son sette kendini zorlama, dambıl düşürmek tehlikeli.",
      },
      {
        exercise: "Incline Dumbbell Press",
        sets: 4,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 120,
        load_tag: "orta_agir",
        note: "Düz benchin %60-70'i kadar olması normal. Üst göğüs zayıf bölge, acele etme.",
      },
      {
        exercise: "Seated Dumbbell Shoulder Press",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 120,
        load_tag: "orta",
        note: "Sırtı sandalyeye yapıştır, bel çukurunu abartma.",
      },
      {
        exercise: "Lateral Raise",
        sets: 3,
        rep_lo: 12,
        rep_hi: 15,
        rest_sec: 75,
        load_tag: "hafif",
        note: "En çok hata yapılan hareket. Ağır alırsan trapezle savurursun. 6-10 kg bile fazla gelebilir.",
      },
      {
        exercise: "Triceps Pushdown",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 75,
        load_tag: "orta",
        note: "Dirsekler gövdeye sabit. Gövdeyle itmeye başlarsan hareket biter.",
      },
      {
        exercise: "Farmer's Walk",
        sets: 3,
        rep_lo: 40,
        rep_hi: 50,
        rest_sec: 90,
        load_tag: "agir",
        note: "Kavraman bırakmadan mesafeyi bitirebileceğin en ağır dambıl. Omuzlar geri, dik yürü.",
      },
    ],
  },
  {
    dow: 2,
    name: "PULL A",
    focus: "Sırt · Trapez · Biceps",
    exercises: [
      {
        exercise: "Chest-Supported Row",
        detail: "dar/nötr tutuş",
        sets: 4,
        rep_lo: 6,
        rep_hi: 8,
        rest_sec: 150,
        load_tag: "agir",
        note: "Sırt öncelik hedefin, günün en ağırı. Tepede kürek kemiklerini sıkıştır, 1 sn bekle.",
      },
      {
        exercise: "Machine Row",
        detail: "geniş tutuş",
        sets: 4,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 120,
        load_tag: "orta_agir",
        note: "Geniş tutuş lat ve arka omuza gider. Birinciden hafif olacak, normal.",
      },
      {
        exercise: "Lat Pulldown",
        detail: "geniş tutuş",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 90,
        load_tag: "orta",
        note: "Geriye yaslanma. Gövde neredeyse dik, barı göğse çek.",
      },
      {
        exercise: "Dumbbell Shrug",
        sets: 4,
        rep_lo: 12,
        rep_hi: 15,
        rest_sec: 90,
        load_tag: "agir",
        note: "Trapez ağırlık kaldırır, çekinme. Omuz döndürme yapma — faydasız ve boyun riskli.",
      },
      {
        exercise: "Face Pull",
        sets: 3,
        rep_lo: 12,
        rep_hi: 15,
        rest_sec: 75,
        load_tag: "hafif",
        note: "Kesinlikle ağır yapılmaz. Duruş hareketi. Ağır alırsan gövdeyle çekersin.",
      },
      {
        exercise: "Biceps Curl",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 75,
        load_tag: "orta",
        note: "Sallanmadan. Beli kırbaçlamak kolu büyütmez.",
      },
    ],
  },
  {
    dow: 3,
    name: "BACAK",
    focus: "Quad · Hamstring · Baldır",
    exercises: [
      {
        exercise: "Leg Press",
        sets: 4,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 150,
        load_tag: "agir",
        note: "Bacak hedefin, sert çalış. Dizleri tam kilitleme. Bel koltuktan kalkıyorsa çok derine iniyorsun.",
      },
      {
        exercise: "Squat Machine",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 120,
        load_tag: "agir",
        note: "Leg presten hafif olacak, normal. Yarım squat yapma, derinlik önemli.",
      },
      {
        exercise: "Walking Lunge",
        detail: "her bacak",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 90,
        load_tag: "orta",
        note: "Dengeyi bozacak kadar ağır alma. Vücut ağırlığıyla başla, sonra dambıl ekle.",
      },
      {
        exercise: "Leg Extension",
        sets: 3,
        rep_lo: 12,
        rep_hi: 15,
        rest_sec: 75,
        load_tag: "orta_hafif",
        note: "Diz eklemine baskı yapar. Ağır + tam kilitleme = diz ağrısı. Kontrollü git.",
      },
      {
        exercise: "Leg Curl",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 75,
        load_tag: "orta",
        note: "Hamstring kramp girmeye yatkın, ısınmadan ağır girme.",
      },
      {
        exercise: "Standing Calf Raise",
        sets: 4,
        rep_lo: 10,
        rep_hi: 15,
        rest_sec: 75,
        load_tag: "agir",
        note: "Baldır dayanıklı kas, ciddi yük ister. Tam alta in, tepede 1 sn bekle. Yaylanma yok.",
      },
      {
        exercise: "Seated Calf Raise",
        sets: 4,
        rep_lo: 15,
        rep_hi: 20,
        rest_sec: 60,
        load_tag: "orta",
        note: "Yüksek tekrar, yanma hissi hedef.",
      },
    ],
  },
  {
    dow: 4,
    name: "PUSH B",
    focus: "Omuz · Göğüs · Kol",
    exercises: [
      {
        exercise: "Standing Barbell Overhead Press",
        sets: 4,
        rep_lo: 6,
        rep_hi: 8,
        rest_sec: 180,
        load_tag: "agir",
        note: "Yeniysen 2 hafta boş bar/hafif çalış. Karnı sık, kaburgaları öne açma, bacaktan itme yapma.",
      },
      {
        exercise: "Dumbbell Bench Press",
        sets: 4,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 120,
        load_tag: "orta_agir",
        note: "Pazartesi'den kasıtlı hafif. Aynı ağırlığı zorlarsan iki gün de bozulur.",
      },
      {
        exercise: "Arnold Press",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 120,
        load_tag: "orta",
        note: "Dönüş hareketi omuza ek yük bindiriyor, normal presten hafif al.",
      },
      {
        exercise: "Incline Dumbbell Fly",
        sets: 3,
        rep_lo: 12,
        rep_hi: 15,
        rest_sec: 90,
        load_tag: "hafif",
        note: "Fly ağır yapılmaz — omuz eklemi gerilme pozisyonunda savunmasız. Germe hissi hedef.",
      },
      {
        exercise: "Overhead Triceps Extension",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 75,
        load_tag: "orta_hafif",
        note: "Dirsek eklemini zorlar. Ağır alırsan dirsek ağrısı başlar.",
      },
      {
        exercise: "Lateral Raise",
        sets: 3,
        rep_lo: 15,
        rep_hi: 15,
        rest_sec: 75,
        load_tag: "hafif",
        note: "Pazartesi'den de hafif olabilir, tekrar yüksek.",
      },
      {
        exercise: "Hammer Curl",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 75,
        load_tag: "orta",
        note: "Normal curlden biraz ağır gidebilirsin, tutuş daha güçlü.",
      },
    ],
  },
  {
    dow: 5,
    name: "PULL B",
    focus: "Arka zincir · Dikey çekiş",
    exercises: [
      {
        exercise: "Deadlift",
        sets: 4,
        rep_lo: 5,
        rep_hi: 6,
        rest_sec: 180,
        load_tag: "agir",
        note: "Programın en riskli hareketi. İlk 2-3 hafta sırf form için hafif çalış. Bel yuvarlandığı an seti bitir. Her tekrarı yerden başlat, sektirme.",
      },
      {
        exercise: "Romanian Deadlift",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 150,
        load_tag: "orta",
        note: "Deadlift sonrası geliyor, ağır gitme. Hamstring gerilmesi hedef. Bacaklar hafif bükülü, bar bacağa yakın.",
      },
      {
        exercise: "Machine Row",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 90,
        load_tag: "orta_agir",
        note: "Bel iki hinge hareketiyle yorgun, destekli makine burada iyi geliyor.",
      },
      {
        exercise: "Lat Pulldown",
        detail: "nötr/dar tutuş",
        sets: 3,
        rep_lo: 8,
        rep_hi: 10,
        rest_sec: 90,
        load_tag: "orta_agir",
        note: "Salı'dakinden farklı tutuş, biraz daha ağır gidebilirsin.",
      },
      {
        exercise: "Barbell Shrug",
        sets: 4,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 90,
        load_tag: "agir",
        note: "Dambıl shrugdan ağır kaldırabilirsin. Kavrama yetmezse kayış kullan.",
      },
      {
        exercise: "Rear Delt Fly",
        sets: 3,
        rep_lo: 12,
        rep_hi: 15,
        rest_sec: 75,
        load_tag: "hafif",
        note: "Küçük kas. Ağır alırsan sırtla çekersin.",
      },
      {
        exercise: "Biceps Curl",
        sets: 3,
        rep_lo: 10,
        rep_hi: 12,
        rest_sec: 75,
        load_tag: "orta",
      },
      {
        exercise: "Suitcase Carry",
        detail: "her taraf",
        sets: 3,
        rep_lo: 30,
        rep_hi: 30,
        rest_sec: 90,
        load_tag: "agir",
        note: "Amaç yana eğilmeye direnmek. Gövde dik kalmalı, eğiliyorsan ağırlık fazla.",
      },
    ],
  },
  {
    dow: 6,
    name: "CORE",
    focus: "Devre · 3-4 tur",
    exercises: [
      {
        exercise: "Mekik",
        sets: 4,
        rep_lo: 60,
        rep_hi: 60,
        rest_sec: 0,
        load_tag: "hafif",
        note: "Devre: 1 dk. Turlar arası 90 sn dinlen. Belde zorlanma varsa bacak kaldırma ile değiştir.",
      },
      {
        exercise: "Topuklara Dokunma",
        sets: 4,
        rep_lo: 60,
        rep_hi: 60,
        rest_sec: 0,
        load_tag: "hafif",
        note: "Devre parçası — 1 dakika. Devre içinde dinlenme yok.",
      },
      {
        exercise: "Makas",
        sets: 4,
        rep_lo: 60,
        rep_hi: 60,
        rest_sec: 0,
        load_tag: "hafif",
        note: "Devre parçası — 1 dakika. Belde zorlanma hissedersen mekiği bacak kaldırmayla değiştir.",
      },
      {
        exercise: "Plank",
        sets: 4,
        rep_lo: 60,
        rep_hi: 60,
        rest_sec: 90,
        load_tag: "hafif",
        note: "Devre sonu 1 dk plank. Tur bitince 90 sn dinlen, 3-4 tur tekrarla.",
      },
    ],
  },
];

export const DEFAULT_PROGRAM_NAME = "FULL SPLIT 6 Gün";
export const DEFAULT_PROGRAM_DESCRIPTION =
  "Pazartesi–Cumartesi full split: Push A, Pull A, Bacak, Push B, Pull B, Core. Pazar dinlenme. Orta-ileri seviye; notlar form ve yük yönetimi için eklendi.";

export const MAIN_LIFTS = [
  "Deadlift",
  "Romanian Deadlift",
  "Leg Press",
  "Squat Machine",
  "Dumbbell Bench Press",
  "Standing Barbell Overhead Press",
  "Chest-Supported Row",
  "Lat Pulldown",
  "Barbell Shrug",
] as const;

export const LOAD_TAG_LABELS: Record<LoadTag, string> = {
  agir: "Ağır",
  orta_agir: "Orta-Ağır",
  orta: "Orta",
  orta_hafif: "Orta-Hafif",
  hafif: "Hafif",
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  gogus: "Göğüs",
  sirt: "Sırt",
  omuz: "Omuz",
  kol: "Kol",
  bacak: "Bacak",
  trapez: "Trapez",
  core: "Core",
  diger: "Diğer",
};

export const DOW_LABELS: Record<number, string> = {
  1: "Pazartesi",
  2: "Salı",
  3: "Çarşamba",
  4: "Perşembe",
  5: "Cuma",
  6: "Cumartesi",
  7: "Pazar",
};


/** Unique short weekday labels (ISO 1=Mon … 7=Sun). Avoids Pazartesi/Pazar and Cuma/Cumartesi clash. */
export const DOW_SHORT: Record<number, string> = {
  1: "Pt",
  2: "Sa",
  3: "Ça",
  4: "Pe",
  5: "Cu",
  6: "Ct",
  7: "Pz",
};

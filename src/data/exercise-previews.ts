/**
 * Client-side exercise preview metadata: movement pattern + form cues.
 * Used when DB has no form_cues yet (library defaults).
 */

export type MovementPattern =
  | "press"
  | "pull"
  | "squat"
  | "hinge"
  | "raise"
  | "curl"
  | "pushdown"
  | "fly"
  | "core"
  | "carry"
  | "calf"
  | "generic";

export type ExercisePreview = {
  pattern: MovementPattern;
  primary: string[];
  secondary?: string[];
  cues: string[];
  /** Short Turkish blurb */
  summary: string;
};

const DEFAULT: ExercisePreview = {
  pattern: "generic",
  primary: ["Tüm vücut"],
  cues: ["Kontrollü tempo", "Nefes: eforla ver", "Ağrısız eklem aralığı"],
  summary: "Formu bozmadan kontrollü tekrarla.",
};

/** Name (lowercase) → preview. Longest match wins via exact key. */
export const EXERCISE_PREVIEW_BY_NAME: Record<string, ExercisePreview> = {
  "dumbbell bench press": {
    pattern: "press",
    primary: ["Göğüs"],
    secondary: ["Omuz", "Triceps"],
    cues: [
      "Kürek kemikleri arkada sabit",
      "Dirsekler ~45° vücuda",
      "Dambılları göğüs hizasında indir",
      "Patlayıcı it, kontrollü indir",
    ],
    summary: "Düz sehpada göğüs odaklı itiş.",
  },
  "incline dumbbell press": {
    pattern: "press",
    primary: ["Üst göğüs"],
    secondary: ["Omuz", "Triceps"],
    cues: ["Sehpayı 30–45°", "Dirsekleri çok açma", "Üst göğüste bitir"],
    summary: "Eğimli sehpada üst göğüs vurgusu.",
  },
  "barbell bench press": {
    pattern: "press",
    primary: ["Göğüs"],
    secondary: ["Omuz", "Triceps"],
    cues: ["Ayaklar yere basılı", "Bar göğüs ortasına", "Bilekler barın üstünde"],
    summary: "Klasik bar bench — spot önerilir.",
  },
  "seated dumbbell shoulder press": {
    pattern: "press",
    primary: ["Omuz"],
    secondary: ["Triceps"],
    cues: ["Sırt yaslı", "Dirsekler önde hafif", "Başın üzerinden kilitlenme"],
    summary: "Oturarak omuz press.",
  },
  "standing dumbbell shoulder press": {
    pattern: "press",
    primary: ["Omuz"],
    secondary: ["Core", "Triceps"],
    cues: ["Karın gergin", "Bel çukurunu abartma", "Kontrollü indiriş"],
    summary: "Ayakta omuz press — core devrede.",
  },
  "standing barbell overhead press": {
    pattern: "press",
    primary: ["Omuz"],
    secondary: ["Triceps", "Core"],
    cues: ["Bar köprücük hizasından", "Baş barın altından geç", "Kalça kilitli"],
    summary: "Dikey bar press.",
  },
  "arnold press": {
    pattern: "press",
    primary: ["Omuz"],
    secondary: ["Triceps"],
    cues: ["Başlangıç avuç içi yüze", "Dönerken press", "Omuzda yanma hissi"],
    summary: "Dönüşlü omuz press varyasyonu.",
  },
  "lateral raise": {
    pattern: "raise",
    primary: ["Yan omuz"],
    cues: ["Dirsek hafif bükük", "Omuz hizasına kadar", "Sallanma yok", "Ağırlık hafif olsun"],
    summary: "Yan omuz izolasyonu.",
  },
  "rear delt fly": {
    pattern: "fly",
    primary: ["Arka omuz"],
    secondary: ["Sırt"],
    cues: ["Gövde hafif öne", "Kürekleri sık", "Dirsekleri kilitleme"],
    summary: "Arka deltoid açılış.",
  },
  "face pull": {
    pattern: "pull",
    primary: ["Arka omuz"],
    secondary: ["Trapez", "Rotator"],
    cues: ["İp yüze doğru", "Dirsekler yüksek", "Dış rotasyon bitiş"],
    summary: "Omuz sağlığı + arka deltoid.",
  },
  "incline dumbbell fly": {
    pattern: "fly",
    primary: ["Göğüs"],
    cues: ["Dirsekler yumuşak", "Gerilimi kaybetme", "Altta omuz zorlama"],
    summary: "Göğüs açılış (fly).",
  },
  "cable fly": {
    pattern: "fly",
    primary: ["Göğüs"],
    cues: ["Gövde sabit", "Kollar geniş yay", "Ortada sık"],
    summary: "Kablo fly — sürekli gerilim.",
  },
  "triceps pushdown": {
    pattern: "pushdown",
    primary: ["Triceps"],
    cues: ["Dirsekler yanlarda sabit", "Sadece ön kol hareket etsin", "Altta tam kilit"],
    summary: "Triceps itiş izolasyonu.",
  },
  "overhead triceps extension": {
    pattern: "press",
    primary: ["Triceps"],
    cues: ["Dirsekler yukarı bak", "Dirsekleri açma", "Kontrollü esneme"],
    summary: "Baş üstü triceps uzatma.",
  },
  dips: {
    pattern: "press",
    primary: ["Göğüs / Triceps"],
    secondary: ["Omuz"],
    cues: ["Omuzları kulaklara çekme", "Kontrollü alçalma", "Ağrıda dur"],
    summary: "Vücut ağırlığı dips.",
  },
  "chest-supported row": {
    pattern: "pull",
    primary: ["Sırt"],
    secondary: ["Biceps"],
    cues: ["Göğüs yastığa yapışık", "Dirsekler geri", "Kürekleri sık"],
    summary: "Göğüs destekli çekiş.",
  },
  "machine row": {
    pattern: "pull",
    primary: ["Sırt"],
    secondary: ["Biceps"],
    cues: ["Göğüs pedde", "Çekişte nefes ver", "Omuzlar öne düşmesin"],
    summary: "Makine row.",
  },
  "single-arm machine row": {
    pattern: "pull",
    primary: ["Sırt"],
    secondary: ["Biceps"],
    cues: ["Gövde rotasyonu az", "Dirsek kalça hizasına", "Tek taraf odak"],
    summary: "Tek kol makine row.",
  },
  "barbell row": {
    pattern: "pull",
    primary: ["Sırt"],
    secondary: ["Biceps", "Core"],
    cues: ["Bel nötr", "Bar göbeğe", "Sarsmadan çek"],
    summary: "Bar row — sırt kalınlığı.",
  },
  "t-bar row": {
    pattern: "pull",
    primary: ["Sırt"],
    cues: ["Göğüs açık", "Dirsekler vücuda yakın", "Üstte sık"],
    summary: "T-bar çekiş.",
  },
  "dumbbell row": {
    pattern: "pull",
    primary: ["Sırt"],
    secondary: ["Biceps"],
    cues: ["Serbest el destek", "Dirsek kalçaya", "Omuz düşmesin"],
    summary: "Tek kol dambıl row.",
  },
  "lat pulldown": {
    pattern: "pull",
    primary: ["Kanat (lat)"],
    secondary: ["Biceps"],
    cues: ["Göğsü bara çek", "Dirsekler aşağı-geri", "Sallanma yok"],
    summary: "Lat pulldown — kanat genişliği.",
  },
  "pull-up": {
    pattern: "pull",
    primary: ["Kanat (lat)"],
    secondary: ["Biceps", "Core"],
    cues: ["Tam asılma", "Çene bar üstü", "İndirişi kontrol et"],
    summary: "Barfiks.",
  },
  "straight-arm pulldown": {
    pattern: "pull",
    primary: ["Kanat (lat)"],
    cues: ["Kollar neredeyse düz", "Sadece omuz eklemi", "Kalça sabit"],
    summary: "Düz kol lat izolasyonu.",
  },
  "dumbbell shrug": {
    pattern: "raise",
    primary: ["Trapez"],
    cues: ["Omuzları kulaklara", "Boyun gevşek", "Yana doğru değil yukarı"],
    summary: "Trapez shrug.",
  },
  "barbell shrug": {
    pattern: "raise",
    primary: ["Trapez"],
    cues: ["Dikey çekiş", "Yuvarlama yok", "Üstte 1 sn tut"],
    summary: "Bar shrug.",
  },
  "biceps curl": {
    pattern: "curl",
    primary: ["Biceps"],
    cues: ["Dirsekler sabit", "Omuz öne gitmesin", "Altta tam açılma"],
    summary: "Klasik biceps curl.",
  },
  "hammer curl": {
    pattern: "curl",
    primary: ["Biceps", "Brachialis"],
    cues: ["Avuçlar birbirine", "Dirsekler yanlarda", "Kontrollü tempo"],
    summary: "Çekiç curl — kol kalınlığı.",
  },
  deadlift: {
    pattern: "hinge",
    primary: ["Arka zincir", "Sırt"],
    secondary: ["Bacak", "Core"],
    cues: ["Bar kaval kemiğine yakın", "Bel nötr", "Kalça itişiyle kalk", "Omuzlar barın önünde"],
    summary: "Deadlift — tüm arka zincir.",
  },
  "romanian deadlift": {
    pattern: "hinge",
    primary: ["Hamstring", "Kalça"],
    secondary: ["Sırt"],
    cues: ["Dizler az bükük", "Kalçayı geri it", "Sırt düz", "Hamstring gerilimi"],
    summary: "RDL — hamstring odaklı.",
  },
  "leg press": {
    pattern: "squat",
    primary: ["Quadriceps"],
    secondary: ["Kalça"],
    cues: ["Bel yastığa yapışık", "Dizler ayak yönünde", "Altta kalça kalkmasın"],
    summary: "Leg press.",
  },
  "squat machine": {
    pattern: "squat",
    primary: ["Quadriceps", "Kalça"],
    cues: ["Ayaklar omuz genişliği", "Dizler dışa", "Derinlik kontrollü"],
    summary: "Makine squat.",
  },
  squat: {
    pattern: "squat",
    primary: ["Quadriceps", "Kalça"],
    secondary: ["Core"],
    cues: ["Göğüs dik", "Dizler ayak ucu yönünde", "Topuklar yerde", "Kalça geri-aşağı"],
    summary: "Free squat.",
  },
  "walking lunge": {
    pattern: "squat",
    primary: ["Quadriceps", "Kalça"],
    cues: ["Adım uzunluğu dengeli", "Ön diz 90°", "Gövde dik"],
    summary: "Yürüyüş lunge.",
  },
  "bulgarian split squat": {
    pattern: "squat",
    primary: ["Quadriceps", "Kalça"],
    cues: ["Arka ayak destekte", "Ön diz sabit", "Dik iniş"],
    summary: "Tek bacak split squat.",
  },
  "hip thrust": {
    pattern: "hinge",
    primary: ["Kalça (glute)"],
    cues: ["Çene hafif göğüste", "Üstte kalça sık", "Bel aşırı çukurluk yok"],
    summary: "Hip thrust — glute odaklı.",
  },
  "leg extension": {
    pattern: "raise",
    primary: ["Quadriceps"],
    cues: ["Sırt yaslı", "Üstte 1 sn tut", "Patella ağrısında azalt"],
    summary: "Leg extension izolasyonu.",
  },
  "leg curl": {
    pattern: "curl",
    primary: ["Hamstring"],
    cues: ["Kalça yastığa basılı", "Kontrollü indiriş", "Sallanma yok"],
    summary: "Leg curl.",
  },
  "standing calf raise": {
    pattern: "calf",
    primary: ["Baldır"],
    cues: ["Tam esneme altta", "Üstte parmak ucu", "Diz kilitli değil"],
    summary: "Ayakta baldır.",
  },
  "seated calf raise": {
    pattern: "calf",
    primary: ["Soleus"],
    cues: ["Diz 90°", "Yavaş tempo", "Tam ROM"],
    summary: "Oturarak baldır.",
  },
  "leg press calf raise": {
    pattern: "calf",
    primary: ["Baldır"],
    cues: ["Sadece ayak bileği", "Dizler sabit", "Kontrol"],
    summary: "Leg press üzerinde baldır.",
  },
  "farmer's walk": {
    pattern: "carry",
    primary: ["Core", "Kavrama"],
    secondary: ["Trapez"],
    cues: ["Omuzlar geride", "Kısa adımlar", "Gövde sallanmasın"],
    summary: "Farmer yürüyüşü.",
  },
  "suitcase carry": {
    pattern: "carry",
    primary: ["Yan core"],
    cues: ["Tek taraflı yük", "Gövde dik kal", "Eğilme yok"],
    summary: "Valiz taşıma — oblik.",
  },
  "ağırlıklı side bend": {
    pattern: "core",
    primary: ["Oblik"],
    cues: ["Yana kontrollü", "Öne eğilme yok", "Hafif ağırlık"],
    summary: "Yan eğilme.",
  },
  "pallof press": {
    pattern: "core",
    primary: ["Anti-rotasyon core"],
    cues: ["Gövde sabit", "Kollar öne uzat", "Dönmeye diren"],
    summary: "Pallof press — core stabilite.",
  },
  plank: {
    pattern: "core",
    primary: ["Core"],
    cues: ["Vücut düz çizgi", "Kalça düşmesin", "Nefes al"],
    summary: "Plank.",
  },
  mekik: {
    pattern: "core",
    primary: ["Karın"],
    cues: ["Boyun gevşek", "Alt sırt yerde", "Kontrollü tempo"],
    summary: "Mekik / crunch.",
  },
  "hanging leg raise": {
    pattern: "core",
    primary: ["Alt karın"],
    cues: ["Sallanmayı kes", "Bacakları kontrollü kaldır", "Bel çukurunu koru"],
    summary: "Asılı bacak kaldırma.",
  },
  "kablo crunch": {
    pattern: "core",
    primary: ["Karın"],
    cues: ["Kalça sabit", "Kaburgaları leğen kemiğine", "Kollarla çekme"],
    summary: "Kablo crunch.",
  },
};

export function getExercisePreview(
  name: string,
  formCues?: string | null,
): ExercisePreview {
  const key = name.trim().toLocaleLowerCase("tr-TR");
  const base = EXERCISE_PREVIEW_BY_NAME[key] ?? { ...DEFAULT, summary: `${name} — form odaklı.` };

  if (formCues && formCues.trim()) {
    return {
      ...base,
      cues: formCues
        .split(/[|\n•]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }
  return base;
}

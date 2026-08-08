import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { o as LOAD_TAG_LABELS } from "./library-DXw4XNK8.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as cn } from "./utils-BtReAY3a.mjs";
import { S as Play, t as X } from "../_libs/lucide-react.mjs";
import { n as resolveExerciseMedia, t as mediaSrc } from "./exercise-media-resolve-7rnO_XA4.mjs";
import { n as ViewSide, t as BodyChart } from "../_libs/body-muscles.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workouts-IgRN97EP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = {
	agir: "bg-red/15 text-red border-red/30",
	orta_agir: "bg-orange/15 text-orange border-orange/30",
	orta: "bg-yellow/15 text-yellow border-yellow/30",
	orta_hafif: "bg-softblue/15 text-softblue border-softblue/30",
	hafif: "bg-blue/15 text-blue border-blue/30"
};
function LoadTagBadge({ tag, className }) {
	const label = LOAD_TAG_LABELS[tag] ?? tag;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", COLORS[tag] ?? "bg-surface2 text-muted border-line", className),
		children: label
	});
}
var DEFAULT = {
	pattern: "generic",
	primary: ["Tüm vücut"],
	cues: [
		"Kontrollü tempo",
		"Nefes: eforla ver",
		"Ağrısız eklem aralığı"
	],
	summary: "Formu bozmadan kontrollü tekrarla."
};
/** Name (lowercase) → preview. Longest match wins via exact key. */
var EXERCISE_PREVIEW_BY_NAME = {
	"dumbbell bench press": {
		pattern: "press",
		primary: ["Göğüs"],
		secondary: ["Omuz", "Triceps"],
		cues: [
			"Kürek kemikleri arkada sabit",
			"Dirsekler ~45° vücuda",
			"Dambılları göğüs hizasında indir",
			"Patlayıcı it, kontrollü indir"
		],
		summary: "Düz sehpada göğüs odaklı itiş."
	},
	"incline dumbbell press": {
		pattern: "press",
		primary: ["Üst göğüs"],
		secondary: ["Omuz", "Triceps"],
		cues: [
			"Sehpayı 30–45°",
			"Dirsekleri çok açma",
			"Üst göğüste bitir"
		],
		summary: "Eğimli sehpada üst göğüs vurgusu."
	},
	"barbell bench press": {
		pattern: "press",
		primary: ["Göğüs"],
		secondary: ["Omuz", "Triceps"],
		cues: [
			"Ayaklar yere basılı",
			"Bar göğüs ortasına",
			"Bilekler barın üstünde"
		],
		summary: "Klasik bar bench — spot önerilir."
	},
	"seated dumbbell shoulder press": {
		pattern: "press",
		primary: ["Omuz"],
		secondary: ["Triceps"],
		cues: [
			"Sırt yaslı",
			"Dirsekler önde hafif",
			"Başın üzerinden kilitlenme"
		],
		summary: "Oturarak omuz press."
	},
	"standing dumbbell shoulder press": {
		pattern: "press",
		primary: ["Omuz"],
		secondary: ["Core", "Triceps"],
		cues: [
			"Karın gergin",
			"Bel çukurunu abartma",
			"Kontrollü indiriş"
		],
		summary: "Ayakta omuz press — core devrede."
	},
	"standing barbell overhead press": {
		pattern: "press",
		primary: ["Omuz"],
		secondary: ["Triceps", "Core"],
		cues: [
			"Bar köprücük hizasından",
			"Baş barın altından geç",
			"Kalça kilitli"
		],
		summary: "Dikey bar press."
	},
	"arnold press": {
		pattern: "press",
		primary: ["Omuz"],
		secondary: ["Triceps"],
		cues: [
			"Başlangıç avuç içi yüze",
			"Dönerken press",
			"Omuzda yanma hissi"
		],
		summary: "Dönüşlü omuz press varyasyonu."
	},
	"lateral raise": {
		pattern: "raise",
		primary: ["Yan omuz"],
		cues: [
			"Dirsek hafif bükük",
			"Omuz hizasına kadar",
			"Sallanma yok",
			"Ağırlık hafif olsun"
		],
		summary: "Yan omuz izolasyonu."
	},
	"rear delt fly": {
		pattern: "fly",
		primary: ["Arka omuz"],
		secondary: ["Sırt"],
		cues: [
			"Gövde hafif öne",
			"Kürekleri sık",
			"Dirsekleri kilitleme"
		],
		summary: "Arka deltoid açılış."
	},
	"face pull": {
		pattern: "pull",
		primary: ["Arka omuz"],
		secondary: ["Trapez", "Rotator"],
		cues: [
			"İp yüze doğru",
			"Dirsekler yüksek",
			"Dış rotasyon bitiş"
		],
		summary: "Omuz sağlığı + arka deltoid."
	},
	"incline dumbbell fly": {
		pattern: "fly",
		primary: ["Göğüs"],
		cues: [
			"Dirsekler yumuşak",
			"Gerilimi kaybetme",
			"Altta omuz zorlama"
		],
		summary: "Göğüs açılış (fly)."
	},
	"cable fly": {
		pattern: "fly",
		primary: ["Göğüs"],
		cues: [
			"Gövde sabit",
			"Kollar geniş yay",
			"Ortada sık"
		],
		summary: "Kablo fly — sürekli gerilim."
	},
	"triceps pushdown": {
		pattern: "pushdown",
		primary: ["Triceps"],
		cues: [
			"Dirsekler yanlarda sabit",
			"Sadece ön kol hareket etsin",
			"Altta tam kilit"
		],
		summary: "Triceps itiş izolasyonu."
	},
	"overhead triceps extension": {
		pattern: "press",
		primary: ["Triceps"],
		cues: [
			"Dirsekler yukarı bak",
			"Dirsekleri açma",
			"Kontrollü esneme"
		],
		summary: "Baş üstü triceps uzatma."
	},
	dips: {
		pattern: "press",
		primary: ["Göğüs / Triceps"],
		secondary: ["Omuz"],
		cues: [
			"Omuzları kulaklara çekme",
			"Kontrollü alçalma",
			"Ağrıda dur"
		],
		summary: "Vücut ağırlığı dips."
	},
	"chest-supported row": {
		pattern: "pull",
		primary: ["Sırt"],
		secondary: ["Biceps"],
		cues: [
			"Göğüs yastığa yapışık",
			"Dirsekler geri",
			"Kürekleri sık"
		],
		summary: "Göğüs destekli çekiş."
	},
	"machine row": {
		pattern: "pull",
		primary: ["Sırt"],
		secondary: ["Biceps"],
		cues: [
			"Göğüs pedde",
			"Çekişte nefes ver",
			"Omuzlar öne düşmesin"
		],
		summary: "Makine row."
	},
	"single-arm machine row": {
		pattern: "pull",
		primary: ["Sırt"],
		secondary: ["Biceps"],
		cues: [
			"Gövde rotasyonu az",
			"Dirsek kalça hizasına",
			"Tek taraf odak"
		],
		summary: "Tek kol makine row."
	},
	"barbell row": {
		pattern: "pull",
		primary: ["Sırt"],
		secondary: ["Biceps", "Core"],
		cues: [
			"Bel nötr",
			"Bar göbeğe",
			"Sarsmadan çek"
		],
		summary: "Bar row — sırt kalınlığı."
	},
	"t-bar row": {
		pattern: "pull",
		primary: ["Sırt"],
		cues: [
			"Göğüs açık",
			"Dirsekler vücuda yakın",
			"Üstte sık"
		],
		summary: "T-bar çekiş."
	},
	"dumbbell row": {
		pattern: "pull",
		primary: ["Sırt"],
		secondary: ["Biceps"],
		cues: [
			"Serbest el destek",
			"Dirsek kalçaya",
			"Omuz düşmesin"
		],
		summary: "Tek kol dambıl row."
	},
	"lat pulldown": {
		pattern: "pull",
		primary: ["Kanat (lat)"],
		secondary: ["Biceps"],
		cues: [
			"Göğsü bara çek",
			"Dirsekler aşağı-geri",
			"Sallanma yok"
		],
		summary: "Lat pulldown — kanat genişliği."
	},
	"pull-up": {
		pattern: "pull",
		primary: ["Kanat (lat)"],
		secondary: ["Biceps", "Core"],
		cues: [
			"Tam asılma",
			"Çene bar üstü",
			"İndirişi kontrol et"
		],
		summary: "Barfiks."
	},
	"straight-arm pulldown": {
		pattern: "pull",
		primary: ["Kanat (lat)"],
		cues: [
			"Kollar neredeyse düz",
			"Sadece omuz eklemi",
			"Kalça sabit"
		],
		summary: "Düz kol lat izolasyonu."
	},
	"dumbbell shrug": {
		pattern: "raise",
		primary: ["Trapez"],
		cues: [
			"Omuzları kulaklara",
			"Boyun gevşek",
			"Yana doğru değil yukarı"
		],
		summary: "Trapez shrug."
	},
	"barbell shrug": {
		pattern: "raise",
		primary: ["Trapez"],
		cues: [
			"Dikey çekiş",
			"Yuvarlama yok",
			"Üstte 1 sn tut"
		],
		summary: "Bar shrug."
	},
	"biceps curl": {
		pattern: "curl",
		primary: ["Biceps"],
		cues: [
			"Dirsekler sabit",
			"Omuz öne gitmesin",
			"Altta tam açılma"
		],
		summary: "Klasik biceps curl."
	},
	"hammer curl": {
		pattern: "curl",
		primary: ["Biceps", "Brachialis"],
		cues: [
			"Avuçlar birbirine",
			"Dirsekler yanlarda",
			"Kontrollü tempo"
		],
		summary: "Çekiç curl — kol kalınlığı."
	},
	deadlift: {
		pattern: "hinge",
		primary: ["Arka zincir", "Sırt"],
		secondary: ["Bacak", "Core"],
		cues: [
			"Bar kaval kemiğine yakın",
			"Bel nötr",
			"Kalça itişiyle kalk",
			"Omuzlar barın önünde"
		],
		summary: "Deadlift — tüm arka zincir."
	},
	"romanian deadlift": {
		pattern: "hinge",
		primary: ["Hamstring", "Kalça"],
		secondary: ["Sırt"],
		cues: [
			"Dizler az bükük",
			"Kalçayı geri it",
			"Sırt düz",
			"Hamstring gerilimi"
		],
		summary: "RDL — hamstring odaklı."
	},
	"leg press": {
		pattern: "squat",
		primary: ["Quadriceps"],
		secondary: ["Kalça"],
		cues: [
			"Bel yastığa yapışık",
			"Dizler ayak yönünde",
			"Altta kalça kalkmasın"
		],
		summary: "Leg press."
	},
	"squat machine": {
		pattern: "squat",
		primary: ["Quadriceps", "Kalça"],
		cues: [
			"Ayaklar omuz genişliği",
			"Dizler dışa",
			"Derinlik kontrollü"
		],
		summary: "Makine squat."
	},
	squat: {
		pattern: "squat",
		primary: ["Quadriceps", "Kalça"],
		secondary: ["Core"],
		cues: [
			"Göğüs dik",
			"Dizler ayak ucu yönünde",
			"Topuklar yerde",
			"Kalça geri-aşağı"
		],
		summary: "Free squat."
	},
	"walking lunge": {
		pattern: "squat",
		primary: ["Quadriceps", "Kalça"],
		cues: [
			"Adım uzunluğu dengeli",
			"Ön diz 90°",
			"Gövde dik"
		],
		summary: "Yürüyüş lunge."
	},
	"bulgarian split squat": {
		pattern: "squat",
		primary: ["Quadriceps", "Kalça"],
		cues: [
			"Arka ayak destekte",
			"Ön diz sabit",
			"Dik iniş"
		],
		summary: "Tek bacak split squat."
	},
	"hip thrust": {
		pattern: "hinge",
		primary: ["Kalça (glute)"],
		cues: [
			"Çene hafif göğüste",
			"Üstte kalça sık",
			"Bel aşırı çukurluk yok"
		],
		summary: "Hip thrust — glute odaklı."
	},
	"leg extension": {
		pattern: "raise",
		primary: ["Quadriceps"],
		cues: [
			"Sırt yaslı",
			"Üstte 1 sn tut",
			"Patella ağrısında azalt"
		],
		summary: "Leg extension izolasyonu."
	},
	"leg curl": {
		pattern: "curl",
		primary: ["Hamstring"],
		cues: [
			"Kalça yastığa basılı",
			"Kontrollü indiriş",
			"Sallanma yok"
		],
		summary: "Leg curl."
	},
	"standing calf raise": {
		pattern: "calf",
		primary: ["Baldır"],
		cues: [
			"Tam esneme altta",
			"Üstte parmak ucu",
			"Diz kilitli değil"
		],
		summary: "Ayakta baldır."
	},
	"seated calf raise": {
		pattern: "calf",
		primary: ["Soleus"],
		cues: [
			"Diz 90°",
			"Yavaş tempo",
			"Tam ROM"
		],
		summary: "Oturarak baldır."
	},
	"leg press calf raise": {
		pattern: "calf",
		primary: ["Baldır"],
		cues: [
			"Sadece ayak bileği",
			"Dizler sabit",
			"Kontrol"
		],
		summary: "Leg press üzerinde baldır."
	},
	"farmer's walk": {
		pattern: "carry",
		primary: ["Core", "Kavrama"],
		secondary: ["Trapez"],
		cues: [
			"Omuzlar geride",
			"Kısa adımlar",
			"Gövde sallanmasın"
		],
		summary: "Farmer yürüyüşü."
	},
	"suitcase carry": {
		pattern: "carry",
		primary: ["Yan core"],
		cues: [
			"Tek taraflı yük",
			"Gövde dik kal",
			"Eğilme yok"
		],
		summary: "Valiz taşıma — oblik."
	},
	"ağırlıklı side bend": {
		pattern: "core",
		primary: ["Oblik"],
		cues: [
			"Yana kontrollü",
			"Öne eğilme yok",
			"Hafif ağırlık"
		],
		summary: "Yan eğilme."
	},
	"pallof press": {
		pattern: "core",
		primary: ["Anti-rotasyon core"],
		cues: [
			"Gövde sabit",
			"Kollar öne uzat",
			"Dönmeye diren"
		],
		summary: "Pallof press — core stabilite."
	},
	plank: {
		pattern: "core",
		primary: ["Core"],
		cues: [
			"Vücut düz çizgi",
			"Kalça düşmesin",
			"Nefes al"
		],
		summary: "Plank."
	},
	mekik: {
		pattern: "core",
		primary: ["Karın"],
		cues: [
			"Boyun gevşek",
			"Alt sırt yerde",
			"Kontrollü tempo"
		],
		summary: "Mekik / crunch."
	},
	"hanging leg raise": {
		pattern: "core",
		primary: ["Alt karın"],
		cues: [
			"Sallanmayı kes",
			"Bacakları kontrollü kaldır",
			"Bel çukurunu koru"
		],
		summary: "Asılı bacak kaldırma."
	},
	"kablo crunch": {
		pattern: "core",
		primary: ["Karın"],
		cues: [
			"Kalça sabit",
			"Kaburgaları leğen kemiğine",
			"Kollarla çekme"
		],
		summary: "Kablo crunch."
	}
};
function getExercisePreview$1(name, formCues) {
	const base = EXERCISE_PREVIEW_BY_NAME[name.trim().toLocaleLowerCase("tr-TR")] ?? {
		...DEFAULT,
		summary: `${name} — form odaklı.`
	};
	if (formCues && formCues.trim()) return {
		...base,
		cues: formCues.split(/[|\n•]+/).map((s) => s.trim()).filter(Boolean)
	};
	return base;
}
var listExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("afd9eb4b0241257f6bb5a71448b2a6e8d646cc52cbb317e94f625819f21299f9"));
/**
* Search / browse full exercises-dataset (1324) + local library.
* - q: free text (min 1–2 chars for dataset name match)
* - muscleGroup: gogus | sirt | omuz | kol | bacak | core | trapez | diger
* Empty q + muscle = browse that group from the full catalog.
* Empty both = local library + first page of full catalog.
*/
var searchExerciseCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => typeof d === "string" ? { q: d } : d).handler(createSsrRpc("49c0636baaf4c59822a0bb0ebe0e0e84c255f416d06dc080f5f05871112453ce"));
/** Materialize a dataset exercise into DB and return its id. */
var adoptDatasetExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("d40ffa3c9cdaff90f8fff0323912a677c99a2c48b39a936b2863aea0e549db7a"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1a7786f874a3551aa8b4967f9b8f7da0acdaf8ce7081cbc3ad6bc5e28ce09ed8"));
/** Lookup media by exercise name (preview button) — full 1324 dataset. */
var getExerciseMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((name) => name).handler(createSsrRpc("2a36a9c41ce43e9ee92030ce0fbc7d52d4d084dd0aa7ebde03702e4780f21aee"));
var similarExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("9e5f71464f06d65f04e609cc76804a0bd79ac52f3a4ffdeb214f6a65d638305c"));
var createExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("dc275b09650b9414d526fd6f324f03568cdbe778fcadee66808955cd53c7596b"));
var LABEL_TR = {
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
	calves: "Baldır"
};
/** Salon dark-theme colors (override library slate palette) */
var C = {
	base: "#1e1e28",
	idle: "#343444",
	secondary: "#e8a838",
	primary: "#f04444",
	primaryStroke: "#ffd666",
	idleStroke: "#1a1a22"
};
/** Map our regions → body-muscles MuscleIds (bilateral) */
var REGION_TO_MUSCLES = {
	chest: [
		"chest-upper-left",
		"chest-upper-right",
		"chest-lower-left",
		"chest-lower-right"
	],
	shoulders: [
		"shoulder-front-left",
		"shoulder-front-right",
		"shoulder-side-left",
		"shoulder-side-right",
		"deltoid-rear-left",
		"deltoid-rear-right"
	],
	biceps: ["biceps-left", "biceps-right"],
	triceps: [
		"triceps-long-left",
		"triceps-lateral-left",
		"triceps-long-right",
		"triceps-lateral-right"
	],
	forearms: [
		"forearm-left",
		"forearm-right",
		"forearm-flexors-left",
		"forearm-extensors-left",
		"forearm-flexors-right",
		"forearm-extensors-right"
	],
	abs: [
		"abs-upper-left",
		"abs-upper-right",
		"abs-lower-left",
		"abs-lower-right"
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
		"spine"
	],
	lats: [
		"lats-upper-left",
		"lats-mid-left",
		"lats-lower-left",
		"lats-upper-right",
		"lats-mid-right",
		"lats-lower-right"
	],
	traps: [
		"traps-upper-left",
		"traps-mid-left",
		"traps-lower-left",
		"traps-upper-right",
		"traps-mid-right",
		"traps-lower-right"
	],
	glutes: [
		"gluteus-maximus-left",
		"gluteus-maximus-right",
		"gluteus-medius-left",
		"gluteus-medius-right"
	],
	quads: ["quads-left", "quads-right"],
	hamstrings: [
		"hamstrings-medial-left",
		"hamstrings-lateral-left",
		"hamstrings-medial-right",
		"hamstrings-lateral-right"
	],
	calves: [
		"calves-gastroc-medial-left",
		"calves-gastroc-lateral-left",
		"calves-soleus-left",
		"calves-gastroc-medial-right",
		"calves-gastroc-lateral-right",
		"calves-soleus-right"
	]
};
var REAR_DELT = ["deltoid-rear-left", "deltoid-rear-right"];
var SIDE_DELT = ["shoulder-side-left", "shoulder-side-right"];
var FRONT_DELT = ["shoulder-front-left", "shoulder-front-right"];
var UPPER_CHEST = ["chest-upper-left", "chest-upper-right"];
var LOWER_CHEST = ["chest-lower-left", "chest-lower-right"];
function uniq(arr) {
	return [...new Set(arr)];
}
/**
* Name-first mapping — specific before general.
*/
function planMuscles(exerciseName, muscleGroup, previewPrimary = [], previewSecondary = []) {
	const n = exerciseName.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/\p{M}/gu, "");
	if (/face\s*pull|rear\s*delt|arka\s*omuz|reverse\s*fly|rear\s*delt\s*fly/.test(n)) return {
		primary: ["shoulders"],
		secondary: ["traps", "back"],
		primaryIds: REAR_DELT,
		secondaryIds: [
			...REGION_TO_MUSCLES.traps.slice(0, 4),
			"lats-upper-left",
			"lats-upper-right"
		]
	};
	if (/lateral\s*raise|side\s*raise|yan\s*acis|yan\s*omuz/.test(n)) return {
		primary: ["shoulders"],
		secondary: [],
		primaryIds: SIDE_DELT
	};
	if (/front\s*raise/.test(n)) return {
		primary: ["shoulders"],
		secondary: [],
		primaryIds: FRONT_DELT
	};
	if (/incline.*(?:bench|press|fly)|(?:bench|press|fly).*incline|ust\s*gogus/.test(n)) return {
		primary: ["chest"],
		secondary: ["shoulders", "triceps"],
		primaryIds: UPPER_CHEST,
		secondaryIds: [...FRONT_DELT, ...REGION_TO_MUSCLES.triceps]
	};
	if (/decline.*(?:bench|press)|(?:bench|press).*decline/.test(n)) return {
		primary: ["chest"],
		secondary: ["shoulders", "triceps"],
		primaryIds: LOWER_CHEST,
		secondaryIds: [...FRONT_DELT, ...REGION_TO_MUSCLES.triceps]
	};
	if (/bench\s*press|chest\s*press|gogus\s*pres|dumbbell\s*press(?!.*shoulder)|barbell\s*bench|push.?up|sinav|fly|pec\s*deck|cable\s*fly/.test(n) && !/shoulder|overhead|ohp|military|arnold/.test(n)) return {
		primary: ["chest"],
		secondary: ["shoulders", "triceps"],
		primaryIds: [...UPPER_CHEST, ...LOWER_CHEST],
		secondaryIds: [...FRONT_DELT, ...REGION_TO_MUSCLES.triceps]
	};
	if (/shoulder\s*press|overhead\s*press|military\s*press|ohp|arnold\s*press|omuz\s*pres|dikey\s*pres/.test(n)) return {
		primary: ["shoulders"],
		secondary: ["triceps", "traps"],
		primaryIds: [...FRONT_DELT, ...SIDE_DELT],
		secondaryIds: [...REGION_TO_MUSCLES.triceps, ...REGION_TO_MUSCLES.traps]
	};
	if (/shrug|trapez|trap\s*bar\s*shrug/.test(n) && !/deadlift/.test(n)) return {
		primary: ["traps"],
		secondary: ["forearms"]
	};
	if (/lat\s*pulldown|pull[\s-]?up|chin[\s-]?up|pulldown|barfiks|straight[\s-]?arm\s*pull/.test(n)) return {
		primary: ["lats", "back"],
		secondary: ["biceps", "shoulders"],
		primaryIds: REGION_TO_MUSCLES.lats,
		secondaryIds: [...REGION_TO_MUSCLES.biceps, ...REAR_DELT]
	};
	if (/row|cekis|cikis|cift\s*kol|t[\s-]?bar|pendlay/.test(n)) return {
		primary: ["back", "lats"],
		secondary: [
			"biceps",
			"shoulders",
			"traps"
		],
		secondaryIds: [
			...REGION_TO_MUSCLES.biceps,
			...REAR_DELT,
			...REGION_TO_MUSCLES.traps
		]
	};
	if (/romanian|rdl|stiff[\s-]?leg|good\s*morning/.test(n)) return {
		primary: ["hamstrings", "glutes"],
		secondary: ["back"],
		secondaryIds: [
			"lower-back-erectors-left",
			"lower-back-erectors-right",
			"spine"
		]
	};
	if (/deadlift|olu\s*kaldir|sumo\s*dead/.test(n)) return {
		primary: [
			"hamstrings",
			"glutes",
			"back"
		],
		secondary: [
			"traps",
			"forearms",
			"quads"
		]
	};
	if (/hip\s*thrust|glute\s*bridge|kalca/.test(n)) return {
		primary: ["glutes"],
		secondary: ["hamstrings"]
	};
	if (/leg\s*curl|hamstring\s*curl|bacak\s*buku/.test(n)) return {
		primary: ["hamstrings"],
		secondary: []
	};
	if (/leg\s*extension|quad\s*extension|bacak\s*acma|bacak\s*ekstans/.test(n)) return {
		primary: ["quads"],
		secondary: []
	};
	if (/calf|baldır|baldir|soleus|gastroc/.test(n)) return {
		primary: ["calves"],
		secondary: []
	};
	if (/squat|leg\s*press|lunge|split\s*squat|hack\s*squat|goblet|bulgarian/.test(n)) return {
		primary: ["quads", "glutes"],
		secondary: ["hamstrings", "calves"]
	};
	if (/triceps|triseps|pushdown|skull\s*crusher|overhead\s*extension|dip(?!.*belt)/.test(n) && !/bench|chest/.test(n)) {
		if (/chest\s*dip|gogus.*dip/.test(n)) return {
			primary: ["chest", "triceps"],
			secondary: ["shoulders"]
		};
		return {
			primary: ["triceps"],
			secondary: []
		};
	}
	if (/dip/.test(n)) return {
		primary: ["chest", "triceps"],
		secondary: ["shoulders"]
	};
	if (/curl|biceps|biseps|hammer\s*curl|preacher|koncentras/.test(n) && !/leg\s*curl|hamstring/.test(n)) return {
		primary: ["biceps"],
		secondary: ["forearms"]
	};
	if (/farmer|carry|suitcase|yuru|walk/.test(n)) return {
		primary: ["forearms", "traps"],
		secondary: ["abs", "shoulders"]
	};
	if (/pallof|side\s*bend|oblique|yan\s*karın|yan\s*karin|woodchop/.test(n)) return {
		primary: ["obliques", "abs"],
		secondary: []
	};
	if (/plank|mekik|crunch|sit[\s-]?up|leg\s*raise|knee\s*raise|abs|karın|karin|makas|flutter|heel\s*touch|topuk/.test(n)) return {
		primary: ["abs"],
		secondary: ["obliques"]
	};
	if (/kablo\s*crunch|cable\s*crunch/.test(n)) return {
		primary: ["abs"],
		secondary: []
	};
	const fromLabels = (labels, into) => {
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
	const pri = [];
	const sec = [];
	fromLabels(previewPrimary, pri);
	fromLabels(previewSecondary, sec);
	if (pri.length === 0 && muscleGroup) ({
		gogus: ["chest"],
		sirt: ["back", "lats"],
		omuz: ["shoulders"],
		kol: [],
		bacak: ["quads"],
		trapez: ["traps"],
		core: ["abs"],
		diger: []
	}[muscleGroup] ?? []).forEach((r) => pri.push(r));
	if (pri.length && sec.length === 0) {
		if (pri.includes("chest")) sec.push("shoulders", "triceps");
		if (pri.includes("lats") || pri.includes("back")) sec.push("biceps");
		if (pri.includes("shoulders") && !pri.includes("chest")) sec.push("triceps");
		if (pri.includes("quads")) sec.push("glutes");
	}
	const priU = uniq(pri);
	return {
		primary: priU,
		secondary: uniq(sec).filter((r) => !priU.includes(r))
	};
}
function buildBodyState(plan) {
	const state = {};
	const paint = (ids, intensity, selected) => {
		for (const id of ids) {
			const prev = state[id];
			if (!prev || prev.intensity < intensity) state[id] = {
				intensity,
				selected
			};
		}
	};
	const expand = (regions, override) => {
		if (override && override.length) return override;
		return regions.flatMap((r) => REGION_TO_MUSCLES[r] ?? []);
	};
	paint(expand(plan.secondary, plan.secondaryIds), 4, false);
	paint(expand(plan.primary, plan.primaryIds), 9, true);
	return state;
}
/** Recolor library SVG for dark UI — only active muscles pop */
function paintSalonTheme(root, bodyState) {
	const svg = root.querySelector("svg");
	if (!svg) return;
	svg.querySelectorAll("path:not(.body-chart-muscle)").forEach((el) => {
		el.setAttribute("fill", C.base);
		el.setAttribute("stroke", "none");
		el.style.fillOpacity = "1";
	});
	svg.querySelectorAll("path.body-chart-muscle").forEach((el) => {
		el.querySelector("title")?.textContent?.trim();
		const aria = el.getAttribute("aria-label") || "";
		const intenMatch = aria.match(/intensity\s+(\d+)/i);
		const intensity = intenMatch ? Number(intenMatch[1]) : 0;
		const selected = /\(selected\)/i.test(aria);
		if (intensity >= 7 || selected) {
			el.setAttribute("fill", C.primary);
			el.setAttribute("stroke", C.primaryStroke);
			el.setAttribute("stroke-width", "0.35");
			el.style.fillOpacity = "1";
			el.style.filter = "none";
		} else if (intensity >= 1) {
			el.setAttribute("fill", C.secondary);
			el.setAttribute("stroke", C.idleStroke);
			el.setAttribute("stroke-width", "0.15");
			el.style.fillOpacity = "0.95";
			el.style.filter = "none";
		} else {
			el.setAttribute("fill", C.idle);
			el.setAttribute("stroke", C.idleStroke);
			el.setAttribute("stroke-width", "0.08");
			el.style.fillOpacity = "1";
			el.style.filter = "none";
		}
	});
}
function ChartPane({ view, bodyState, stateKey, label }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current) return;
		ref.current.innerHTML = "";
		const chart = new BodyChart(ref.current, {
			view,
			bodyState,
			showViewLabel: false,
			enableTransitions: false,
			ariaLabel: label,
			className: "body-muscles-chart"
		});
		paintSalonTheme(ref.current, bodyState);
		const root = ref.current;
		const retheme = () => paintSalonTheme(root, bodyState);
		root.addEventListener("mouseleave", retheme);
		root.addEventListener("click", () => requestAnimationFrame(retheme));
		return () => {
			root.removeEventListener("mouseleave", retheme);
			chart.destroy();
		};
	}, [
		view,
		stateKey,
		label,
		bodyState
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muscle-pane rounded-xl border border-line bg-[#121218] p-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-dim",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: "muscle-chart-host mx-auto h-[260px] w-full max-w-[160px] sm:h-[300px] sm:max-w-[180px]"
		})]
	});
}
function BodyMuscleMap({ primary = [], secondary = [], exerciseName = "", muscleGroup = null, className }) {
	const plan = (0, import_react.useMemo)(() => {
		if (exerciseName) return planMuscles(exerciseName, muscleGroup, primary, secondary);
		const asRegions = (xs) => xs.filter((x) => x in LABEL_TR);
		return {
			primary: asRegions(primary),
			secondary: asRegions(secondary)
		};
	}, [
		exerciseName,
		muscleGroup,
		primary,
		secondary
	]);
	const [tab, setTab] = (0, import_react.useState)("both");
	const bodyState = (0, import_react.useMemo)(() => buildBodyState(plan), [plan]);
	const stateKey = (0, import_react.useMemo)(() => Object.entries(bodyState).map(([k, v]) => `${k}:${v?.intensity}`).sort().join("|"), [bodyState]);
	const labels = [...plan.primary.map((r) => ({
		r,
		level: "primary"
	})), ...plan.secondary.map((r) => ({
		r,
		level: "secondary"
	}))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("w-full", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex justify-center gap-1.5",
				children: [
					{
						id: "both",
						label: "Ön+Arka"
					},
					{
						id: "front",
						label: "Ön"
					},
					{
						id: "back",
						label: "Arka"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(t.id),
					className: cn("min-h-9 rounded-full border px-3 text-[11px] font-semibold", tab === t.id ? "border-yellow bg-yellow/15 text-yellow" : "border-line text-muted"),
					children: t.label
				}, t.id))
			}),
			plan.primary.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-line bg-surface2/40 px-3 py-4 text-center text-xs text-muted",
				children: "Bu hareket için net kas eşlemesi yok."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid gap-2", tab === "both" ? "grid-cols-2" : "grid-cols-1 place-items-center"),
				children: [(tab === "both" || tab === "front") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPane, {
					view: ViewSide.FRONT,
					bodyState,
					stateKey,
					label: "Ön"
				}), (tab === "both" || tab === "back") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPane, {
					view: ViewSide.BACK,
					bodyState,
					stateKey,
					label: "Arka"
				})]
			}),
			labels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: labels.map(({ r, level }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", level === "primary" ? "border-red/50 bg-red/15 text-red" : "border-yellow/40 bg-yellow/10 text-yellow"),
					children: [
						level === "primary" ? "● " : "○ ",
						LABEL_TR[r],
						level === "primary" ? " (ana)" : " (yardımcı)"
					]
				}, `${level}-${r}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center justify-center gap-4 text-[10px] text-dim",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-[#f04444]" }), " Ana"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-[#e8a838]" }), " Yardımcı"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-[#343444]" }), " Pasif"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-center text-[9px] text-dim",
				children: [
					"Harita:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://github.com/vulovix/body-muscles",
						target: "_blank",
						rel: "noreferrer",
						className: "underline decoration-line hover:text-muted",
						children: "body-muscles"
					})
				]
			})
		]
	});
}
function ExercisePreviewButton({ name, formCues, gifUrl, muscleGroup, className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn("inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-surface2 px-3.5 text-xs font-semibold text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.98] active:bg-surface active:text-yellow", className),
		"aria-label": `${name} önizleme`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 fill-current" }), "Önizle"]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePreviewModal, {
		name,
		formCues,
		gifUrl,
		muscleGroup,
		onClose: () => setOpen(false)
	})] });
}
function ExercisePreviewModal({ name, formCues, gifUrl, muscleGroup, onClose }) {
	const fallback = getExercisePreview$1(name, formCues);
	const local = (0, import_react.useMemo)(() => resolveExerciseMedia(name), [name]);
	const [remote, setRemote] = (0, import_react.useState)(null);
	const [stage, setStage] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	(0, import_react.useEffect)(() => {
		setStage(0);
		let cancelled = false;
		getExerciseMedia({ data: name }).then((m) => {
			if (!cancelled && m && (m.gif_url || m.image_url)) setRemote(m);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [name]);
	const gif = local.gif_url || remote?.gif_url || gifUrl || null;
	const still = local.image_url || remote?.image_url || null;
	const group = local.muscle_group || remote?.muscle_group || muscleGroup || null;
	const cueSource = formCues || local.form_cues || remote?.form_cues || remote?.default_note || "";
	const cueList = cueSource ? cueSource.split(/[|\n•·]+/).map((s) => s.trim()).filter(Boolean) : fallback.cues;
	const displaySrc = (() => {
		if (stage === 0 && gif) return mediaSrc(gif, true);
		if (stage === 1 && gif) return mediaSrc(gif, false);
		if (stage === 2 && still) return mediaSrc(still, true);
		if (stage === 3 && still) return mediaSrc(still, false);
		return null;
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] flex items-end justify-center bg-black/75 sm:items-center sm:p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": "Kapat",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line bg-surface sm:rounded-2xl",
			style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-2 sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-10 rounded-full bg-line" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 flex items-start justify-between gap-2 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-tight tracking-wide text-yellow",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs leading-snug text-muted",
							children: [fallback.summary, local.dataset_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-dim",
								children: [" · ", local.dataset_name]
							}) : null]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "grid size-11 shrink-0 place-items-center rounded-full border border-line text-muted active:bg-surface2",
						"aria-label": "Kapat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-2xl border border-line bg-[#0a0a0c]",
							children: displaySrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: displaySrc,
								alt: name,
								className: "mx-auto max-h-72 w-full bg-white object-contain",
								loading: "eager",
								onError: () => setStage((s) => Math.min(4, s + 1))
							}, displaySrc) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-40 place-items-center px-4 text-center text-xs text-muted",
								children: "Animasyon bulunamadı — kas haritası aşağıda"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line bg-surface2/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim",
								children: "Çalışan bölgeler"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyMuscleMap, {
								exerciseName: name,
								muscleGroup: group,
								primary: fallback.primary,
								secondary: fallback.secondary ?? []
							})]
						}),
						cueList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line bg-surface2/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim",
								children: "Form / yönerge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: cueList.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2 text-sm leading-snug text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-yellow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
								}, i))
							})]
						})
					]
				})
			]
		})]
	});
}
var listWorkoutsInRange = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c470ce496b95c9afdde529cbf005d46ee94dc975539d9b6621c922d51795a182"));
var getWorkoutByDate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((date) => date).handler(createSsrRpc("879445236f81bc8637c1953d8ef815391e749af0f994bc78513ce6f22c30c6f9"));
var createWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("e182973a651642b29b1973d1c35de9338c54625555633269f5cc40ea83ace408"));
var updateWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5740b898ff2b8a3912750e367ca6d84cec314df9865bdec0573f089208464972"));
/**
* Skip / reschedule:
* - postpone_week: shift ALL planned sessions in that ISO week by +1 day
* - skip_week: mark only this session skipped (not this week)
* - tomorrow / next_free: kept as aliases → postpone_week for backwards compat
*/
var skipWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("8a6ef6d33b6ce0ad083bb720c90041620b058b1a4a1f936e060e6dc4cd22ad71"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("124a8196e107618fd2bfc73f3170758380308d2a732d8b12b09d6b2fdf3b1923"));
/**
* Delete only future planned/skipped sessions from today forward.
* Completed (and past completed) history is never touched.
*/
var clearFutureWorkouts = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("3ed198a712ba243748c19883d294a55c8673b5cb99729de6cea884039eec9619"));
var updateWorkoutSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("0aa88f3b0eabf3b1b7d35bdf0f95f7c192faaecdbe09741c3383e9a4cd53c14a"));
var addWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("da6f4422ac456ec8d3de4e92022c49907399b21f4818e1991f97c80565997136"));
var deleteWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("d15162f3aac5ef71e27a4432278e1b880f9f5a5acf078e52eb9a73b92685b5a8"));
/** Swap a workout exercise for a similar/library alternative; keeps set rows. */
var swapWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("0fd7ffd0ad309e1a3b86498de81aa8d817b86201e8a02ebe9b35898dbf514be0"));
/**
* Write this session's exercise list onto the linked program day
* (or active program day for that weekday). Future sessions use the new list.
*/
var saveWorkoutToProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("0abaad264c031de8d875ed3c3f2037cc5b223eb2089d8830ed8f3416a337d624"));
/**
* Rolling horizon filler.
* - Never touches completed / skipped past sessions with exercises
* - Only creates missing future (and empty-shell) days that have a program day
* - Keeps at least `minAheadDays` from today filled, and always covers `coverUntil` if given
* So the calendar continuously extends as time passes — not a one-shot "4 weeks dump".
*/
/**
* Manual / clone entry: extends rolling horizon.
* `weeks` kept for API compat — maps to minAheadDays = weeks * 7.
*/
var generateWorkouts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5d9dcfe0ba767a8b7f8e4598dfde4f07e08af8efdb0827ea0bcd28da03832044"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d = {}) => d ?? {}).handler(createSsrRpc("a44538cec3761e97a74f2c188ba695b160f7d023a550829ceab7769bd128c2d2"));
//#endregion
export { swapWorkoutExercise as _, clearFutureWorkouts as a, deleteWorkoutExercise as c, listExercises as d, listWorkoutsInRange as f, skipWorkout as g, similarExercises as h, adoptDatasetExercise as i, generateWorkouts as l, searchExerciseCatalog as m, LoadTagBadge as n, createExercise as o, saveWorkoutToProgram as p, addWorkoutExercise as r, createWorkout as s, ExercisePreviewButton as t, getWorkoutByDate as u, updateWorkout as v, updateWorkoutSet as y };

import { i as withTransaction } from "./db-DdbNJQxT.mjs";
import { n as DEFAULT_PROGRAM_DESCRIPTION, r as DEFAULT_PROGRAM_NAME, t as DEFAULT_PROGRAM } from "./library-DGJU16Cf.mjs";
import { ensureExerciseLibrary } from "./seed-DlydNDJa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CK8l1uze.js
/** key → locale → copy */
var CATALOG_I18N = {
	"fullsplit6": {
		"de": {
			"name": "Full Split (6 Tage)",
			"description": "Sechstage-Push/Pull/Legs-Doppel-Split für Fortgeschrittene. Hohes Volumen mit klaren Pausen."
		},
		"es": {
			"name": "Full Split (6 días)",
			"description": "Split push/pull/legs de seis días para avanzados. Alto volumen con descansos estructurados."
		},
		"id": {
			"name": "Full Split (6 hari)",
			"description": "Split push/pull/legs 6 hari untuk level mahir. Volume tinggi dengan istirahat terstruktur."
		},
		"pt-BR": {
			"name": "Full Split (6 dias)",
			"description": "Split push/pull/legs de seis dias para avançados. Alto volume com descanso estruturado."
		},
		"ja": {
			"name": "Full Split（6日）",
			"description": "上級者向け6日PPLダブル。高ボリュームと計画的レスト。"
		},
		"ko": {
			"name": "Full Split (6일)",
			"description": "고급자를 위한 6일 푸시/풀/레그 더블 스플릿. 체계적 휴식의 고볼륨."
		},
		"vi": {
			"name": "Full Split (6 ngày)",
			"description": "Split push/pull/legs 6 ngày cho nâng cao. Volume cao, nghỉ có cấu trúc."
		},
		"zh-CN": {
			"name": "Full Split（6 天）",
			"description": "进阶六天推/拉/腿双循环。高容量、结构清晰的休息。"
		},
		"zh-TW": {
			"name": "Full Split（6 天）",
			"description": "進階六天推/拉/腿雙循環。高容量、結構清楚的休息。"
		},
		"ar": {
			"name": "Full Split (6 أيام)",
			"description": "تقسيم دفع/سحب/أرجل لستة أيام للمستوى المتقدم. حجم مرتفع مع راحة منظمة."
		}
	},
	"full3": {
		"de": {
			"name": "Full Body (3 Tage)",
			"description": "Einsteigerfreundliches Ganzkörpertraining Mo/Mi/Fr. Push, Pull und Beine in jeder Einheit."
		},
		"es": {
			"name": "Full Body (3 días)",
			"description": "Full body para principiantes lun/mié/vie. Empuje, tirón y piernas en cada sesión."
		},
		"id": {
			"name": "Full Body (3 hari)",
			"description": "Full body ramah pemula Sen/Rab/Jum. Dorong, tarik, dan kaki di setiap sesi."
		},
		"pt-BR": {
			"name": "Full Body (3 dias)",
			"description": "Full body para iniciantes seg/qua/sex. Empurrar, puxar e pernas em cada sessão."
		},
		"ja": {
			"name": "Full Body（3日）",
			"description": "月・水・金の初心者向け全身。毎回プッシュ・プル・脚。"
		},
		"ko": {
			"name": "Full Body (3일)",
			"description": "월/수/금 초보 친화 전신. 매 세션 푸시·풀·다리."
		},
		"vi": {
			"name": "Full Body (3 ngày)",
			"description": "Full body thân thiện người mới T2/T4/T6. Đẩy, kéo và chân mỗi buổi."
		},
		"zh-CN": {
			"name": "Full Body（3 天）",
			"description": "周一/三/五友好型全身。每次含推、拉与腿。"
		},
		"zh-TW": {
			"name": "Full Body（3 天）",
			"description": "週一/三/五友善型全身。每次含推、拉與腿。"
		},
		"ar": {
			"name": "Full Body (3 أيام)",
			"description": "جسم كامل للمبتدئين الإثنين/الأربعاء/الجمعة. دفع وسحب وأرجل في كل جلسة."
		}
	},
	"ul4": {
		"de": {
			"name": "Upper / Lower (4 Tage)",
			"description": "Ausgewogener 4-Tage-Ober-/Unterkörper-Split. Mo–Do Training, Wochenende frei."
		},
		"es": {
			"name": "Upper / Lower (4 días)",
			"description": "Split superior/inferior equilibrado de 4 días. Lun–jue entrenamiento, fin de semana libre."
		},
		"id": {
			"name": "Upper / Lower (4 hari)",
			"description": "Split upper/lower seimbang 4 hari. Sen–Kam latihan, akhir pekan libur."
		},
		"pt-BR": {
			"name": "Upper / Lower (4 dias)",
			"description": "Split superior/inferior equilibrado de 4 dias. Seg–qui treino, fim de semana livre."
		},
		"ja": {
			"name": "Upper / Lower（4日）",
			"description": "バランス良い4日上下分割。月–木トレ、週末オフ。"
		},
		"ko": {
			"name": "Upper / Lower (4일)",
			"description": "균형 잡힌 4일 상·하체 스플릿. 월–목 훈련, 주말 휴무."
		},
		"vi": {
			"name": "Upper / Lower (4 ngày)",
			"description": "Split trên/dưới cân bằng 4 ngày. T2–T5 tập, cuối tuần nghỉ."
		},
		"zh-CN": {
			"name": "Upper / Lower（4 天）",
			"description": "均衡四天上下肢分化。周一至四训练，周末休息。"
		},
		"zh-TW": {
			"name": "Upper / Lower（4 天）",
			"description": "均衡四天上下肢分化。週一至四訓練，週末休息。"
		},
		"ar": {
			"name": "Upper / Lower (4 أيام)",
			"description": "تقسيم علوي/سفلي متوازن لأربعة أيام. تدريب الإثنين–الخميس، عطلة نهاية الأسبوع."
		}
	},
	"ppl6": {
		"de": {
			"name": "Push / Pull / Legs (6 Tage)",
			"description": "Klassisches PPL zweimal pro Woche. Fortgeschrittenes Volumen für Kraft und Masse."
		},
		"es": {
			"name": "Push / Pull / Legs (6 días)",
			"description": "PPL clásico dos veces por semana. Volumen avanzado para fuerza y tamaño."
		},
		"id": {
			"name": "Push / Pull / Legs (6 hari)",
			"description": "PPL klasik dua kali seminggu. Volume mahir untuk kekuatan dan ukuran."
		},
		"pt-BR": {
			"name": "Push / Pull / Legs (6 dias)",
			"description": "PPL clássico duas vezes por semana. Volume avançado para força e tamanho."
		},
		"ja": {
			"name": "Push / Pull / Legs（6日）",
			"description": "週2周のクラシックPPL。筋力とサイズの上級ボリューム。"
		},
		"ko": {
			"name": "Push / Pull / Legs (6일)",
			"description": "주 2회 클래식 PPL. 힘과 크기용 고급 볼륨."
		},
		"vi": {
			"name": "Push / Pull / Legs (6 ngày)",
			"description": "PPL cổ điển hai vòng/tuần. Volume nâng cao cho sức mạnh và size."
		},
		"zh-CN": {
			"name": "Push / Pull / Legs（6 天）",
			"description": "经典 PPL 每周两轮。进阶容量兼顾力量与围度。"
		},
		"zh-TW": {
			"name": "Push / Pull / Legs（6 天）",
			"description": "經典 PPL 每週兩輪。進階容量兼顧力量與圍度。"
		},
		"ar": {
			"name": "Push / Pull / Legs (6 أيام)",
			"description": "PPL كلاسيكي مرتين أسبوعيًا. حجم متقدم للقوة والحجم."
		}
	},
	"bw3": {
		"de": {
			"name": "Körpergewicht Einstieg (3 Tage)",
			"description": "Minimales Equipment. Drei Ganzkörper-Einheiten für Gewohnheit, Core und relative Kraft."
		},
		"es": {
			"name": "Peso corporal inicio (3 días)",
			"description": "Equipo mínimo. Tres full body para hábito, core y fuerza relativa."
		},
		"id": {
			"name": "Bodyweight Pemula (3 hari)",
			"description": "Peralatan minimal. Tiga sesi full body untuk kebiasaan, core, dan kekuatan relatif."
		},
		"pt-BR": {
			"name": "Peso corporal iniciante (3 dias)",
			"description": "Equipamento mínimo. Três full body para hábito, core e força relativa."
		},
		"ja": {
			"name": "自重スターター（3日）",
			"description": "最小機材。習慣・コア・相対筋力のための全身3日。"
		},
		"ko": {
			"name": "맨몸 스타터 (3일)",
			"description": "최소 장비. 습관·코어·상대 근력을 위한 전신 3일."
		},
		"vi": {
			"name": "Bodyweight cơ bản (3 ngày)",
			"description": "Ít dụng cụ. Ba buổi full body xây thói quen, core và sức mạnh tương đối."
		},
		"zh-CN": {
			"name": "自重入门（3 天）",
			"description": "最少器材。三次全身课培养习惯、核心与相对力量。"
		},
		"zh-TW": {
			"name": "自重入門（3 天）",
			"description": "最少器材。三次全身課培養習慣、核心與相對力量。"
		},
		"ar": {
			"name": "وزن الجسم للمبتدئين (3 أيام)",
			"description": "معدات قليلة. ثلاث جلسات جسم كامل لبناء العادة والجذع والقوة النسبية."
		}
	},
	"db4hyp": {
		"de": {
			"name": "Kurzhantel-Hypertrophie (4 Tage)",
			"description": "Vier Tage kurzhantel-fokussierte Hypertrophie. Ideal zu Hause oder im vollen Gym."
		},
		"es": {
			"name": "Hipertrofia con mancuernas (4 días)",
			"description": "Cuatro días de hipertrofia con mancuernas. Ideal en casa o gimnasios llenos."
		},
		"id": {
			"name": "Hipertrofi Dumbbell (4 hari)",
			"description": "Empat hari hipertrofi berfokus dumbbell. Cocok di rumah atau gym ramai."
		},
		"pt-BR": {
			"name": "Hipertrofia com halteres (4 dias)",
			"description": "Quatro dias de hipertrofia com foco em halteres. Ótimo em casa ou academia cheia."
		},
		"ja": {
			"name": "ダンベル筋肥大（4日）",
			"description": "ダンベル中心の4日筋肥大。自宅や混雑ジム向け。"
		},
		"ko": {
			"name": "덤벨 근비대 (4일)",
			"description": "덤벨 중심 4일 근비대. 홈/혼잡 헬스장에 적합."
		},
		"vi": {
			"name": "Hipertrofi tạ đơn (4 ngày)",
			"description": "Bốn ngày tăng cơ tập trung tạ đơn. Tốt cho nhà hoặc phòng tập đông."
		},
		"zh-CN": {
			"name": "哑铃增肌（4 天）",
			"description": "四天哑铃导向增肌。适合家庭或拥挤健身房。"
		},
		"zh-TW": {
			"name": "啞鈴增肌（4 天）",
			"description": "四天啞鈴導向增肌。適合居家或擁擠健身房。"
		},
		"ar": {
			"name": "تضخيم بالدمبل (4 أيام)",
			"description": "أربعة أيام تضخيم بتركيز الدمبل. ممتاز في المنزل أو الجيم المزدحم."
		}
	},
	"str5": {
		"de": {
			"name": "Kraftblock (5 Tage)",
			"description": "Fünftägiger Kraftblock um die großen Hebebewegungen. Mittel bis fortgeschritten."
		},
		"es": {
			"name": "Bloque de fuerza (5 días)",
			"description": "Bloque de fuerza de cinco días centrado en los grandes levantamientos. Intermedio a avanzado."
		},
		"id": {
			"name": "Blok Kekuatan (5 hari)",
			"description": "Blok kekuatan lima hari di seputar angkatan besar. Menengah hingga mahir."
		},
		"pt-BR": {
			"name": "Bloco de força (5 dias)",
			"description": "Bloco de força de cinco dias em torno dos grandes levantamentos. Intermediário a avançado."
		},
		"ja": {
			"name": "筋力ビルダー（5日）",
			"description": "ビッグリフト中心の5日筋力ブロック。中級〜上級。"
		},
		"ko": {
			"name": "근력 빌더 (5일)",
			"description": "큰 리프트 중심 5일 근력 블록. 중급~고급."
		},
		"vi": {
			"name": "Khối sức mạnh (5 ngày)",
			"description": "Khối sức mạnh 5 ngày quanh các động tác lớn. Trung cấp đến nâng cao."
		},
		"zh-CN": {
			"name": "力量构建（5 天）",
			"description": "围绕大重量动作的五天力量周期。中高级。"
		},
		"zh-TW": {
			"name": "力量建構（5 天）",
			"description": "圍繞大重量動作的五天力量週期。中高級。"
		},
		"ar": {
			"name": "بناء القوة (5 أيام)",
			"description": "كتلة قوة لخمسة أيام حول الرفعات الكبرى. متوسط إلى متقدم."
		}
	},
	"home2": {
		"de": {
			"name": "Home Minimal (2 Tage)",
			"description": "Zwei effiziente Ganzkörper-Tage mit wenig Equipment. Ideal in vollen Wochen."
		},
		"es": {
			"name": "Casa minimal (2 días)",
			"description": "Dos full body eficientes con poco equipo. Ideal en semanas ocupadas."
		},
		"id": {
			"name": "Rumah Minimal (2 hari)",
			"description": "Dua hari full body efisien dengan peralatan minim. Cocok untuk minggu sibuk."
		},
		"pt-BR": {
			"name": "Casa minimal (2 dias)",
			"description": "Dois full body eficientes com pouco equipamento. Perfeito em semanas corridas."
		},
		"ja": {
			"name": "ホーム最小（2日）",
			"description": "最小機材で効率的な全身2日。忙しい週向け。"
		},
		"ko": {
			"name": "홈 미니멀 (2일)",
			"description": "최소 장비로 효율적인 전신 2일. 바쁜 주에 적합."
		},
		"vi": {
			"name": "Tối giản tại nhà (2 ngày)",
			"description": "Hai ngày full body hiệu quả với ít dụng cụ. Lý tưởng tuần bận."
		},
		"zh-CN": {
			"name": "居家极简（2 天）",
			"description": "少量器材的高效全身两日。适合忙碌周。"
		},
		"zh-TW": {
			"name": "居家極簡（2 天）",
			"description": "少量器材的高效全身兩日。適合忙碌週。"
		},
		"ar": {
			"name": "منزل بسيط (يومان)",
			"description": "يومان كاملان بكفاءة وبمعدات قليلة. مثالي للأسابيع المزدحمة."
		}
	},
	"mach4": {
		"de": {
			"name": "Maschinen-Circuit (4 Tage)",
			"description": "Maschinen-first 4-Tage-Circuit. Gelenkfreundliches Volumen für Mittelstufe."
		},
		"es": {
			"name": "Circuito de máquinas (4 días)",
			"description": "Circuito de 4 días centrado en máquinas. Volumen amable con las articulaciones."
		},
		"id": {
			"name": "Sirkuit Mesin (4 hari)",
			"description": "Sirkuit 4 hari mengutamakan mesin. Volume ramah sendi untuk level menengah."
		},
		"pt-BR": {
			"name": "Circuito de máquinas (4 dias)",
			"description": "Circuito de 4 dias focado em máquinas. Volume amigável às articulações."
		},
		"ja": {
			"name": "マシンサーキット（4日）",
			"description": "マシン中心の4日サーキット。関節に優しい中級ボリューム。"
		},
		"ko": {
			"name": "머신 서킷 (4일)",
			"description": "머신 중심 4일 서킷. 관절 친화 중급 볼륨."
		},
		"vi": {
			"name": "Circuit máy (4 ngày)",
			"description": "Circuit 4 ngày ưu tiên máy. Volume thân thiện khớp cho trung cấp."
		},
		"zh-CN": {
			"name": "器械循环（4 天）",
			"description": "以器械为主的四天循环。关节友好的中级容量。"
		},
		"zh-TW": {
			"name": "器械循環（4 天）",
			"description": "以器械為主的四天循環。關節友善的中級容量。"
		},
		"ar": {
			"name": "دائرة أجهزة (4 أيام)",
			"description": "دائرة أربعة أيام تركز على الأجهزة. حجم لطيف على المفاصل للمستوى المتوسط."
		}
	},
	"glute4": {
		"de": {
			"name": "Glute & Beine (4 Tage)",
			"description": "Unterkörper-fokussierter 4-Tage-Plan. Glutes, Quads und Hamstrings priorisiert."
		},
		"es": {
			"name": "Glúteos y piernas (4 días)",
			"description": "Plan de 4 días centrado en tren inferior. Prioriza glúteos, cuádriceps e isquios."
		},
		"id": {
			"name": "Glute & Kaki (4 hari)",
			"description": "Rencana 4 hari fokus lower body. Prioritas glute, quad, dan hamstring."
		},
		"pt-BR": {
			"name": "Glúteos e pernas (4 dias)",
			"description": "Plano de 4 dias focado no inferior. Prioriza glúteos, quadríceps e posteriores."
		},
		"ja": {
			"name": "臀部と脚（4日）",
			"description": "下半身重視の4日。臀・大腿四頭・ハムを優先。"
		},
		"ko": {
			"name": "둔근 & 다리 (4일)",
			"description": "하체 중심 4일 플랜. 둔근·대퇴사두·햄스트링 우선."
		},
		"vi": {
			"name": "Mông & chân (4 ngày)",
			"description": "Kế hoạch 4 ngày tập trung thân dưới. Ưu tiên mông, đùi trước và sau."
		},
		"zh-CN": {
			"name": "臀与腿（4 天）",
			"description": "下肢导向的四天计划。优先臀、股四头与腘绳。"
		},
		"zh-TW": {
			"name": "臀與腿（4 天）",
			"description": "下肢導向的四天計畫。優先臀、股四頭與腿後腱。"
		},
		"ar": {
			"name": "أرداف وأرجل (4 أيام)",
			"description": "خطة أربعة أيام تركز على الجزء السفلي. أولوية للأرداف والمربعات والمأبض."
		}
	},
	"ppl3": {
		"de": {
			"name": "PPL Einstieg (3 Tage)",
			"description": "Einmal Push/Pull/Legs für Einsteiger. Muster lernen vor mehr Volumen."
		},
		"es": {
			"name": "PPL inicio (3 días)",
			"description": "Una ronda push/pull/legs para principiantes. Aprende el patrón antes del volumen."
		},
		"id": {
			"name": "PPL Pemula (3 hari)",
			"description": "Satu putaran push/pull/legs untuk pemula. Pelajari pola sebelum volume."
		},
		"pt-BR": {
			"name": "PPL iniciante (3 dias)",
			"description": "Uma rodada push/pull/legs para iniciantes. Aprenda o padrão antes do volume."
		},
		"ja": {
			"name": "PPL スターター（3日）",
			"description": "初心者向けPPL 1周。ボリューム前に型を覚える。"
		},
		"ko": {
			"name": "PPL 스타터 (3일)",
			"description": "초보용 PPL 1라운드. 볼륨 전에 패턴을 익히세요."
		},
		"vi": {
			"name": "PPL cơ bản (3 ngày)",
			"description": "Một vòng push/pull/legs cho người mới. Học pattern trước khi tăng volume."
		},
		"zh-CN": {
			"name": "PPL 入门（3 天）",
			"description": "初学者一轮推/拉/腿。先学模式再加容量。"
		},
		"zh-TW": {
			"name": "PPL 入門（3 天）",
			"description": "初學者一輪推/拉/腿。先學模式再加容量。"
		},
		"ar": {
			"name": "PPL للمبتدئين (3 أيام)",
			"description": "جولة واحدة دفع/سحب/أرجل للمبتدئين. تعلّم النمط قبل الحجم."
		}
	},
	"cond3": {
		"de": {
			"name": "Kondition Full Body (3 Tage)",
			"description": "Ganzkörper mit kürzeren Pausen für Fettabbau und Arbeitskapazität."
		},
		"es": {
			"name": "Full body acondicionamiento (3 días)",
			"description": "Sesiones full body con descansos cortos para grasa y capacidad de trabajo."
		},
		"id": {
			"name": "Kondisi Full Body (3 hari)",
			"description": "Sesi full body dengan istirahat lebih pendek untuk fat loss dan work capacity."
		},
		"pt-BR": {
			"name": "Full body condicionamento (3 dias)",
			"description": "Sessões full body com descansos curtos para perda de gordura e capacidade de trabalho."
		},
		"ja": {
			"name": "コンディショニング全身（3日）",
			"description": "短いレストの全身で減量と作業能力。"
		},
		"ko": {
			"name": "컨디셔닝 전신 (3일)",
			"description": "짧은 휴식의 전신 세션으로 지방 감량과 작업 능력."
		},
		"vi": {
			"name": "Full body conditioning (3 ngày)",
			"description": "Buổi full body nghỉ ngắn cho giảm mỡ và khả năng làm việc."
		},
		"zh-CN": {
			"name": "体能全身（3 天）",
			"description": "较短间歇的全身课，侧重减脂与工作能力。"
		},
		"zh-TW": {
			"name": "體能全身（3 天）",
			"description": "較短間歇的全身課，側重減脂與工作能力。"
		},
		"ar": {
			"name": "Full body تكييف (3 أيام)",
			"description": "جلسات جسم كامل براحات أقصر لفقدان الدهون وسعة العمل."
		}
	},
	"ath5": {
		"de": {
			"name": "Athletische Leistung (5 Tage)",
			"description": "Fünftägiger Mix aus Kraft, Power und Kondition für Sport."
		},
		"es": {
			"name": "Rendimiento atlético (5 días)",
			"description": "Mezcla de cinco días: fuerza, potencia y acondicionamiento para deporte."
		},
		"id": {
			"name": "Performa Atletik (5 hari)",
			"description": "Campuran 5 hari: kekuatan, power, dan conditioning untuk olahraga."
		},
		"pt-BR": {
			"name": "Desempenho atlético (5 dias)",
			"description": "Mistura de cinco dias: força, potência e condicionamento para esporte."
		},
		"ja": {
			"name": "アスレチック（5日）",
			"description": "筋力・パワー・コンディショニングの5日ブレンド。"
		},
		"ko": {
			"name": "운동 수행 (5일)",
			"description": "힘·파워·컨디셔닝을 섞은 5일 스포츠용 플랜."
		},
		"vi": {
			"name": "Hiệu suất thể thao (5 ngày)",
			"description": "Hỗn hợp 5 ngày: sức mạnh, power và conditioning cho thể thao."
		},
		"zh-CN": {
			"name": "运动表现（5 天）",
			"description": "五天运动向：力量、爆发与体能结合。"
		},
		"zh-TW": {
			"name": "運動表現（5 天）",
			"description": "五天運動向：力量、爆發與體能結合。"
		},
		"ar": {
			"name": "أداء رياضي (5 أيام)",
			"description": "مزيج خمسة أيام: قوة وقدرة وتكييف للرياضة."
		}
	}
};
function ex(exercise, sets, rep_lo, rep_hi, rest_sec, load_tag, detail) {
	return {
		exercise,
		sets,
		rep_lo,
		rep_hi,
		rest_sec,
		load_tag,
		detail
	};
}
var CATALOG = [
	{
		key: "fullsplit6",
		name: "Full Split (6 days)",
		description: "Six-day push / pull / legs double split for advanced lifters. High volume with structured rest.",
		name_tr: DEFAULT_PROGRAM_NAME,
		description_tr: DEFAULT_PROGRAM_DESCRIPTION,
		tags: "katalog,fullsplit,6gun,ileri,guc,hipertrofi,barbell,dumbbell",
		share_code: "FULL6X",
		days: DEFAULT_PROGRAM
	},
	{
		key: "full3",
		name: "Full Body (3 days)",
		description: "Beginner-friendly full body on Mon / Wed / Fri. Balanced push, pull and legs each session.",
		name_tr: "Full Body (3 gün)",
		description_tr: "Başlangıç ve yoğun tempo için. Pazartesi / Çarşamba / Cuma full body.",
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
					ex("Plank", 3, 20, 40, 60, "hafif")
				]
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
					ex("Triceps Pushdown", 2, 10, 12, 60, "orta")
				]
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
					ex("Mekik", 3, 12, 15, 45, "hafif")
				]
			}
		]
	},
	{
		key: "ul4",
		name: "Upper / Lower (4 days)",
		description: "Balanced four-day upper–lower split. Mon–Thu training, weekend free.",
		name_tr: "Upper / Lower (4 gün)",
		description_tr: "Dengeli 4 günlük üst-alt split. Pazartesi–Perşembe aktif, hafta sonu serbest.",
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
					ex("Biceps Curl", 2, 10, 12, 60, "orta")
				]
			},
			{
				dow: 2,
				name: "LOWER A",
				focus: "Squat pattern",
				exercises: [
					ex("Squat", 4, 5, 8, 180, "agir"),
					ex("Romanian Deadlift", 3, 8, 10, 120, "orta_agir"),
					ex("Leg Press", 3, 10, 12, 90, "orta"),
					ex("Standing Calf Raise", 4, 10, 15, 60, "orta")
				]
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
					ex("Triceps Pushdown", 3, 10, 12, 60, "orta")
				]
			},
			{
				dow: 5,
				name: "LOWER B",
				focus: "Hinge + posterior",
				exercises: [
					ex("Deadlift", 3, 3, 5, 180, "agir"),
					ex("Hip Thrust", 3, 8, 12, 90, "orta_agir"),
					ex("Leg Curl", 3, 10, 12, 75, "orta"),
					ex("Bulgarian Split Squat", 3, 8, 10, 90, "orta")
				]
			}
		]
	},
	{
		key: "ppl6",
		name: "Push / Pull / Legs (6 days)",
		description: "Classic PPL twice per week. Advanced volume for strength and size.",
		name_tr: "Push / Pull / Legs (6 gün)",
		description_tr: "Klasik PPL, haftada iki tur. İleri seviye hacim — güç ve kas için.",
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
					ex("Triceps Pushdown", 3, 10, 12, 60, "orta")
				]
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
					ex("Biceps Curl", 3, 10, 12, 60, "orta")
				]
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
					ex("Standing Calf Raise", 4, 10, 15, 60, "orta")
				]
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
					ex("Overhead Triceps Extension", 3, 10, 12, 60, "orta")
				]
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
					ex("Hammer Curl", 3, 10, 12, 60, "orta")
				]
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
					ex("Seated Calf Raise", 4, 12, 15, 60, "orta")
				]
			}
		]
	},
	{
		key: "bw3",
		name: "Bodyweight Starter (3 days)",
		description: "Minimal equipment. Three full-body sessions to build habit, core and relative strength.",
		name_tr: "Vücut Ağırlığı Başlangıç (3 gün)",
		description_tr: "Minimum ekipman. Alışkanlık, core ve göreli güç için haftada üç seans.",
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
					ex("Topuklara Dokunma", 3, 15, 20, 45, "hafif")
				]
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
					ex("Plank", 3, 30, 45, 60, "hafif")
				]
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
					ex("Mekik", 3, 15, 20, 45, "hafif")
				]
			}
		]
	},
	{
		key: "db4hyp",
		name: "Dumbbell Hypertrophy (4 days)",
		description: "Four-day dumbbell-only plan for intermediate lifters chasing muscle growth.",
		name_tr: "Dambıl Hipertrofi (4 gün)",
		description_tr: "Sadece dambıl. Orta seviye, kas odaklı dört günlük plan.",
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
					ex("Triceps Pushdown", 2, 12, 15, 60, "orta_hafif")
				]
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
					ex("Hammer Curl", 2, 10, 12, 60, "orta")
				]
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
					ex("Standing Calf Raise", 4, 12, 15, 60, "orta")
				]
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
					ex("Biceps Curl", 2, 10, 12, 60, "orta")
				]
			}
		]
	},
	{
		key: "str5",
		name: "Strength Builder (5 days)",
		description: "Five-day strength block focused on the big barbell lifts. Advanced.",
		name_tr: "Güç Blok (5 gün)",
		description_tr: "Beş günlük güç bloğu — ana bar hareketleri. İleri seviye.",
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
					ex("Standing Calf Raise", 4, 8, 12, 75, "orta")
				]
			},
			{
				dow: 2,
				name: "BENCH DAY",
				focus: "Bench primary",
				exercises: [
					ex("Barbell Bench Press", 5, 3, 5, 180, "agir"),
					ex("Incline Dumbbell Press", 3, 6, 8, 120, "orta_agir"),
					ex("Seated Dumbbell Shoulder Press", 3, 6, 8, 120, "orta"),
					ex("Triceps Pushdown", 3, 8, 10, 75, "orta")
				]
			},
			{
				dow: 3,
				name: "DEADLIFT DAY",
				focus: "Deadlift primary",
				exercises: [
					ex("Deadlift", 5, 2, 4, 200, "agir"),
					ex("Barbell Row", 4, 5, 8, 120, "agir"),
					ex("Lat Pulldown", 3, 6, 8, 90, "orta"),
					ex("Barbell Shrug", 3, 8, 10, 75, "orta")
				]
			},
			{
				dow: 5,
				name: "OVERHEAD DAY",
				focus: "Press primary",
				exercises: [
					ex("Standing Barbell Overhead Press", 5, 3, 5, 180, "agir"),
					ex("Dumbbell Bench Press", 3, 6, 8, 120, "orta_agir"),
					ex("Lateral Raise", 3, 10, 12, 60, "orta"),
					ex("Face Pull", 3, 12, 15, 60, "hafif")
				]
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
					ex("Plank", 3, 30, 45, 45, "hafif")
				]
			}
		]
	},
	{
		key: "home2",
		name: "Home Minimal (2 days)",
		description: "Two short home sessions with dumbbells and bodyweight. Perfect for busy weeks.",
		name_tr: "Ev Minimal (2 gün)",
		description_tr: "İki kısa ev seansı — dambıl + vücut ağırlığı. Yoğun haftalar için.",
		tags: "katalog,baslangic,2gun,kilo,hipertrofi,dumbbell,vucut",
		share_code: "HOME2X",
		days: [{
			dow: 2,
			name: "HOME A",
			focus: "Full body A",
			exercises: [
				ex("Squat", 3, 10, 12, 90, "orta"),
				ex("Dumbbell Bench Press", 3, 8, 12, 90, "orta"),
				ex("Dumbbell Row", 3, 8, 12, 75, "orta"),
				ex("Seated Dumbbell Shoulder Press", 2, 10, 12, 75, "orta"),
				ex("Plank", 3, 30, 40, 45, "hafif")
			]
		}, {
			dow: 5,
			name: "HOME B",
			focus: "Full body B",
			exercises: [
				ex("Romanian Deadlift", 3, 8, 10, 90, "orta"),
				ex("Walking Lunge", 3, 10, 12, 75, "orta"),
				ex("Incline Dumbbell Press", 3, 10, 12, 75, "orta"),
				ex("Dumbbell Row", 3, 10, 12, 75, "orta"),
				ex("Mekik", 3, 12, 15, 45, "hafif")
			]
		}]
	},
	{
		key: "mach4",
		name: "Machine Circuit (4 days)",
		description: "Beginner machine-based split. Safe learning curve for gym newcomers.",
		name_tr: "Makine Devresi (4 gün)",
		description_tr: "Başlangıç makine split’i. Salona yeni başlayanlar için güvenli tempo.",
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
					ex("Triceps Pushdown", 3, 12, 15, 60, "orta")
				]
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
					ex("Biceps Curl", 3, 12, 15, 60, "orta")
				]
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
					ex("Seated Calf Raise", 4, 12, 15, 60, "orta")
				]
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
					ex("Mekik", 3, 15, 20, 45, "hafif")
				]
			}
		]
	},
	{
		key: "glute4",
		name: "Glute & Legs (4 days)",
		description: "Lower-body emphasis with two glute days and two full lower sessions. Intermediate.",
		name_tr: "Kalça & Bacak (4 gün)",
		description_tr: "Alt vücut odaklı — iki kalça günü, iki tam bacak. Orta seviye.",
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
					ex("Standing Calf Raise", 3, 12, 15, 60, "orta")
				]
			},
			{
				dow: 2,
				name: "UPPER LIGHT",
				focus: "Maintain upper",
				exercises: [
					ex("Dumbbell Bench Press", 3, 8, 10, 90, "orta"),
					ex("Lat Pulldown", 3, 8, 12, 90, "orta"),
					ex("Seated Dumbbell Shoulder Press", 3, 10, 12, 75, "orta"),
					ex("Face Pull", 3, 12, 15, 60, "hafif")
				]
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
					ex("Seated Calf Raise", 3, 12, 15, 60, "orta")
				]
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
					ex("Standing Calf Raise", 4, 12, 15, 60, "orta")
				]
			}
		]
	},
	{
		key: "ppl3",
		name: "PPL Starter (3 days)",
		description: "One push, one pull, one legs day. Intermediate bridge from full body.",
		name_tr: "PPL Başlangıç (3 gün)",
		description_tr: "Bir push, bir pull, bir bacak. Full body’den geçiş için orta seviye.",
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
					ex("Triceps Pushdown", 3, 10, 12, 60, "orta")
				]
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
					ex("Biceps Curl", 3, 10, 12, 60, "orta")
				]
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
					ex("Standing Calf Raise", 4, 10, 15, 60, "orta")
				]
			}
		]
	},
	{
		key: "cond3",
		name: "Conditioning Full Body (3 days)",
		description: "Metabolic full-body days with carries and core. Fat-loss oriented, intermediate.",
		name_tr: "Kondisyon Full Body (3 gün)",
		description_tr: "Carry ve core ile metabolik full body. Kilo odaklı, orta seviye.",
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
					ex("Plank", 3, 30, 45, 45, "hafif")
				]
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
					ex("Hanging Leg Raise", 3, 8, 12, 45, "orta")
				]
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
					ex("Mekik", 3, 15, 20, 40, "hafif")
				]
			}
		]
	},
	{
		key: "ath5",
		name: "Athletic Performance (5 days)",
		description: "Five-day mix of strength, unilateral work and core for athletic conditioning.",
		name_tr: "Atletik Performans (5 gün)",
		description_tr: "Beş günlük güç, tek bacak ve core karışımı — atletik kondisyon.",
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
					ex("Standing Calf Raise", 3, 10, 12, 60, "orta")
				]
			},
			{
				dow: 2,
				name: "POWER UPPER",
				focus: "Press + pull",
				exercises: [
					ex("Barbell Bench Press", 4, 4, 6, 150, "agir"),
					ex("Barbell Row", 4, 5, 8, 120, "agir"),
					ex("Standing Barbell Overhead Press", 3, 5, 8, 120, "orta_agir"),
					ex("Pull-up", 3, 5, 8, 90, "orta")
				]
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
					ex("Plank", 3, 40, 50, 45, "hafif")
				]
			},
			{
				dow: 5,
				name: "STRENGTH MIX",
				focus: "Heavy accessories",
				exercises: [
					ex("Deadlift", 3, 3, 5, 180, "agir"),
					ex("Incline Dumbbell Press", 3, 6, 8, 120, "orta_agir"),
					ex("Chest-Supported Row", 3, 6, 8, 90, "orta"),
					ex("Hip Thrust", 3, 6, 8, 90, "orta")
				]
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
					ex("Mekik", 3, 15, 20, 40, "hafif")
				]
			}
		]
	}
];
/** Bump to force catalog rebuild on existing installs. */
var CATALOG_VERSION = "catalog-v3";
async function insertProgramDays(sql, programId, days, byName) {
	for (let di = 0; di < days.length; di++) {
		const day = days[di];
		const dayId = (await sql`
      insert into program_days (program_id, dow, name, focus, sort)
      values (${programId}, ${day.dow}, ${day.name}, ${day.focus}, ${di})
      returning id
    `)[0].id;
		for (let ei = 0; ei < day.exercises.length; ei++) {
			const pe = day.exercises[ei];
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
async function upsertTranslations(sql, programId, cat) {
	try {
		const rows = [{
			locale: "en",
			name: cat.name,
			description: cat.description
		}, {
			locale: "tr",
			name: cat.name_tr,
			description: cat.description_tr
		}];
		const extra = CATALOG_I18N[cat.key] ?? {};
		for (const [locale, copy] of Object.entries(extra)) if (copy?.name) rows.push({
			locale,
			name: copy.name,
			description: copy.description ?? cat.description
		});
		for (const row of rows) await sql`
        insert into program_translations (program_id, locale, name, description)
        values (${programId}, ${row.locale}, ${row.name}, ${row.description})
        on conflict (program_id, locale) do update set
          name = excluded.name,
          description = excluded.description
      `;
	} catch {}
}
var catalogGlobal = globalThis;
/** Seed / refresh Salon catalog (user_id = system). Rebuilds when CATALOG_VERSION changes. */
async function ensureCatalogSeeded(_sql) {
	if (catalogGlobal.__ensureCatalogSeeded__ && catalogGlobal.__ensureCatalogSeededVersion__ === CATALOG_VERSION) return catalogGlobal.__ensureCatalogSeeded__;
	catalogGlobal.__ensureCatalogSeededVersion__ = CATALOG_VERSION;
	catalogGlobal.__ensureCatalogSeeded__ = (async () => {
		await withTransaction(async (sql) => {
			await ensureExerciseLibrary(sql);
			const lib2 = await sql`
        select id, name from exercises where owner_id is null
      `;
			const byName = new Map(lib2.map((e) => [e.name, e.id]));
			const keepCodes = CATALOG.map((c) => c.share_code);
			for (const cat of CATALOG) {
				const existing = await sql`
          select id, tags from programs
          where user_id = 'system' and share_code = ${cat.share_code}
        `;
				if (existing.length > 0) {
					const id = existing[0].id;
					if (!(existing[0].tags ?? "").includes(CATALOG_VERSION)) {
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
				const prog = await sql`
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
				await insertProgramDays(sql, prog[0].id, cat.days, byName);
				await upsertTranslations(sql, prog[0].id, cat);
			}
			if (keepCodes.length > 0) await sql`
          delete from programs
          where user_id = 'system'
            and share_code is not null
            and share_code <> all(${keepCodes}::text[])
        `;
		});
	})().catch((err) => {
		catalogGlobal.__ensureCatalogSeeded__ = void 0;
		catalogGlobal.__ensureCatalogSeededVersion__ = void 0;
		throw err;
	});
	return catalogGlobal.__ensureCatalogSeeded__;
}
//#endregion
export { ensureCatalogSeeded as t };

/** Multi-locale names/descriptions for system catalog programs (not user content). */
export type CatalogLocaleCopy = { name: string; description: string };

/** Locales beyond en/tr (those live on CatalogProgram fields). */
export const CATALOG_EXTRA_LOCALES = ["de","es","id","pt-BR","ja","ko","vi","zh-CN","zh-TW","ar"] as const;

export type CatalogExtraLocale = (typeof CATALOG_EXTRA_LOCALES)[number];

/** key → locale → copy */
export const CATALOG_I18N: Record<
  string,
  Partial<Record<CatalogExtraLocale, CatalogLocaleCopy>>
> = {
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
} as const;

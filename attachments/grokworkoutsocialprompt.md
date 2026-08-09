# Salon — Antrenman ekranı yeniden yerleşimi + sosyal karşılaştırma katmanı

İki iş aynı ekranda buluşuyor: **antrenman ekranının yeniden yerleşimi** ve **hareket bazında karşılaştırma katmanı** ("bu hareketi başkaları ne kaldırıyor, bu programda kimler var").

Ekranı program aktifken çalıştırıp ölçtüm; aşağıdaki sorunlar ve sayılar gerçek. Veri uygunluğunu da şemadan doğruladım — **bu özellik için yeni tabloya neredeyse hiç gerek yok.**

## Kırmızı çizgiler

- `src/lib/auth/server.ts`, `preview.ts`, `pglite-dialect.ts`, `popup.server.ts` — dokunma.
- `vite.config.ts`'te `0.0.0.0:8080` sözleşmesi ve plugin'ler.
- `migrations/0001`–`0014` — düzenleme; yeni dosya aç.
- **Keşfet ve profil ekranlarına dokunma** — bu tur yalnızca antrenman ekranı + karşılaştırma.
- Set kaydetme davranışı bozulmayacak: debounce'lu kaydetme, otomatik "tamamlandı" geçişi, dinlenme sayacı aynı çalışmalı.
- Yeni server function: `authMiddleware` + `context.userId` scope + zod (`v(schema)` / `noInput`) + gizlilik **sunucuda**.
- Bitince `npm run typecheck && npm run lint && npm run test && npm run build` yeşil.

---

# FAZ 1 — Antrenman ekranı yeniden yerleşimi

Bu ekranın işi: **hedefe bak → kilo yaz → tekrar yaz → onayla.** Şu an okumaya göre kurulmuş, girmeye göre değil. Ölçtüğüm sorunlar:

| Sorun | Ölçüm |
|---|---|
| Başlık ikiye bölünüyor | "PUSH / A" alt alta düşüyor, üç buton üstüne biniyor |
| Finish en üstte ve dolu | Hiç set girilmeden birincil aksiyon "bitir" diyor |
| Kart 6 katmanlı | Ad, rozet satırı, ikinci aksiyon satırı, antrenör notu, hedef çipi, set tablosu |
| Ekrana sığan hareket | **1 tane** (6 hareketlik seansta) |
| Set satırı yüksekliği | ~112px — üç satır ekranın yarısı |
| Takvim kartı | ~350px, her ziyarette |
| Boş gösterim | `—` — veri mi boşluk mu belirsiz, geçen seferin değeri hiç görünmüyor |
| Kas rozeti | Semantik `danger` (kırmızı) dekoratif kullanılmış |

**Yap:**

**1.1 Takvim tek şeride insin.** Kart ve legend satırı kalksın; günler yatay şerit, durum küçük renk noktalarıyla. Legend'ı kaldırma ama sürekli gösterme — bir `ⓘ` ya da ilk kullanımda bir kez.

**1.2 Başlık tek satır.** `PUSH A` + altında kas grupları + sağda ilerleme (`2/6`). Skip/Postpone, gelecekleri temizle ve diğer aksiyonlar `⋯` menüsüne. Başlık asla sarmamalı.

**1.3 "Seansı bitir" alta sabitlensin.** Ekranın altında sabit çubuk: solda dinlenme sayacı, sağda `Seansı bitir · 2/6`. **En az bir set işaretlenene kadar pasif.**

**1.4 Hareketler akordeon olsun.** Sıradaki hareket açık, diğerleri tek satır: `01 · Dumbbell Bench Press · 4×6–8 · 2/4`. Bir hareket tamamlanınca otomatik kapanıp sıradaki açılsın. Hedef: **ekrana 4+ hareket sığsın.**

**1.5 Set satırı ~34px'e insin.** `# | kilo | tekrar | ✓` tek satır. Onay kutusu dokunma hedefi 44px'in altına düşmesin (padding ile çöz, yüksekliği büyüterek değil).

**1.6 Geçen seferin değeri hayalet placeholder olsun.** `—` yerine soluk `32,5` yazsın; alana dokununca temizlensin. Ayrıca hareket başlığında `geçen sefer 32,5 kg` bilgisi ve **"aynısını tekrarla"** tek dokunuşu.

**1.7 Not ve önizleme ikincil.** Antrenör notu varsayılan kapalı (`ⓘ`), GIF önizleme hareket adının yanında küçük ikon. Bunlar dikey alanı yememeli.

**1.8 Kas rozeti semantik renk kullanmasın.** `danger`/`success` yalnızca durum için. Kas grubu rozeti nötr yüzey + metin rengi olsun.

**1.9 "Önizle" hâlâ Türkçe** — İngilizce arayüzde görünüyor, `t()`'ye taşı.

---

# FAZ 2 — Karşılaştırma katmanı: veri ve gizlilik

## 2.1 Mevcut veri (doğruladım, yeni tablo gerekmiyor)

- `programs.source_program_id` — klon soyağacı, "aynı programdakiler" buradan
- `workout_sets.weight / reps / completed` + `workout_exercises.exercise_id` — dağılım
- `body_measurements.body_weight` — **göreli kıyasın ekseni**
- `user_profiles.sex / birth_date / visibility` — isteğe bağlı klasman filtresi
- `workouts.status='completed'` + `date` — güncellik ve seri

Tek şema eklemesi (yeni migration):

```sql
alter table user_profiles
  add column if not exists comparison_opt_in boolean not null default true;
```

## 2.2 Karşılaştırma değeri nasıl hesaplanır

- Bir kullanıcının bir hareketteki değeri: **son 90 gün** içindeki `completed = true` setlerin **en yüksek `weight`**'i. 90 gün sınırı şart — yoksa tablo iki yıl önce tek ağır set yapmış kişilerle dolar.
- **Göreli değer** = o ağırlık ÷ kullanıcının **en güncel** `body_weight`'i. (Basitleştirme: setin yapıldığı tarihteki kilo değil, en güncel kilo. Yeterince doğru ve çok daha ucuz — bu tercihi koda yorum olarak yaz.)
- Kilosu girilmemiş kullanıcı göreli havuza **girmez**; kendisine mutlak sekmesi gösterilir.

## 2.3 Gizlilik — pazarlık konusu değil

Bu özellik başkalarının verisini gösteriyor. Beş kural **sunucuda** uygulanacak; istemciye gönderip orada gizlemek sayılmaz.

1. `visibility = 'private'` kullanıcılar hiçbir toplulaştırmaya girmez.
2. `visibility = 'followers'` olanlar yalnızca **kendilerini takip edenlerin** gördüğü hesaba girer.
3. `comparison_opt_in = false` olanlar hiçbir hesaba girmez.
4. **k ≥ 5**: filtre uygulandıktan **sonra** havuzda 5'ten az kişi varsa yüzdelik/dağılım **gösterilmez**.
5. Yanıtta **kimsenin ham kilosu, yaşı, doğum tarihi veya vücut ağırlığı bulunmaz.** Yalnızca toplulaştırılmış sayılar (havuz boyutu, p10/p50/p90, kullanıcının kendi yüzdeliği) ve — yalnızca herkese açık profiller ile takip ettiklerin için — isimli en iyi set listesi.

## 2.4 Klasman filtresi ve guardrail'leri

Varsayılan: **herkes + göreli**, filtre kapalı. Kullanıcı isterse daraltır: sıklet, yaş aralığı, cinsiyet.

- **k kontrolü filtreden sonra.** Havuz 5'in altına düşerse filtre bir kademe genişletilsin ve **kullanıcıya söylensin**: *"Bu klasmanda yeterli veri yok — 25–44 aralığına genişletildi."* Sessizce geniş veriyi dar etiketle gösterme.
- **Karşılıklılık:** bir alana göre filtrelemek için kullanıcının o alanı **kendi profilinde doldurmuş** olması gerekir. Yaşını girmemiş biri yaşa göre süzemez.
- **En fazla iki demografik filtre birlikte** (sıklet / yaş / cinsiyet). Ölçüm ekseni (göreli–mutlak) bu sayıya dahil değil.
- Sıklet birincil, yaş ve cinsiyet ikincil sunulsun — sıklet halterin kendi kavramı ve daha az hassas.

## 2.5 Performans — bu kod tabanının zayıf noktası

Bu ekranda 6 hareket var. Hareket başına ayrı benchmark sorgusu atarsan seans açılışında 6 ağır sorgu olur; bu projede daha önce tam olarak bu kalıp sorun çıkardı.

- **Tek server function, toplu sorgu:** `getExerciseBenchmarks({ exerciseIds: number[], filters })` → hareket başına `{ pool, p10, p50, p90, myValue, myPercentile, widened? }`. Hepsi **tek sorguda** (`exercise_id = any($1)` + `percentile_cont` ile `group by exercise_id`).
- Gerekli indeksleri yeni migration'da ekle (`workout_sets(workout_exercise_id)` var; `workout_exercises(exercise_id)` ve `workouts(user_id, status, date)` kontrol et).
- Şerit **lazy** olsun: hareket kartı açıldığında yüklensin, kapalı hareketler için sorgu atma.
- Sonuçları TanStack Query ile makul bir `staleTime` ile önbelleğe al (bu veri saniyelik değişmiyor; 5 dakika uygun).
- Ölçümü yap: seans açılışında karşılaştırma yüzünden eklenen sorgu sayısı **1'i geçmesin**.

---

# FAZ 3 — Karşılaştırma arayüzü

**3.1 Hareket içi şerit.** Açık hareket kartının altında, katlanabilir:
- Başlık: `Herkes · göreli · 412 kişi` + sağda `Klasman ▾`
- Dağılım çubuğu: medyan işareti + senin konumun (vurgu renginde)
- Alt satır: `0,28×` … **`üst %22`** … `0,68×`
- Altında (varsa) takip ettiklerinin en iyi setleri: avatar + ad + değer

**3.2 Klasman sheet'i.** `AppSheet` ile: Ölçüm (Göreli / Mutlak), Sıklet, Yaş aralığı, Cinsiyet. Aktif filtre sayısı başlıkta rozet olarak. "Tümünü temizle" bağlantısı.

**3.3 Boş ve yetersiz durumlar** — bunlar sık görülecek, baştan tasarla:
- Havuz < 5: *"Henüz yeterli veri yok — bu hareketi yapan 5 kişi olunca karşılaştırma açılacak."*
- Kullanıcının kilosu yok: göreli sekmesi pasif + *"Vücut ağırlığını gir, göreli karşılaştırma açılsın"* → Ölçüler'e bağlantı.
- Kullanıcı `comparison_opt_in = false`: şerit hiç görünmesin, ayarlara bağlantı.

**3.4 Set sonrası mikro geri bildirim.** Bir set işaretlendiğinde, değer havuz medyanının üstündeyse tek satırlık sakin bir bilgi: *"Bu set, bu hareketi yapanların %78'inin üstünde."* Rekor kutlamasıyla **çakışmasın** — rekor varsa yalnızca rekor gösterilsin.

**3.5 Ayarlar.** Gizlilik bölümüne: *"Verilerim karşılaştırmalarda kullanılsın"* anahtarı (`comparison_opt_in`). Kapatınca kullanıcı hem havuzdan çıkar hem de kendi şeridini görmez — bunu açıklamada yaz.

---

# FAZ 4 — Program ve seans düzeyinde sosyal

**4.1 "Bu programda N kişi".** Program başlığında ve antrenman ekranı üstünde. `source_program_id` üzerinden aynı kaynağı klonlamış, aktif programı olan kullanıcı sayısı. Yanında takip ettiklerinin avatar sırası.

**4.2 Liste sheet'i.** Dokununca: takip ettiklerin önce, sonra herkese açık profiller. Satır: avatar + ad + `6. hafta · 12 gün seri`. Hafta `programs.valid_from`'dan, seri tamamlanmış seans tarihlerinden. Aynı gizlilik kuralları geçerli.

**4.3 "Bugün N kişi bu seansı yaptı".** Aynı program gününü bugün tamamlayanların sayısı — tek `count` sorgusu, seans başlığında sakin bir satır.

---

# Doğrulama

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Playwright 390px, program aktifken, **gerçekten bakarak**:

**Yerleşim**
- [ ] Başlık tek satır, sarmıyor; `⋯` menüsü aksiyonları taşıyor
- [ ] Ekranda **en az 4 hareket** görünüyor
- [ ] "Seansı bitir" altta sabit ve ilk set işaretlenene kadar pasif
- [ ] Boş set alanında geçen seferin değeri soluk görünüyor, dokununca temizleniyor
- [ ] Onay kutusu dokunma hedefi ≥ 44px
- [ ] Kas rozeti kırmızı değil; "Önizle" çevrilmiş

**Karşılaştırma**
- [ ] Seans açılışında karşılaştırma yüzünden **en fazla 1 ek sorgu** (ağ sekmesinden say)
- [ ] Şerit: havuz boyutu, medyan, senin yüzdeliğin görünüyor
- [ ] Klasman filtresi sonucu değiştiriyor ve havuz sayısı düşüyor
- [ ] Havuz 5'in altına düşünce yüzdelik gizleniyor ve **genişletme bildiriliyor**
- [ ] Yaşını girmemiş kullanıcı yaşa göre filtreleyemiyor
- [ ] Üçüncü demografik filtre seçilemiyor

**Gizlilik (en kritik)**
- [ ] `visibility='private'` bir kullanıcının seti hiçbir havuza girmiyor
- [ ] `comparison_opt_in=false` kullanıcı havuzda yok ve kendi şeridini görmüyor
- [ ] **Ağ yanıtında** hiçbir başka kullanıcının kilosu, yaşı, doğum tarihi veya vücut ağırlığı yok — tarayıcı ağ sekmesinden ham JSON'a bak, göz kararı yetmez

**Program düzeyi**
- [ ] "Bu programda N kişi" doğru sayıyor; liste hafta ve seri gösteriyor
- [ ] Gizli profiller listede yok

---

# Çalışma şekli

Sıra: **1 → 2 → 3 → 4.** Yerleşimi önce bitir; sosyal şerit yeni hareket kartının içine oturacak, eski 6 katmanlı kartın içine koyarsan iki kez yazarsın.

Faz 2'de şemayı ve server function'ı arayüzden önce bitir ve **gerçek veriyle** test et — birkaç test hesabı oluşturup farklı ağırlıklarla set gir, k<5 durumunu ve gizlilik kurallarını gerçekten tetikle. Boş bir veritabanında bu özellik "çalışıyor" görünür ama hiçbir şey doğrulanmamış olur.

Her fazdan sonra commit at ve ekran görüntüsü al. Bir değişiklik set kaydetme davranışını etkileyecekse önce sor.

# Salon — Mobil sosyal fitness uygulamasına dönüşüm (UI/UX)

Bu workspace'teki `salon` uygulamasını yeniden konumlandırıyoruz. Bugün: tek kullanıcılık bir antrenman defteri. Hedef: **mobil-öncelikli, sosyal, premium hissettiren bir fitness uygulaması.**

Üç yön:

1. **Sadece mobil.** Masaüstü düzeni yapma. Uygulama bir telefon uygulaması gibi davransın; büyük ekranlarda ortalanmış dar bir kolon olarak görünsün.
2. **Sosyal.** Sosyal veritabanı iskeleti (takip, herkese açık program, paylaşım kodu) zaten var ama arayüzde karşılığı yok — **birini takip edince hiçbir şey olmuyor, akış yok.** Asıl iş bu.
3. **Premium.** Şu an her yükleme durumu ortada dönen bir spinner, hiç geçiş animasyonu yok, kart kenarları görünmüyor, kişisel rekor kırınca hiçbir şey olmuyor. Bunlar düzelecek.

---

## Değiştirmeyeceğin şeyler (kırmızı çizgi)

- `src/lib/auth/server.ts`, `preview.ts`, `pglite-dialect.ts`, `popup.server.ts` — dokunma.
- `vite.config.ts` içindeki `0.0.0.0:8080` sözleşmesi ve mevcut plugin'ler.
- `startup.sh` — silme/yeniden adlandırma; başlatma yolu değişirse aynı turda güncelle.
- `migrations/0001`–`0006` — **asla düzenleme.** Yeni şema `0007_*.sql`'den itibaren yeni dosyalarda.
- Mevcut antrenman kaydetme akışı (set girme, dinlenme sayacı, program klonlama) — davranışı bozma, sadece görsel dili ve etkileşimi yükselt.
- Her adımdan sonra `npm run typecheck` ve `npm run build` yeşil kalmalı, dev server ayakta kalmalı.

## Her yeni server function için zorunlu kurallar

Yeni sosyal özellikler yeni veri erişim yolları açıyor — bunlar güvenlik açısından kritik:

- Her server function `authMiddleware` kullanacak ve her sorgu `context.userId` ile scope'lanacak.
- Her `.validator()` **zod şeması** olacak, kimlik fonksiyonu (`(d) => d`) yazma.
- **Gizlilik sunucuda uygulanacak, istemcide değil.** Bir kullanıcının profili/aktivitesi `visibility` ayarına göre filtrelenecek; istemciye gönderilip orada gizlenmeyecek.
- Çok adımlı yazma işlemleri transaction içinde olacak.
- Kullanıcı metni (bio, yorum) her zaman React ile render edilecek — `dangerouslySetInnerHTML` kullanma.
- Yorum ve bio alanlarına uzunluk sınırı + oran sınırlaması (rate limit) koy.

## Dil kuralı (tüm fazlar boyunca geçerli)

`src/lib/i18n/messages.ts` şu an **7 dil** içeriyor ama de/es/fr/ru/az'ın **%65-67'si çevrilmemiş** — sadece İngilizce kopyalar. Üstelik `t()` kullanmayan sayfalar her dilde Türkçe kalıyor.

- **Dil listesini `tr` ve `en` olarak ikiye indir**, diğer 5 dili sil.
- Yazdığın **her yeni** kullanıcı metni `t()` üzerinden geçecek, hem tr hem en karşılığıyla.
- Dokunduğun her eski dosyadaki sabit metinleri de `t()`'ye taşı. Öncelik: `login.tsx`, `register.tsx`, `index.tsx`, `olculer.tsx`, `u.$userId.tsx`, `modals.tsx` — hepsi şu an sıfıra yakın `t()` kullanıyor.
- **Sunucu hata mesajları da sabit Türkçe** (`"Antrenman bulunamadı."`). Bunları kod taşıyan hatalar haline getir (`throw new AppError("workout.not_found")`), çeviriyi istemcide yap.

---

# FAZ 0 — Zemin (önce bu, tek turda biter)

## 0.1 Kabuğu mobile kilitle

Masaüstünde şu an içerik `max-w-2xl`'de ortalanmış ama alt tab bar tüm genişliği kaplıyor ve ekranın ortasında yüzen bir çubuk gibi duruyor.

- `src/components/layout/app-shell.tsx`: tüm kabuğu (header + main + nav) **tek bir `max-w-[480px]` kolona** al, ortala.
- Alt navigasyon bu kolonun içinde kalsın, `position: fixed` ama `left/right` yerine kolonun genişliğiyle hizalı.
- Geniş ekranda kolonun iki yanına hafif bir ayırıcı ver ki "çerçeveli telefon" gibi dursun.
- `resp-desktop-dash.png`'deki kırık görüntü kalmayacak. Masaüstü için ayrı düzen **yapma** — sadece bozuk görünmesin.

## 0.2 Renk token'larını düzelt (ölçülmüş değerler)

`src/styles.css` `@theme` bloğu. Mevcut kontrast oranlarını ölçtüm:

| Token | Mevcut | surface üzerinde | Durum |
|---|---|---|---|
| `--color-dim` | `#6b6b78` | **3.50:1** | ❌ WCAG AA (4.5) kalıyor |
| `--color-line` | `#2a2a34` | **1.29:1** | ❌ çok soluk, kart kenarları görünmüyor |

**Yap:**
- `--color-dim`: `#6b6b78` → **`#8a8a99`** (surface üzerinde 5.40:1, surface2 üzerinde 4.98:1 — ikisi de AA geçer).
- Kenarlıklar için **iki ayrı token** kullan, çünkü koyu temada tek bir değer iki işi birden göremiyor:
  - `--color-line: #33333f` — dekoratif kart ayırıcıları. (1.47:1; WCAG bunu zorunlu tutmuyor çünkü bir kontrolü tanımlamıyor, ama mevcut 1.29'dan görünür şekilde iyi.)
  - `--color-line-strong: #62626d` — **etkileşimli kontrollerin** kenarlığı: input, textarea, checkbox, segmented control, seçili olmayan butonlar. Ölçtüm: surface üzerinde **3.05:1**, WCAG 1.4.11'i geçen en koyu değer. Daha koyusu geçmiyor, bu yüzden bunu kullan.
- **Kart ayrımını kenarlığa yükleme.** Koyu temada asıl derinlik gölgeden ve üst kenardaki ince ışık çizgisinden gelir (ölçtüm: yüzey tonları arasındaki en geniş fark bile sadece 1.1:1 — tek başına algılanmıyor). Bkz. 1.1.
- Sarı/yeşil/kırmızı/mavi vurgu renkleri ve `text`/`muted` zaten AA geçiyor, **onlara dokunma**.

## 0.3 `:focus-visible` ekle

Şu an uygulamada **hiç focus stili yok** — klavyeyle gezinmek imkânsız. `styles.css`'e global bir `:focus-visible` halkası ekle (sarı, 2px, 2px offset), `:focus` için değil `:focus-visible` için.

## 0.4 Görünen bug'ları düzelt

- **Gün kısaltmaları çakışıyor.** `src/routes/program.tsx:330` ve `src/components/discover-panel.tsx:370` → `DOW_LABELS[dow]?.slice(0, 3)`. Bu yüzden Pazartesi→"Paz" ve Pazar→"Paz", Cuma→"Cum" ve Cumartesi→"Cum" aynı çıkıyor. `src/data/library.ts`'e ayrı bir `DOW_SHORT` haritası ekle: `{1:"Pt", 2:"Sa", 3:"Ça", 4:"Pe", 5:"Cu", 6:"Ct", 7:"Pz"}` — takvim başlığı zaten bu kısaltmaları kullanıyor, tutarlı olsun.
- **Bozuk başlık.** `src/routes/profil.tsx:351` → `title={\`· (${followers.length})\`}` — çeviri anahtarı unutulmuş, ekranda düz "· (0)" görünüyor. `t("profile.followers")` olacak.
- **"Son antrenmanlar" geleceği gösteriyor.** `src/lib/server/dashboard.ts:160-163` sorgusunda status filtresi yok ve `order by w.date desc` — planlayıcı 4 hafta ileriye seans oluşturduğu için kart gelecekteki planlı seansları listeliyor. `and w.status = 'completed'` ekle (`social.ts`'teki aynı sorgu bunu doğru yapıyor, oradan bak).
- **Toast header'ı örtüyor.** `src/routes/__root.tsx:54` → `position="top-center"`, sticky başlığın üstüne biniyor. `bottom-center`'a al ve alt navigasyonun üstünde kalacak şekilde offset ver.
- **Atlanan seansta çıkmaz.** Bir gün "Atlandı" olduğunda tek eylem yeşil "Bitir" butonu, geri alma yok; arayüz kullanıcıya metin içinde "takvimden başka bir güne geçip yeniden seç" diyor. Net bir **"Atlamayı geri al"** butonu koy, o yönlendirme metnini kaldır.
- **Native `<select>` ×7** (`modals.tsx` 6 yerde, `index.tsx:171`) — koyu temada işletim sisteminin beyaz açılır listesi çıkıyor, tema kırılıyor. Faz 1'de bottom sheet picker'a geçecekler; şimdilik en azından `@radix-ui/react-select` ile değiştir (paket zaten kurulu).

---

# FAZ 1 — Tasarım sistemi (sonraki her ekran bu dille yazılacak)

## 1.1 Derinlik sistemi

Koyu temada derinlik **gölge + üst kenar ışığı** ile kurulur, dolgu farkıyla değil.

- Üç kademeli yüzey: `surface` (kartlar) → `surface2` (kart içi bölmeler) → yeni `--color-elevated` (bottom sheet, açılır menü, öne çıkan kart).
- Yükseltilmiş her yüzeye: yumuşak dış gölge + `inset 0 1px 0 rgba(255,255,255,0.06)` üst ışık çizgisi.
- `--shadow-card`, `--shadow-sheet`, `--shadow-fab` token'ları tanımla, gölgeyi elle yazma.
- Öne çıkan kartlarda (rekor, sıradaki antrenman) çok hafif bir sarı gradyan kabul edilebilir — abartma, her karta koyma.

## 1.2 Hareket

Şu an sıfır geçiş var.

- Sayfa geçişlerinde View Transitions API (destek yoksa sessizce atla).
- Liste öğelerinde kademeli giriş (stagger), öğe başına ~30ms.
- Sayı sayaçlarında (tonaj, seri, takipçi) roll-up animasyonu.
- Set tamamlandığında spring geri bildirimi; basılan butonlarda `active:scale-95` zaten var, tutarlı uygula.
- `@media (prefers-reduced-motion: reduce)` bloğu `styles.css`'te zaten var — **yeni animasyonların hepsi bu kurala uymalı.**

## 1.3 Skeleton yükleme

Uygulamada **her** yükleme durumu ortada dönen bir `<Loader2 className="animate-spin">` — en ucuz çözüm ve premium hissi en çok baltalayan şey.

- İçeriğin şeklini taklit eden skeleton bileşenleri yaz. `src/components/layout/app-shell.tsx`'teki `AuthGateSkeleton` doğru deseni zaten kuruyor, yaygınlaştır.
- Her liste/kart için bir skeleton varyantı: akış kartı, profil başlığı, program kartı, antrenman kartı.
- Spinner sadece buton içi "kaydediliyor" durumunda kalsın.

## 1.4 Bottom sheet

Merkez modal yerine alttan açılan sheet — mobilde yerli his. **`vaul` paketi zaten kurulu ve hiç kullanılmamış**, tam bu iş için.

- `src/components/ui/sheet.tsx` oluştur: sürüklenebilir tutamaç, momentum, arka planda hafif ölçekleme, safe-area desteği.
- `src/components/program/modals.tsx`'teki (2032 satır, 8+ modal) tüm modalleri buna geçir ve **her modalı kendi dosyasına ayır**. Bu dosya bu haliyle sürdürülebilir değil.
- Mevcut `Modal` bileşeninin (`modals.tsx:1054`) erişilebilirliği yok: `role="dialog"` yok, `aria-modal` yok, focus trap yok, **Escape çalışmıyor**, arka plan scroll kilidi yok. `vaul` bunları hazır veriyor — elle çözmeye çalışma.
- Tüm seçiciler (yük etiketi, gün, kas grubu) native `<select>` yerine sheet picker olsun.

## 1.5 Boş durumlar

Şu an tek satır gri metin ("Henüz kayıt yok"). Her boş durum: küçük illüstrasyon/ikon + tek cümle açıklama + **tek net CTA butonu**. Kullanıcı hiçbir boş ekranda "şimdi ne yapacağım?" diye kalmasın.

---

# FAZ 2 — Sosyal profil

## 2.1 Kullanıcı adı, bio, avatar, gizlilik

Yeni migration `0007_user_profiles.sql`:

```sql
create table if not exists user_profiles (
  user_id     text primary key,
  username    text not null,
  bio         text,
  avatar_url  text,
  visibility  text not null default 'public',  -- public | followers | private
  unit_system text not null default 'metric',  -- metric | imperial
  time_zone   text not null default 'Europe/Istanbul',
  created_at  timestamptz not null default now()
);
create unique index if not exists user_profiles_username_lower_uidx
  on user_profiles (lower(username));
```

- **Kullanıcı adı:** 3–20 karakter, `[a-z0-9_]`, büyük/küçük harf duyarsız benzersiz. Rezerve kelime listesi tut (`admin`, `salon`, `api`, `u`, `login`…).
- **Mevcut kullanıcılara geri doldurma:** ad/e-postadan türet, normalize et, çakışırsa sayı ekle. İlk girişte kullanıcıya "kullanıcı adını onayla/değiştir" ekranı göster.
- **URL'ler kullanıcı adına geçsin:** `/u/$userId` → `/u/$username`. Şu an URL'de ham veritabanı id'si var (`/u/abc123-def...`) — sosyal bir uygulamada kabul edilemez. Eski id tabanlı URL'ler kullanıcı adına yönlendirsin.
- **Avatar yükleme.** Şu an sadece OAuth görseli ya da baş harfler var. Yükleme + kırpma + boyut sınırı (≤2MB, jpeg/png/webp).
- **Bio:** ≤160 karakter, düz metin.
- **Gizlilik:** `public` (herkes görür) / `followers` (sadece takipçiler) / `private` (sadece kendisi). **Sunucuda uygula** — `getUserProfile` ve akış sorguları bu ayara uymalı.

## 2.2 Profil ekranını yeniden kur

`src/routes/profil.tsx` ve `src/routes/u.$userId.tsx` aynı bileşeni paylaşsın (kendi profili / başkasının profili farkı bir prop olsun). Şu an ikisi ayrı ayrı yazılmış ve `u.$userId.tsx`'te **hiç `t()` yok**.

Düzen:
- **Kapak alanı** — mevcut sarı gradyan iyi, koru.
- **Antrenman ısı haritası** — son 6 ayın günlük antrenman yoğunluğu (GitHub katkı grafiği gibi). Hem premium duruyor, hem sosyal kanıt, hem paylaşılabilir görsel. Kapağın altına yerleştir.
- **Kimlik satırı** — avatar, görünen ad, `@kullaniciadi`, bio.
- **Sayaçlar** — Takipçi / Takip / Antrenman. Hepsi **tıklanabilir**, listeye açılsın.
- **Sekmeler:**
  - **Aktivite** — o kullanıcının akış olayları (Faz 3)
  - **Programlar** — yayınladığı programlar, kopyalanma sayısıyla, doğrudan "Kopyala" butonuyla
  - **İstatistik** — rekorlar, hacim grafiği ve **ölçüler**
- **Ölçüler'i buraya taşı.** Şu an `/olculer` rotasına **sadece** `profil.tsx:229`'daki tek bir linkten ulaşılıyor; alt menüden çıkarılmış, `messages.ts`'te `nav.measurements` anahtarı yetim kalmış. Vücut ölçüleri sosyal profilin doğal parçası — İstatistik sekmesine al. Rota kalabilir ama ana giriş noktası profil olsun. Ölçüler varsayılan olarak **sadece kendine görünür**, isteğe bağlı paylaşılabilir.

## 2.3 Takip etkileşimini düzelt

`src/routes/kesfet.tsx:148-155` — takip butonunun etiketi şu an takipteyken **`"—"`**, değilken **`"+"`**. Tek karakter, hiçbir şey anlatmıyor. Takipçi sayısı da etiketsiz çıplak bir rakam.

- Buton: **"Takip et"** / **"Takipte"** (basılı tutunca veya üzerine gelince "Takibi bırak").
- Takipten çıkarken onay iste.
- **Optimistic güncelleme** — şu an her takip işleminden sonra tüm arama yeniden çalıştırılıyor (`setResults(await searchUsers(...))`). Anında güncelle, hata olursa geri al.
- Karşılıklı takipte "Seni de takip ediyor" rozeti.
- Tüm sayaçlara etiket ("128 takipçi", çıplak "128" değil).

---

# FAZ 3 — Akış (en büyük iş)

**Bu, sosyal hissin merkezi.** Şu an birini takip etmenin hiçbir görünür sonucu yok.

## 3.1 Şema — `0008_activity.sql`

```sql
create table if not exists activity_events (
  id         bigserial primary key,
  user_id    text not null,
  type       text not null,   -- workout_completed | personal_record | program_published | streak_milestone
  subject_id bigint,          -- workout id / program id
  payload    jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists activity_user_created_idx on activity_events (user_id, created_at desc);
create index if not exists activity_created_idx      on activity_events (created_at desc);

create table if not exists activity_likes (
  event_id   bigint not null references activity_events(id) on delete cascade,
  user_id    text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists activity_comments (
  id         bigserial primary key,
  event_id   bigint not null references activity_events(id) on delete cascade,
  user_id    text not null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists activity_comments_event_idx on activity_comments (event_id, created_at);
```

`payload`'a kartı çizmek için gereken **anlık görüntüyü** yaz (gün adı, tonaj, hareket sayısı, kas grupları / rekor hareketi ve ağırlığı). Böylece akış sorgusu antrenman tablolarına join atmak zorunda kalmaz ve geçmiş olay, kaynak veri sonradan değişse bile doğru kalır.

## 3.2 Olay üretimi

- **Antrenman tamamlandı** — `updateWorkout` status'ü `completed` yaptığında ve `updateWorkoutSet` son seti tamamladığında (`workouts.ts:386` civarı, iki giriş noktası da var, ikisinden de üret). Aynı antrenman için **tek olay** üret (idempotent ol).
- **Kişisel rekor** — bir set kaydedilirken o hareketteki önceki en yüksek ağırlık aşıldığında.
- **Program yayınlandı** — `publishProgram` `is_public: true` yaptığında.
- **Seri kilometre taşı** — 4, 8, 12, 26, 52 hafta.

Olay üretimi ilgili mutasyonla **aynı transaction içinde** olsun.

## 3.3 Akış sorgusu

`getFeed({ cursor, limit })` — takip ettiklerinin + kendi olayların, `created_at desc`, **cursor tabanlı sayfalama** (offset değil).

Her satır: olay + yazarın profili (ad, kullanıcı adı, avatar) + beğeni sayısı + yorum sayısı + **görüntüleyenin beğenip beğenmediği**. Bunları tek sorguda topla, satır başına ek sorgu atma — kod tabanında zaten ciddi bir N+1 sorunu var, akışta tekrarlama.

**Gizlilik sunucuda:** `visibility = 'private'` olanların olayları hiç kimseye, `'followers'` olanlarınki sadece takipçilere gitsin.

## 3.4 Akış arayüzü — yeni ana ekran

`/` rotası istatistik panosundan akışa dönüşsün. (Mevcut panel içeriği — grafikler, rekorlar, kas dağılımı — profilin **İstatistik** sekmesine taşınsın, silme.)

- **Kart tipleri** her olay türü için ayrı görsel dil; rekor kartı en vurgulusu.
- Her kartta: yazar satırı (avatar + ad + @kullanıcıadı + göreli zaman), içerik, **beğen / yorum / paylaş**.
- Beğeni **optimistic** + haptik.
- Yorumlar bottom sheet'te açılsın, canlı sayaçla.
- **Sonsuz kaydırma** (`useInfiniteQuery`), skeleton ile.
- **Aşağı çekip yenile** (pull-to-refresh).
- **Boş akış** (kimseyi takip etmiyor): "önerilen sporcular" (en çok takip edilenler / programı en çok kopyalananlar) + katalog programları. Kullanıcı asla boş ekran görmesin.
- Kendi kartında silme seçeneği; başkasınınkinde bildirme (report).

---

# FAZ 4 — Keşif ve arama

## 4.1 Birleşik arama

FAB'ı koru, içeriğini değiştir: **tek arama alanı** — kişi + program + hareket, sonuçlar gruplanmış başlıklar altında. Şu anki "Programlar / Kişiler" sekme ayrımını kaldır.

## 4.2 Canlı arama

Şu an manuel submit (`kesfet.tsx:36` `doSearch()`, Enter'a veya butona basmak gerekiyor). **250ms debounce ile yazarken ara.** Yarış koşullarını önle (son isteği kazandır).

**Ayrıca:** arama placeholder'ı şu an kelimenin tam anlamıyla `"…"` (`kesfet.tsx:100`) — gerçek bir metin yaz.

Boş durumda: son aramalar + önerilen aramalar.

## 4.3 Keşfet'i içerik sayfası yap

Düz katalog listesi yerine bölümler:
- "Öne çıkanlar"
- "Bu hafta en çok kopyalananlar"
- "Takip ettiklerinin yayınladıkları"
- "Seviyene uygun"

Yatay kaydırmalı raflar kullan. **Kaydırılabilir her şeritte sağ kenarda gradyan ipucu olsun** — şu an gün/seans çip şeritleri sağda kesiliyor ve kaydırılabildiği anlaşılmıyor (`qa-similar-edit.png`'de görünüyor).

## 4.4 Filtreler

Gün sayısı, seviye, hedef (güç / hipertrofi / kilo verme), ekipman. `programs.tags` alanı zaten var ve kullanılmıyor — normalize et ve filtrelerin kaynağı yap.

---

# FAZ 5 — Cila

## 5.1 Kişisel rekor anı

Kullanıcı rekor kırdığında şu an **hiçbir şey olmuyor.** Fitness uygulamasının duygusal zirvesi burası.
- Tam ekran kutlama: konfeti, hareket adı, yeni ağırlık, önceki rekorla farkı.
- `prefers-reduced-motion` açıksa sade bir kutlama kartı göster.
- İki buton: **"Paylaş"** (akışa düşer + görsel kart üretir) ve "Devam et".

## 5.2 Paylaşılabilir görsel kart

Antrenman özetini / rekoru **1080×1920** dikey görsele çevir (Instagram story formatı): uygulama markası, kullanıcı adı, rakamlar, tarih. Web Share API ile paylaş, desteklenmiyorsa indir. Büyüme döngüsünün motoru bu.

## 5.3 Haptik

`navigator.vibrate()`: set tamamlama (kısa), rekor (desenli), beğeni (çok kısa), takip. Ayarlardan kapatılabilir olsun.

## 5.4 Antrenman ekranı düzeltmeleri

`final-workout-filled.png`'den:
- Hedef tekrar aralığı ("8-10") şu an input gibi görünüyor — değer mi ipucu mu belirsiz. Görsel olarak ayır (hedef bir etiket, girilen değer bir input).
- Boş değer gösterimini birleştir — bazı yerlerde `—`, bazılarında boş input var.
- **Takvimdeki nokta/halka durum göstergelerinin açıklaması (legend) yok** — dolu daire, boş halka, nokta neyi anlatıyor belli değil. Küçük bir legend ekle veya göstergeleri kendiliğinden anlaşılır yap.
- Egzersiz kartındaki iki dikey sıralama oku çok yer kaplıyor — sürükle-bırak sıralamaya geçir.
- Silme butonu (kırmızı çöp kutusu) "Düzenle"nin hemen yanında ve onay akışı yok — onay ekle veya geri alınabilir yap.

## 5.5 Ayarlar

Mevcut ayarlar ekranı tasarım olarak uygulamanın en iyisi — **desenini koru**, şunları ekle:
- Birim sistemi (kg / lb) — `user_profiles.unit_system` alanı hazır
- Saat dilimi — `user_profiles.time_zone` alanı hazır, ilk girişte `Intl.DateTimeFormat().resolvedOptions().timeZone` ile doldur
- Gizlilik (profil görünürlüğü)
- Bildirim tercihleri
- Haptik açık/kapalı
- Veri dışa aktarma
- **Hesap silme** — KVKK/GDPR gereği zorunlu, şu an yok
- **Şifre sıfırlama** — `login.tsx`'te "Şifremi unuttum" linki bile yok

---

# Doğrulama

Her fazın sonunda:

```bash
npm run typecheck                                   # 0 hata
npm run lint                                        # 0 hata
npm run build                                       # başarılı
```

Playwright ile kendin ekran görüntüsü al ve **gerçekten bak** (390px genişlik, mobil viewport):
- Akış: dolu hâli, boş hâli, yükleme (skeleton) hâli
- Profil: kendi profilin, başkasının profili, gizli profil
- Arama: yazarken canlı sonuçlar
- Rekor kutlaması
- Bir bottom sheet açık hâlde
- 1280px masaüstü: kabuk ortalanmış ve **bozuk görünmüyor**

Elle kontrol listesi:
- [ ] Dili EN yap → **hiçbir ekranda Türkçe sabit metin kalmadı** (özellikle login, kayıt, profil, keşfet)
- [ ] Klavyeyle baştan sona gezin → her etkileşimli öğede görünür focus halkası var
- [ ] İki hesap aç, biri diğerini takip etsin → antrenman tamamla → **akışta göründü mü?**
- [ ] Gizliliği `private` yap → diğer hesap artık aktiviteyi göremiyor
- [ ] Hiç native `<select>` açılır listesi kalmadı
- [ ] Ortada dönen spinner kalmadı (buton içi hariç), hepsi skeleton
- [ ] Pazartesi/Pazar ve Cuma/Cumartesi kısaltmaları artık ayırt ediliyor

---

# Çalışma şekli

- Fazları **sırayla** yap: 0 → 1 → 2 → 3 → 4 → 5. Faz 0 ve 1 zemin; onlar bitmeden sosyal ekranlara başlama, yoksa her şeyi iki kez yazarsın.
- Her fazın sonunda commit at ve doğrulama komutlarını çalıştır.
- Faz 3 (akış) en büyük parça — şemayı ve server function'ları arayüzden **önce** bitir ve gerçek veriyle test et.
- Mevcut antrenman kaydetme akışının davranışını bozma; sadece görsel dilini ve etkileşimini yükselt.
- Bir değişikliğin mevcut davranışı bozacağını düşünüyorsan önce sor, körlemesine değiştirme.
- Emin olmadığın yerde mevcut davranışı koru.

# Salon — İlk giriş akışı (onboarding)

Yeni üye olan kullanıcı için **bir kereye mahsus** bir karşılama akışı. Amacı: uygulamayı tanıtmak, eksik bilgileri toplamak ve kullanıcıyı ilk antrenmanına kadar götürmek.

Bugün yeni kullanıcı kayıt olduktan sonra doğrudan boş bir akışa düşüyor: program yok, vücut ağırlığı yok, tema seçilmemiş. Her ekranda "No program selected" görüyor ve ne yapacağını bilmiyor.

## Kırmızı çizgiler

- `src/lib/auth/server.ts`, `preview.ts`, `pglite-dialect.ts`, `popup.server.ts` — dokunma.
- `vite.config.ts`'te `0.0.0.0:8080` sözleşmesi ve plugin'ler.
- `migrations/0001`–`0015` — düzenleme; `0016_*.sql`'den itibaren yeni dosya.
- Mevcut kayıt formunu **şişirme** — aşağıda hangi alanların zaten toplandığı yazıyor.
- Yeni server function: `authMiddleware` + `context.userId` scope + zod (`v(schema)` / `noInput`) + çok adımlıda `withTransaction`.
- Bitince `npm run typecheck && npm run lint && npm run test && npm run build` yeşil.

---

## 1. Neyi zaten biliyoruz — tekrar sorma

Kayıt formu (`src/routes/register.tsx`) bunları **zaten topluyor**: ad, kullanıcı adı, e-posta, şifre, doğum tarihi, cinsiyet, boy.

Sistem bunları **zaten tahmin edebiliyor**: dil (`navigator.language`), saat dilimi (`Intl.DateTimeFormat().resolvedOptions().timeZone`).

Gerçekten eksik olanlar: **vücut ağırlığı**, **tema + vurgu rengi**, **ilk program**.

**Kural: onboarding yalnızca boş olanı sorar.** E-posta ile kaydolan kullanıcıda doğum tarihi zaten dolu — o adım atlanır. OAuth ile gelen kullanıcıda dolu değil — sorulur. Her adım başında ilgili alan doluysa adımı geç.

## 2. Akışın şekli

Beş adım, ama kullanıcı en fazla dördünü görür. Üstte ince ilerleme çizgisi, altta tek birincil buton.

**Adım 1 — Karşılama (bilgilendirme, 1 ekran)**
Üç kısa değer önermesi: *Kaydet · Karşılaştır · Takip et*. Uzun metin yok, her biri tek satır + ikon. Tek buton: "Başla". Bu adım **atlanabilir değil ama tek dokunuş** — tanıtım havası burada kurulur.

**Adım 2 — Vücut ağırlığı (zorunlu)**
Tek sayı alanı + birim seçimi (kg / lb). Neden istendiği tek satırla açıklanır: *"Göreli sıralamalarda kendini adil şekilde karşılaştırabilmen için."*
- `body_measurements`'a bugünün tarihiyle yazılır (tablo ve `saveMeasurement` zaten var).
- Birim seçimi `user_profiles.unit_system`'e yazılır.
- **Atlanamaz** ama makul sınır dışında değer kabul edilmez (zod: 20–400 kg).

**Adım 3 — Görünüm (zorunlu ama zevkli)**
Tema seçimi: **Obsidian / Carbon**, iki küçük canlı önizleme kartı olarak. Seçilen temanın vurgu renkleri hemen altında nokta olarak çıkar (Obsidian → Pirinç/Bakır/Kemik, Carbon → yedi sinyal rengi). Seçim **anında tüm ekrana uygulanır** — bu adım bir form değil, bir deneyim anı olmalı.
`user_profiles.theme` ve `accent` alanlarına yazılır (şema zaten var, `settings.ts`'te şemalar tanımlı).

**Adım 4 — Dil ve saat dilimi (onay, ayrı adım değil)**
Adım 3'ün altında tek satır: *"Türkçe · Europe/Istanbul"* + yanında `Değiştir`. Doğruysa kullanıcı hiçbir şey yapmaz. **Ayrı bir adım olarak sorma** — otomatik algılama zaten çalışıyor, iki ekran harcamaya değmez. `Değiştir` dokunulursa sheet açılır.

**Adım 5 — İlk program (asıl aktivasyon)**
Kataloğun tamamı değil, **3–4 öneri** göster. Öneriler kullanıcının profilinden türetilsin: haftada kaç gün antrenman yapmak istediğini soran tek bir çip satırı (*2 · 3 · 4 · 5 · 6 gün*) ve seçime göre filtrelenmiş program listesi.
- Satırlar Keşfet'teki `ProgramRow` bileşeninin aynısı olsun — yeni bir liste stili icat etme.
- Programa dokununca mevcut **detay sheet'i + "Başla"** akışı çalışsın (`cloneProgram` zaten başlangıç tarihi ve ilk seans seçimi yapıyor).
- Altta ikincil bağlantı: `Tümünü gör` → Keşfet. Kullanıcı isterse kaçabilsin ama varsayılan yol program seçmek olsun.
- Program seçilmeden bitirilebilir olmalı **ama** o zaman kapanış ekranı "Program seçmeden devam et" uyarısıyla çıksın.

**Kapanış — "Hazırsın"**
Kısa kutlama + ne yapacağını söyleyen tek cümle. Buton: **"İlk antrenmanına git"** → program seçildiyse `/antrenman`'da ilk seans gününe, seçilmediyse Keşfet'e.

## 3. Bir kere gösterme — bunu doğru yap

Bu daha önce kullanıcı adı sheet'inde ters gitti: kapatılamayan bir sheet her açılışta geri geldi. Aynı hataya düşme.

Yeni migration:

```sql
alter table user_profiles
  add column if not exists onboarded_at timestamptz;
```

- Kayıt anında `null` kalır. Akış tamamlanınca (veya kullanıcı bilinçli çıkınca) `now()` yazılır.
- **Yönlendirme:** `onboarded_at is null` olan giriş yapmış kullanıcı, korumalı herhangi bir rotaya girdiğinde `/hosgeldin`'e yönlendirilir. `onboarded_at` doluysa `/hosgeldin` açılmaz, ana ekrana atar.
- **Yarıda bırakma:** kullanıcı çıkarsa ilerleme kaybolmasın — her adım tamamlandığında verisi anında kaydedilsin (adımlar zaten ayrı alanlara yazıyor). Geri dönünce kaldığı adımdan devam etsin.
- **Kaçış yolu:** başlıkta sağ üstte `Şimdilik geç` bağlantısı olsun. Basıldığında `onboarded_at` yazılır ve akış bir daha açılmaz — ama uygulama içinde eksik adımlar için sakin hatırlatıcılar kalır (örn. akışta "Vücut ağırlığını gir" satırı).
- `user_onboarding` tablosu (`0002`'de var) tohumlama için kullanılıyor, **bununla karıştırma** — yeni bayrak `user_profiles.onboarded_at`.

## 4. Yerleşim ve stil kuralları

- Rota `/hosgeldin`. Alt navigasyon ve üst uygulama başlığı **görünmesin** — tam ekran, odaklı akış.
- Her adım: üstte ince ilerleme çizgisi (5 değil, gösterilecek adım sayısı kadar), ortada içerik, altta sabit tek birincil buton.
- Buton metni her adımda ne olacağını söylesin: "Başla", "Devam", "Programı seç", "İlk antrenmanına git" — hepsinde "İleri" yazma.
- Geri gitme mümkün olsun (sol üstte ok), ama son adımdan sonra geri dönülmesin.
- Dokunma hedefleri ≥44px. Adım geçişlerinde `prefers-reduced-motion`'a uy.
- Tüm metinler `t()` üzerinden, hem `tr` hem `en`.
- Klavye açıldığında (ağırlık adımı) buton klavyenin üstünde kalsın, içerik kaymasın.

## 5. Yeni kullanıcı için veri boşluğu

Onboarding bittiğinde kullanıcının hâlâ **sıfır antrenmanı** var, yani akış boş, profil boş, karşılaştırma havuzu yok. Bunu kabullen ve boş durumları buna göre yaz:
- Akış: "İlk antrenmanını tamamla, kartın burada görünsün" + sıradaki seansa bağlantı.
- Karşılaştırma şeridi: veri yokken sessizce gizlensin, sayı gösterme.
- Profil ısı haritası: tek satırlık teşvik metni (zaten böyle).

---

## Doğrulama

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Playwright 390px, **yeni bir hesapla**:

- [ ] Kayıt ol → otomatik `/hosgeldin`'e yönleniyor
- [ ] Vücut ağırlığı girmeden ilerlenemiyor; geçersiz değer (5 kg, 900 kg) reddediliyor
- [ ] Tema seçimi **anında** tüm ekrana uygulanıyor; vurgu renkleri temaya göre değişiyor
- [ ] Dil ve saat dilimi otomatik doğru geliyor, ayrı adım olarak sorulmuyor
- [ ] Gün sayısı çipi seçilince program önerileri **gerçekten değişiyor**
- [ ] Program seçilince `cloneProgram` çalışıyor ve takvim doluyor
- [ ] Bitirince `/antrenman`'da ilk seans günü açılıyor
- [ ] **Akış bir daha açılmıyor** — çıkış yap, tekrar gir, `/hosgeldin`'e elle git: ana ekrana atıyor
- [ ] Yarıda bırak (üçüncü adımda çık) → tekrar girince kaldığı adımdan devam ediyor, önceki adımların verisi duruyor
- [ ] `Şimdilik geç` ile çıkan kullanıcı bir daha akışı görmüyor
- [ ] Alt navigasyon ve uygulama başlığı akış boyunca görünmüyor
- [ ] Türkçe ve İngilizce'de tüm metinler çevrili

## Çalışma şekli

Önce şema + yönlendirme mantığını (madde 3) kur ve **bir kere gösterme** davranışını doğrula — bu akışın en kritik parçası, yanlış olursa kullanıcı her açılışta duvara çarpar. Sonra adımları sırayla ekle. Her adımdan sonra commit at ve yeni bir test hesabıyla baştan dene.

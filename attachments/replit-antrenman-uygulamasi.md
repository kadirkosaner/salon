# ANTRENMAN TAKİP UYGULAMASI — Replit Yapım Dosyası

Bu dosya iki işe yarıyor: aşağıdaki **Faz promptlarını** sırayla Replit Agent'a
yapıştırırsın, aradaki bölümler de neyin neden öyle olduğunu anlatır.

**Yöntem:** Fazları tek tek ver. Her fazın sonunda çalışıp çalışmadığını kontrol et,
sonra bir sonrakine geç. Hepsini tek promptta verirsen Agent yarısını atlar.

---

## MİMARİ

| Katman | Seçim | Neden |
|---|---|---|
| Frontend | React + Vite + TypeScript | Replit şablonu hazır geliyor |
| Backend | Node + Express | Aynı dilde kalıyorsun, Agent bunu iyi yazıyor |
| Veritabanı | PostgreSQL (Replit'in kendi DB'si) | İlişkisel veri, geçmiş sorguları için şart |
| ORM | Drizzle | Replit Agent'ın varsayılanı, migration'ları temiz |
| Oturum | express-session + connect-pg-simple, bcrypt | Basit ve yeterli, JWT karmaşasına gerek yok |

---

## KRİTİK TASARIM KARARI — bunu atlarsan sonra her şeyi bozar

Program değiştiğinde **geçmiş kayıtlar bozulmamalı.**

Örnek: Ocak ayında Lat Pulldown'ı 3×8-10 yapıyordun. Mart'ta programı değiştirip
4×10-12 yaptın. Ocak'taki kaydına baktığında "3×8-10 hedefi" görmen lazım,
"4×10-12" değil.

Çözüm: **antrenman kaydı oluşturulurken o günkü hedefler kaydın içine kopyalanır.**
`workout_sets` tablosu program tablosuna referansla değil, o anki değerlerin
kopyasıyla çalışır. Buna "snapshot" deniyor.

Aynı mantık program versiyonlaması için de geçerli: programı düzenlediğinde eski
program silinmez, `valid_from` / `valid_to` tarihleriyle arşivlenir.

---

## FAZ 1 — Temel, veritabanı, giriş

```
Bir antrenman takip uygulaması yapıyoruz. Bu ilk aşama: veritabanı şeması,
kullanıcı kaydı ve giriş. Arayüz Türkçe.

STACK: React + Vite + TypeScript (frontend), Express (backend),
PostgreSQL + Drizzle ORM, express-session + connect-pg-simple oturum yönetimi,
bcrypt ile şifre hashleme.

## VERİTABANI ŞEMASI

users
  id serial pk
  email text unique not null
  password_hash text not null
  name text not null
  created_at timestamptz default now()

exercises            -- hareket kütüphanesi
  id serial pk
  owner_id int null references users(id)   -- null = herkese açık hareket
  name text not null
  detail text null                          -- "geniş tutuş" gibi
  unit text default 'kg'                    -- 'kg' | 'm' (taşıma hareketleri)
  default_note text null
  created_at timestamptz default now()

programs
  id serial pk
  user_id int not null references users(id)
  name text not null
  is_active boolean default true
  valid_from date not null default current_date
  valid_to date null                        -- null = hâlâ geçerli
  created_at timestamptz default now()

program_days
  id serial pk
  program_id int not null references programs(id) on delete cascade
  dow smallint not null                     -- 1=Pzt ... 7=Paz
  name text not null                        -- "PUSH A"
  focus text null                           -- "Göğüs · Omuz · Triceps"
  sort smallint default 0

program_exercises
  id serial pk
  program_day_id int not null references program_days(id) on delete cascade
  exercise_id int not null references exercises(id)
  sets smallint not null
  rep_lo smallint not null
  rep_hi smallint not null
  rest_sec smallint not null
  load_tag text not null      -- 'agir'|'orta_agir'|'orta'|'orta_hafif'|'hafif'
  note text null
  sort smallint not null

workouts                      -- bir antrenman seansı
  id serial pk
  user_id int not null references users(id)
  date date not null
  program_day_id int null references program_days(id)
  day_name text not null      -- SNAPSHOT: "PUSH A"
  status text not null default 'planned'   -- 'planned' | 'completed'
  notes text null
  created_at timestamptz default now()
  unique(user_id, date)

workout_exercises             -- seanstaki hareketler (SNAPSHOT)
  id serial pk
  workout_id int not null references workouts(id) on delete cascade
  exercise_id int not null references exercises(id)
  exercise_name text not null    -- SNAPSHOT
  detail text null               -- SNAPSHOT
  unit text not null default 'kg'
  target_sets smallint not null  -- SNAPSHOT
  target_rep_lo smallint not null
  target_rep_hi smallint not null
  rest_sec smallint not null
  load_tag text not null
  note text null
  sort smallint not null

workout_sets
  id serial pk
  workout_exercise_id int not null references workout_exercises(id) on delete cascade
  set_index smallint not null
  weight numeric(6,2) null
  reps smallint null
  rir smallint null              -- kalan tekrar
  completed boolean default false

body_measurements
  id serial pk
  user_id int not null references users(id)
  date date not null
  body_weight numeric(5,2) null
  waist numeric(5,1) null
  chest numeric(5,1) null
  arm numeric(5,1) null
  thigh numeric(5,1) null
  unique(user_id, date)

ÖNEMLİ: workout_exercises tablosundaki "SNAPSHOT" işaretli alanlar,
antrenman oluşturulurken program_exercises'tan KOPYALANIR. Program sonradan
değişse bile geçmiş kayıtlar değişmez. Bunu atlamayın.

## API UÇLARI (bu fazda)
POST /api/auth/register   { email, password, name }
POST /api/auth/login      { email, password }
POST /api/auth/logout
GET  /api/auth/me         -> aktif kullanıcı veya 401

Şifre en az 8 karakter. Email zaten kayıtlıysa net Türkçe hata dön:
"Bu e-posta zaten kayıtlı."

## ARAYÜZ (bu fazda)
- Giriş sayfası ve Kayıt sayfası
- Giriş yapılmamışsa tüm sayfalar giriş ekranına yönlensin
- Giriş yapılmışsa boş bir "Panel" sayfası ve çıkış butonu

Türkçe metin kullan. Hata mesajları ne olduğunu ve ne yapılacağını söylesin,
"Bir hata oluştu" gibi boş mesaj yazma.
```

---

## FAZ 2 — Program yönetimi ve tohum veri

```
Şimdi program yönetimini ekliyoruz.

## HAREKET KÜTÜPHANESİ (seed)
Aşağıdaki hareketleri owner_id = null olarak veritabanına ekle (herkese açık):

Dumbbell Bench Press, Incline Dumbbell Press, Seated Dumbbell Shoulder Press,
Standing Dumbbell Shoulder Press, Arnold Press, Incline Dumbbell Fly,
Cable Fly, Lateral Raise, Rear Delt Fly, Face Pull, Triceps Pushdown,
Overhead Triceps Extension, Dips, Barbell Bench Press,
Standing Barbell Overhead Press, Chest-Supported Row, Machine Row,
Single-Arm Machine Row, Barbell Row, T-Bar Row, Dumbbell Row, Lat Pulldown,
Pull-up, Straight-Arm Pulldown, Dumbbell Shrug, Barbell Shrug, Biceps Curl,
Hammer Curl, Deadlift, Romanian Deadlift, Leg Press, Squat Machine, Squat,
Walking Lunge, Bulgarian Split Squat, Hip Thrust, Leg Extension, Leg Curl,
Standing Calf Raise, Seated Calf Raise, Leg Press Calf Raise,
Farmer's Walk (unit: m), Suitcase Carry (unit: m), Ağırlıklı Side Bend,
Pallof Press, Plank, Mekik, Hanging Leg Raise, Kablo Crunch

## VARSAYILAN PROGRAM (seed)
Yeni kullanıcı kaydolduğunda ona "Ana Program" adında bir program ve
aşağıdaki günler otomatik oluşturulsun.

Format: Hareket | set × tekrar | dinlenme sn | ağırlık etiketi | not

PAZARTESİ (dow 1) — "PUSH A" — odak: Göğüs · Omuz · Triceps
1 Dumbbell Bench Press | 4×6-8 | 150 | agir | Günün ana hareketi. Dambılları kontrolsüz indirme. Spot yoksa son sette kendini zorlama.
2 Incline Dumbbell Press | 4×8-10 | 120 | orta_agir | Düz benchin %60-70'i kadar olması normal. Üst göğüs zayıf bölge, acele etme.
3 Seated Dumbbell Shoulder Press | 3×8-10 | 120 | orta | Sırtı sandalyeye yapıştır, bel çukurunu abartma.
4 Lateral Raise | 3×12-15 | 75 | hafif | Ağır alırsan trapezle savurursun. 6-10 kg bile fazla gelebilir.
5 Triceps Pushdown | 3×10-12 | 75 | orta | Dirsekler gövdeye sabit. Gövdeyle itmeye başlarsan hareket biter.
6 Farmer's Walk | 3×40-50 (m) | 90 | agir | Kavraman bırakmadan mesafeyi bitirebileceğin en ağır dambıl. Omuzlar geri, dik yürü.

SALI (dow 2) — "PULL A" — odak: Sırt kalınlığı · Trapez · Biceps
1 Chest-Supported Row (dar/nötr tutuş) | 4×6-8 | 150 | agir | Günün en ağırı. Tepede kürek kemiklerini sıkıştır, 1 sn bekle.
2 Machine Row (geniş tutuş) | 4×8-10 | 120 | orta_agir | Geniş tutuş lat ve arka omuza gider. Birinciden hafif olacak, normal.
3 Lat Pulldown (geniş tutuş) | 3×10-12 | 90 | orta | Geriye yaslanma. Gövde neredeyse dik, barı göğse çek.
4 Dumbbell Shrug | 4×12-15 | 90 | agir | Trapez ağırlık kaldırır, çekinme. Omuz döndürme yapma.
5 Face Pull | 3×12-15 | 75 | hafif | Kesinlikle ağır yapılmaz. Duruş hareketi.
6 Biceps Curl | 3×10-12 | 75 | orta | Sallanmadan. Beli kırbaçlamak kolu büyütmez.

ÇARŞAMBA (dow 3) — "BACAK" — odak: Quad · Hamstring · Baldır
1 Leg Press | 4×8-10 | 150 | agir | Dizleri tam kilitleme. Bel koltuktan kalkıyorsa çok derine iniyorsun.
2 Squat Machine | 3×8-10 | 120 | agir | Leg presten hafif olacak. Yarım squat yapma, derinlik önemli.
3 Walking Lunge (her bacak) | 3×8-10 | 90 | orta | Dengeyi bozacak kadar ağır alma.
4 Leg Extension | 3×12-15 | 75 | orta_hafif | Ağır + tam kilitleme = diz ağrısı. Kontrollü git.
5 Leg Curl | 3×10-12 | 75 | orta | Hamstring kramp girmeye yatkın, ısınmadan ağır girme.
6 Standing Calf Raise | 4×10-15 | 75 | agir | Tam alta in, tepede 1 sn bekle. Yaylanma yok.
7 Seated Calf Raise | 4×15-20 | 60 | orta | Yüksek tekrar, yanma hissi hedef.

PERŞEMBE (dow 4) — "PUSH B" — odak: Omuz · Göğüs · Kol
1 Standing Barbell Overhead Press | 4×6-8 | 180 | agir | Yeniysen 2 hafta hafif çalış. Karnı sık, bacaktan itme yapma.
2 Dumbbell Bench Press | 4×8-10 | 120 | orta_agir | Pazartesi'den kasıtlı hafif.
3 Arnold Press | 3×8-10 | 120 | orta | Dönüş hareketi omuza ek yük bindiriyor, normal presten hafif al.
4 Incline Dumbbell Fly | 3×12-15 | 90 | hafif | Fly ağır yapılmaz. Germe hissi hedef.
5 Overhead Triceps Extension | 3×10-12 | 75 | orta_hafif | Ağır alırsan dirsek ağrısı başlar.
6 Lateral Raise | 3×15-15 | 75 | hafif | Pazartesi'den de hafif olabilir.
7 Hammer Curl | 3×10-12 | 75 | orta | Normal curlden biraz ağır gidebilirsin.

CUMA (dow 5) — "PULL B" — odak: Arka zincir · Dikey çekiş
1 Deadlift | 4×5-6 | 180 | agir | Programın en riskli hareketi. İlk 2-3 hafta form için hafif. Bel yuvarlandığı an seti bitir.
2 Romanian Deadlift | 3×8-10 | 150 | orta | Deadlift sonrası geliyor, ağır gitme. Bacaklar hafif bükülü, bar bacağa yakın.
3 Machine Row | 3×8-10 | 90 | orta_agir | Bel iki hinge hareketiyle yorgun, destekli makine iyi geliyor.
4 Lat Pulldown (nötr/dar tutuş) | 3×8-10 | 90 | orta_agir | Salı'dakinden farklı tutuş, biraz daha ağır.
5 Barbell Shrug | 4×10-12 | 90 | agir | Kavrama yetmezse kayış kullan.
6 Rear Delt Fly | 3×12-15 | 75 | hafif | Küçük kas. Ağır alırsan sırtla çekersin.
7 Biceps Curl | 3×10-12 | 75 | orta | Sallanmadan, kontrollü.
8 Suitcase Carry (her taraf) | 3×30-30 (m) | 90 | agir | Gövde dik kalmalı, eğiliyorsan ağırlık fazla.

CUMARTESİ (dow 6) — "CORE" — odak: Karın · Oblik
1 Mekik | 4×1 | 0 | hafif | Devre parçası — 1 dakika.
2 Ağırlıklı Side Bend (her taraf) | 3×12-15 | 60 | orta_agir | Sadece yana eğil-doğrul, gövdeyi döndürme.
3 Pallof Press (her taraf) | 3×12-12 | 60 | orta_hafif | Gövden dönmeyecek kadar ağırlık. Dönüyorsa fazla.

## API UÇLARI
GET    /api/exercises                      -- kütüphane + kullanıcının kendi eklediği
POST   /api/exercises                      -- kişisel hareket ekle
GET    /api/programs                       -- kullanıcının programları
GET    /api/programs/:id                   -- günler + hareketler dahil
POST   /api/programs                       -- yeni program
PATCH  /api/programs/:id                   -- ad, aktiflik
POST   /api/programs/:id/days              -- gün ekle
PATCH  /api/program-days/:id               -- gün adı/odak/dow
DELETE /api/program-days/:id
POST   /api/program-days/:id/exercises     -- harekete ekle
PATCH  /api/program-exercises/:id          -- set/tekrar/dinlenme/etiket/not
DELETE /api/program-exercises/:id
PATCH  /api/program-days/:id/reorder       -- sıralama { orderedIds: [] }

## ARAYÜZ — "Programım" sayfası
- Gün sekmeleri, her günün hareket listesi
- Hareket satırında: ad, set × tekrar, dinlenme, ağırlık etiketi
- Düzenle: set sayısı, tekrar aralığı, dinlenme, etiket, not
- Hareket ekle: kütüphaneden ara-seç, yoksa yeni hareket oluştur
- Sürükle-bırak ya da yukarı/aşağı ok ile sıralama
- Hareket sil (onay iste)
- Gün ekle / gün adını değiştir

Program değişiklikleri SADECE bundan sonraki antrenmanları etkiler.
Geçmiş kayıtlar değişmez — bunu arayüzde de bir satırla belirt.
```

---

## FAZ 3 — Antrenman kaydı ve ileriye dönük planlama

```
Şimdi asıl işlev: antrenman girme ve planlama.

## ANTRENMAN OLUŞTURMA MANTIĞI
Kullanıcı bir tarih seçtiğinde:
- O tarihte kayıt varsa onu getir
- Yoksa, o tarihin haftagününe denk gelen program gününden yeni bir workout
  oluştur ve program_exercises'taki değerleri workout_exercises'a KOPYALA
- Kullanıcı istediği günü manuel de seçebilsin (Pazartesi'yi Salı yapmak gibi)

Bu kopyalama sayesinde programı sonradan değiştirsen bile geçmiş kayıtlar
olduğu gibi kalır.

## GEÇMİŞ DEĞER GÖSTERİMİ
Her hareketin üstünde "Geçen sefer" satırı olsun: aynı exercise_id ile
girilmiş, bu tarihten önceki EN SON tamamlanmış kaydın setleri.
Örnek: "Geçen sefer · 04.08.2026 — 22×8  22×8  22×7"

## AĞIRLIK ARTIRMA SİNYALİ
Bir harekette tüm setler doldurulmuşsa VE her sette reps >= target_rep_hi ise,
yeşil bir uyarı çıkar: "Tüm setlerde üst sınıra ulaştın — ağırlığı %2.5-5 artır"
Ayrıca bir sonraki aynı gün açıldığında o hareket için önerilen ağırlığı
(son ağırlık × 1.025, en yakın 2.5 kg'a yuvarlanmış) placeholder olarak göster.

## İLERİYE DÖNÜK PLANLAMA
- Kullanıcı gelecekteki bir tarihi seçip antrenman oluşturabilsin (status: planned)
- Planlanan antrenmanda hedef ağırlıkları önceden girebilsin
- Takvim görünümü: bir ay, her gün için nokta göstergesi
  (dolu yeşil = tamamlandı, boş çember = planlandı, gri = boş)
- Bir günü "atlandı" olarak işaretleyebilsin
- "Önümüzdeki 4 haftayı programdan otomatik doldur" butonu

## DİNLENME SAYACI
Set tamamlandığında (✓ basınca) o hareketin rest_sec süresi kadar geri sayım
başlasın. Ekranın altında sabit bar. Süre bitince bildirim sesi (kısa bip)
ve titreşim (navigator.vibrate). Duraklat / +30 sn / kapat butonları.

## API UÇLARI
GET   /api/workouts?from=&to=              -- tarih aralığı, takvim için
GET   /api/workouts/:date                  -- o günün seansı (yoksa oluştur seçeneği)
POST  /api/workouts                        { date, programDayId } -> snapshot'lı oluştur
PATCH /api/workouts/:id                    { status, notes }
DELETE /api/workouts/:id
PATCH /api/workout-sets/:id                { weight, reps, rir, completed }
POST  /api/workouts/:id/exercises          -- seansa hareket ekle (o güne özel)
DELETE /api/workout-exercises/:id          -- seanstan hareket çıkar
POST  /api/workouts/generate               { fromDate, weeks } -- toplu planla
GET   /api/exercises/:id/history           -- o hareketin tüm geçmişi (grafik için)

Kaydetme otomatik olsun, 600 ms debounce ile. Üstte "Kaydediliyor… / Kayıtlı"
göstergesi. Kullanıcı kaydet butonuna basmak zorunda kalmasın.
```

---

## FAZ 4 — Panel (dashboard) ve ölçüler

```
Son aşama: panel ve vücut ölçüleri.

## PANEL (ana sayfa)
Üstte özet kartları:
- Bu hafta: tamamlanan antrenman / planlanan antrenman (örn. "4 / 6")
- Toplam kaldırılan ağırlık, bu hafta (kg × tekrar toplamı)
- Aktif seri: kaç haftadır en az 4 antrenman yapıldı
- Sıradaki antrenman: gün adı + tarih + hareket sayısı, tıklayınca açılır

Altında:
- SON 12 HAFTA HACİM GRAFİĞİ — haftalık toplam tonaj çubuk grafiği
- KAS GRUBU DAĞILIMI — bu hafta hangi gruba kaç set (yatay çubuk)
  Not: her hareketi bir kas grubuna eşleyen bir tablo gerekiyor,
  exercises tablosuna muscle_group kolonu ekle
  (gogus, sirt, omuz, kol, bacak, trapez, core)
- KİŞİSEL REKORLAR — her ana hareket için en yüksek ağırlık ve tarihi.
  Ana hareketler: Deadlift, Romanian Deadlift, Leg Press, Squat Machine,
  Dumbbell Bench Press, Standing Barbell Overhead Press, Chest-Supported Row,
  Lat Pulldown, Barbell Shrug
- İLERLEME GRAFİĞİ — hareket seç, zaman içinde en ağır set grafiği
- SON 5 ANTRENMAN — tarih, gün adı, tonaj, tıklayınca detay

## ÖLÇÜLER SAYFASI
- Yeni ölçüm formu: tarih, vücut ağırlığı (kg), bel, göğüs, kol, uyluk (cm)
- Kayıt tablosu, satır silme
- Toplam değişim kutuları: ilk ölçümden son ölçüme fark
- Vücut ağırlığı çizgi grafiği
- Bel / kol / göğüs / uyluk çizgi grafiği (aynı grafikte, seçilebilir)
- Bilgi notu: "Bel sabit kalırken kol, göğüs ve uyluk artıyorsa doğru yoldasın."

## API UÇLARI
GET  /api/dashboard              -- tüm özet veriler tek çağrıda
GET  /api/stats/volume?weeks=12
GET  /api/stats/muscle-groups?week=
GET  /api/stats/records
GET  /api/measurements
POST /api/measurements
DELETE /api/measurements/:id

Grafikler için recharts kullan.
```

---

## TASARIM YÖNERGESİ (her fazda geçerli, prompta ekle)

```
## GÖRSEL YÖN
Koyu tema. Salonda, kötü ışıkta, terli parmakla kullanılacak.

Renk değişkenleri (halter plakası renk kodlarından türetildi):
  --bg:#0E1113  --surface:#171B1F  --surface2:#1E242A  --line:#2A3138
  --text:#E9ECEE  --muted:#8B959D  --dim:#5C666E
  --yellow:#F2C230   (ana vurgu)
  --red:#D9312B  --green:#2E9E5B  --blue:#2F6FD0  --orange:#E07B1F

Ağırlık etiketi renkleri:
  agir → kırmızı, orta_agir → turuncu, orta → sarı,
  orta_hafif → #7FA8C9, hafif → mavi

Tipografi:
  Başlıklar ve TÜM RAKAMLAR: 'Barlow Condensed', 600-700 ağırlık
  Gövde metni: 'Inter', 400-500
  Google Fonts'tan çek. Rakamlar büyük olsun, uzaktan okunmalı.

Kurallar:
- Mobil öncelikli. Ana kullanım telefonda, salonda, tek elle.
- Giriş kutuları en az 44px yükseklik, sayı klavyesi açılsın (inputMode)
- Tek vurgu rengi sarı; her yeri renklendirme
- Klavye ile gezinilebilir, focus halkası görünür
- prefers-reduced-motion desteklensin
- Türkçe metin. Hata mesajı ne olduğunu VE ne yapılacağını söylesin.
- Boş ekranlar yönlendirici olsun: "Henüz kayıt yok. Antrenman sekmesinden
  ağırlıkları girmeye başla."
```

---

## SIRALAMA VE KONTROL LİSTESİ

**Faz 1 sonrası kontrol:** Kayıt olabiliyor musun? Çıkıp tekrar girebiliyor musun?
Yanlış şifrede Türkçe hata çıkıyor mu?

**Faz 2 sonrası kontrol:** Yeni kullanıcıda program otomatik geldi mi? Bir hareketin
setini 3'ten 4'e çıkarabiliyor musun? Hareket ekleyip silebiliyor musun?

**Faz 3 sonrası kontrol:** Bugünün antrenmanını açıp ağırlık girebiliyor musun?
Sayfayı yenileyince duruyor mu? Programdaki bir hareketi değiştirdiğinde
dünkü kayıt eskisi gibi mi kalıyor? (Bu en önemli test.)

**Faz 4 sonrası kontrol:** Panelde sayılar doğru mu? Tonaj hesabı taşıma
hareketlerini (unit = m) dışarıda bırakıyor mu?

---

## SONRAKİ ADIMLAR (isteğe bağlı, sonra eklenebilir)

- **Arkadaş takibi:** İki kullanıcı birbirini takip edip haftalık özetini görür.
  Ayrı bir `follows` tablosu ve gizlilik ayarı gerekir.
- **Antrenman şablonu paylaşımı:** Bir kullanıcı programını link ile paylaşır,
  diğeri kendi hesabına kopyalar.
- **Deload haftası:** Her 6-8 haftada bir otomatik hafif hafta önerisi.
- **PWA:** manifest.json + service worker ile ana ekrana eklenebilir,
  internet olmadan da çalışır hale gelir. Salon için değerli.
- **Fotoğraf takibi:** Aylık vücut fotoğrafı, yan yana karşılaştırma.

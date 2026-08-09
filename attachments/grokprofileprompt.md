# Profil, kayıt akışı ve terminoloji

Üç iş: **profile yeni tasarım dilini uygula** (asıl iş), **kullanıcı adını kayıt akışına taşı ve profil alanlarını genişlet**, **"Sporcu/Athlete" terminolojisini düzelt**.

Keşfet'i çalıştırıp doğruladım — düzen, tekilleştirme, katalog ve filtreler doğru çalışıyor. **Keşfet'e dokunma.** Sorun diğer ekranlarda.

## Kırmızı çizgiler

- `src/lib/auth/server.ts`, `preview.ts`, `pglite-dialect.ts`, `popup.server.ts` — dokunma.
- `vite.config.ts`'te `0.0.0.0:8080` sözleşmesi ve plugin'ler.
- `migrations/0001`–`0013` — düzenleme, `0014_*.sql`'den itibaren yeni dosya aç.
- **Keşfet ekranı** — doğru çalışıyor, tekrar elden geçirme.
- Yeni server function: `authMiddleware` + `context.userId` scope + zod (`v(schema)` / `noInput`) + çok adımlıda `withTransaction`.
- Bitince `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` yeşil olmalı.

---

## 1. Profil ekranına yeni tasarım dilini uygula

Keşfet kart yığınından yoğun satırlara geçti ama **profil hiç dokunulmamış** — kaldırdığımız kalıp burada aynen duruyor: kart, kart, üç istatistik kartı, pill sekmeler, kart.

**1.1 Kartları kaldır.** Kenardan kenara satır + `rule` ayıracı. Kart yalnızca sheet/modal/menüde kalır. Keşfet'teki `ProgramRow` deseninin aynısını kullan.

**1.2 Avatar isimle çakışıyor.** Avatar sol üstte konumlanmış, "Admin" adı ortalanmış ve avatarın altına giriyor. Kimlik satırını tek bir yatay dizilime al: avatar → ad + `@kullanıcıadı` + bio, yan yana ve hizalı.

**1.3 Sayaçlar iki kere görünüyor.** Başlık kartında "0 followers 0 following", hemen altında yine "FOLLOWERS 0 / FOLLOWING 0 / TOTAL SESSIONS 0". Birini seç: kimlik satırının altında tek sıra, tıklanabilir sayaçlar. Ayrı istatistik kartlarını kaldır.

**1.4 Sekmeler tutarsız.** Profilde dolu pill, Keşfet'te altı çizili. Keşfet'inkiyle aynı olsun.

**1.5 Isı haritası boşken koca bir ölü blok.** Hiç veri yoksa gizle ya da tek satırlık bir teşvik metnine indir.

**1.6 Türkçe sızıntı.** İngilizce arayüzde "Tamamladığın seanslar burada listelenir." görünüyor. Profil ekranındaki tüm sabit metinleri `t()`'ye taşı.

**1.7 Alt navigasyon içeriği kesiyor.** Sayfa altına navigasyon yüksekliği kadar boşluk bırak.

---

## 2. Kullanıcı adı kayıt akışına taşınsın

Şu an kullanıcı adı otomatik üretiliyor ve profil ilk açıldığında **kapatılamayan bir sheet** ile onaylatılıyor (`username-claim.tsx`, `dismissible={false}`).

Mantığı test ettim, doğru çalışıyor — "Keep"e basınca kapanıyor ve yenileyince geri gelmiyor. **Ama önizlemede PGLite bellekte olduğu için sandbox her yeniden başladığında `username_confirmed` sıfırlanıyor ve sheet tekrar karşımıza çıkıyor.** Kullanıcı profilini hiç göremiyor.

**Yap:**

- **Kullanıcı adını kayıt formunda al.** `src/routes/register.tsx` şu an ad, e-posta, şifre topluyor; buna kullanıcı adı alanını ekle.
- Yazarken **canlı müsaitlik kontrolü** yap (debounce'lu), alınmışsa anında söyle ve alternatif öner.
- Addan otomatik bir öneri doldur ama kullanıcı değiştirebilsin.
- Kurallar mevcut olanla aynı: 3–20 karakter, `[a-z0-9_]`, büyük/küçük harf duyarsız benzersiz, rezerve kelime listesi.
- Kayıt başarılı olduğunda `username_confirmed = true` yaz.
- **`UsernameClaimSheet`'i tamamen kaldır** — kayıtta alındığı için gereksiz. Kullanıcı adını değiştirmek isteyen Ayarlar → Profili düzenle'den yapar.
- OAuth ile gelen kullanıcılarda (kayıt formu yok) otomatik ad üretilir; bu durumda `username_confirmed` yine `true` olsun ve **bloklayıcı sheet gösterme** — bunun yerine profilde kapatılabilir tek satırlık bir öneri ("Kullanıcı adını seç") göster.

---

## 3. Profil alanları: doğum tarihi, cinsiyet, boy

Şu an profilde bu bilgiler yok. Fitness uygulamasında bunlar süs değil — kuvvet standardı karşılaştırması, kalori/nabız tahmini ve BMI için gerekli.

Yeni migration (`0014_profile_details.sql`), `user_profiles`'a ekle:

```sql
alter table user_profiles add column if not exists birth_date date;
alter table user_profiles add column if not exists sex text
  check (sex in ('female','male','unspecified'));
alter table user_profiles add column if not exists height_cm numeric(5,1);
alter table user_profiles add column if not exists details_public boolean not null default false;
```

**Kurallar:**

- **Yaş değil doğum tarihi sakla** — yaş her yıl bayatlar, doğum tarihinden hesaplanır.
- **Üçü de isteğe bağlı.** Kayıt formunu şişirme; kayıtta yalnızca ad, e-posta, şifre, kullanıcı adı olsun. Bunlar kayıttan sonra "Profilini tamamla" adımında ya da Ayarlar → Profili düzenle'de doldurulur.
- **Cinsiyet alanında "Belirtmek istemiyorum" seçeneği olsun** ve varsayılan bu olsun. Zorunlu tutma.
- **Varsayılan gizli.** `details_public` varsayılanı `false`; bu alanlar herkese açık profilde görünmesin. `getUserProfile`'da **sunucu tarafında** filtrele, istemciye gönderip orada gizleme.
- Boy `unit_system`'e göre gösterilsin (cm / ft-in), veritabanında her zaman cm sakla.
- Doğum tarihi için makul sınır koy (13 yaş altı kabul etme, 120 yaş üstü kabul etme) ve zod ile doğrula.
- Bu alanları kullanan bir hesaplama eklemene gerek yok; şimdilik sadece topla ve profilde göster. Kuvvet standartları sonraki iş.

---

## 4. "Sporcu / Athlete" → "Kişi / People"

Uygulama hem sporcu hem antrenör hem sıradan kullanıcı barındıracak; "Sporcu" daraltıcı. Türkçe dil dosyasında yedi yerde geçiyor:

| Anahtar | Şimdi (tr) | Şimdi (en) |
|---|---|---|
| `discover.people` | Sporcular | Athletes |
| `common.athlete` | Sporcu | — |
| `discover.searchPlaceholder` | Sporcu, program, kod ara… | — |
| `discover.subtitle` | Program & sporcu ara | Programs & athletes |
| `profile.searchPeople` | Sporcu ara | Find athletes |
| `feed.emptyHint` | Sporcu takip et veya… | Follow athletes or… |
| `feed.suggested` | Önerilen sporcular | Suggested athletes |

Hepsini "Kişiler / Kişi / People / Person" karşılıklarıyla değiştir, **hem tr hem en**. Sonra tüm dil dosyalarında `sporcu`/`athlete` araması yapıp kalan olmadığını doğrula.

---

## 5. Filtre pill'i seçim yapıldığını göstermiyor

Keşfet'te filtreler doğru çalışıyor (test ettim: filtresiz 13 program → "Beginner" ile 4 program, tamamen farklı sonuçlar). Ama pill hep "Filters" yazıyor, aktif filtre sayısını göstermiyor — bu yüzden kullanıcı seçim yaptığını fark etmiyor ve ekran sabit sanılıyor.

- Pill'e aktif sayı rozeti ekle: "Filtre 2".
- Seçili filtreleri pill'in yanında **kaldırılabilir etiket** olarak göster.
- Filtre uygulanınca bölüm başlıkları "Sonuçlar (4)" gibi tek bir başlığa dönsün; FEATURED / NEW / FOLLOW başlıkları filtre aktifken anlamsız.
- "Tümünü temizle" bağlantısı koy.

---

## Doğrulama

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Playwright ile 390px mobil görünümde ekran görüntüsü al, **gerçekten bak**:

- [ ] Profilde kenarlıklı kart yok; satırlar ve ayıraçlar var
- [ ] Avatar ile ad çakışmıyor
- [ ] Takipçi/takip sayacı ekranda **bir kez** görünüyor
- [ ] Sekmeler Keşfet'tekiyle aynı stilde
- [ ] Profilde İngilizce seçiliyken Türkçe metin yok
- [ ] Yeni kayıt: kullanıcı adı formda alınıyor, alınmış bir ad anında uyarı veriyor
- [ ] Kayıttan sonra profile gir → **kullanıcı adı sheet'i açılmıyor**
- [ ] Ayarlar → Profili düzenle'de doğum tarihi, cinsiyet, boy alanları var ve kaydediliyor
- [ ] `details_public = false` iken başka bir hesaptan bakınca bu alanlar **görünmüyor**
- [ ] Hiçbir dilde "sporcu" / "athlete" kalmadı
- [ ] Keşfet'te filtre seçince pill "Filtre 1" gösteriyor ve seçili etiket görünüyor

## Çalışma şekli

Sırayla: 2 (kayıt akışı) → 3 (profil alanları) → 1 (profil tasarımı) → 4 → 5. Kayıt akışını önce bitir; bloklayıcı sheet kalkmadan profil tasarımını rahat test edemezsin. Her adımdan sonra commit at ve ekran görüntüsüyle doğrula.

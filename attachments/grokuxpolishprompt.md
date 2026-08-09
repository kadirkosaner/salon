# Salon — UX cila turu: dokunma hedefleri, buton hiyerarşisi, sayaç doğruluğu, yerleşim

Uygulamayı program aktifken çalıştırdım, set girdim ve sekiz ekranın tamamını 390px'te yakaladım. Aşağıdaki bulguların hepsi ölçülmüş veya ekran görüntüsünden — tahmin yok.

**Yapı iyi durumda.** Akordeon, yoğun satırlar, sabit bitir çubuğu, Obsidian teması, karşılaştırma şeridi — hepsi yerinde. Bu tur **cila**: dokunma hedefleri, buton hiyerarşisi, yanlış sayaçlar ve boşluk ritmi.

## Kırmızı çizgiler

- `src/lib/auth/server.ts`, `preview.ts`, `pglite-dialect.ts`, `popup.server.ts` — dokunma.
- `vite.config.ts`'te `0.0.0.0:8080` sözleşmesi ve plugin'ler.
- `migrations/0001`–`0015` — düzenleme; gerekirse yeni dosya.
- **Mimariyi değiştirme.** Akordeon, sekmeler, yoğun satır düzeni, karşılaştırma katmanı doğru — yeniden tasarlama.
- Set kaydetme davranışı (debounce, otomatik tamamlanma, dinlenme sayacı) bozulmayacak.
- Bitince `npm run typecheck && npm run lint && npm run test && npm run build` yeşil.

---

## 1. KRİTİK: Ağırlıksız set "tamamlandı" sayılıyor

Ekran görüntüsünde set 1 ve 2 yeşil onaylı görünüyor ama **KG sütunu boş** — yalnızca REPS dolu. Ağırlıksız tamamlanmış set, hem kullanıcı için anlamsız hem de karşılaştırma havuzunu bozar (`benchmarks.ts` `max(weight)` alıyor, `null` ağırlıklı setler istatistiği çarpıtır).

**Yap:**
- Ağırlık **veya** tekrar boşken onay kutusu pasif olsun; dokunulduğunda eksik alan vurgulansın ve odaklansın.
- Vücut ağırlığı hareketlerinde (`unit` alanına bak) ağırlık zorunlu olmasın — yalnızca tekrar yeterli.
- Zaten kayıtlı, ağırlıksız tamamlanmış setler için karşılaştırma sorgusunda `weight is not null` filtresi olduğundan emin ol.

## 2. KRİTİK: "Finish session · 0/6" yanlış sayıyor

İki set tamamlandığı halde çubuk `0/6` diyor — sayaç **hareket** sayıyor, kullanıcı **set** girdiğini görüyor. Üstelik buton hiç ilerleme yokken bile **dolu ve aktif**.

**Yap:**
- Çubukta iki bilgi ayrı olsun: ilerleme `4/24 set` (veya `1/6 hareket`), buton metni sadece `Seansı bitir`.
- **En az bir set tamamlanana kadar buton pasif** olsun (prompt'ta istenmişti, uygulanmamış).
- Tüm setler bitince buton vurgulansın; yarım bırakılmışsa onay iste ("2 hareket eksik, yine de bitirilsin mi?").

## 3. Sabit çubuklar üst üste biniyor

Ölçtüm: bitir çubuğu `top 719 → bottom 780`, alt navigasyon `top 779 → bottom 844`. **1px örtüşme** var ve ikisi birlikte ekranın alt **125px'ini** yiyor. `workout-finish-pad` bu yüksekliği karşılamıyor — son hareket kartı çubukların altında kalıyor.

**Yap:**
- Bitir çubuğunun alt kenarı navigasyonun üst kenarıyla **tam hizalansın** (örtüşme sıfır), aralarında 1px `rule` ayıracı olsun.
- Sayfa alt boşluğu = bitir çubuğu + nav + `env(safe-area-inset-bottom)`. Hesabı sabit değerle değil, ölçülen yükseklikten türet.
- Son hareket açıkken sona kaydır ve içeriğin tamamının göründüğünü doğrula.

## 4. Dokunma hedefleri 44px altında (ölçüldü)

| Öğe | Ölçü | Gereken |
|---|---|---|
| Set girdileri (kg/tekrar) | 130×**40** | ≥44 yükseklik |
| Akordeon başlıkları | 362×**40** | ≥44 |
| "Class" (klasman) butonu | 64×**36** | ≥44 |
| "Body metrics" bağlantısı | 71×**14** | ≥44 dokunma alanı |

**Yap:** hepsini 44px'e çıkar — görsel yüksekliği büyütmek yerine **padding veya görünmez dokunma alanı** ile. Set satırı görsel olarak kompakt kalabilir, dokunma hedefi büyür. "Body metrics" 14px yükseklikte bir metin bağlantısı; buton haline getir.

## 5. Renk semantiği ihlalleri

- **Onay kutuları doygun yeşil** (`success`) — Obsidian'ın pirinç/kemik paletiyle çarpışıyor. Tamamlanmış set vurgu rengiyle (accent) veya nötr dolu ile gösterilsin; yeşil yalnızca gerçek "başarı" durumları için.
- **"HEAVY" rozeti kırmızı** (`danger`) — yük etiketi bir uyarı değil. Yük etiketleri nötr yüzey + metin tonlarıyla ayrışsın (hafif→sönük, ağır→belirgin), semantik renk kullanmasın.
- **"Chest" kas rozeti** de aynı kuralda nötr olsun.

## 6. Hareket kartındaki aksiyon satırı dağınık

Başlık altında altı öğe yan yana: `Chest` pill, `HEAVY` pill, ▶ ikon, ⓘ ikon, ⇄ ikon, 🗑 ikon. İkisi pill, dördü çıplak ikon — görsel ağırlıkları farklı, gruplanmamış, hepsi aynı hiyerarşide.

**Yap:**
- **Bilgi** (kas grubu, yük etiketi) solda, sessiz metin/rozet olarak.
- **Aksiyonlar** (önizle, not, değiştir, sil) sağda tek bir `⋯` menüsünde toplansın. En sık kullanılan bir tanesi (önizle) dışarıda kalabilir.
- Sil, menü içinde ve `danger` renginde en altta, ayıraçla ayrılmış olsun.

## 7. Karşılaştırma şeridi boş durumda kırık görünüyor

Şerit `Relative · 0` yazıyor — sıfır bir değer değil, veri yokluğu. Altında `Add body weight for relative ranking Body metrics` cümlesi bağlantıyla birleşip tek satır gibi okunuyor.

**Yap:**
- Değer yokken sayı gösterme: `Göreli — veri yok`.
- Boş durum metnini tek cümleye indir ve bağlantıyı ayrı bir satıra al: *"Göreli sıralama için vücut ağırlığını gir"* + altında `Ölçüler'e git` butonu.
- Havuz 5'in altındayken de aynı sakin boş durum kullanılsın.

## 8. Başlık ve tarih tekrarı

Üst başlık `Sun, Aug 9, 2026 · Full Split (6 days)`, hemen altında `Sun, Aug 9, 2026 · PUSH A`. Tarih iki kez.

**Yap:** üst başlıkta program adı, alt satırda gün + seans adı. Tarih tek yerde.

Ayrıca gün şeridinde seçili gün `TODAY` yazıyor, diğerleri `THU/FRI/SAT`. Seçili gün de haftanın gününü göstersin; "bugün" bilgisi nokta veya renkle verilsin — bilgi kaybı olmasın.

## 9. Akış ekranı: sayaç ve boşluk

- `WEEKLY VOLUME 0 kg / 10k` ve `0% of goal · 1 sessions left` — hedef **10k sabit**, kullanıcı belirlemedi. Ya ayarlardan hedef belirlenebilir yap, ya hedefi kaldırıp yalnızca hacmi göster. Uydurma hedef güven kırar.
- `1 sessions left` — tekil/çoğul bozuk. Tüm sayı içeren metinlerde çoğul kuralını uygula (`t()` içinde count desteği).
- Boş akış kartı ~560px yer kaplıyor. Yüksekliği yarıya indir; altındaki "Featured programs" rafı ilk ekrana girsin.
- "Featured programs" rafında üçüncü kart sert kesiliyor — sağa gradyan ipucu ekle.

## 10. Keşfet: bölüm sayaçları ve kesilme

- `NEW` bölümünün ilk satırı alt navigasyonun arkasında kalıyor (ekran görüntüsünde "Conditioning Full B..." yarı görünür). Bölüm başlıklarının altına yeterli boşluk ve sayfa altına nav payı ekle.
- `1 clones` — yine tekil/çoğul. Ayrıca sıfırken hiç gösterilmiyor, bu doğru; tekil/çoğulu düzelt.
- Rank numaraları her bölümde `01`'den başlıyor. Bu doğru davranış ama `FEATURED`/`NEW`/`FOR YOUR LEVEL` başlıkları arasında görsel ayrım zayıf — bölüm başlıklarına biraz daha üst boşluk ver.

## 11. Profil: boş durum yanlış metin

Aktivite sekmesinin boş durumu **"No workout this day"** diyor — bu antrenman ekranının metni, profil bağlamında anlamsız. `"Henüz aktivite yok"` benzeri doğru anahtarı kullan.

Ayrıca boş durum kartı ~550px; profil sayfasının yarısı boş. Kompakt hale getir.

## 12. Genel kural seti — tüm ekranlarda uygula

1. **Ekran başına tek dolu birincil buton.** Akışta hem "Discover" dolu hem composer var; profilde "Workout" dolu buton boş durumda. Dolu buton ekranın asıl eylemi için.
2. **Dokunma hedefi ≥44px**, istisnasız.
3. **Semantik renk yalnızca durum için** — dekoratif rozetlerde kullanma.
4. **Sayı içeren her metin çoğul kurallı.**
5. **Sabit çubuklar örtüşmez**, sayfa altı boşluğu onların toplam yüksekliğinden türetilir.
6. **Boş durumlar kompakt** — ekranın yarısını kaplamaz.
7. **Boşluk ölçeği 4/8/12/16/24**; bölüm başlıkları arası ritim her ekranda aynı.
8. **Kaydırılabilir her şeridin sağında gradyan ipucu.**

---

## Doğrulama

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Playwright 390px, **program aktif ve birkaç set girilmiş** halde:

- [ ] Ağırlıksız set onaylanamıyor; eksik alan vurgulanıyor
- [ ] Bitir çubuğu doğru sayıyor (`4/24 set`), ilk set girilene kadar pasif
- [ ] Bitir çubuğu ile nav **örtüşmüyor**; son hareket tamamen görünüyor
- [ ] Sayfadaki hiçbir interaktif öğe 44px'in altında değil — betikle ölç, göz kararı yetmez
- [ ] Onay kutusu ve yük rozetleri semantik renk kullanmıyor
- [ ] Hareket kartında aksiyonlar `⋯` menüsünde toplanmış
- [ ] Karşılaştırma boş durumu `0` göstermiyor
- [ ] Tarih tek yerde; gün şeridinde seçili gün haftanın gününü koruyor
- [ ] `1 session left` / `1 clone` gibi tekil/çoğul doğru
- [ ] Keşfet'te hiçbir satır navigasyonun arkasında kalmıyor
- [ ] Profil boş durumu doğru metni gösteriyor
- [ ] Sekiz ekranın da 390px görüntüsünü yan yana koy: başlık yüksekliği, bölüm ritmi ve buton hiyerarşisi tutarlı

## Çalışma şekli

Sıra: **1 → 2 → 3 → 4** (davranış ve erişilebilirlik önce), sonra **5 → 6 → 7 → 8** (antrenman ekranı cilası), sonra **9 → 10 → 11** (diğer ekranlar), en son **12** (genel geçiş).

Her maddeden sonra commit at ve ekran görüntüsü al. Bu tur davranış değiştirmemeli — 1 ve 2 dışında (onlar zaten hatalı davranışın düzeltilmesi). Emin olmadığın yerde mevcut davranışı koru.

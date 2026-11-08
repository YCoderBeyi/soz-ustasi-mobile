# Level Audit Rubric Calibration - L1, L8, L15

Tarih: 21 Haziran 2026  
Durum: Faz 0 kalibrasyon adayi  
Kapsam: L1, L8 ve L15; teknik on-kontrol, dil, zorluk/akis ve anlati/ogrenme

## 1. Amac

Bu belge, 75 seviyelik profesyonel denetimde kullanilacak ortak rubrigi uc farkli noktada kalibre eder:

- L1: ilk oyuncu deneyimi.
- L8: ilk bolumun orta noktasi.
- L15: ilk 15 seviyelik denetim diliminin sonu.

Rubrik yalniz `kod calisiyor mu` sorusunu degil, `oyuncu bunu adil, anlamli ve surukleyici bulur mu` sorusunu da cevaplar.

## 2. Kanit Tabanı

Calistirilan kontroller:

```text
npm run audit:levels
node scripts/audit-plan.mjs
npx vitest run src/data/levels.test.ts
```

Sonuclar:

- Teknik level audit: PASS, 75 level, 10 warning.
- Level testleri: 778/778 PASS.
- Plan audit: 5 kritik, 4 onemli, 2 ikincil bulgu.
- Katalog genelinde hareketli zorluk ortalamasi 30 kez geriliyor.
- Katalog genelinde ana kelime ve gizli kelime tekrar mesafesi ihlalleri var.
- 75/75 kartta `impact` ve/veya `today` alani eksik.
- 75/75 kartta editoryal onay durumu eksik.

## 3. Oncelik Siniflari

| Oncelik | Tanim | Ornek | Aksiyon |
| --- | --- | --- | --- |
| P0 | Yayin/ilerleme engeli | Uretilemeyen hedef, crash, progression lock, kayit kaybi, sinirsiz odul | Batch beklemeden duzelt |
| P1 | Oyuncu guveni veya ana deneyim hasari | Gecersiz/yaniltici kelime, anlati-bulmaca kopuklugu, sert zorluk duvari, erken tekrar | Ilk duzeltme batch'i |
| P2 | Kalite ve tutarlilik borcu | Zayif anlam, yetersiz kart alani, odul/ritim sapmasi | Ilgili 15'li batch icinde duzelt |
| P3 | Cilalama | Kisa metin, mikro animasyon, dekoratif tutarlilik | P0-P2 sonrasinda |

## 4. Dort Mercekli Rubrik

Toplam puan 100'dur. Puan tek basina yayin karari vermez; bir P0 bulgusu toplam puandan bagimsiz olarak seviyeyi bloke eder.

### A. Teknik cozulebilirlik - 25 puan

| Olcut | Puan |
| --- | ---: |
| Ana ve gizli kelimeler harf sayilari dahil havuzdan uretiliyor | 8 |
| Crossword tek bagli; anagram davranisi gercek ve tamamlanabilir | 5 |
| Ayni level icinde normalize cakisma yok | 3 |
| Blocklist, gecersiz karakter ve hassas hedef ihlali yok | 3 |
| Odul, gizli sayaci ve tamamlama akisi tutarli | 3 |
| Katalog tekrar kurallariyla cakisma yok | 3 |

### B. Turkce ve kelime editorlugu - 25 puan

| Olcut | Puan |
| --- | ---: |
| Ana kelimeler bagimsiz, guncel ve guvenilir | 8 |
| Gizli kelimeler sozluk degeri tasiyor | 4 |
| Anlamlar dogru, acik ve kelimeyi dairesel tanimlamiyor | 5 |
| Turkce yazim/duzeltme isaretleri ve normalizasyon dogru | 4 |
| Genel kitlede argo, cinsellik veya yanlis anlasilma riski dusuk | 4 |

### C. Zorluk, akis ve oyuncu psikolojisi - 25 puan

| Olcut | Puan |
| --- | ---: |
| Seviye bulundugu bant icin uygun harf/kelime yukunde | 7 |
| Onceki ve sonraki seviyelerle kontrollu zorluk egirisi kuruyor | 5 |
| Gizli kelime ve odul baski degil istege bagli merak uretiyor | 4 |
| Ipucu ozerkligi korunuyor; otomatik cevap yok | 4 |
| Basari geri bildirimi ve tekrar oynama nedeni acik | 5 |

### D. Anlati, ogrenme ve atmosfer - 25 puan

| Olcut | Puan |
| --- | ---: |
| Bulmaca kelimeleri ile kesif karti arasinda semantik kopru var | 8 |
| Tarihsel ifade dengeli, abartisiz ve yaniltici degil | 5 |
| Kart `neden onemli` ve `bugun nerede` sorularini yanitliyor | 5 |
| Tema, seviye ve muhur ayni atmosferi destekliyor | 4 |
| Kaynak ve editoryal onay kaydi var | 3 |

## 5. Karar Esikleri

| Sonuc | Kosul |
| --- | --- |
| Yayina aday | 85-100, P0/P1 yok |
| Duzelt ve tekrar denetle | 70-84 veya herhangi bir P1 |
| Yeniden tasarla | 0-69 veya iki ve daha fazla ana mercekte 15 puan alti |
| Yayin blokeli | Herhangi bir P0 |

## 6. L1 Kalibrasyon Ciktisi

### Veri

```text
Havuz: A R I
Ana: ARI, AR
Gizli: yok
Puzzle: crossword
Kart: Tekerlegin Donusu
Tema: old_istanbul
```

### Olcum

```text
Harf sayisi: 3
Ana kelime: 2
Ortalama ana kelime uzunlugu: 2.5
Zorluk proxy: 13.1
Uretilebilirlik: PASS
Crossword bagliligi: PASS
Blocklist: PASS
```

### Mercek puanlari

| Mercek | Puan | Gerekce |
| --- | ---: | --- |
| Teknik | 25/25 | Iki kelime de havuzdan uretiliyor ve ortak A/R ile baglanabiliyor. |
| Turkce | 22/25 | `ARI` acik; iki harfli `AR` ilk seviyede kabul edilebilir fakat yeni oyuncu icin daha zayif bir ana hedeftir. |
| Zorluk/akis | 24/25 | Hizli basari saglayan uygun onboarding; gizli kelime olmamasi L1 istisnasina uygundur. |
| Anlati/ogrenme | 9/25 | ARI/AR kelimeleri ile tekerlek karti arasinda semantik kopru yok; kart alanlari ve onay kaydi eksik. |
| **Toplam** | **80/100** | Teknik olarak saglam, anlati baglantisi nedeniyle duzeltme gerekli. |

### Bulgular

- `P1-NARRATIVE`: Bulmaca, tekerlek kesfini hazirlamiyor veya pekistirmiyor.
- `P2-EDITORIAL`: Kartta `impact`, `today`, kaynak ve onay durumu yok.
- `P3-ONBOARDING`: `AR` yerine ayni basitlikte daha somut bir ikinci hedef secenegi degerlendirilmeli; degisim crossword ve zorluk testine baglidir.

### Karar

`Duzelt ve tekrar denetle`. L1'in teknik yapisi korunabilir; kelime-kart eslesmesi ya da kart konusu yeniden tasarlanmalidir.

## 7. L8 Kalibrasyon Ciktisi

### Veri

```text
Havuz: S A H I L
Ana: SAHIL, ASIL, HAL
Gizli: AS
Puzzle: crossword
Kart: Gokyuzunu Olcen Usturlap
Tema: ege_coast
```

### Olcum

```text
Harf sayisi: 5
Ana kelime: 3
Ortalama ana kelime uzunlugu: 4.0
Zorluk proxy: 25.2
Uretilebilirlik: PASS
Crossword bagliligi: PASS
Blocklist: PASS
Global tekrar: AS, L8 -> L22, mesafe 14; plan hedefi >=20
```

### Mercek puanlari

| Mercek | Puan | Gerekce |
| --- | ---: | --- |
| Teknik | 22/25 | Level ici teknik yapi saglam; gizli `AS` daha sonra erken tekrar ediyor. |
| Turkce | 19/25 | `HAL` tanimi `hal/hâl` ayrimini belirsiz birakiyor; iki harfli `AS` guvenilir fakat dusuk kesif degerinde. |
| Zorluk/akis | 23/25 | 5 harf, 3 ana ve 1 gizli kelime orta nokta icin dengeli. |
| Anlati/ogrenme | 10/25 | Sahil/asil/hal ile usturlap arasinda zayif bag; tema deniz yolculugu uzerinden bag kurabilir ama metin bunu yapmiyor. |
| **Toplam** | **74/100** | P1 dil/anlati ve tekrar bulgulari var. |

### Bulgular

- `P1-LANGUAGE`: `HAL`, verilen `durum` anlaminda yazim ve anlam ayrimi acisindan editoryal inceleme gerektiriyor.
- `P1-NARRATIVE`: Usturlap karti bulmaca kelimelerinden turemiyor; `SAHIL` ile denizcilik/yon bulma koprusu acik kurulabilir.
- `P1-REPEAT`: Gizli `AS`, L22'de 14 seviye sonra yeniden kullaniliyor.
- `P2-EDITORIAL`: Kart etki, bugun, kaynak ve onay alanlarindan yoksun.

### Karar

`Duzelt ve tekrar denetle`. Teknik harf havuzu korunabilir; `HAL` ve `AS` kelimeleriyle kartin semantik koprusu birlikte ele alinmalidir.

## 8. L15 Kalibrasyon Ciktisi

### Veri

```text
Havuz: S A R A Y
Ana: SARAY, YARA, ARSA, AYAR
Gizli: YASA, YAR
Puzzle: anagram
Kart: Bilginin Cogalmasi - Gutenberg
Tema: old_istanbul
```

### Olcum

```text
Harf sayisi: 5
Ana kelime: 4
Ortalama ana kelime uzunlugu: 4.25
Zorluk proxy: 29.0
Uretilebilirlik: PASS
Anagram tamamlanabilirligi: PASS
Blocklist: PASS
Plan bandi: L1-20 hedefi 2-3 ana kelime; mevcut 4
Hareketli ortalama: L15'te 29.3 -> 28.8 gerileme
```

### Mercek puanlari

| Mercek | Puan | Gerekce |
| --- | ---: | --- |
| Teknik | 25/25 | Tum kelimeler havuzdan uretiliyor; level ici cakisma yok. |
| Turkce | 22/25 | Kelimeler gecerli; `YAR` hem ucurum hem sevgili anlamiyla belirsiz, tanim bunu sinirliyor. |
| Zorluk/akis | 19/25 | 4 ana + 2 gizli hedef erken bant icin yuksek; buna ragmen hareketli ortalama geriliyor, bu proxy/rubrik uyumsuzlugunu da gosteriyor. |
| Anlati/ogrenme | 10/25 | Saray/yara/arsa/ayar kelimeleri Gutenberg ve baski kartini hazirlamiyor. Kart tarihsel olarak daha dengeli yazilmis ancak yapisal alanlar eksik. |
| **Toplam** | **76/100** | Teknik olarak saglam; anlati koprusu ve zorluk kalibrasyonu gerekli. |

### Bulgular

- `P1-NARRATIVE`: Bulmaca ile Gutenberg/baski konusu arasinda semantik bag yok.
- `P2-DIFFICULTY`: Erken bantta 4 ana + 2 gizli hedef; L15'in dilim sonu olmasi tek basina bu yuku aciklamiyor.
- `P2-METRIC`: Zorluk proxy, hedef sayisi yuksek olmasina ragmen hareketli ortalamada gerileme bildiriyor; nadirlik, olasi kelime sayisi ve anagram davranisi modele eklenmeli.
- `P2-EDITORIAL`: Kart etki, bugun, kaynak ve onay alanlarindan yoksun.

### Karar

`Duzelt ve tekrar denetle`. Kelime havuzu teknik olarak kullanilabilir; kart konusu kelime ailesine yaklastirilmali veya baski/yazi temasina uygun yeni havuz tasarlanmalidir.

## 9. Kalibrasyondan Cikan Rubrik Kararlari

### 9.1 Rubrige eklenecek zorunlu kontroller

- `semanticBridge`: Ana kelimelerden en az biri kartin konusu, araci, etkisi veya kullanim baglamiyla acik bag kurar.
- `orthographyAmbiguity`: Duzeltme isareti veya Turkce I/İ farki anlami degistiriyorsa editoryal kontrol gerekir.
- `futureRepeat`: Seviye yalniz onceki degil sonraki tekrarlarla da denetlenir.
- `puzzleAwareDifficulty`: Anagram ve crossword ayni proxy ile degerlendirilmez.
- `editorialCompleteness`: impact, today, kaynak ve onay durumu ayri puanlanir.

### 9.2 Otomatik ve insan denetimi siniri

Otomatik script sunlari kesin kontrol eder:

- Uretilebilirlik.
- Normalize cakisma.
- Harf havuzu ve kelime tekrari.
- Blocklist ve gecersiz karakter.
- Kelime/hedef sayisi.
- Zorluk proxy ve odul sayilari.

Uzman denetimi sunlari karara baglar:

- Kelimenin guncel ve dogal Turkce olup olmadigi.
- Anlamin yas grubuna uygunlugu.
- Bulmaca-kart semantik koprusu.
- Tarihsel iddianin dengesi.
- Gercek oyuncu zorlugu ve eglence ritmi.

## 10. Faz 1 Cikti Formati

Her seviye tek satirlik ozet ve ayrintili bulgu listesi dondurur:

```text
Level: LNN
Score: NN/100
Decision: candidate | revise | redesign | blocked
Technical: NN/25
Language: NN/25
Difficulty: NN/25
Narrative: NN/25
Findings: [P0/P1/P2/P3 code + evidence]
Recommended action: one concrete edit scope
Tests affected: exact test/audit names
```

Her 15'li dilim sonunda:

- P0-P3 backlog.
- Zorluk egirisi ozeti.
- Anlati/tema haritasi.
- Tekrar tablosu.
- Korunacak guclu seviyeler.
- Yeniden yazilacak seviyeler.

## 11. Kalibrasyon Sonucu

Rubrik Faz 1 icin kullanilabilir, ancak su iki kosulla:

1. Teknik PASS, otomatik olarak yayin adayi anlamina gelmez.
2. Semantik kopru ve tarihsel editoryal alanlar P1/P2 ayrimini belirleyen zorunlu merceklerdir.

Bir sonraki adim, ayni rubrikle L1-15 diliminin dort mercekli tam denetimidir. Bu kalibrasyon belgesi onaylanmadan batch duzeltmeye gecilmez.

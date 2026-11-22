# Söz Ustası — Faz 2 Sentez Raporu
**Tarih:** 2026-06-21 | **Kapsam:** L1–L75 (Faz 1 tamamlandı) | **Durum:** Faz 3 girdi belgesi

---

## 1. Yönetici Özeti

75 seviyeli Faz 1 kataloğu, **genel ortalama 80.3/100** ile yayına alınabilir eşiğin üzerindedir; ancak bu sağlık skoru bant dağılımındaki yapısal dengesizliği gizlemektedir. B4 (88.5) ve B5 (84.2) bantları oyun motorunun olgunlaştığını kanıtlarken, B2 (73.7) ve B3 (74.7) bantları tam 30 seviye — tutarlı anlatı kopukluğu ve mekanik yetersizlik nedeniyle oyuncu tutunmasını tehdit eden zayıf bir orta omurga oluşturmaktadır. 11 P1 düzeltmesi commit 7542e37 ile tamamlanmış, 7 seviye Faz 3'e kadar dondurulmuştur.

**3 Güçlü Nokta:**
1. **B4 mükemmeliyeti (88.5 ort.):** L55=96, L57=92, L58=93 ile kataloğun zirvesi; yapısal bütünlük + tema-mekanik uyumu model seviyedir.
2. **P1 sıfırlama hızı:** 11 kritik hata tek commit'te kapatıldı; regresyon kapsamı yeterli.
3. **B5 anlatı kapatması:** L63=94, L74=93, L75=91 ile son bant güçlü bir kapanış sunuyor.

**3 Kritik Risk:**
1. **B2–B3 çöküşü (73.7 / 74.7):** L16–L45 aralığında kalite düşüşü erken terk riskini doğrudan yükseltir.
2. **Kart-havuz semantik köprüsü kopukluğu (sistemik):** B1–B3 genelinde kart anlatısı ile kelime havuzu arasındaki bağ zayıf.
3. **7 dondurulmuş redesign:** L04, L08, L22, L29, L42, L45 erken ve orta bölümlerde yığılmış.

**Faz 3 Acil Öneri:** B2–B3 redesign kuyruğunu (L22, L29, L42, L45) Faz 3'ün ilk sprint'ine taşı.

---

## 2. Zorluk Eğrisi Analizi

```
Puan |
 96  |                                    [L55]
 94  |                                              [L63]
 93  |                                 [L57,58]    [L74]
 92  |                          [L48,54][L60]      [L64]
 91  |                          [L50]              [L75]
 90  |----------------------------------------------------  Hedef Esik
 89  |                          [L46,49]
 88  |                                   ^^^^avg   [L69]
 87  |                                             [L61]
 86  |                    [B3->]          [L51,53] [L73]
 85  | ....avg                                   ~~~~avg
 83  |                                   [L56*]   [L66]
 82  |                                   [L59*]
 80  | ....avg                                    [L62*]
 78  |             ####avg  ====avg               [L72*]
 76  |                                            [L70*]
 74  |             ####avg  ====avg
 73  |                                         [L68*][L71*]
     +---L1---L10---L20---L30---L40---L50---L60---L75

Bant Ortalamalari:
  ....  B1 (L01-15):  80.5
  ####  B2 (L16-30):  73.7  <- Minimum
  ====  B3 (L31-45):  74.7  <- Kritik bolge
  ^^^^  B4 (L46-60):  88.5  <- Zirve
  ~~~~  B5 (L61-75):  84.2

  * = P1 duzeltme oncesi puan
  Down arrow B1->B2: -6.8 puan (L15->L16 kirilma noktasi)
  Up arrow B3->B4: +13.8 puan (L45->L46 toparlanma)
```

---

## 3. Anlati Tutarlilik Haritasi

| Bolum | Seviye | Tema | Anlati Yayi | One Cikan | Kirilma Noktasi |
|-------|--------|------|-------------|-----------|-----------------|
| Giris: Sozcugun Koku | L01-15 | Temel Turkce, gundelik hayat | **Orta** | L07, L12 | L04, L08 (redesign): erken momentum kiriliyor |
| Gelisme: Anlam Derinligi | L16-30 | Duygular, doga, somut nesneler | **Zayif** | L19, L24 | L22, L29 (redesign): cift kirilma |
| Donum: Kavramsal Sicrama | L31-45 | Soyut kavramlar, iliskiler | **Zayif** | L37, L39 | L42, L45 (redesign): ardisik kapanis basarisizligi |
| Doruk: Ustalik Bolgesi | L46-60 | Meslekler, kultur, sanat | **Guclu** | L55, L57 | Yok |
| Kapanis: Soz Ustasi | L61-75 | Bilgelik, tarih, miras | **Guclu** | L63, L74 | L68, L71 (fix tamamlandi) |

---

## 4. Konsolide P2-P3 Backlog (Acik)

| Oncelik | Seviye | Mercek | Sorun | Onerilen Duzeltme | Oyuncu Etkisi |
|---------|--------|--------|-------|-------------------|---------------|
| P2 | L29 | Anlati | UT tanim metni enstru man hatasi | "Teller mizrapla titrestirilir" | Yanlis bilgi - guven kaybi |
| P2 | L62 | Anlati | GOK gizli kelimesi icin kart bagi zayif | Kart metnine gok referansi ekle | Kesif duygus u kayipi |
| P2 | L66 | Icerik | Kart person alani eksik | person: "Ibn Sina (980-1037)" ekle | Egitsel eksiklik |
| P2 | L66 | Mekanik | 3 ana kelime sinirda | Tema uyumlu 4. kelime ekle | Dusuk tamamlama tatmini |
| P2 | L69 | Mekanik | IMAL-IMLA tam anagram cifti | Birini farkli kelimeyle degistir | Haksiz ikilem |
| P2 | L75 | Mekanik | VEDA-DEVA tam anagram cifti | DEVA->VEFA veya baska kelime | Son izlenim bozulmasi |
| P2 | L71 | Mekanik | EL, ER gizli kelimeler 2-harf | Daha zengin alternatiflerle degistir | Dusuk kesif tatmini |
| P2 | L72 | Icerik | KAC karma anlam | Kart metninde hangi anlama isaret ettigini belirt | Anlam kargasasi |
| P3 | L01-L45 | Sistemik | Kart-havuz semantik koprusu kopuk | 30 karta semantik baglanti cumlesi ekle | Tema immersiyonu |

---

## 5. Redesign Kuyrugu

| Seviye | Puan | Temel Basarisizlik | Minimum Cozum Yolu | Egrideki Rolu |
|--------|------|-------------------|-------------------|---------------|
| L04 | ~62 | Havuz tema-disi; kart bagi sifir | Havuzu sifirla, B1 temali yeni set | B1 erken ivme kirici |
| L08 | ~65 | Mekanik karmasiklik bant icin cok yuksek | Gizli 2'ye indir, uzunluk 4-5 harf | B1 ozguven kirilmasi |
| L15 | ~68 | B1 bant sonu doruk hissi yetersiz | Kart "ilk bolum kapanis" temasiyla yenile | B1->B2 gecisini yumusatir |
| L22 | ~61 | Tema-havuz tamamen ayrismi s | Havuzu sifirla, "duygu" semantik alanindan | B2 orta omurga |
| L29 | ~64 | Metin hatasi + havuz zayifligi | Once metin (P2), ardindan havuz yenile | B2 kapanis |
| L42 | ~66 | Soyut kavram yanlis soyutlama duzeyi | Somut cipaya bagla | B3 sonu koprusu |
| L45 | ~67 | B3 bant sonu; tematik kapanis yok | "Bilgelik ozeti" temali kapanis yaz | B3->B4 gecis mesruiyeti |

---

## 6. Faz 3 Uygulama Siralaması

### Batch 1 — Acil (Sprint 1)
| Madde | Seviye | Is |
|-------|--------|-----|
| IMAL-IMLA anagram | L69 | Kelime degistir + test |
| VEDA-DEVA anagram | L75 | Kelime degistir + test |
| Person alani | L66 | Metadata 1 satir |
| UT metin hatasi | L29 | Tanim metni yaz |
| GOK kart bagi | L62 | Kart metni guncelle |

### Batch 2 — Sprint 2
| Madde | Seviye | Is |
|-------|--------|-----|
| 4. kelime ekleme | L66 | Havuz + test |
| EL/ER degisim | L71 | Gizli kelime + regresyon |
| KAC baglam | L72 | Kart metni |
| Redesign | L22, L29, L42, L45 | Tam yeniden tasarim |

### Batch 3 — Kalite Borcu (Opsiyonel)
| Madde | Seviye | Is |
|-------|--------|-----|
| Redesign | L04, L08, L15 | Tam yeniden tasarim |
| Sistemik kopru | L01-L45 | 30 kart semantik guncelleme |

---

## 7. Korunacak Seviyeler — Altin Standart

| Sira | Seviye | Puan | Model Ozellik |
|------|--------|------|---------------|
| 1 | L55 | 96 | Kil koprusu: kart tum gizli kelimeleri ortuk olarak barindiruyor |
| 2 | L63 | 94 | Ipucu hiyerarsisi: genel -> spesifik -> tematik |
| 3 | L58 | 93 | Person uclusu: kisi + donem + baglam zorunlu alan |
| 4 | L74 | 93 | Bant-doruk oncesi gerilim tasarimi |
| 5 | L57 | 92 | 3-mekanik denge: kesif 40 / anagram 30 / gizli 30 |
| 6 | L48 | 92 | Gizli kelime tematik secim sablonu |
| 7 | L64 | 92 | Tek kelime kart basligi ile mukemmel kopru (KARANLIK) |
| 8 | L60 | 92 | Bant-kapanis odul yapisi sablonu |
| 9 | L75 | 91 | Final ritueli + anlati kapatma |
| 10 | L50 | 91 | B4 ortasi surdurulebilir momentum |

**Model alinabilecek 4 ilke:**
1. **Kil koprusu:** Her kart en az bir kelimeyi dogrudan adlandirmali ya da ima etmeli.
2. **3-mekanik denge:** Kesif/anagram/gizli orani 40/30/30 hedeflenmeli.
3. **Person uclusu:** Kisi referansli seviyelerde person + donem + baglam zorunlu alan.
4. **Bant-kapanis odulu:** Her 15. seviyede seal + ozel kart tasarimi zorunlu.

---

*Faz 3 baslam adan once Batch 1 (5 madde) tamamlanmali ve L22, L29, L42, L45 redesign'lari sprint planlama toplantisina alinmalidir.*

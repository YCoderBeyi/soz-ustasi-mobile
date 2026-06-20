# Soz Ustasi 1.0.16 - 120 Ozgun Seviye Tasarimi

Tarih: 20 Haziran 2026  
Durum: Onayli tasarim  
Surum hedefi: `1.0.16`  
Kapsam: Seviye 76-120, kesif kartlari, zorluk, bonus kelime, gorsel/ses atmosferi, kayit uyumlulugu ve yayin kalite kapilari

## 1. Urun Karari

`1.0.16`, mevcut 75 ozgun seviyeyi 120 ozgun seviyeye tamamlar. Bu surumde 76-120 arasindaki 45 seviye elle yazilmis editoryal veri olarak eklenir. `121-240` kapsami bu surume alinmaz; sonraki surumlerde 20 seviyelik bolum paketleriyle uretilir.

Bu karar, 165 seviyeyi tek teslimata sikistirarak tekrar, dolgu metni, tarihsel hata ve test boslugu olusturma riskini engeller.

## 2. Oyuncuya Verilen Soz

Oyuncu 76. seviyeden 120. seviyeye kadar:

- Daha once gormedigi harf havuzlari ve ana kelime kombinasyonlariyla karsilasir.
- Zorlugun etiketten degil gercek kelime ve bulmaca ozelliklerinden arttigini hisseder.
- Her bes seviyede tamamlanan kisa bir bilgi macerasi yasar.
- Her seviyede belirli bir bilimsel, teknik veya kulturel baglam acar.
- Ipucu istemeden otomatik cevap ya da harf almaz.
- Gecerli fakat hedef olmayan kelimeleri sessiz ret yerine bonus tepkiyle gorur.
- Gizli kelime sayisini bilir; cevaplari ancak kendisi bulur.
- Ana odulu ve kelime odullerini yalniz ilk hak ediste alir.
- Guncelleme sonrasinda ilerleme, yildiz, altin, esya ve ayarlarini korur.

## 3. Arastirmadan Cikan Tasarim Ilkeleri

### 3.1 Motivasyon

Self-Determination Theory, puan veya odul eklemek icin yuzeysel bir gerekce olarak kullanilmayacak. Tasarim uc somut ihtiyaci destekleyecek:

- Yetkinlik: cozulur fakat giderek daha guclu bulmacalar, acik ilerleme ve anlamli basari geri bildirimi.
- Ozerklik: ipucu, gizli kelime arayisi, tekrar oynama ve muhurleme zamaninin oyuncuda olmasi.
- Baglam: kelimenin insanlik bilgisi, bilim tarihi ve bugunku kullanimla iliskilendirilmesi.

### 3.2 Ogrenme

- Her kart tek ana fikri ogretir.
- Kart, `ne oldu`, `kim veya hangi ekip katkida bulundu`, `bugun neye donustu` sorularindan en az ikisini yanitlar.
- Zor veya yeni kelime anlamlari kisa, yas grubuna uygun ve baglam icinde sunulur.
- Ana yolculukta rastgele tekrar kullanilmaz.
- Daha sonra kurulacak ustalik sistemi, zorlanilan kelimeyi neden tekrar gosterdigini oyuncuya aciklar.

### 3.3 Uyarlanabilir Yardim

- Oyun basarisizligi algilasa bile cevabi otomatik acmaz.
- Yalniz ipucu dugmesinin fark edilebilirligini artirabilir.
- Oyuncu anlam, uzunluk, harf veya kesisim yardimindan birini secmeden altin harcanmaz.
- Yardimin maliyeti ve etkisi onceden gorunur.

### 3.4 Android ve Play Kalitesi

Yayin kapilari dort ayri alanda uygulanir:

- Cekirdek deger: oyun acik bir kelime kesfi ve ogrenme degeri sunar.
- Kullanici deneyimi: ekran tasmasi, okunamayan metin, geciken dokunma ve kontrol disi yardim yoktur.
- Teknik kalite: crash, ANR, kayit kaybi, progression lock ve bozuk paket yoktur.
- Gizlilik ve guven: beyan edilmeyen veri, reklam kimligi, izin veya ag davranisi yoktur.

## 4. Kapsam Disi

`1.0.16` icine asagidakiler alinmayacak:

- 121-240 seviyeleri.
- Canli yapay zeka veya sunucu tabanli kelime dogrulama.
- Hesap, bulut kaydi, liderlik tablosu veya cok oyunculu mod.
- Reklam, gercek para odemesi veya uygulama ici satin alma.
- Yeni bir ana puzzle ailesi.
- Prosedurel ana yolculuk seviyesi.
- Lisansi veya kaynagi kanitlanamayan yeni asset.

## 5. Icerik Mimarisi

### 5.1 Dosya sinirlari

Yeni veriler bes seviyelik paketlere ayrilir:

```text
src/data/
  levels76to80.ts
  levels81to85.ts
  levels86to90.ts
  levels91to95.ts
  levels96to100.ts
  levels101to105.ts
  levels106to110.ts
  levels111to115.ts
  levels116to120.ts
  levelStories76to80.ts
  levelStories81to85.ts
  levelStories86to90.ts
  levelStories91to95.ts
  levelStories96to100.ts
  levelStories101to105.ts
  levelStories106to110.ts
  levelStories111to115.ts
  levelStories116to120.ts
```

`src/data/levels.ts` ve `src/data/levelStories.ts` yalniz deterministik birlestirme yapar. Runtime seviye veya hikaye uretmez.

### 5.2 Seviye veri sozlesmesi

Mevcut `LevelData` ile geriye uyumluluk korunur. `1.0.16` icin gerekli yeni editoryal metadata ayri ve opsiyonel bir katalogda tutulur; kayit semasi gereksiz yere degistirilmez.

Her seviye sunlari saglar:

- Sabit `levelId`.
- Benzersiz `themeId` ve uygun `sealId` iliskisi.
- `crossword` veya gercek davranisi tanimli `anagram`.
- 5-8 harfli havuz.
- 3-5 ana kelime.
- 1-4 gizli kelime; istisna yalniz belgelenmis final tasariminda.
- Her kelime icin dogru, kisa anlam.
- Harf tekrar sayilarina uygun uretilebilirlik.
- Tek bagli crossword yerlesimi.
- Ilk tamamlama ve gizli kelime ekonomisiyle uyumlu odul.

## 6. 45 Seviyelik Yolculuk

| Seviyeler | Mikro-macera | Bilgi ekseni | Bulmaca karakteri | Final odulu |
| --- | --- | --- | --- | --- |
| 76-80 | Dunyayi Olcmek | Biruni, olcum, cografya | Tekrarli harf ve olcu kavramlari | Olcum kureci |
| 81-85 | Suyla Calisan Makine | Cezeri, su duzenekleri, hareket | Fiil ve mekanik adlarin kesisimi | Mekanik kus |
| 86-90 | Zamanin Dislileri | Saat, takvim, usturlap | Sirali hedef ve uzun-kisa kelime dengesi | Usturlap parcasi |
| 91-95 | Yildiz Cetveli | Meryem el-Icliyye, Ulug Bey | Daha uzun fakat acik anlamli kelimeler | Yildiz levhasi |
| 96-100 | Gokyuzu Okulu | Ali Kuscu, astronomi egitimi | Yogun crossword ve bolum finali | Gok kubbe muhru |
| 101-105 | Denizlerin Hafizasi | Piri Reis, denizcilik, harita | Yon ve deniz temali gizli kelimeler | Harita rulusu |
| 106-110 | Sehirlerin Cizgisi | Matrakci Nasuh, sehir tasviri | Gorsel tema ve kavram transferi | Sehir minyaturu |
| 111-115 | Rasathanenin Gecesi | Takiyuddin, saat ve gozlem | Yuksek belirsizlik, istege bagli anlam yardimi | Rasathane anahtari |
| 116-120 | Bilginin Buyuk Muhru | Katip Celebi, Mimar Sinan, bilgi mirasi | Tum becerilerin kontrollu final karmasi | Usta muhru |

### 6.1 Bes seviyelik ritim

Her mikro-macera ayni iskeleti kullanir fakat ayni sunumu tekrarlamaz:

1. Kesif: tanidik kelime, yeni konu, hizli basari.
2. Bag kurma: yeni harf deseni veya daha yogun kesisim.
3. Secim: gizli kelime ya da koleksiyon hedefi.
4. Meydan okuma: paketin en yuksek bilissel yuku.
5. Final: ozel muhur, buyuk kart ve koleksiyon parcasi.

Mikro-macera finali atlanabilir ve 2.5 saniyeyi gecmez. Seviye 100 ve 120 bolum finalidir; daha buyuk sunum kullanabilir ancak ana CTA ekranda erisilebilir kalir.

## 7. Kelime Editoryal Standardi

### 7.1 Ana kelime

- Guncel Turkcede bagimsiz anlam tasir.
- Yalniz cekimli bicim, ek, kisaltma veya ozel ad degildir.
- Aile dostudur ve hedef yas grubunda yanlis anlasilma riski dusuktur.
- Anlami en az 10 karakterdir ve kelimeyi baska bir bicimde tekrar etmez.
- Havuzdan birebir harf sayisiyla uretilir.

### 7.2 Gizli kelime

- Guvenilir sozluk degeri vardir.
- Oyuncuya sayisi gosterilir, cevabi gosterilmez.
- Ayni seviyedeki ana veya bonus kelimeyle cakisma yapmaz.
- Yalniz ilk kesifte odul verir.

### 7.3 Bonus kelime

- Harf havuzundan uretilen ve sozlukte kabul edilen hedef disi kelimedir.
- Ana/gizli kelime gibi davranmaz; ayri tepki ve sinirli ilk-kesif odulu verir.
- Gecersiz girdiden farkli geri bildirim alir.
- Yerel sozlukte bulunmayan kelime icin oyun kesin dogruluk iddiasi kurmaz.

### 7.4 Tekrar politikasi

- 76-120 arasinda ayni normalize harf havuzu tekrarlanmaz.
- 76-120 arasinda ayni ana kelime tekrarlanmaz.
- 76-120 arasinda ayni gizli kelime en az 20 seviye aralik olmadan tekrarlanmaz.
- 1-75 ile ana kelime cakismasi varsayilan olarak yasaktir.
- Zorunlu pedagojik tekrar ancak en az 40 seviye aralik, farkli anlam/baglam ve provenance kaydiyla kabul edilir.
- Turkce `I/i`, `I/ı`, `İ/i`, `S/Ş`, `G/Ğ`, `O/Ö`, `U/Ü`, `C/Ç` kurallari test edilir.

## 8. Zorluk Tasarimi

Zorluk puani su girdilerden hesaplanir:

- Harf havuzu uzunlugu ve tekrarli harf sayisi.
- Ana kelime sayisi.
- Ortalama ve maksimum kelime uzunlugu.
- Kelime kullanilma sikligi ve soyutluk.
- Olası kelime belirsizligi.
- Crossword kesisim yogunlugu.
- Gizli kelime sayisi.

Kurallar:

- Her beslinin 4. seviyesi yerel zirvedir.
- 5. seviye finaldir; zor olabilir fakat sirf final oldugu icin adaletsiz olmaz.
- Sonraki beslinin ilk seviyesi nefes aldirabilir, ancak onceki beslinin ilk seviyesinden kolay olamaz.
- Bes seviyelik ortalama uzun vadede geriye sarmaz.
- Zorluk etiketi gercek olcumden turetilir; elle sisirilmez.
- Kapali testte yuksek ipucu ve terk orani birlikte gorulurse kelime veya yerlesim yeniden tasarlanir.

## 9. Tarih ve Bilim Icerigi

Her kesif karti:

- Proje icin sifirdan yazilir.
- En az iki guvenilir kaynakla kontrol edilir.
- Birincil kaynak, muze/universite/ansiklopedi veya hakemli calisma tercih eder.
- Tek kisiye tartismali bicimde butun bulusun sahipligini vermez.
- Katki zincirini ve donem kosullarini aciklar.
- Bugunku etkiyi abartmadan belirtir.
- Dogrudan uzun alinti kullanmaz.
- `draft`, `reviewed`, `approved` durumlarindan birini tasir; release yalniz `approved` kartlari kabul eder.

Kaynaklar `vault/07-Production/Content-Provenance-Ledger-v1.md` icinde seviye bazinda kaydedilir.

## 10. Gorsel Atmosfer

### 10.1 Makineler ve Gokyuzu, 76-100

- Palet: pirinc, gece moru, koyu lacivert, kontrollu sicak altin.
- Malzeme: disli, su, cam, yildiz haritasi, parsomene basili olcu cizgileri.
- Kahraman objeler: olcum kureci, mekanik kus, usturlap, yildiz levhasi, gok kubbe muhru.
- Hareket: yavas disli, su halkasi, hafif yildiz pariltisi; oynanisi engellemez.

### 10.2 Anadolu ve Osmanli Bilimi, 101-120

- Palet: Iznik mavisi, koyu kirmizi, parsomon, kontrollu altin.
- Malzeme: cini, ahsap, murekkep, harita, tas ve pirinc gozlem aleti.
- Kahraman objeler: harita rulusu, sehir minyaturu, rasathane anahtari, usta muhru.
- Hareket: harita acilimi, murekkep izi, rasathane isik gecisi; 2.5 saniye siniri.

### 10.3 Asset kurallari

- Gorsel uzerinde gomulu metin yoktur.
- Emoji placeholder yoktur.
- Yeni asset anlamli ad, boyut butcesi ve lisans/provenance kaydina sahiptir.
- Bilim insani benzerligi yerine izinli veya sembolik obje anlatimi tercih edilir.
- Dusuk hareket modu statik alternatif kullanir.
- AAB hedefi 45 MB altidir; sert karar noktasi 50 MB'dir.

## 11. Ses ve Haptik

- Harf secimi: kisa, yumusak ve 100 ms altinda tepki.
- Normal kelime: 120-180 ms onay sesi; girisi kilitlemez.
- Gizli kelime: ana kelimeden ayirt edilen kisa kesif motifi.
- Mikro-final: 2.5 saniyeden kisa, atlanabilir ses/muhur eslesmesi.
- Bolum finali: ozel motif; ayar ses seviyesi ve mute durumunu izler.
- Sesler mobil hoparlorde duyulur fakat distorsiyon olusturmaz.
- Haptik kapatilabilir ve basari/yanlis durumunu ses olmadan da ayirt ettirir.

## 12. Ilerleme ve Ekonomi

- Seviye ID'leri 1-120 arasinda sabittir.
- Mevcut `PlayerSave v2` korunur; yeni alan zorunlu degilse sema artirilmaz.
- Eski kayit `currentLevel=75` ise guncelleme sonrasi 76 acilir.
- Eski kayit 75 altindaysa oldugu yerde kalir.
- Gecersiz veya katalog disi currentLevel dinamik son seviyeye guvenli bicimde sinirlanir.
- Harita, sonuc modali ve profil yildizi `levelMastery` kaynagini kullanir.
- Ana odul seviye basina bir kez.
- Gizli ve bonus kelime odulu seviye-kelime anahtari basina bir kez.
- Tekrar oynama eksik gizli kelime veya yildiz icin degerlidir; sinirsiz altin kaynagi degildir.

## 13. Test ve Audit Mimarisi

### 13.1 Otomatik testler

- 120 ardışık ve benzersiz level ID.
- Her harf havuzu benzersiz.
- Her kelime harf havuzundan uretilir.
- Her crossword tek bagli yerlesir.
- Ana, gizli ve bonus listeleri cakisma yapmaz.
- 76-120 ana kelimeleri kendi icinde tekrarlanmaz.
- Jenerik hikaye ve tekrar dolgusu bulunmaz.
- Her seviyeye bir onayli kart eslenir.
- Zorluk bolum ortalamalari ve final esikleri gecilir.
- Save migrasyonu currentLevel, yildiz, altin, esya ve ayarlari korur.
- Odul idempotency testleri gecilir.
- Final seviye dinamik olarak 120'den turetilir.

### 13.2 Manuel cihaz matrisi

- En az bir Android 10/11 cihaz.
- En az bir Android 13-15 cihaz.
- Dusuk veya orta RAM profili.
- Kisa ekran ve uzun ekran.
- Seviye 75->76, 80->81, 100->101, 119->120 ve final sonrasi akış.
- Mute, dusuk ses, hareket azaltma ve dusuk kalite modu.
- Uygulama kapat/ac, guncelleme ve geri donus senaryolari.

### 13.3 Yayini durduran durumlar

- Tekrar eden harf havuzu veya aciklanmamis ana kelime tekrari.
- Uretilemeyen kelime veya baglanamayan crossword.
- Onaysiz/jenerik kesif karti.
- Kayit, yildiz, altin veya esya kaybi.
- Sinirsiz odul.
- Otomatik ipucu.
- Kisa ekranda erisilemeyen ana CTA.
- Crash, ANR, progression lock veya bozuk imza.
- Lisansi/kaynagi belirsiz asset ya da kopya metin.
- Aciklanmamis audit uyarisi.

## 14. Kapali Test Basari Olcutleri

- En az 12 test kullanicisi 14 gun kesintisiz opt-in.
- 75->76 gecisinde ilerleme kaybi bildirimi yok.
- Ayni besli icin iki veya daha fazla `sikici/tekrarli` bildirimi yok; varsa paket yeniden incelenir.
- Kritik akista crash veya progression lock yok.
- Bir seviyede test grubunun cogunlugunun istemsiz ipucu algisi yok.
- Zor seviyelerde ipucu talebi izlenir; otomatik kolaylastirma yapilmaz.
- Geri bildirim, cihaz, seviye, sorun, tekrar adimi ve sonuc alanlariyla kaydedilir.

## 15. Release Sozlesmesi

- Version name: `1.0.16`.
- Version code: `18`.
- Katalog: 120 authored levels.
- Track: Closed test; production only after eligibility and review.
- Network access: None.
- Ads: None.
- In-app purchases: None.
- Account/login: None.
- Supported locale: `tr-TR`.
- APK ve AAB imzali, hashleri manifestte kayitli.
- AAB icinde native `.so` yoksa native debug symbols uygulanamaz; varsa sembol paketi zorunludur.

## 16. Kaynak Temeli

- Android Core App Quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Google Play closed testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Self-Determination Theory and HCI Games Research: https://arxiv.org/abs/2405.12639
- Learning Mechanics and Game Mechanics under SDT: https://arxiv.org/abs/1805.08053
- Procedurally generating rules to adapt difficulty: https://arxiv.org/abs/2307.05518

Bu kaynaklar tasarim ilkelerini destekler; oyun metni veya seviye icerigi bu kaynaklardan kopyalanmaz.

## 17. Definition of Done

`1.0.16` ancak asagidakilerin tamami saglandiginda tamamlanmistir:

1. Seviye 76-120 elle yazilmis ve runtime katalogda acikca tanimlanmis.
2. 45 kart kaynak kayitli ve `approved`.
3. Kelime, tekrar, crossword, zorluk ve icerik auditleri temiz.
4. Tam test, lint, build ve release audit basarili.
5. Eski kayitla guncelleme testi basarili.
6. Iki fiziksel cihazda sinir seviyeleri oynanmis.
7. Gorsel, ses, font ve metin provenance kayitlari tamamlanmis.
8. Imzali APK/AAB uretilmis ve hashleri dogrulanmis.
9. Kapali test notlari ve geri bildirim kaydi hazir.
10. Bilinen yayin engelleyici hata kalmamis.

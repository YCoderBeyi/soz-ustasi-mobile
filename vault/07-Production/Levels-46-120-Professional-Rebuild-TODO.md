# Levels 46-120 Professional Rebuild TODO

Tarih: 19 Haziran 2026  
Hedef surum: `1.0.15`  
Durum: Uygulama basladi

## Teslimat Tanimi

Seviye 46-120 arasindaki 75 runtime klonu kaldirilacak ve her seviye asagidaki kapsamlariyla ozgun, elle yazilmis, test edilmis bir oyun seviyesi olacak:

- Benzersiz normalize edilmis harf havuzu.
- 3-5 ana kelime; anlasilir, aile dostu ve guncel Turkce.
- 1-4 gizli kelime; oyuncuya sayisi gosterilen fakat cevabi aciklanmayan kesif hedefi.
- Havuzdan uretilebilen bonus kelimeler icin sozluk uyumu.
- Calisan cengel yerlesimi veya gercek anagram sozlesmesi.
- Gercek kelime ozelliklerinden tureyen zorluk profili.
- Bolum ritmine uygun odul, yildiz, gizli kelime ve muhur dengesi.
- Ozgun tarih/bilim kesif karti; jenerik `Ustalik Adimi N` metni olmayacak.
- Mevcut seviye ID'si korunarak kayit ve yildiz uyumlulugu.

## Profesyonel Roller ve Kabul Kapilari

### Oyun tasarimi

- [ ] Her 5 seviyelik dongu `giris -> gelisim -> karisik beceri -> meydan okuma -> odul` ritmine sahip.
- [ ] Toparlanma seviyesi onceki bolum baslangicindan daha kolay degil.
- [ ] Yeni mekanik ilk kullanimda zaman baskisi olmadan ogretiliyor.
- [ ] Gizli kelime sayisi seviye baslangicinda gorunuyor; cevaplar gizli kaliyor.
- [ ] Oyuncu istemeden ipucu veya harf acilmiyor.

### Turkce dil ve kelime editorlugu

- [ ] Ana kelimeler bagimsiz anlam tasiyor; yalniz ek almis cekimli bicimler ana hedef degil.
- [ ] Ozel ad, kisaltma, tartismali iki harfli bicim ve guvenilmez argo ana hedef degil.
- [ ] Her anlam kisa, dogru ve hedef yas grubuna uygun.
- [ ] Turkce `I/I`, `İ/i`, `S/Ş`, `G/Ğ`, `O/Ö`, `U/Ü`, `C/Ç` normalizasyonu test ediliyor.
- [ ] Ana, gizli ve bonus kelimeler ayni seviyede birbiriyle cakismiyor.

### Bulmaca muhendisligi

- [ ] Her kelime, harf tekrar sayilari dahil, havuzdan eksiksiz uretilebiliyor.
- [ ] Crossword seviyelerinde butun ana kelimeler tek bagli yerlesime giriyor.
- [ ] Gecerli yan yana kelime hedef degilse bonus sozluk akimina gidiyor; sessizce reddedilmiyor.
- [ ] Ayni normalize harf havuzu 1-120 arasinda tekrar etmiyor.
- [ ] Ayni ana kelime en az 40 seviye gecmeden yeniden ana hedef olmuyor.
- [ ] Ayni gizli kelime en az 20 seviye gecmeden yeniden gizli hedef olmuyor.

### Ogrenme ve tarih icerigi

- [ ] 46-60: Bilgelik Evleri, ceviri, matematik ve erken mekanik.
- [ ] 61-80: Optik, tip, eczacilik ve dogal gozlem.
- [ ] 81-100: Makineler, saatler, astronomi ve haritacilik.
- [ ] 101-120: Anadolu ve Osmanli bilim/kultur tarihi.
- [ ] Her kart belirli olay, eser, kisi/ekip ve bugunku etkiyi anlatiyor.
- [ ] Tartismali bulus sahipligi tek kisiye kesin bicimde mal edilmiyor.
- [ ] Her kart editoryal kaynak notuna ve onay durumuna sahip olacak yeni modele gecis icin hazir.

### Zorluk ve oyuncu psikolojisi

- [ ] Zorluk etiketten degil; harf sayisi, kelime sayisi/uzunlugu, nadirlik, belirsizlik ve kesisimden hesaplanıyor.
- [ ] Bes seviyelik hareketli ortalama uzun vadede gerilemiyor.
- [ ] Tek seviye toparlanmasi onceki seviyeye gore en fazla yuzde 18.
- [ ] Her 5. seviye yuksek gorunurluklu ama sinirli odul veriyor.
- [ ] Basarisizlik cezalandirilmiyor; yardim yalniz oyuncu istegiyle kademeli sunuluyor.

### Ekonomi ve ilerleme

- [ ] Ilk tamamlama ana odulu yalniz bir kez veriyor.
- [ ] Gizli/bonus kelime odulu kelime-seviye anahtariyla yalniz ilk kesifte veriliyor.
- [ ] Tekrar oynama sinirsiz altin uretmiyor.
- [ ] Harita yildizi, kayitli `levelMastery` ve sonuc ekrani ayni kaynagi kullaniyor.
- [ ] Seviye ID'leri 46-120 olarak korunuyor; mevcut tamamlanma/yildiz/odul kayitlari silinmiyor.

### 3D sanat, UI ve ses

- [ ] Her 20 seviyelik bolum onayli palet, malzeme ve ana obje ailesine bagli.
- [ ] Gorsellerde gomulu Turkce metin, emoji placeholder veya lisansi belirsiz asset yok.
- [ ] Muhur, yildiz, kesif ve bolum final animasyonlari girdiyi gereksiz engellemiyor.
- [ ] Kisa telefonda ana eylem kaydirmadan ulasilabilir.
- [ ] Reduced motion ve dusuk kalite modu calisiyor.
- [ ] Efektler ses ayarini izliyor ve fiziksel cihazda duyulabilir seviyede.

### QA ve yayin

- [ ] Anti-klon testleri once mevcut katalogda kirmizi, yeni katalogda yesil.
- [ ] `npm test`, `npm run lint`, `npm run audit:levels`, `npm run audit:ui`, `npm run build` temiz.
- [ ] Audit aciklanmamis uyariyla AAB uretimine izin vermiyor.
- [ ] 1.0.14 -> 1.0.15 guncelleme testi ilerleme, yildiz, altin, esya ve ayarlari koruyor.
- [ ] Iki fiziksel Android cihazda 46, 60, 61, 80, 81, 100, 101 ve 120 sinir seviyeleri oynaniyor.

### Ozgunluk, telif ve provenans

- [ ] Her seviye, hikaye, aciklama ve koleksiyon metni proje icin sifirdan yaziliyor.
- [ ] Rakip oyunlardan seviye dizilimi, ekran kompozisyonu, karakter, ikon, ses, animasyon veya metin kopyalanmiyor.
- [ ] Esinlenilen mekanik yalniz soyut tasarim ilkesi olarak kullaniliyor; ad, gorsel dil, kurallar ve sunum Soz Ustasi'na ozgu oluyor.
- [ ] Her tarih/bilim kartinda olguyu dogrulayan en az iki guvenilir kaynak notu bulunuyor; kaynak cumleleri oyun metnine kopyalanmiyor.
- [ ] Dogrudan alinti kullanilmiyor; zorunlu bir alinti olursa kisa, atifli ve lisans/hak kontrolu tamamlanmis oluyor.
- [ ] Yasayan kisilerin fotografi, portresi veya benzerligi acik lisans/izin olmadan kullanilmiyor.
- [ ] Uretilen veya satin alinan her 2D/3D asset icin kaynak, uretici, tarih, lisans, kullanim siniri ve orijinal dosya hash'i kaydediliyor.
- [ ] Font, ses, muzik, shader, ikon ve texture lisanslari release paketine girmeden inceleniyor.
- [ ] `THIRD_PARTY_NOTICES.md` yalniz gercek bagimliliklari ve gerekli atiflari iceriyor.
- [ ] Lisansi bilinmeyen, internette bulunmus veya kaynagi kanitlanamayan dosya release paketinden cikariliyor.
- [ ] AI ile uretilen asset varsa kullanilan servis, tarih, prompt ozeti, kaynak girdi haklari ve insan duzenleme kaydi tutuluyor.
- [ ] AI ciktisi mevcut marka, karakter veya sanatci stilini taklit edecek bicimde istenmiyor ve benzerlik incelemesinden geciyor.
- [ ] Magaza aciklamasi ve ekran goruntuleri oyunda bulunmayan ozellik veya lisanssiz gorsel icermiyor.

## Uygulama Paketleri

## Monotonluk Karsiti Oyun Kurgusu

### Arastirmadan cikan kararlar

- Yetkinlik: Oyuncu ilerledikce gercekten daha uzun, daha belirsiz ve daha yogun kesisimli bulmacalar cozer; yalniz `difficulty` etiketi artmaz.
- Ozerklik: Oyuncu ipucu, gizli kelime arayisi ve muhru ne zaman basacagi konusunda karar verir.
- Anlam: Her bes seviyelik mikro-macera bir bilim/tarih sorusunu acar ve finalde somut bir kesif kartiyla kapanir.
- Akis: Dort seviyelik kontrollu yukselis sonrasinda final gelir; sonraki dongunun ilk seviyesi nefes aldirir fakat uzun donem tabani geriye gitmez.
- Seffaf uyarlama: Oyun otomatik cevap vermez. Yalniz ipucu dugmesini gorunur kilabilir ve oyuncunun sectigi yardim katmanini uygular.
- Etik tutundurma: Kaybetme korkusu, zorunlu reklam, rastgele sandik ve suclayici seri mesaji kullanilmaz.

Kaynak temeli:

- Self-Determination Theory ve oyun arastirmalarinda yuzeysel uygulama riski: https://arxiv.org/abs/2405.12639
- Ogrenme mekanikleri ile oyun mekaniklerinin motivasyon baglantisi: https://arxiv.org/abs/1805.08053
- Hedef zorluga gore kural uyarlama ve kurallari oyuncuya anlatma: https://arxiv.org/abs/2307.05518

### Bes seviyelik mikro-macera sozlesmesi

1. `Kesif`: Yeni tema, tanidik kelimeler, hizli basari.
2. `Bag Kurma`: Ayni bilgi temasinda yeni harf paterni veya daha yogun kesisim.
3. `Secim`: Oyuncu gizli kelime/koleksiyon hedefini istege bagli kovalar.
4. `Meydan Okuma`: Dongunun en yuksek bilissel yuku; otomatik yardim yok.
5. `Final`: Ozgun muhur animasyonu, buyuk kesif karti ve koleksiyon parcasi.

Her dongude sunum ayni kalmaz:

- Bir dongu ana kelime kesisimini one cikarir.
- Bir dongu anlamdan kelimeye dusunmeyi one cikarir.
- Bir dongu gizli kelime avini one cikarir.
- Bir dongu uzun kelimeyi parcali kesfetmeyi one cikarir.
- Bir dongu bolum finali ve koleksiyon tamamlama duygusunu one cikarir.

### 75 seviyelik 15 mikro-macera

| Seviyeler | Mikro-macera | Bilgi ekseni | Oyun farki | Final odulu |
| --- | --- | --- | --- | --- |
| 46-50 | Cebirin Anahtari | Harezmi, sayi ve algoritma | Kisa kelimeden uzun kavrama yukselis | Cebir tableti |
| 51-55 | Gizli Mesajlar | Kindi ve kriptanaliz | Anlam ipucuyla desen ayirma | Sifre diski |
| 56-60 | Bilgelik Evi | Ceviri hareketi ve Benu Musa | Yogunlasan cengel kesisimleri | Bilgelik muhru |
| 61-65 | Isigin Izinde | Ibnu'l-Heysem ve optik | Golge/mercek temali kelime ailesi | Kristal mercek |
| 66-70 | Sifanin Haritasi | Razi, Ibn Sina ve klinik gozlem | Anlamdan kelimeye kontrollu gecis | Sifa kodeksi |
| 71-75 | Cerrahin Aletleri | Zehravi ve tip aletleri | Uzun kelimeyi kisa baglarla acma | Gumus alet seti |
| 76-80 | Dunyayi Olcmek | Biruni, olcum ve cografya | Tekrarli harf ve olcum kavramlari | Olcum kureci |
| 81-85 | Suyla Calisan Makine | Cezeri ve mekanik | Hareket/duzen kavramli kesisimler | Mekanik kus |
| 86-90 | Zamanin Dislileri | Saat, takvim ve usturlap | Sirali hedef hissi veren ana kelimeler | Usturlap parcasi |
| 91-95 | Yildiz Cetveli | Meryem el-Icliyye ve Ulug Bey | Daha uzun ve nadir ama acik kelimeler | Yildiz levhasi |
| 96-100 | Gokyuzu Okulu | Ali Kuscu ve astronomi | Bolumun en yogun crossword finalleri | Gok kubbe muhru |
| 101-105 | Denizlerin Hafizasi | Piri Reis ve haritacilik | Yon/deniz temali gizli kelime avi | Harita rulusu |
| 106-110 | Sehirlerin Cizgisi | Matrakci Nasuh ve minyatur harita | Gorsel tema degisimi ve koleksiyon izi | Sehir minyaturu |
| 111-115 | Rasathanenin Gecesi | Takiyuddin, saat ve gozlem | Yuksek belirsizlik, istege bagli anlam yardimi | Rasathane anahtari |
| 116-120 | Bilginin Buyuk Muhru | Katip Celebi, Sinan ve bilgi mirasi | Tum becerilerin kontrollu final karmasi | Usta muhru ve bolum vitrini |

### Heyecan ve geri bildirim ritmi

- Normal kelime: 120-180 ms dokunsal/gorsel geri bildirim; oynanisi durdurmaz.
- Gizli kelime: kisa altin izi ve `bulunan/toplam` sayaci.
- Mikro-macera finali: en fazla 2.5 saniyelik atlanabilir muhur acilisi.
- Bolum finali: koleksiyon objesi 3D vitrine eklenir; oyuncu nesneyi daha sonra Vault'ta inceleyebilir.
- Zor bulmaca sonrasi: ceza yerine kisa yetkinlik ozeti (`Ipucusuz`, `Tum gizliler`, `Yeni kelime`).
- Tekrar oynama: daha iyi yildiz ve eksik gizli kelimeyi tamamlama sansi; sinirsiz ana altin yok.

### Tekduzeligi olcecek QA metrikleri

- Ardisik iki seviyede ayni harf havuzu, baskin kelime uzunlugu ve hedef kombinasyonu bulunmaz.
- Bes seviyelik dongude en az uc farkli hedef profili bulunur.
- On seviyelik pencerede ayni final animasyonu varyanti ikiden fazla kullanilmaz.
- Her 20 seviyede en az bir yeni koleksiyon objesi, iki buyuk kesif karti ve dort mikro-final bulunur.
- Test oyuncularinda seviye terk noktasi, ipucu talebi ve tekrar deneme sayisi anonim veri olmadan kapali test formuyla toplanir.
- `Sikici/tekrarli` geri bildirimi ayni aralikta iki test oyuncusundan gelirse ilgili besli dongu yeniden editoryal incelemeye girer.

### Paket 0 - Sözleşme ve kırmızı testler

- [x] Klon ureticinin kok nedeni dogrulandi.
- [x] Global havuz benzersizligi testi.
- [x] 40 seviye ana kelime tekrar mesafesi testi.
- [x] 20 seviye gizli kelime tekrar mesafesi testi.
- [x] Jenerik mastery hikayesi yasagi.
- [x] Zorluk hareketli ortalama testi.
- [x] Audit kurallarini warning yerine error yapma.

### Paket 1 - Seviye 46-70

- [x] 25 ozgun bulmaca kaydi (25/25 teknik olarak tamamlandi).
- [ ] 25 ozgun kesif/hikaye karti (25/25 teknik olarak tamamlandi; ikinci kaynak onaylari bekliyor).
- [x] Kelime editorlugu ve crossword kontrolu.
- [x] Zorluk/odul ilk dengelemesi.
- [x] Focused test (261 test) ve paket ici tekrar denetimi.

### Paket 2 - Seviye 71-95

- [ ] 25 ozgun bulmaca kaydi (5/25 tamamlandi).
- [ ] 25 ozgun kesif/hikaye karti (5/25 teknik olarak tamamlandi; ikinci kaynak onaylari bekliyor).
- [ ] Kelime editorlugu ve crossword kontrolu.
- [ ] Zorluk/odul dengelemesi.
- [ ] Focused test ve audit.

### Paket 3 - Seviye 96-120

- [ ] 25 ozgun bulmaca kaydi.
- [ ] 25 ozgun kesif/hikaye karti.
- [ ] Kelime editorlugu ve crossword kontrolu.
- [ ] Zorluk/odul dengelemesi.
- [ ] Level 120 final sozlesmesi.
- [ ] Focused test ve audit.

### Paket 4 - Entegrasyon

- [ ] `createMasteryLevels` ve `createMasteryLevelStories` runtime yollarini kaldir.
- [ ] Uc katalog ve uc hikaye paketini deterministik sirayla birlestir.
- [ ] Dinamik son seviye ve harita bolum sinirlarini dogrula.
- [ ] Save migrasyonu gerektirmeden sabit ID uyumlulugunu test et.

### Paket 5 - Release kapisi

- [ ] Tam regresyon.
- [ ] Android update smoke testi.
- [ ] Imzali AAB/APK, mapping ve native symbols.
- [ ] Release audit ve artifact hashleri.
- [ ] Kapali test release notlari ve Play Console yuklemesi.

### Paket 6 - Ozgunluk ve hak denetimi

- [ ] `vault/07-Production/Content-Provenance-Ledger-v1.md` her seviye/kart icin doldurulur.
- [ ] `vault/07-Production/Asset-License-Ledger-v1.md` her gorsel/ses/font icin doldurulur.
- [ ] Hikaye kartlarinda dahili metin benzerligi ve yinelenen cumle denetimi calisir.
- [ ] Asset hash/isim/kaynak tekrar denetimi calisir.
- [ ] THIRD_PARTY_NOTICES, gizlilik, magaza materyali ve binary birlikte hukuk/politika checklistinden gecer.

## Yayini Durduran Durumlar

- Herhangi bir tekrar eden harf havuzu.
- 40 seviyeden erken ana kelime tekrari.
- Calismayan crossword veya havuzdan uretilemeyen kelime.
- Jenerik/klon hikaye.
- Kayit/yildiz/odul kaybi.
- Sinirsiz tekrar odulu.
- Aciklanmamis audit uyarisi.
- Fiziksel cihazda progression lock, crash veya modal tasmasi.
- Kaynagi/lisansi belirsiz asset, kopya metin veya rakip urune ayirt edilemeyecek kadar benzeyen sunum.

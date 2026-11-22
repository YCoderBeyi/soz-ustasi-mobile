# Soz Ustasi Surum Yol Haritasi

Tarih: 19 Haziran 2026  
Durum: Uygulama plani hazir  
Ana uygulama plani: `docs/superpowers/plans/2026-06-19-release-train.md`

## Karar

Ilk Google Play uretim adayi `1.0.15` (`versionCode 17`) olacaktir. Daha once Play Console'a yuklenen paketler nedeniyle surum numarasi geriye alinmayacaktir.

## Surumler

| Surum | Teslim edilen deger |
| --- | --- |
| `1.0.15` | 1-120 kararlı seviye; 46-120 klon seviyelerin ozgunlestirilmesi; zorluk dongusu, kayit, odul, ses, arayuz, asset ve Play kontrolleri |
| `1.1.0` | 121-160 ozgun seviye, kesif kartlari ve bolum gorselleri |
| `1.2.0` | 161-200 ozgun seviye, bilim tarihi ve gelismis koleksiyon kasasi |
| `1.3.0` | 201-240 ozgun seviye, tam yolculuk ve buyuk final |
| `1.4.0` | Kontrollu yeni bulmaca turleri ve kalan 3D sunum iyilestirmeleri |
| `1.5.0` | Ustalik Atolyesi, aralikli tekrar ve haftalik yerel ogrenme ozeti |
| `1.6.0` | Seffaf, cihaz ici uyarlama ve kisisellestirilmis gunluk gorevler |
| `1.7.0` | Yalniz kalite ve retention esikleri gecilirse etik para kazanma deneyi |
| `1.8.0` | Hesap, bulut kayit ve anonim eszamansiz rekabet altyapisi |
| `2.0.0` | Sezonlar, kontrollu AI kelime inceleme ve yasayan rekabetci ogrenme platformu |

## Ilk Yayin Kapsami

`1.0.15` icine yalniz su maddeler girer:

- Mevcut 120 seviyenin kritik bug duzeltmeleri.
- 46-120 arasinda ilk 45 seviyeyi kopyalayan runtime ureticinin tamamen kaldirilmasi.
- 46-120 seviyelerinin ayni ID'ler korunarak ozgun harf havuzu, ana/gizli kelime ve hikayelerle yazilmasi.
- Ayni harf havuzunun tekrarini, 40 seviyeden erken ana kelime tekrarini ve gerileyen zorluk egimini yayin hatasina donusturen audit.
- Kayit ve guncelleme sonrasi ilerleme korumasi.
- Tekrar oynama odul suistimali engeli.
- Gizli/bonus kelime odulleri ve harita yildizi tutarliligi.
- Oyuncu istemeden ipucu verilmemesi.
- Odul modalinin kisa ekranda tasmamasi.
- Ses seviyesi kontrolu ve duyulabilir efekt dengesi.
- Ikon, splash, 3D asset ve paket boyutu temizligi.
- Lint, test, level/UI/release audit, imzali AAB ve fiziksel cihaz guncelleme testi.
- Binary ile uyumlu Play Console, Data Safety ve gizlilik beyanlari.

Ilk yayina yeni AI, reklam, hesap, sunucu, yeni puzzle ailesi veya 121-240 seviye genislemesi eklenmez. Ancak mevcut 120 seviye icindeki dejavu ve hatali zorluk dongusu yayina ertelenemez; bunlar `1.0.15` icin blocker kabul edilir.

## Yayin Kapilari

Her surumde:

1. Test, lint, build ve audit temizdir.
2. Kayit migrasyonu onceki surumden guncellemeyi korur.
3. Iki fiziksel Android cihazda smoke test tamamlanir.
4. Kritik/bloker hata sifirdir.
5. Gizlilik ve Play beyanlari binary ile aynidir.
6. Imzali AAB, semboller, mapping ve artifact hashleri kaydedilir.
7. Surum kademeli dagitilir; crash, ANR, save loss veya progression lock gorulurse durdurulur.

## Urun Ilkesi

- Ana yolculukta runtime seviye klonlama yapilmaz.
- 240 seviyenin tamami editoryal olarak yazilir ve denetlenir.
- Bilgi kartlari insan onayi olmadan yayina girmez.
- AI, oyuncunun cevabini otomatik vermek veya denetimsiz icerik yayinlamak icin kullanilmaz.
- Reklam, ilk yayini geciktirmez ve retention/kalite olculmeden eklenmez.
- Hicbir guncelleme oyuncunun mevcut ilerlemesini sessizce sifirlamaz.

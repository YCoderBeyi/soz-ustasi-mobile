# Asset License Ledger

Tarih: 19 Haziran 2026  
Durum: Release kapisi

## Zorunlu Alanlar

| Asset yolu | Tur | Kaynak/uretici | Uretim tarihi | Lisans/hak dayanaği | Atif gerekli mi | Kaynak girdi haklari | SHA-256 | Inceleme |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/SealedChestReward.tsx` (inline SVG) | Programatik vektor cizim | Proje icinde ozgun kod; harici gorsel/referans dosyasi kullanilmadi | 2026-11-25 | Proje calismasi olarak sifirdan yazildi; patent taramasi yapilmadi | Harici atif yok | Harici girdi yok | `4A37A1ABFB0CF84AECFF0F1470DD7DDA750FBF6C97B683FF98041A6973D4EF5A` | Kaynak ozgunluk beyanidir; hukuki hak/patent temizligi anlamina gelmez |
| `src/styles/sealed-chest-reward.css` | CSS animasyon ve gorunum | Proje icinde ozgun CSS; harici kod/animasyon paketi alinmadi | 2026-11-25 | Proje calismasi olarak sifirdan yazildi; patent taramasi yapilmadi | Harici atif yok | Harici girdi yok | `F881ABE58148018375E8B885D9BA94F4BA14DDC89F1F9FBB4B2BE1143BA0D62B` | Kaynak ozgunluk beyanidir; hukuki hak/patent temizligi anlamina gelmez |

## Kurallar

- `public/` ve Android `res/` altindaki her gorsel, ses, font ve 3D dosya bu tabloda yer alir.
- Proje icinde uretilen asset `original-project-work` olarak isaretlenir ve kaynak calisma dosyasi belirtilir.
- Satin alinan asset icin fatura/lisans belgesinin yerel arsiv yolu kaydedilir.
- Acik lisansli asset icin lisans surumu, URL ve atif metni kaydedilir.
- AI destekli uretimde servis, tarih, prompt ozeti ve referans girdilerin hak durumu kaydedilir.
- Kaydi olmayan asset `npm run audit:release` icin blocker kabul edilir.
- Benzerlik veya marka riski tasiyan asset yeniden tasarlanir; yalniz renk degisikligi ozgunluk sayilmaz.


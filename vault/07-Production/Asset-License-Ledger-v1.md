# Asset License Ledger

Tarih: 19 Haziran 2026  
Durum: Release kapisi

## Zorunlu Alanlar

| Asset yolu | Tur | Kaynak/uretici | Uretim tarihi | Lisans/hak dayanaği | Atif gerekli mi | Kaynak girdi haklari | SHA-256 | Inceleme |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Kurallar

- `public/` ve Android `res/` altindaki her gorsel, ses, font ve 3D dosya bu tabloda yer alir.
- Proje icinde uretilen asset `original-project-work` olarak isaretlenir ve kaynak calisma dosyasi belirtilir.
- Satin alinan asset icin fatura/lisans belgesinin yerel arsiv yolu kaydedilir.
- Acik lisansli asset icin lisans surumu, URL ve atif metni kaydedilir.
- AI destekli uretimde servis, tarih, prompt ozeti ve referans girdilerin hak durumu kaydedilir.
- Kaydi olmayan asset `npm run audit:release` icin blocker kabul edilir.
- Benzerlik veya marka riski tasiyan asset yeniden tasarlanir; yalniz renk degisikligi ozgunluk sayilmaz.


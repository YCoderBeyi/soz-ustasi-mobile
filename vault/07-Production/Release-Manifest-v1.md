# Release Manifest

- Version name: 1.2.9
- Version code: 34
- Track: Closed test, then production after eligibility
- Data model: PlayerSave v3
- Network access: Internet (AdMob)
- Ads: Rewarded + Rewarded Interstitial + Map Banner (AdMob)
- In-app purchases: None
- Account/login: None (isteğe bağlı Play Games lig opt-in)
- Supported locale: tr-TR
- Level catalog: 75 authored levels
- Release owner: Yasar Derebasi
- AAB SHA-256: E603C477315671CED3E0978288D0526EF5E7E00758376D000A2DFDB221A87D74
- APK SHA-256: A031DD2A1CA9698A788941733B6547EE84CBF8D773D8CF211986CD35B38A3BA2

## Play Games Services (lig) — ID doldurma

Play Console → Grow → Play Games Services → Setup / Leaderboards.

| Slot | Dosya | Placeholder | Durum |
| --- | --- | --- | --- |
| PGS project number | `android/.../values/games-ids.xml` → `game_services_project_id` | `1043491881859` (Cloud: `soz-ustasi-515420`) | Yazıldı |
| Haftalık puan ligi | `src/services/playGames/ids.ts` → `weeklyScore` | `Cgklg4fap68eEAIQAg` (Haftalık Puan) | Yazıldı |
| Bölge yıldızı ligi | `src/services/playGames/ids.ts` → `regionStars` | `Cgklg4fap68eEAIQAQ` (Söz Ustaları) | Yazıldı |

Önerilen board ayarları: weeklyScore = Higher is better, score format numeric; UI WEEKLY span. regionStars = Higher is better, ALL_TIME. Yayınladıktan sonra ~2 saat yayılım.

## Play Release Notes

Söz Ustası 1.2.9:
- Yeni Modern Anadolu karşılama ekranı: Kapadokya atmosferi, mühür ve net “Oyuna Başla / Devam Et” akışı.
- Harita yenilendi: Kapadokya masal diyagramı; seviye noktaları taş pedlere hizalandı.
- Daha sakin oyun geri bildirimi: doğru kelime izi, gizli kelime parıltısı ve mühür açılış dokunuşu.
- Ödül ve ipucu pencerelerinde CTA’lar netleştirildi; “İlerlemeyi Koru” cihaz kaydını hatırlatır.
- İsteğe bağlı ödüllü reklamla ipucu veya mağazada 30 altın kazan; ödüllü geçiş reklamı düzgün bağlandı.
- 75. seviyeden sonra yeni bulmacalarla devam et; kişisel rekorlarını profilde gör.
- Harita banner’ı oyun alanından ayrı; reklamı reddederek de oynamaya devam edebilirsin.
- Sakin Mod, erişilebilirlik, kayıtlı ilerleme ve Android reklam kimliği uyumluluğu iyileştirildi.
- Kullanılmayan görsel kaynaklar kurulum paketinden çıkarılarak indirme boyutu azaltıldı.

## Play Console (tr-TR, kısa)

```
• Modern Anadolu karşılama ve Kapadokya haritası
• Seviye noktaları taş pedlere hizalandı
• Daha sakin kelime / mühür geri bildirimi
• Ödül ve ipucu CTA’ları netleştirildi
• Ödüllü reklam ve geçiş reklamı düzeltmeleri
• 75 özgün seviye sonrası binlerce benzersiz üretim bulmacası, profil rekorları ve Sakin Mod
```

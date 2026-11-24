# Release Manifest

İlgili: [[Ads-Readiness-v1]], [[Ad-Monetization-C-Plus-Architecture-v1]], [[Data-Safety-v1]], [[UA-App-Campaign-Draft-v1]], [[Closed-Test-Checklist-v1]]

- Version name: 1.2.10
- Version code: 35
- Track: Closed test, then production after eligibility
- Data model: PlayerSave v3
- Network access: Internet (AdMob; optional Google Play Games)
- Ads: Rewarded + Interstitial + Map and LevelStart Banner (AdMob)
- In-app purchases: None
- Account/login: None (optional Play Games leaderboard opt-in)
- Supported locale: tr-TR
- Level catalog: 75 authored levels
- Release owner: Yasar Derebasi
- AAB SHA-256: E8C3D045E8E3B69B268B829700822DA068651DAE03299ADD022DAF9594562106
- APK SHA-256: A031DD2A1CA9698A788941733B6547EE84CBF8D773D8CF211986CD35B38A3BA2
- Artifact AAB: `artifacts/SozUstasi-1.2.10-release.aab`

## Play Games Services (lig) — ID doldurma

Play Console → Grow → Play Games Services → Setup / Leaderboards.

| Slot | Dosya | Placeholder | Durum |
| --- | --- | --- | --- |
| PGS project number | `android/.../values/games-ids.xml` → `game_services_project_id` | `1043491881859` (Cloud: `soz-ustasi-515420`) | Yazıldı |
| Haftalık puan ligi | `src/services/playGames/ids.ts` → `weeklyScore` | `Cgklg4fap68eEAIQAg` (Haftalık Puan) | Yazıldı |
| Toplam yıldız ligi | `src/services/playGames/ids.ts` → `regionStars` | `Cgklg4fap68eEAIQAQ` (Söz Ustaları) | Yazıldı |

Önerilen board ayarları: weeklyScore = Higher is better, score format numeric; UI WEEKLY span. regionStars = Higher is better, ALL_TIME. Yayınladıktan sonra ~2 saat yayılım.

## Play Release Notes

Söz Ustası 1.2.10:
- İçerik denetimi üç uzman ajana bölündü: seviyeler 1–25, 26–50 ve 51–75.
- Yeni kelime adayları bağımsız incelemelerden geçirildi.
- Tahta geri bildirimi: mühür baskısı, ipucu mist tonu ve sakin hedef kenarı.
- İsteğe bağlı Play Games skor paylaşımı (haftanın en iyi seviye puanı / toplam yıldız).

### Privacy and leaderboard data

Play Games lig katılımı isteğe bağlıdır. Katılım açıkken ve Sakin Mod kapalıyken seviye tamamlandığında o seviyenin puanı haftalık leaderboard'a, toplam yıldız puanı da all-time leaderboard'a gönderilir. Sıralama ekranı public leaderboard koleksiyonunu kullanır; oyuncu adı/profil görünürlüğü Google Play Games hesap ayarlarına bağlı olabilir. Katılım kapatıldığında yeni skor gönderimi durur; daha önce gönderilmiş skorlar bu uygulama ayarıyla silinmez. Google Play Console Data Safety beyanı, bu sürümün gerçek SDK davranışı ve Google'ın güncel veri açıklamaları incelenerek ayrıca doğrulanmalıdır; bu manifestte Console cevapları belirlenmiş sayılmaz.

## Play Console (tr-TR, kısa)

```
• İçerik denetimi 1–25 / 26–50 / 51–75 ajan aralıkları
• Yeni kelime adayları bağımsız incelemeden geçti
• Mühür baskısı ve sakin tahta geri bildirimi
• İsteğe bağlı Play Games ligi
```

# Psikoloji Ekran Checklist

Related: [[Modern-Anadolu-Production-Prompt-v2]], [[Global-UI]]

Hedef: özerklik, yetkinlik, düşük bilişsel yük, sakin geri bildirim.

| # | Madde | Durum |
| --- | --- | --- |
| 1 | Harita veil hafif (yol birincil) | Yapıldı |
| 2 | Karşılama veil yumuşak (CTA okunaklı) | Yapıldı |
| 3 | Harita chrome sade (günlük/mastery ikincil) | Yapıldı |
| 4 | İpucu: isteğe bağlı metin + kapat | Yapıldı |
| 5 | Ödül: eşit CTA + seçim notu | Yapıldı |
| 6 | Profil boş/dolu durum | Yapıldı |
| 7 | LevelStart + oyun HUD Anadolu chrome | Yapıldı |
| 8 | Çark/tahta geometrisi dokunulmadı | Korundu |
| 9 | Ayarlar: Anadolu + Sakin Mod üstte | Yapıldı |
| 10 | Pause: Anadolu + özerklik notu | Yapıldı |
| 11 | Global sis/filigran/karartma budandı | Yapıldı |
| 12 | Karar: sis geri gelmez; profil/ayar/mağaza açıldı | Yapıldı |

## Karar (2026-11-21)

- **Koru:** harita/karşılama aydınlık; sis/fog yok; modalda orta karartma (odak için).
- **Düzelt:** profil/ayar/mağaza “mağara yeşili” → daha açık petrol (umut / rahat kontrol).
- **Ambient:** `premiumSheen` + `premiumBloom` (ince altın lake ışığı). `atmosphereSweep` / yan vignette / partikül sis — hayır.
- **Oyun alanı:** tahta/çark üzerinde ambient yok.
- **Motion (yaklaşım 1 / itiraz 2026-11-21):** yanlış = renk flaşı; doğru = trail + bloom (kısa, olay bağlı). Tahta/çark filter glow RET (sık UI motion). Sıradaki = opacity beckon. Sakin Mod / reduce-motion korunur.
- **Motion SSOT:** gameplay/map/tile `@keyframes` → `src/styles/animations.css`; süre/easing token’ları `--feedback-*-ms`, `--anadolu-ease-motion`.

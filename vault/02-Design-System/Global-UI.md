# Global UI Tasarım Sistemi

**Aktif production brief (2026-11-21):** [[Modern-Anadolu-Production-Prompt-v2]] — çark/tahta kilitli; Modern Anadolu token’ları ve ekran sırası orada.

**CSS SSOT:** `src/styles/base.css` içindeki `--anadolu-*` (petrol, ivory, copper, burgundy, gold, ink, spacing, motion). Eski `--brand-*` köprülenir; yeni UI Anadolu token’larını kullanır.

## Frame

- Design frame: 390 x 844 pt
- Render target: 1080 x 2340 px
- Orientation: portrait only
- Safe area: iPhone notch ve Android navigation bar destekli
- Touch floor: `--ui-touch-floor` ≥ 44px

## Renkler (Modern Anadolu)

- Petrol: `#133D36` / deep `#0C2823`
- Ivory parchment: `#F5E8CE`
- Copper: `#BF8744`
- Wax burgundy: `#6F3928`
- Gold: `#D5AD57` / soft `#F2CF77`
- Ink: `#263028`
- Legacy navy/gold referansları yalnızca geriye dönük yüzeylerde

## Tipografi

- Başlık / marka: Georgia / serif display
- Gövde / UI: Inter, SF Pro veya Noto Sans
- Kelime kutuları: bold, yüksek kontrast
- Harf halkası: semibold, büyük puntolu (geometri kilitli)

## Animasyon

- Tap: `--anadolu-tap-ms` (140ms) + `--anadolu-ease-tap`
- Küçük geçiş: `--anadolu-transition-ms` (240ms) + `--anadolu-ease-out`
- Word found: glow + kısa hareket, 280 ms
- Meaning card: slide/fade, 2.2 sn görünür
- Seal open: ışık halkası + altın partikül, 900 ms
- `prefers-reduced-motion` / `html.reduce-motion` zorunlu

## Özel Bileşen Stilleri

### StoryBanner
- Z-index: 1, position: relative
- Padding: 8px 12px, margin: 0 12px
- Border-radius: 8px
- Background: `rgba(244, 230, 200, 0.12)` + `border: 1px solid rgba(244, 230, 200, 0.2)`
- Backdrop-filter: blur(4px)
- Yazı: 12px, `rgba(255, 247, 226, 0.85)`
- Kapatma butonu: 22×22px, koyu yarı-saydam arka plan

### FavStar (Anlam Kartı)
- Varsayılan: `rgba(75, 51, 35, 0.35)` (Ink Brown muted)
- Aktif: `#D9A441` (Seal Gold) + text-shadow glow
- Transition: color 180ms, transform 120ms
- WordCard'da: `rgba(255, 247, 226, 0.3)` → aktif `#F1C96A`

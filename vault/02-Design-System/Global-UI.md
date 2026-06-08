# Global UI Tasarım Sistemi

## Frame

- Design frame: 390 x 844 pt
- Render target: 1080 x 2340 px
- Orientation: portrait only
- Safe area: iPhone notch ve Android navigation bar destekli

## Renkler

- Background Deep Navy: `#101827`
- Seal Gold: `#D9A441`
- Warm Parchment: `#F4E6C8`
- Ink Brown: `#4B3323`
- Success Emerald: `#3FBF7F`
- Error Ruby: `#D94A4A`
- Soft White: `#FFF9EF`
- Muted Text: `#B8A98B`

## Tipografi

- Başlık: serif hissi, Playfair Display veya Cormorant Garamond tarzı
- Gövde: Inter, SF Pro veya Noto Sans
- Kelime kutuları: bold, yüksek kontrast
- Harf halkası: semibold, büyük puntolu

## Animasyon

- Tap feedback: 0.94 scale -> 1.00, 120 ms
- Word found: glow + kısa hareket, 280 ms
- Meaning card: slide/fade, 2.2 sn görünür
- Seal open: ışık halkası + altın partikül, 900 ms
- Story banner: storyIn (fade + translateY -8px → 0), 300 ms
- FavStar: active scale(1.2), 120 ms

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

# GamePlayScreen

Ana oyun ekranı MVP'nin en kritik ekranıdır.

## Bölge Dağılımı

- StoryBanner: %5 — level'e bağlı inline story (varsa)
- Top bar: %8
- Kelime kutuları: %28
- Anlam kartı + FavStar: %14
- Harf halkası: %32
- Alt aksiyonlar: %8
- Safe spacing: %5

## Componentler

- StoryBanner — level'in `story` alanını gösterir, kapatılabilir
- GameTopBar
- SealWordGrid
- WordSlot
- MeaningCard + FavStar — anlam kartı üzerinde favori toggle yıldızı
- LetterWheel
- LetterNode
- ConnectionLine
- HintButton
- ShuffleButton (Fisher-Yates)
- SealProgressButton
- HiddenWordToast
- WrongWordToast
- PauseModal
- RewardModal
- SealOpenAnimation
- ThemeBackground
- CoinCounter

## UX Kuralları

- Harf node dokunma alanı minimum 48 pt olmalı.
- Harf seçimi sırasında ekran scroll etmemeli.
- Yanlış kelime animasyonu kısa ve akışı bozmayan yapıda olmalı.
- Anlam kartı değer katmalı, oyunu yavaşlatmamalı.
- StoryBanner oyun akışını kesmez, tek dokunuşla kapatılabilir (storyIn animasyonu).
- FavStar: active scale(1.2) feedback, altın rengi toggle.

## İlgili Diğer Ekranlar

- **VaultScreen** — Favoriler sekmesi: `favoriteWords` dizisini filtreler, her wordCard'da favori toggle'ı bulunur.

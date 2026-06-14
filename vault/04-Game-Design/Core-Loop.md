# Core Loop

1. Oyuncu level seçer.
2. Harfleri bağlayarak kelime üretir.
3. Doğru kelimeler mühür kutularına yerleşir.
4. Kelime anlam kartı kısa süre görünür; üzerinde favori yıldızı bulunur.
5. Level'in inline `story` alanı varsa StoryBanner gösterilir (kapatılabilir).
6. Tüm ana kelimeler bulununca Söz Mührü açılır.
7. Ödül alınır (baseCoin her levelde artar).
8. Sonraki level veya harita akışına dönülür.

## Ek Döngüler

- Gizli kelime -> Söz Hazinesi koleksiyonuna eklenir.
- Favori kelime -> anlam kartındaki yıldız ile toggle edilir, VaultScreen'de filtrelenebilir.
- Günlük görev -> coin ve retention sağlar.
- Tema geçişleri -> her 5-6 levelde yeni atmosfer açar.

## Coin Ekonomisi

- baseCoin = 15 + levelId×1.8 + avgDiff×5
- L1: ~20, L45: ~115 (son level'da ortalama zorluk 4.15 olduğu için eskiye göre daha yüksek).
- hiddenWordBonus: gizli kelime ödülleri toplamı / 5
- Gizli kelime ödülleri: 5-15 coin arası (keşfi anlamlı kılmak için eski 3-4'ten artırıldı).
- Ödül, level'in ortalama zorluk seviyesine göre ölçeklenir (zor level daha çok kazandırır).

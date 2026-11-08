# UI Denetimi v1 (2026-11-08)

Yöntem: Playwright ile 12 ekran, 390x844. Her ekranda her etkileşimli öğenin boyutu, yazı boyutu, kontrastı ve sınıfı ölçüldü (betik: oturum geçici klasörü, `inventory.mjs` + `analyze.cjs`). Ayrıca ekran görüntüleri gözle incelendi.

## Sayısal bulgular
| Bulgu | Değer | Eşik |
|---|---|---|
| Farklı düğme sınıfı | 30 | tek aile |
| Geniş düğmelerde farklı yükseklik | 13 (28, 36, 38, 43, 48, 52, 54, 58, 60, 66, 72, 76, 86) | 3 (44/52/60) |
| Farklı köşe yuvarlaklığı | 0, 8, 12, 13, 14, 18, 20 | 2 |
| Dokunma hedefi < 44 px | harita sayfa noktaları (10x10), günün görevi (36), level kapat (42), gizlilik bağlantısı (38), mağaza sekmeleri (43), **mağaza satın al (42)**, ses kaydırıcı (28) | 44 |
| Düğme yazısı < 12 px | alt gezinme etiketleri (9), mühür (10), gizlilik (11) | 12 |
| Erişilebilir etiketsiz düğme | 0 | 0 |

## Gözle bulgular
- **İpucu penceresi:** 4 eş boyutlu (316x86) dev düğme, her biri ayrıca bir kutunun içinde. Gerçek karar iki eksenli (hangi ipucu x altınla mı reklamla mı) ama renk (altın/yeşil) ödeme biçimini değil ipucu türünü kodluyor. "REKLAMLA (KALAN: 6)" iki satıra bölünüp yüz sınırına değiyor. Altın yetersizse düğme sönük değil, tıklayınca toast çıkıyor.
- **Duraklatma:** Üç geçiş düğmesinden ikisi yan yana, üçüncüsü tek başına yarım satırda kalıyor. "Leveli yeniden başlat" ilerlemeyi sıfırlıyor ama onay yok. Pencere Escape ile kapanmıyor (yalnız Kapat).
- **Ayarlar:** "Sürüm" kartı ile "Gizlilik Politikası" düğmesi üst üste biniyor.
- **Profil:** Sözlük ve Mağaza satırları alt gezinmeyle aynı işi yapıyor; gezinme sekmesi olan bir ekranda ayrıca büyük geri düğmesi var. Geri düğmesi 80 px, oyundakiyle (44 px) farklı dil.
- **Mağaza:** Üç sekme iki satıra kırılıyor, satın al düğmeleri 42 px.
- **Harita:** Sayfa noktaları tıklanabilir ama 10 px ve düşük kontrast.

## Kararlar
- Tek token kaynağı: `src/styles/ui-tokens.css` (dokunma 44, kontrol yükseklikleri 44/52/60, yarıçap 12/16, yazı en az 12).
- Eski boyut/yarıçap bildirimleri CSS ayrıştırıcısıyla silinip yalnız token dosyasında tanımlanır.
- Test: dokunma hedefi ve yazı boyutu tabanı otomatik denetlenir (tarayıcı taraması, `ui-audit`).

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
| 13 | Lig opt-in (Play Games); Sakin Mod’da skor yok | Yapıldı |

## Karar (2026-11-21)

- **Koru:** harita/karşılama aydınlık; sis/fog yok; modalda orta karartma (odak için).
- **Düzelt:** profil/ayar/mağaza “mağara yeşili” → daha açık petrol (umut / rahat kontrol).
- **Ambient:** `premiumSheen` + `premiumBloom` (ince altın lake ışığı). `atmosphereSweep` / yan vignette / partikül sis — hayır.
- **Oyun alanı:** tahta/çark üzerinde ambient yok.
- **Motion (yaklaşım 1 / itiraz 2026-11-21):** yanlış = renk flaşı; doğru = trail + bloom (kısa, olay bağlı). Tahta/çark filter glow RET (sık UI motion). Sıradaki = opacity beckon. Sakin Mod / reduce-motion korunur.
- **Motion SSOT:** gameplay/map/tile `@keyframes` → `src/styles/animations.css`; süre/easing token’ları `--feedback-*-ms`, `--anadolu-ease-motion`.
- **Lig (isteğe bağlı):** Ayarlar toggle → `leagueOptIn`; mühürde haftalık puan + bölge yıldızı gönderimi; Sakin Mod skor göndermez. Play Console ID’leri `ids.ts` + `games-ids.xml` placeholder.

## Yayın öncesi deneyim doğrulaması

Kaynak kodu ve otomasyon tek başına ekranın gerçek cihazda okunaklı, dokunulabilir veya oyuncu için anlaşılır olduğunu kanıtlamaz. Bu nedenle aşağıdaki iki kapı ayrı ayrı tamamlanır; biri diğerinin yerine geçmez.

### Görsel ve etkileşim denetimi

- [ ] Tarayıcıda 360×720, 390×844 ve dar yatay görünümde açılış → tanıtım → harita → seviye başlangıcı → oyun → ödül → mağaza → profil → ayarlar → duraklatma akışını dolaş.
- [ ] Küçük ekran, metin büyütme, klavye odağı ve azaltılmış hareket tercihinde ekran görüntüsü al; kesilme, yatay taşma, çakışan hit-area, görünmeyen birincil eylem ve konsol hatalarını kaydet.
- [ ] Gerçek Android cihazda güvenli alan/çentik, geri tuşu, dokunma hedefleri, ses, çevrimdışı devam ve reklam başarısızlığı davranışını doğrula.
- [ ] Her bulgu için ekran, viewport/cihaz, yeniden üretim adımı, beklenen/gerçek sonuç ve kanıt bağlantısını ekle.

### İnsan oyuncu kullanılabilirlik oturumu

- [ ] Oyunu daha önce oynamamış 5 hedef oyuncuyla kısa, moderatörün çözümü göstermediği oturum yap. Bu sayı biçimlendirici nitel gözlem içindir; istatistiksel başarı iddiası değildir.
- [ ] Oyuncudan düşüncelerini sesli paylaşmasını iste; kişisel bilgi toplama. Görevler: ilk kez oyuna girip 1. seviyeyi başlatmak, ana kelimeleri bulup mührü tamamlamak, haritaya dönmek, sesi ayarlardan değiştirmek ve profilde rekorunu bulmak.
- [ ] Yardım gereksinimi, yanlış dokunuş, geri dönme, ipucu kullanımı, tereddüt edilen metin ve oyuncunun kendi sözleriyle bir sonraki adımı açıklayıp açıklayamadığını not et.
- [ ] Kabul ölçütü: ilerleme kaybı veya erişimi engelleyen kusur yok; kritik görevlerde oyuncuya çözümü söylemek gerekmiyor; en az 4/5 oyuncu bir sonraki eylemi yardım almadan buluyor. Eşik kaçarsa yayın öncesi bulguyu düzelt ve aynı görevi yeniden dene.

**Durum:** Bu çalışma turunda otomasyon ve içerik audit’i tamamlandı; görsel tarayıcı denetimi bağlantılı tarayıcı bulunamadığı için, fiziksel cihaz denetimi ve insan oyuncu oturumu henüz yapılmadı. Bu üçü tamamlanmadan bunlar “geçti” olarak raporlanmaz.

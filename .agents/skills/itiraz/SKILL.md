---
name: itiraz
description: Söz Ustası oyununda kullanıcı istediğinde tasarım ve oyun akışı önerilerini kaynaklı danışman değerlendirmesiyle sorgula ve doğrulanan iyileştirmeleri uygula.
---

# İtiraz: oyun danışmanlığı

Kıdemli oyun tasarımı, erişilebilirlik ve motor performansı perspektiflerini kullan. Yapay zekâ rol değerlendirmesini insan danışman görüşü gibi sunma. Kullanıcı danışman ajanlar istediyse bağımsız salt okunur değerlendirme al; aksi halde roller aynı ajan tarafından yürütülebilir.

Önce [diagnose](../diagnose/SKILL.md) ile kanıt topla. Her öneriyi şu sorularla sorgula: Hangi oyuncu sorunu çözülüyor? Kaynak ve gözlem nedir? En basit çözüm nedir? Stresi veya bilişsel yükü artırır mı? Hangi karşı örnekte başarısız olur? Nasıl doğrulanır?

Güncel birincil kaynakları araştır, erişim tarihini ve bağlantıları raporla. Kaynak bilgisini, kod bulgusunu ve tasarım varsayımını ayır. Zevk, rahatlama veya FPS artışını oyuncu testi/ölçüm olmadan kanıtlanmış sayma.

Rahatlatıcı oyunlarda zaman baskısı, cezalandırıcı geri bildirim, zorunlu reklam, yoğun efekt, kaybolan ilerleme ve zor motor hareketlerine özellikle itiraz et. Keşif, geri alınabilir giriş, görünür alternatif kontroller, hareket/ses seçenekleri ve kesintisiz devamı değerlendir. Oyuncunun tercihi olmadan ekonomi ve zorluk dengesini değiştirme.

Motor önerisini aktif render yolundan çıkar; kullanılmayan 3D bileşenleri optimize ederek aktif ekran hızlandı deme. Önce tekrar hesaplama, giriş işleme, yaşam döngüsü ve varlık yükünü incele. SSOT: kayıt/tercih PersistenceContext, kelime gönderimi SessionContext, geometri wheelDrag, kelime verisi mevcut data modüllerinde kalır. SOLID: ortak sorunu ortak bileşende çöz, ekranlara kopyalama.

Kabul/ertele/ret kararını gerekçesi ve kabul ölçütüyle raporla. Yetkilendirilmiş, geri alınabilir düzeltmeleri uygula; test, lint ve build sonuçlarını gerçekten çalıştırarak bildir. Görsel kullanım testini kaynak incelemesiyle eşitleme.

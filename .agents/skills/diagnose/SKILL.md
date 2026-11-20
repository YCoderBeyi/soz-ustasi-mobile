---
name: diagnose
description: Söz Ustası ekran ve etkileşim sorunlarını yeniden üretim, kök neden ve kanıta dayalı doğrulamayla teşhis et.
---

# Diagnose / grilling

ScreenRouter'dan aktif ekran envanterini çıkar; pencere ve boş/dolu/kilitli/seçili/hata durumlarını ekle. Mevcut değişiklikleri kontrol et ve koru.

Tarayıcı varsa her ekranı gerçek UI üzerinden dolaş: açılış, rehber, harita, seviye başlangıcı, oyun, hazine, mağaza, profil, ayarlar. Dar/kısa ve normal mobil görünüm, klavye odağı, azaltılmış hareket, uzun metin ve kaydırmayı kontrol et. Tarayıcı yoksa engeli kaydet; DOM testi veya kaynak okumaya 'ekranı kullandım' deme.

Her bulgu için önem, ekran/durum, yeniden üretim, beklenen/gerçek davranış, kök neden, düzeltme ve doğrulama yaz. 'Bütün tasarım sorunları çözüldü' gibi kapsamı kanıtlanamayan iddialar kurma.

Grilling: Bu gerçek hata mı yoksa tercih mi? Sorun shared bileşenden mi geliyor? Dokunma/klavye ve ekran okuyucu sonucu aynı mı? Pencere kapanınca odak geri geliyor mu? Boş durumda sonraki eylem anlaşılır mı? Fiyat/ödül/tercih verisi tek kaynaktan mı? Hangi durum hâlâ test edilmedi?

Davranış hatasını anlamlı başarısız testle göster, en küçük düzeltmeyi yap ve testi tekrar çalıştır. Görsel kusurları uygun ekran görüntüsüyle doğrula. Son raporda düzeltildi, açık ve doğrulanamadı durumlarını ayır.

# Ekran teşhisi ve itiraz değerlendirmesi — 8 Kasım 2026

## Kapsam ve kanıt sınırı

Aktif dokuz ekran ScreenRouter üzerinden envanterlendi. Kaynak incelemesi ve gerçek GameProvider ile DOM etkileşim testi yapıldı. Tarayıcı çalışma zamanı iki kontrolde boş tarayıcı listesi döndürdü. Bu rapor **gerçek cihazda tüm ekranlar kullanılarak yapılmış görsel denetim değildir**. Kontrast, piksel taşması, görsel denge, FPS ve dokunma hissi sertifikalandırılmadı.

Danışmanlık, kıdemli oyun tasarımı, erişilebilirlik ve performans perspektifleriyle yürütülen yapay zekâ değerlendirmesidir; insan uzmana danışıldığı iddia edilmez. Bağımsız danışman ajanından bu rapor yazılırken sonuç alınamadı.

## Doğrulanan sorunlar ve uygulanan düzeltmeler

| ID / önem | Ekran ve yeniden üretim | Kök neden → düzeltme | Kanıt |
|---|---|---|---|
| D01 / P2 | Açılış: Başla/Devam Et | Gerçek yüklemeye bağlı olmayan 100 zamanlayıcı güncellemesi → doğrudan geçiş | İlk/geri dönen kullanıcı DOM testleri |
| D02 / P1 | Yeni oyun: rehbere erişim | Açılış her zaman haritaya gidiyordu → ilerleme yoksa mevcut rehber açılır | Gerçek sağlayıcılarla akış testi |
| D03 / P2 | Rehber: geri dönmek veya atlamak | Yalnız ileri eylemi → Önceki ve Tanıtımı Atla | DOM davranış testi |
| D04 / P2 | Rehber: adım değişimi | Yalnız görsel noktalar → canlı adım sayısı ve açıklama | DOM durum testi |
| D05 / P2 | Rehber: kısa ekran | Fazla içerik için kaydırma garantisi yok → dikey kaydırma | CSS; cihaz doğrulaması bekliyor |
| D06 / P1 | Ayarlar: Gizlilik Politikası | Modal durumu değişiyor ama bileşen render edilmiyordu → PrivacyModal bağlandı | Aç/kapat testi ve gerçek sağlayıcı akışı |
| D07 / P1 | Gizlilik: Tamam/Kapat | Her yerde pause durumuna dönüyordu → oyun içinde pause, ayarlarda null | İki bağlam için DOM testi |
| D08 / P1 | Tüm ortak pencereler: Tab/Shift+Tab | İlk odak/odak çevrimi yok → ortak Modal içinde odak yönetimi | Başarısız test gösterildi, düzeltme sonrası geçti |
| D09 / P2 | Pencere kapanışı/rerender | Açan düğmeye dönüş yok → odak geri yüklenir; yeni callback odağı sıfırlamaz | Odak ve Escape testi |
| D10 / P1 | Pencereler: uzun metin/kısa ekran | Ortak modal overflow:hidden → dikey kaydırma | CSS; cihaz doğrulaması bekliyor |
| D11 / P2 | Ayarlar: açık/kapalı seçimler | Yalnız görsel anahtar → switch ve aria-checked | DOM durum testi |
| D12 / P2 | Ayarlar: hareket hassasiyeti | Ana ayarlarda seçenek yok → mevcut PersistenceContext tercihi kullanıldı | Tercih ve kök CSS sınıfı akış testi |
| D13 / P2 | Duraklatma: ses/titreşim | Seçim durumu bildirilmemiş → aria-pressed | Kaynak kontrolü; tam ses/haptik cihaz testi bekliyor |
| D14 / P2 | Harita: bölge noktaları | Çok sayıda sabit genişlikli nokta → ekran genişliğinde yatay kaydırılabilir grup, 44px kontrol genişliği | CSS ve DOM; dar cihaz doğrulaması bekliyor |
| D15 / P2 | Harita: bölge seçimi | Aynı tema adları ve seçili durum eksikliği → benzersiz bölge/seviye adı, aria-current | Bölge değiştirme DOM testi |
| D16 / P2 | Harita: çapraz/dikey sürükleme | Yalnız x farkı ölçülüyordu → yatay baskınlık ve iptal temizliği | Dikey sürükleme DOM testi |
| D17 / P2 | Harita: kilitli/tamamlanan seviye | İngilizce teknik durum etiketi → Türkçe Seviye ve durum adı | Gerçek sağlayıcı akışı |
| D18 / P2 | Mağaza: fiyat düğmeleri ve sekmeler | Düğme adı yalnız fiyat → ürün/fiyat/eylem ve yetersiz bakiye açıklaması, seçili sekme durumu | DOM kontrol testi |
| D19 / P2 | Mağaza/harita: geri bildirim | Görsel toast → role=status | Kaynak kontrolü |
| D20 / P2 | Hazine: favori/gizli boş durum | Her filtrede aynı genel mesaj → filtreye uygun nasıl doldurulur açıklaması | Favori boş durum testi |
| D21 / P2 | Profil: kısa ekran/büyük yazı | İçerik satırları kesilebilir → içerik paneli kaydırılabilir | CSS; cihaz doğrulaması bekliyor |
| D22 / P2 | Ortak gezinme: Görevler | İşlevsiz hedef etkin görünüyordu; bazı ekranlarda toast görünmüyordu → Yakında etiketi ve disabled durum | DOM testi |
| D23 / P2 | Oyun: klavye ile harf seçimi | Odaklanılabilir kontrol tamamen görünmez kalıyordu → odak içerideyken görünür giriş paneli | CSS; gerçek klavye görsel testi bekliyor |
| D24 / P2 | Ortak ikon ve düğmeler | Bazı kontrollerde odak çerçevesi kaldırılmıştı → ortak focus-visible kuralı | CSS; cihaz doğrulaması bekliyor |

Seviye başlangıcı ayrıca gerçek sağlayıcı akışında Oyna → oyun geçişiyle kontrol edildi. Burada bu turda kanıtlanmış yeni mantık hatası bulunmadı; başlığın/uzun hedeflerin dar ekranda yerleşimi görsel test bekliyor. Oyun ipucu, duraklatma, gizlilik, ödül ve ikinci şans pencereleri ortak Modal düzeltmesini paylaşır; ödül ve reklamın uçtan uca cihaz akışı bu testin kapsamı dışındadır.

## Grilling: reddedilen veya ölçüm bekleyen öneriler

- **Yeni motor/ekstra 3D efekt:** Aktif oyun React/SVG kullanıyor. Kullanılmayan R3F sahnesine demand rendering eklemek aktif oyunu hızlandırdığını kanıtlamaz; uygulanmadı. **Karar (sonradan):** sahne hiçbir yerden içe aktarılmıyordu, `src/game/three` ve dört bağımlılığı silindi (üretim paketi değişmedi, 397,9 kB).
- **Bulmaca önbelleklemesini tekrar eklemek:** Güncel WordPuzzle zaten useMemo ve memo kullanıyor. Önceki incelemedeki eski sürüme ait bulgu geçerli değil; ikinci bir önbellek eklenmedi.
- **Otomatik ekonomi/zorluk değişimi (bu belgenin ilk sürümü):** Bu turda ödül ve yıldız hesapları değiştirilmedi. **Güncelleme:** aynı gün, ayrı bir çalışmada kullanıcı onayıyla şunlar yapıldı ve testle kilitlendi: bonus coin tavanı 3/2/1/1 sonra 0, zorluk eğrisi testi (her beş levelda nefes alma, ani sıçrama yok), 40 saniyelik ücretsiz harf takılma yardımı, iki bağımsız modelle onaylanan kelime kalite kapısı ve Sakin Mod. Rahatlama etkisi oyuncu testiyle ölçülmedi.
- **Daha fazla kutlama/sarsıntı:** Stres azaltma amacıyla çelişebilir. Önce mevcut hareket azaltma seçeneği görünür hale getirildi.
- **"Daha zevkli" veya "FPS arttı" iddiası:** Oyuncu testi ve cihaz profili olmadan doğrulanamaz. Yapılmadı.

## Açık test ve tasarım soruları

1. Tarayıcı bağlanınca 320×568, 390×844, 430×932 ve yatay görünümde dokuz ekranın ekran görüntülü turu yapılmalı. Bu ölçüler test hedefidir; çalıştırıldığı iddia edilmez.
2. Yazı büyütme, font yüklenmesi, gerçek ekran okuyucu, güvenli alan ve yüklü/eksik görsel durumları kontrol edilmeli.
3. Harita kaydırma sonrası nokta görünürlüğü, rehber kaydırması, profil ve modal kaydırması cihazda doğrulanmalı.
4. Oyun klavye panelinin odakta görünmesi, gerçek çoklu dokunma ve geri hareket davranışı cihazda kontrol edilmeli. Dokunarak seçim için sürekli görünür alternatif halen ürün değerlendirmesi gerektirir.
5. Reklam gizlilik seçenekleri web sürümünde servis tarafından sessizce atlanıyor; Android consent akışı doğrulanmadan ortak servis sözleşmesi değiştirilmedi. Ödüllü reklam ve ikinci şansın başarı/iptal/hata durumları cihaz testi bekliyor.
6. İlk oynanışta tek kelime bulup henüz mühürlememiş kullanıcı kaydı, açılışta rehberi yeniden gösterebilir; mevcut hasProgress tanımı tamamlanan seviye/kelime koleksiyonu üzerinden çalışır. **Karar:** ayrı `onboardingCompleted` alanı eklenmiyor (kayıt biçimi değişir, geçiş gerekir); kalan risk yalnızca hiç kelime bulmadan çıkan oyuncunun rehberi yeniden görmesi, kabul edildi.
7. Rehberin gösterim çiziminde (adım 1) mühür "R" harfinin üstüne biniyor ve dar ekranda kalabalık duruyor. Görsel düzeltme bekliyor.

## Kaynaklar ve SSOT

Kaynaklar 8 Kasım 2026 tarihinde kontrol edildi:

- [W3C APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): odağın pencereye alınması, Tab çevrimi, Escape ve geri dönüş için temel.
- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/): sade alternatif giriş, büyük/aralıklı kontroller ve hareket seçenekleri için referans. Bunların rahatlama etkisi bu projede ayrıca ölçülmelidir.
- [React Three Fiber: Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance): aktif WebGL sahnesi olduğunda değerlendirilir; mevcut DOM ekranında ölçülmüş performans sonucu değildir.

Kayıt/ayarlar PersistenceContext, kelime gönderimi SessionContext ve fiyatlar shopItems içinde kaldı. Ortak pencere davranışı Modal içinde bir kez düzeltildi. Yeni global ayar deposu veya render motoru oluşturulmadı. Yerel tekrar kullanılabilir süreçler `.agents/skills/itiraz/SKILL.md` ve `.agents/skills/diagnose/SKILL.md` altında; her ikisi quick_validate ile geçerli bulundu.

## Doğrulama

Yeni testler: `src/components/Modal.test.tsx`, `src/screens/screenFlows.test.tsx`, `src/App.test.tsx`. Sonuncusu dokuz aktif ekranı gerçek sağlayıcılarla DOM üzerinden dolaşır; ResizeObserver yalnız test ortamında taklit edilir, ses/reklam yan etkileri taklit edilir. Yerleşim testi değildir.

İlk odak ve açılış/sekme/boş durum kusurları önce başarısız testlerle gösterildi. Pencere, akış ve rehber düzeltmelerinden sonra 14 yeni test geçti. Tam paket ilk çalışmada yeni Yakında etiketindeki 10px yazıyı proje alt sınırına aykırı buldu; değer mevcut `--ui-text-micro` tokenına çevrildi.

Son kontroller: `npm test -- --maxWorkers=1` → **34 dosya, 1148 test geçti**. `npm run lint` → geçti. `npm run build` → TypeScript ve Vite üretim derlemesi geçti (163 modül). `git diff --check` → hata yok. Sandbox içindeki bellek/alt işlem hatasından sonra üretim derlemesi sandbox dışında başarıyla tamamlandı. Görsel tarayıcı/gerçek cihaz kontrolleri halen bekliyor.

## Ek: aynı gün yapılan ölçümlü görsel denetim (başka oturum)

Playwright ile gerçek Chrome'da, 390×844 / 360×640 / 412×915'te şu ekranlar ekran görüntüsüyle ve ölçümle denetlendi: harita, level başlangıç, oyun, ipucu, duraklatma, ayarlar, mağaza (3 sekme), sözlük, profil, yeni oyuncu rehberi (390 ve 320 genişlik). Bulgular ve düzeltmeler `UI-Audit-v1.md` içinde; kontrol ölçeği `src/styles/uiTokens.test.ts` ile korunuyor. Harita düğümleri artık arka plan resminin koordinatlarında (her ekran oranında platformun üstünde), bölge noktalarının arkasındaki bulanık kutular kaldırıldı. Gerçek cihaz, dokunmatik ve ekran okuyucu denemesi hâlâ yapılmadı.

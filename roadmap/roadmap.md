# Proje Yol Haritası & Gelişmeler (Roadmap)

## Yapılan Geliştirmeler

### 12 Haziran 2026
- **Mühür Level Atlama Hatası Düzeltildi (Z-Index):** 
  - Mühür basıldıktan sonra ortaya çıkan `.sealReveal` efekti (`z-index: 80`) modal pencerelerinin (`z-index: 10`) üstünde kaldığı için ödül modalı arka planda kalıyordu. Bu durum kullanıcının sonraki seviyeye geçmesini engelliyordu.
  - `.modalShade` sınıfının z-index değeri `100` olarak güncellendi ve bu katman çakışması çözüldü.
- **Arayüz Kaydırması (5px):**
  - Harf çemberi (`.letterWheel`) ve oyun kutu tahtası (`.gameBoard`) görsel denge ve daha iyi okunabilirlik/UX adına dikey olarak 5px aşağıya ötelendi (`top: 5px;` eklendi).
- **Android Senkronizasyonu:**
  - Yapılan değişiklikler Android platformu için derlenip `npx cap sync android` ile native katmana aktarıldı.
- **Seviye Tasarımı Düzeltmeleri (Progression & UX Audit):**
  - **Ödül Doğrusallaştırma:** 5, 10, 20, 25, 30, 35 ve 40. seviyelerdeki ödül düşüşleri (dips) giderildi; baseCoin değerleri artık seviye sırasıyla tezatlık oluşturmayacak şekilde artan düzene çekildi.
  - **Atıl Harf Temizliği (Seviye 37):** Ana bulmacada kullanılmayan ve bilişsel yük oluşturan `"C"` harfini değerlendirmek amacıyla `YON` (gizli) ve `YONCA` (ana) kelimeleri yer değiştirdi.
  - **İmla ve Sözlük Düzeltmeleri:** Seviye 34'teki yanlış yazılmış `KALİP` kelimesi TDK onaylı `TALİP` ile, Seviye 44'teki yapay `MAZA` kelimesi ise `MANA` ile güncellendi.
  - Yapılan değişiklikler yazılan seviye denetleme betiğiyle (`check_levels.js`) denetlendi ve sıfır hata raporlandı.
- **Google Play Uyumlaştırması (Tekrarlayan İçerik Engeli):**
  - **Kopya Ana Kelimelerin Kaldırılması:** Oyun kalitesini ve Play Store onay başarısını artırmak için seviyeler arasında tekrarlanan ana kelimeler (`KALE`, `DİL`, `BUL`, `KAP`, `DERE`) alternatif anlamlı kelimelerle değiştirilerek temizlendi (Sırasıyla: `MEAL`, `VALİ`, `BUT`, `ATİK`, `EDER` getirildi).
  - Yazılan `check_duplicates.js` denetleme betiğiyle tüm seviyeler taranarak çakışmaların tamamen giderildiği doğrulandı.
  - `npm run android:doctor` ile Android derleme ortamının hatasız olduğu onaylandı.
- **Favicon ve Görsel Güncelleme:**
  - Kullanıcı tarafından sağlanan premium 3D mühür görseli `public/favicon.png` olarak projeye eklendi ve `index.html` üzerindeki ikon tanımı güncellendi.
- **Android Çentik (StatusBar) ve İkon Hata Düzeltmeleri:**
  - **Çentik Çakışması Giderildi:** `.gameTopBar` alanına `var(--ui-safe-top)` eklenerek cihazların üst bildirim çubuğu (saat, pil simgesi) ile oyun içi butonların üst üste binmesi engellendi.
  - **Uygulama İkonu Güncellemesi (Adaptive Icon):** Android 8.0+ cihazların modern uyarlanabilir ikon yapısı (`mipmap-anydpi-v26` altındaki `ic_launcher.xml` ve `ic_launcher_round.xml`) güncellendi. Eski vektör şablonlar yerine yeni 3D mühür PNG logomuz ön plan katmanı olarak bağlandı.

### 13 Haziran 2026
- **Global Çentik/Güvenli Alan Düzeltmesi (28px Minimum):**
  - Android cihazlarda safe-area değerlerinin 0px dönmesi ihtimaline karşı `--ui-safe-top` değişkeni minimum `28px` güvenceli fallback değeriyle güncellendi (`max(28px, env(safe-area-inset-top, 0px))`).
  - Sadece oyun içi değil, tüm ekranların üst barları (`.topBar` - Söz Hazinesi / Sözlük, `.map-topbar` - Harita, `.profileHeader`, `.settingsHeader`, `.shopHeader` ve `.ls-close` kapatma butonu) bu güvenli alan/saat çakışma korumasına dahil edildi.
- **Esnek/Kavisli Harf Çemberi Drag Çizgisi:**
  - Çemberde harfler birleştirilirken çizilen düz sert polyline hattı, merkeze (`50, 50`) doğru hafif esneyen (%18 oranında) organik ve dinamik bir Bezier eğrisine (`<path>` - `Q` parametreleriyle) dönüştürüldü. Çizgiye derinlik katmak amacıyla CSS selector'leri ve gölge filtreleri path öğesiyle uyumlu hale getirildi.
- **Arayüz Taşma ve Kesilme (Cut-off) Düzeltmeleri:**
  - **Giriş Ekranı Logo Taşması:** Kısa ekranlı cihazlarda giriş (başlangıç) ekranındaki logo levhasının `.logo-group` üstten kesilerek "SÖZ USTASI" başlığının görünmesini engelleyen esnek flex kutu taşma hatası, öğeye `max-height: min(280px, 30dvh)` verilerek giderildi.
  - **Mühür Kartı Kırpılma Hatası:** Seviye detay ekranındaki (`LevelStartScreen`) kilitli mühür görselinin (`.ls-hero-seal`) sağ kenarının kart sınırı tarafından kesilmesine sebep olan `.ls-hero-card` üzerindeki `overflow: hidden` kuralı `overflow: visible` olarak güncellendi.
  - **Harita Sınır Hizalaması:** Harita ekranı (`.map-screen`), diğer tüm ekranlarla uyumlu olması ve seviye butonlarının ekran sınırlarının dışına taşarak kırpılmasını önlemek amacıyla uygulama kabuğu genişliğine (`width: var(--ui-shell-w); margin: 0 auto;`) sabitlendi.
- **Android Tam Ekran Sürükleyici Mod (Immersive Mode - Modern API Geçişi):**
  - Android 11+ (API 30) ve sonraki modern Android sürümlerinde (Android 15/16 dahil) eski `setSystemUiVisibility` flag'leri geçersiz kalmaktadır ve bu durum durum çubuğunun (saat, şebeke ve pil göstergelerinin) şeffaf olarak oyun ekranının/haritanın üzerine binmesine yol açmaktadır. 
  - Bu sorunun kök sebebini çözmek için, native katmanda [MainActivity.java](file:///d:/ydTeknik/13-Projelerim/APP/sozustası/android/app/src/main/java/com/sozustasi/game/MainActivity.java) güncellenerek modern `WindowInsetsController` API'sine geçilmiştir. `onCreate` ve `onWindowFocusChanged` eventlerinde `WindowInsets.Type.statusBars()` ve `WindowInsets.Type.navigationBars()` kod seviyesinde gizlenerek sistem çubuklarının oyun alanını kapatması kesin olarak engellenmiş ve oyun tam ekran sarmal (immersive) moda kavuşturulmuştur. Old cihazlar için ise güvenli fallback (SYSTEM_UI_FLAG) mekanizması korunmuştur.
- **Seviye 23+ Zorluk ve Oyuncu Tutundurma (Retention) Ayarlamaları:**
  - Seviye 23-27 bandındaki yüksek bilişsel yükü ve oyuncu kaybını (churn) azaltmak için eski/ağır kelimeler daha popüler gündelik kelimelerle değiştirildi:
    - **Seviye 23:** `KATİ` yerine `PATİK` ve `TİP` getirildi.
    - **Seviye 24:** `ADİ` ve `DAN` yerine `VİDA` ve `ANİ` kelimeleri yerleştirildi.
    - **Seviye 26:** `SUAL` yerine `SULU` kelimesi atandı.
    - **Seviye 27:** `VERİ` ve `VİZE` kelimelerinin zorluk puanları `3`'ten `2`'ye düşürüldü.
  - **Seviye 37 Harf Havuzu Düzeltmesi:** Level audit kontrolünde hata veren 7 harfli çember havuzu, tekrarlı harf (`A`) elenerek 6 harfe (`["O","L","A","Y","N","C"]`) çekildi; `YALAN` kelimesi yerine `ONAY` getirilerek testlerden başarıyla sıfır hatayla geçmesi sağlandı.
- **Oyun Ekranı Z-Index Çakışma Düzeltmesi:**
  - Oyun ekranının (`.screen.game` / `.game` sınıfı) diğer ekranlar veya native bindirilmiş katmanlar karşısında altta kalma (z-index çakışması) riskini tamamen ortadan kaldırmak için, hem `base.css` hem de `game.css` içindeki `.game` seçicisine `position: relative` ve `z-index: 100` kuralları eklendi. Böylece oyun aktifken diğer tüm arayüz veya kalıntı katmanların üzerinde en üstte renderlanması sağlandı.









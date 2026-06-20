# Seviye Seviye Profesyonel Analiz — Master Plan & To-Do
Tarih: 2026-06-21 · Kapsam: yayındaki 75 seviye · Dayanak: [[Game-Mechanics-Panel-Audit-2026-06-20]], [[Level-Word-Audit-2026-06-20]], [[Plan-Compliance-Audit-2026-06-20]]

## Amaç
Her seviyeyi dört profesyonel kimliğin gözünden tek tek denetlemek, puanlamak ve eyleme dönük düzeltme backlog'u üretmek. Sonuç: tutarlı zorluk eğrisi, sağlam kelime/anlatı kalitesi, adil mekanik, güçlü oyuncu psikolojisi.

## Dört Mercek (her seviye için rubrik, 1–5 puan + bulgu + aksiyon)

### 1) Oyun Yazarı — Kelime & Sözlük Kalitesi
- Ana/gizli/bonus kelimeler TDK'ya uygun, gerçek ve tek anlamlı mı?
- Anlam açıklamaları doğru, kısa, çocuğa/genel kitleye uygun mu?
- Hassas/yanlış anlaşılır kelime var mı? (blocklist ile çapraz)
- Tema–kelime uyumu (ör. optik bölümünde ışık temalı kelimeler).

### 2) Senarist — Keşif Kartı & Anlatı Yayı
- `levelStories` kartı özgün, öğretici ve bölüm temasına bağlı mı?
- Bölüm içi mikro-yay: merak → keşif → "neden önemli" kapanışı var mı?
- Kartlar jenerik dolgu değil mi? (başlık ≥6, gövde ≥40 — test mevcut)
- 5 bölüm arası makro-anlatı tutarlı mı (kronoloji/tema geçişi)?

### 3) İnsan Psikolojisi Analisti — Akış & Motivasyon
- Zorluk, seviyenin konumuna uygun mu? (akış kanalı: sıkılma/kaygı dengesi)
- İlk 3 seviye onboarding'i nazik mi? Bölüm sonları doruk mu?
- Ödül takvimi tatmin edici mi (base/gizli/KUSURSUValueof/bölge/daily)?
- Hayal kırıklığı noktaları: çözülemez his, belirsiz ipucu, sert sıçrama?
- "Aha" anı, ilerleme hissi, geri dönüş kancası (daily, koleksiyon) var mı?

### 4) Oyun Motoru Ustası — Mekanik & Adalet
- Harf havuzu tüm kelimeleri kurabiliyor mu? (otomatik test mevcut)
- Crossword yerleşimi üretiliyor mu? Kesişimler mantıklı mı?
- Gizli/bonus dengesi; ödül sınırları; tekrar (≥10) kuralı.
- Erişilebilirlik (reduceMotion, kontrast, dokunmatik hedef), performans.

## Puanlama Şeması
Her seviye için: `L## | yazar/senarist/psikoloji/motor (1-5 her biri) | toplam/20 | öncelik(P0-P3) | bulgular | aksiyonlar`.
P0 = oynanışı/adaleti bozan, P1 = kalite kaybı, P2 = iyileştirme, P3 = nice-to-have.

## Aşamalı Plan

### Faz 0 — Hazırlık (otomatik taban)
- Mevcut `audit:levels` / `audit:plan` çıktısını topla; rubrik tablo şablonunu kur.
- Otomatik ön-kontroller: solvability, duplicate (≥10 çapraz — test mevcut), difficulty metrikleri, blocklist, kart uzunlukları.

### Faz 1 — Bölüm bölüm uzman denetimi (5 bölüm × 15 seviye)
Her bölüm için dört mercekten geçir, rubrik tablosunu doldur. Çıktı: bölüm raporu + bulgu listesi.
- Bölüm 1: L1–15 · Bölüm 2: L16–30 · Bölüm 3: L31–45 · Bölüm 4: L46–60 · Bölüm 5: L61–75

### Faz 2 — Sentez
- Tüm bulguları P0–P3'e göre önceliklendir; tekrarlayan desenleri çıkar (ör. "bölüm 3 zorluk platosu").
- Zorluk eğrisi grafiği (bölüm ortalamaları) ve anlatı tutarlılık haritası.

### Faz 3 — Uygulama (TDD)
- P0/P1 düzeltmelerini batch'ler halinde uygula; her batch sonrası tam test + build yeşil.
- Kelime değişikliklerinde mevcut güvenlik testleri (havuz/dup/blocklist) zorunlu geçer.

### Faz 4 — Doğrulama & kayıt
- Önce/sonra metrikleri, vault raporu, hafıza güncellemesi.

## To-Do (işaretlenebilir)

**Faz 0**
- [ ] Rubrik tablo şablonu + puanlama dosyası oluştur
- [ ] Otomatik ön-kontrol raporunu üret (audit script'leri)

**Faz 1 — denetim**
- [ ] Bölüm 1 (L1–15) dört mercek denetimi + rubrik
- [ ] Bölüm 2 (L16–30) dört mercek denetimi + rubrik
- [ ] Bölüm 3 (L31–45) dört mercek denetimi + rubrik
- [ ] Bölüm 4 (L46–60) dört mercek denetimi + rubrik
- [ ] Bölüm 5 (L61–75) dört mercek denetimi + rubrik

**Faz 2 — sentez**
- [ ] P0–P3 önceliklendirilmiş backlog
- [ ] Zorluk eğrisi + anlatı haritası

**Faz 3 — uygulama**
- [ ] P0 düzeltmeleri (batch + test yeşil)
- [ ] P1 düzeltmeleri (batch + test yeşil)
- [ ] P2/P3 (opsiyonel)

**Faz 4**
- [ ] Önce/sonra rapor + hafıza

## Yürütme Notu
Faz 1 paralelleştirilebilir: her bölüm için ayrı uzman alt-ajan (4 mercek) eşzamanlı çalışıp yapılandırılmış bulgu döndürebilir; ben sentezleyip uygularım. Onay verilirse Bölüm 1'den başlanır.

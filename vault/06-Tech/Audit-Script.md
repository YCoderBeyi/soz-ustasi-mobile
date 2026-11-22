# Audit Script — scripts/audit-full.mjs

12 kategorili, 45 level otomatik doğrulama scripti.

## Kategoriler

### 1. Harf Havuzu Kontrolü
Her level'deki harf havuzunun ana ve gizli kelimeleri üretebildiğini doğrular. Harf sayıları havuz büyüklüğüyle tutarlı mı kontrol eder. Yanlış normalize edilmiş harfleri (I/İ, Ü/U, Ğ/G, Ş/S, Ç/C) tespit eder.

### 2. Seviyeler Arası Tekrar
Aynı normalize edilmiş kelimenin birden çok levelde ana veya gizli kelime olarak kullanılıp kullanılmadığını kontrol eder. Uyarı seviyesinde raporlanır (çok yaygın kelimelerde toleranslı).

### 3. Level İçinde Çakışma
Aynı level içinde ana kelimelerin ve gizli kelimelerin normalize halleriyle birbirleriyle çakışmadığını doğrular.

### 4. Hikaye String Kesme Riski
Level hikayelerindeki (`story` alanı) metinlerin UI'da taşma/kesilme riskini denetler.

### 5. Hikaye-Kelime Tutarlılığı
`levelStories.ts`'deki hikaye kartlarının level verisiyle uyumunu kontrol eder.

### 6. Tema Tutarlılığı
Tüm level themeId'lerinin mevcut tema listesindeki ID'lerle eşleştiğini doğrular.

### 7. Hikaye Varlığı
Her level için `levelStories.ts`'de bir hikaye kartı bulunduğunu kontrol eder.

### 8. Ödül Kontrol
baseCoin ve hiddenWordBonus değerlerinin anlamlı aralıkta olduğunu doğrular.

### 9. Politika Taraması
Tüm kelime ve anlam metinlerinde yasaklı desenleri tarar (26 desen).

### 10. Geçersiz Karakter Taraması
Tüm metin alanlarında Türkçe alfabe dışı karakter veya kontrol karakteri bulunmadığını doğrular.

### 11. Ödül Progresyonu
baseCoin değerlerinin her levelde arttığını (plateau yok) doğrular. Phase 5 düzeltmesi sonrası tüm 45 level monoton artıyor.

## Çıktı Yorumlama

```
❌ HATA: Yayınlanamaz. (mutlaka düzeltilmeli)
⚠️ UYARI: İncelenmeli. (yayına engel değil, normalize artefaktı veya ortak kelime)
✅ Hata yok, yayınlanabilir.
```

## Sonuç Geçmişi

| Tarih | Uyarı | Hata |
|-------|-------|------|
| Phase 1-3 öncesi | 22 | 0 |
| Phase 1-4 sonrası | 12 | 0 |
| Phase 5 sonrası (coin düzeltmesi) | 10 | 0 |
| Level Design Review v1 (zorluk skalası 1-5) | 10 | 0 |

Son durum: **10 uyarı** — tamamı normalize artefaktı (ARI/ARİ, ASİL/ASIL, AS/AŞ) veya ortak kelime tekrarları (AL×3, KALE×2, DİL×2, DERE×2, KAP×2, BUL×2). Zorluk skalası değişikliği audit sonuçlarını etkilemedi.

## Çalıştırma

```bash
node scripts/audit-full.mjs
```

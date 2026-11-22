# Bulgular Backlog & İş Emri — 2026-06-20

Tüm denetim bulgularının (plan uyumu + mekanik panel + kelime içeriği + bug taraması)
to-do listesi. **Kısıt:** mevcut çalışan durum bozulmayacak (test yeşil kalacak),
mekanik yeniden inşa edilmeyecek (kullanıcı kararı). Durum kolonu bu turun kapsamını gösterir.

## Durum açıklaması
- 🟢 **YAPILIYOR** — bu turda ekip yapıyor (güvenli, veri-only, testle doğrulanır)
- 🟡 **BACKLOG** — onaylı ama bu turun dışında (maliyet/risk veya doğrulanmış kaynak gerek)
- 🔵 **YOL HARİTASI** — sürüm sonrası
- ⚪ **BIRAK** — fayda < risk (kozmetik)

---

## T1 — Geçersiz/sözlük-dışı kelimeler 🟢
NEDER (L14 ana), NERE (L14 ana, halk ağzı), NEDİ (L20 gizli), TULU (L29 ana) →
TDK-geçerli, aynı harf havuzundan üretilebilir kelimelerle değiştir. Crossword çözülebilir
kalmalı, anlamlar doğru. **Fayda yüksek / risk düşük.**

## T2 — Zorluk etiketi kalibrasyonu 🟢
75 seviyede `difficulty` sıklık-tabanlı yeniden atanır (MUTLU/ZAMAN/ADALET=5 → 2). Kısıt:
guardrail testleri (L1-5 ort ≤2, L71-75 ort ≥3, 15'lik bölüm monotonluğu) yeşil kalmalı.
Test guardrail'i izin verdiği kadar dürüstleştir; kalanı raporla. **Eğri-proxy'nin kökü.**

## T3 — Plan tekrar mesafesi (40/20) 🟡
KİTAP (L23/34/57), KAT (L31/57) ana; AL/AS/ALP/ER gizli. **Not:** testler yalnız ≥10
istiyor (yeşil); bu plan §6.4'ün daha sıkı 40/20 hedefi. Tek başına düşük getiri → T2 ile
birlikte yapılırsa değer. Bu tur dışı.

## T4 — Zorluk eğrisi regresyonları (§7.3) 🟡
28 MA gerilemesi, 5 ani düşüş, zayıf finaller. Kökünün ~%60'ı T2 ile düzelir; kalanı içerik
yeniden dizilimi (riskli) → T2 sonrası ölç, gerekirse ayrı tur.

## T5 — L1–45 tema yeniden tasarımı 🟡
Bölüm öğrenme eksenine taşı (yazı/sayı/tarım → kitap/harita → matematik). ~45 seviye tam
yeniden yazım = en pahalı/riskli iş; ayrı planlı sürüm. İlk ana kelimeler L46-75'te kilitli
ama L1-45'te serbest (manevra var).

## T6 — Keşif kartları impact/today 🟡
75/75 kart boş. Kod değil **senaryo/editoryal** iş; oynanışa sıfır regresyon. ANCAK plan §22
gereği **doğrulanmış kaynak** ister — uydurma olgu yasak. Kaynaklı bir editoryal turda
kademeli doldurulur (her seviye için tarihsel/bilimsel olgu + sourceNotes + contentReviewStatus).

## T7 — Çark a11y + ipucu onayı 🟡 (yarı-mekanik)
Çark ekran-okuyucu/klavye erişilebilir değil; ipucu tek dokunuşla onaysız 20 altın harcıyor.
Etik/yasal getiri yüksek, izole UI işi — ama mekanik-bitişik; kullanıcı "mekaniğe dokunma"
dediği için bu tur dışı, onay beklemede.

## T8 — Mekanik dürüstlük katmanı 🟡 (mekanik — dokunulmuyor)
anagram etiketi vs mekanik, "KUSURSUZ +%50" flawless ölü vaat, doubler/coinMultiplier
uygulanmamış. Kullanıcı kararıyla mevcut mekanik korunuyor → backlog.

## T9 — Katalog 76–240 🔵
165 eksik seviye. Sürüm sonrası içerik genişlemesi.

## T10 — Kozmetik ⚪
L28/43/73 gizli kelimesiz, L1/3/4 iki-harfli ana, ödül testere dişi. Dokunma riski > getiri.

## T11 — Bölge bonusu hardcoded (`levelId % 6`) 🟡
Plan 20'lik bölüm modeliyle uyumsuz; ekonomi dengesi turunda ele alınır.

---

**Bu turun iş emri:** T1 + T2 (ekip, testle doğrulanır, mekanik/UI dokunulmaz).
**Doğrulama kapısı:** `npm run audit:levels` + `npm run audit:plan` + `npm test` yeşil.

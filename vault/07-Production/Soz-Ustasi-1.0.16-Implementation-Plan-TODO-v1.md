# Soz Ustasi 1.0.16 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Söz Ustası'nı mevcut 75 özgün seviyeden, kaynak kontrollü 120 özgün seviyeye çıkaran ve imzalı `1.0.16 (18)` Android yayın adayını üreten sürümü tamamlamak.

**Architecture:** Seviye ve keşif kartları beş seviyelik bağımsız veri paketlerinde tutulur; ana katalog yalnız deterministik birleştirme yapar. İçerik kalitesi test ve audit ile veri katmanında engellenir, mevcut `PlayerSave v2` ve ödül idempotency sözleşmeleri korunur, görsel/ses farklılaşması mevcut ortak UI kabuğunu bozmadan bölüm tokenlarıyla uygulanır.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Vitest 4, Capacitor 8, Android Gradle Plugin 8.13, Node tabanlı audit scriptleri.

---

## 1. Uygulama Stratejisi

Uygulama sırası zorunludur:

1. Sözleşme ve kırmızı testler.
2. İçerik veri modeli ve audit.
3. Dokuz adet beş-seviyelik paket.
4. Katalog, harita, final ve kayıt entegrasyonu.
5. Görsel/ses kalite paketi.
6. Tam regresyon, fiziksel cihaz ve Android release.

Bir paket kalite kapısını geçmeden sonraki pakete geçilmez. Aynı anda çalışabilecek tek işler, birbirinden bağımsız seviye veri paketleri ve kaynak araştırmalarıdır; `levels.ts`, `levelStories.ts`, audit ve save entegrasyonu tek sahipli kalır.

## 2. Dosya Haritası

### Oluşturulacak içerik dosyaları

```text
src/data/levels76to80.ts
src/data/levels81to85.ts
src/data/levels86to90.ts
src/data/levels91to95.ts
src/data/levels96to100.ts
src/data/levels101to105.ts
src/data/levels106to110.ts
src/data/levels111to115.ts
src/data/levels116to120.ts
src/data/levelStories76to80.ts
src/data/levelStories81to85.ts
src/data/levelStories86to90.ts
src/data/levelStories91to95.ts
src/data/levelStories96to100.ts
src/data/levelStories101to105.ts
src/data/levelStories106to110.ts
src/data/levelStories111to115.ts
src/data/levelStories116to120.ts
src/data/journeyEditorial.ts
src/data/journeyEditorial.test.ts
```

### Değiştirilecek ana dosyalar

```text
src/data/levels.ts
src/data/levelStories.ts
src/data/levels.test.ts
src/game/bonusDictionary.ts
src/game/wordRewards.test.ts
src/game/playerSave.test.ts
src/store/contexts/SessionContext.test.tsx
src/components/RewardModal.test.ts
scripts/audit-levels.mjs
scripts/audit-release.mjs
android/app/build.gradle
package.json
package-lock.json
vault/07-Production/Content-Provenance-Ledger-v1.md
vault/07-Production/Asset-License-Ledger-v1.md
vault/07-Production/Release-Manifest-v1.md
vault/07-Production/Closed-Test-Checklist-v1.md
vault/07-Production/Google-Play-Listing-v1.md
```

### Görsel ve ses paketi

Yeni dosyalar yalnız lisans/provenance kaydı tamamlandığında eklenir:

```text
public/assets/chapters/machines-sky/
public/assets/chapters/anatolian-science/
public/assets/audio/chapters/
```

## 3. İçerik Üretim Matrisi

Her satır tek bir beş-seviyelik teslimat ve ayrı kabul kapısıdır.

| Paket | Seviye | Ana kavram zinciri | Kart odağı | Final nesnesi |
| --- | ---: | --- | --- | --- |
| P1 | 76-80 | ölçü, çap, dünya, yön, ufuk | Biruni ve ölçüm yöntemleri | Ölçüm küreci |
| P2 | 81-85 | düzenek, su, çark, hareket, denge | Cezeri'nin makineleri | Mekanik kuş |
| P3 | 86-90 | zaman, saat, gölge, takvim, usturlap | Zaman ölçümü ve araçlar | Usturlap parçası |
| P4 | 91-95 | yıldız, cetvel, gözlem, tablo, gök | Meryem el-İcliyye ve Uluğ Bey | Yıldız levhası |
| P5 | 96-100 | yörünge, açı, hesap, eğitim, astronomi | Ali Kuşçu ve bilim aktarımı | Gök kubbe mührü |
| P6 | 101-105 | deniz, rota, kıyı, pusula, harita | Piri Reis ve deniz haritaları | Harita rulosu |
| P7 | 106-110 | şehir, çizgi, menzil, tasvir, kayıt | Matrakçı Nasuh ve şehir tasviri | Şehir minyatürü |
| P8 | 111-115 | rasat, gece, saat, konum, ölçüm | Takiyüddin ve rasathane | Rasathane anahtarı |
| P9 | 116-120 | yapı, bilgi, eser, kaynak, miras | Sinan, Kâtip Çelebi ve bilgi zinciri | Usta mührü |

## 4. Görevler

### Task 1: Baseline ve 1.0.16 sözleşmesini kilitle

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `android/app/build.gradle`
- Modify: `vault/07-Production/Release-Manifest-v1.md`
- Modify: `scripts/audit-release.mjs`

- [ ] **Step 1: Mevcut kalite durumunu kaydet**

Run:

```powershell
npm run test
npm run lint
npm run audit:levels
npm run audit:ui
npm run build
```

Expected: 1.0.15 tabanında bütün komutlar exit `0`; seviye auditinin mevcut 75 seviyeyi raporlaması.

- [ ] **Step 2: Sürüm sözleşmesi için kırmızı audit oluştur**

`scripts/audit-release.mjs` beklentilerini aşağıdaki değerlere yükselt:

```js
const expectedVersionName = '1.0.16';
const expectedVersionCode = 18;
const expectedLevelCatalog = '120 authored levels';
```

Run:

```powershell
npm run audit:release
```

Expected: `1.0.15`, code `17`, 75 seviye manifesti ve eksik 1.0.16 artifact nedeniyle FAIL.

- [ ] **Step 3: Paket ve Android sürümünü güncelle**

Set:

```json
"version": "1.0.16"
```

Set in `android/app/build.gradle`:

```gradle
versionCode 18
versionName "1.0.16"
```

Manifest fields:

```text
- Version name: 1.0.16
- Version code: 18
- Level catalog: 120 authored levels
- AAB SHA-256: pending build
- APK SHA-256: pending build
```

- [ ] **Step 4: Sürüm metadata testini çalıştır**

Run:

```powershell
npm run audit:release
```

Expected: yalnız artifact/hash alanları nedeniyle FAIL; sürüm ve katalog uyuşmazlığı kalmaması.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json android/app/build.gradle scripts/audit-release.mjs vault/07-Production/Release-Manifest-v1.md
git commit -m "chore: start 1.0.16 release contract"
```

### Task 2: 120 seviyelik kırmızı kalite testlerini yaz

**Files:**
- Modify: `src/data/levels.test.ts`
- Modify: `src/components/RewardModal.test.ts`
- Modify: `src/game/playerSave.test.ts`

- [ ] **Step 1: Katalog ve final testi yaz**

Add:

```ts
it('contains exactly 120 sequential authored levels', () => {
  expect(levels).toHaveLength(120);
  expect(levels.map((level) => level.levelId)).toEqual(
    Array.from({ length: 120 }, (_, index) => index + 1),
  );
});
```

Update final assertion:

```ts
expect(isFinalLevel(120, levels)).toBe(true);
```

- [ ] **Step 2: Yeni paket tekrar testini yaz**

```ts
it('keeps levels 76-120 free of internal pool and main-word repeats', () => {
  const extension = levels.filter((level) => level.levelId >= 76);
  const pools = extension.map((level) => level.letters.map(normalizeWord).sort().join(''));
  const words = extension.flatMap((level) => level.mainWords.map((entry) => normalizeWord(entry.word)));
  expect(new Set(pools).size).toBe(pools.length);
  expect(new Set(words).size).toBe(words.length);
});
```

- [ ] **Step 3: Eski katalogla tekrar mesafesi testi yaz**

```ts
it('does not reuse an earlier main word without forty levels of distance', () => {
  const lastSeen = new Map<string, number>();
  for (const level of levels) {
    for (const entry of level.mainWords) {
      const word = normalizeWord(entry.word);
      const previous = lastSeen.get(word);
      if (level.levelId >= 76 && previous !== undefined) {
        expect(level.levelId - previous, `${entry.word} too early`).toBeGreaterThanOrEqual(40);
      }
      lastSeen.set(word, level.levelId);
    }
  }
});
```

- [ ] **Step 4: Kırmızı testleri doğrula**

Run:

```powershell
npx vitest run src/data/levels.test.ts src/components/RewardModal.test.ts
```

Expected: katalog 75 olduğu ve final 75'te kaldığı için FAIL.

- [ ] **Step 5: Commit**

```powershell
git add src/data/levels.test.ts src/components/RewardModal.test.ts src/game/playerSave.test.ts
git commit -m "test: define 120-level release contract"
```

### Task 3: Editoryal metadata ve provenance modelini ekle

**Files:**
- Create: `src/data/journeyEditorial.ts`
- Create: `src/data/journeyEditorial.test.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`

- [ ] **Step 1: Metadata testi yaz**

```ts
import { describe, expect, it } from 'vitest';
import { journeyEditorial } from './journeyEditorial';

describe('journey editorial catalog', () => {
  it('keeps every registered entry unique and source-backed', () => {
    const ids = journeyEditorial.map((entry) => entry.levelId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(journeyEditorial.every((entry) => entry.sourceUrls.length >= 2)).toBe(true);
  });
});
```

- [ ] **Step 2: Testin eksik modül nedeniyle kırmızı olduğunu doğrula**

Run:

```powershell
npx vitest run src/data/journeyEditorial.test.ts
```

Expected: module bulunamadığı için FAIL.

- [ ] **Step 3: Saf metadata tipini ve kataloğu oluştur**

```ts
export type JourneyEditorialEntry = {
  levelId: number;
  microAdventureId: string;
  learningGoal: string;
  sourceUrls: [string, string, ...string[]];
  reviewStatus: 'draft' | 'reviewed' | 'approved';
};

export const journeyEditorial: JourneyEditorialEntry[] = [];
```

İçerik paketleri tamamlandıkça kayıtlar aynı commit içinde eklenir. Katalog bütünlüğü testi her ara committe yeşil kalır; 45 kayıt tamamlanma koşulu Task 13'te eklenir.

- [ ] **Step 4: Provenance ledger kolonlarını sabitle**

```markdown
| Level | Topic | Source 1 | Source 2 | Author | Review status | Text hash |
```

Allowed status: `draft`, `reviewed`, `approved`.

- [ ] **Step 5: Type-check çalıştır**

Run:

```powershell
npm run build
```

Expected: build ve metadata bütünlük testi PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/data/journeyEditorial.ts src/data/journeyEditorial.test.ts vault/07-Production/Content-Provenance-Ledger-v1.md
git commit -m "feat: add journey editorial provenance contract"
```

### Task 4: Seviye auditini 120 seviyeye ve editoryal kurallara yükselt

**Files:**
- Modify: `scripts/audit-levels.mjs`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: Audit beklentisini 120 yap**

```js
if (levels.length !== 120) {
  errors.push(`Tam katalog 120 level olmali; mevcut ${levels.length}.`);
}
```

- [ ] **Step 2: 76-120 iç tekrarlarını error yap**

Audit checks:

```js
const extension = levels.filter((level) => level.levelId >= 76);
assertUnique(extension, normalizedPool, 'harf havuzu');
assertUnique(extension.flatMap((level) => level.mainWords), normalizedWord, 'ana kelime');
```

`assertUnique` her çakışmada iki level ID'yi mesajda göstermelidir.

- [ ] **Step 3: Kart/provenance kapısı ekle**

Her 76-120 seviyesi için:

```js
if (!editorial || editorial.reviewStatus !== 'approved' || editorial.sourceUrls.length < 2) {
  errors.push(`Level ${level.levelId}: editorial approval/source gate failed.`);
}
```

- [ ] **Step 4: Eski katalogda auditin kırmızı olduğunu doğrula**

Run:

```powershell
npm run audit:levels
```

Expected: 120 yerine 75 seviye ve eksik 45 metadata nedeniyle FAIL.

- [ ] **Step 5: Commit**

```powershell
git add scripts/audit-levels.mjs src/data/levels.test.ts
git commit -m "test: enforce 120-level editorial audit"
```

### Task 5: Paket P1 - Seviye 76-80, Dünyayı Ölçmek

**Files:**
- Create: `src/data/levels76to80.ts`
- Create: `src/data/levelStories76to80.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: Paket sözleşmesi testini yaz**

```ts
it('defines the authored 76-80 measurement package', () => {
  const pack = levels.slice(75, 80);
  expect(pack.map((level) => level.levelId)).toEqual([76, 77, 78, 79, 80]);
  expect(pack.every((level) => level.mainWords.length >= 3)).toBe(true);
  expect(pack.every((level) => level.hiddenWords.length >= 1)).toBe(true);
});
```

- [ ] **Step 2: Testi kırmızı çalıştır**

Run: `npx vitest run src/data/levels.test.ts -t "76-80"`  
Expected: empty slice nedeniyle FAIL.

- [ ] **Step 3: Beş seviyeyi editoryal olarak yaz**

Level briefs:

```text
76: ölçü ve oran; erişilebilir giriş; 5-6 harf
77: çap ve çevre; tekrar eden harf; 5-7 harf
78: yön ve ufuk; gizli kelime seçimi; 6-7 harf
79: dünya ölçümü; yerel zorluk zirvesi; 7-8 harf
80: Biruni keşif finali; dengeli final; 6-8 harf
```

Her kayıt `LevelData` literalidir; ana kelime 3-5, gizli kelime 1-4, puzzle tipi gerçek davranışla uyumludur.

- [ ] **Step 4: Beş özgün kart ve on kaynak kaydı ekle**

Kartlar sırasıyla ölçü yöntemi, çap/çevre ilişkisi, ufuk gözlemi, Biruni'nin yaklaşımı ve ölçüm bilgisinin bugünkü etkisini anlatır. Her kart iki bağımsız güvenilir URL ve `approved` metadata kaydı alır.

- [ ] **Step 5: Focused test ve audit çalıştır**

Run:

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
npm run audit:levels
```

Expected: 76-80 paket testleri PASS; tam katalog auditinin 81-120 eksikliği nedeniyle FAIL.

- [ ] **Step 6: Commit**

```powershell
git add src/data/levels76to80.ts src/data/levelStories76to80.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 76 to 80 measurement journey"
```

### Task 6: Paket P2 - Seviye 81-85, Suyla Çalışan Makine

**Files:**
- Create: `src/data/levels81to85.ts`
- Create: `src/data/levelStories81to85.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [81,82,83,84,85] paket testini yaz ve kırmızı çalıştır**

Run: `npx vitest run src/data/levels.test.ts -t "81-85"`  
Expected: FAIL because package is absent.

- [ ] **Step 2: Beş seviyeyi yaz**

```text
81: su ve akış; paket girişi
82: çark ve dönüş; kesişim yoğunluğu artışı
83: denge ve düzen; gizli kelime seçimi
84: düzenek ve hareket; yerel zorluk zirvesi
85: Cezeri ve mekanik kuş; mikro-final
```

- [ ] **Step 3: Kart ve kaynakları ekle**

Cezeri'yi tek başına bütün otomasyonun mucidi ilan etmeden eser, düzenek örnekleri, mühendislik yöntemi ve sonraki etki açıklanır.

- [ ] **Step 4: Focused test çalıştır**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
```

Expected: P1-P2 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/data/levels81to85.ts src/data/levelStories81to85.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 81 to 85 machine journey"
```

### Task 7: Paket P3 - Seviye 86-90, Zamanın Dişlileri

**Files:**
- Create: `src/data/levels86to90.ts`
- Create: `src/data/levelStories86to90.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [86,87,88,89,90] paket testini yaz ve FAIL doğrula**

- [ ] **Step 2: Seviyeleri şu ritimle yaz**

```text
86: gölge ve zaman
87: saat ve düzen
88: takvim ve dönem
89: usturlap kavramları; paket zirvesi
90: zaman ölçüm araçları; mikro-final
```

- [ ] **Step 3: Kart, iki kaynak ve provenance kaydını her seviye için ekle**

- [ ] **Step 4: Test ve crossword üretilebilirlik denetimini çalıştır**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
npm run audit:levels
```

Expected: 86-90 package checks PASS; 91-120 missing errors remain.

- [ ] **Step 5: Commit**

```powershell
git add src/data/levels86to90.ts src/data/levelStories86to90.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 86 to 90 time journey"
```

### Task 8: Paket P4 - Seviye 91-95, Yıldız Cetveli

**Files:**
- Create: `src/data/levels91to95.ts`
- Create: `src/data/levelStories91to95.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [91,92,93,94,95] kırmızı paket testini ekle**

- [ ] **Step 2: Seviyeleri yaz**

```text
91: yıldız ve gözlem
92: cetvel ve ölçüm aracı
93: tablo ve kayıt
94: gök ölçümü; paket zirvesi
95: Meryem el-İcliyye/Uluğ Bey bağlamı; mikro-final
```

- [ ] **Step 3: Kartlarda kişi, araç, dönem ve bugünkü etkiyi ayır; iki kaynak ekle**

- [ ] **Step 4: Focused testleri çalıştır ve commit et**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
git add src/data/levels91to95.ts src/data/levelStories91to95.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 91 to 95 star-table journey"
```

### Task 9: Paket P5 - Seviye 96-100, Gökyüzü Okulu

**Files:**
- Create: `src/data/levels96to100.ts`
- Create: `src/data/levelStories96to100.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [96,97,98,99,100] ve level 100 final testlerini kırmızı yaz**

```ts
expect(levels[99].levelId).toBe(100);
expect(levels[99].mainWords.length).toBeGreaterThanOrEqual(4);
```

- [ ] **Step 2: Seviyeleri yaz**

```text
96: açı ve hesap
97: yörünge ve düzen
98: gözlem eğitimi
99: astronomi kavramları; bölüm zirvesi
100: Ali Kuşçu ve bilim aktarımı; bölüm finali
```

- [ ] **Step 3: Final mührü ve kart metadata sözleşmesini ekle**

Level 100 `seal_sky_chapter_final` kullanır; final kartı önceki beş mikro-macerayı tek katkı zincirinde özetler.

- [ ] **Step 4: 76-100 paket auditini çalıştır**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
npm run audit:levels
```

Expected: level 76-100 checks PASS; 101-120 missing errors remain.

- [ ] **Step 5: Commit**

```powershell
git add src/data/levels96to100.ts src/data/levelStories96to100.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 96 to 100 astronomy finale"
```

### Task 10: Paket P6 - Seviye 101-105, Denizlerin Hafızası

**Files:**
- Create: `src/data/levels101to105.ts`
- Create: `src/data/levelStories101to105.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [101,102,103,104,105] kırmızı paket testini ekle**

- [ ] **Step 2: Seviyeleri yaz**

```text
101: deniz ve kıyı; bölüm girişi
102: rota ve yön
103: pusula ve seyir
104: harita ve ölçek; paket zirvesi
105: Piri Reis ve deniz haritası; mikro-final
```

- [ ] **Step 3: Kartlarda harita üretimini tek kişilik icat olarak anlatma; kaynakları ekle**

- [ ] **Step 4: Test ve commit**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
git add src/data/levels101to105.ts src/data/levelStories101to105.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 101 to 105 navigation journey"
```

### Task 11: Paket P7 - Seviye 106-110, Şehirlerin Çizgisi

**Files:**
- Create: `src/data/levels106to110.ts`
- Create: `src/data/levelStories106to110.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [106,107,108,109,110] kırmızı paket testini ekle**

- [ ] **Step 2: Seviyeleri yaz**

```text
106: şehir ve çizgi
107: menzil ve yol
108: tasvir ve kayıt
109: plan ve görünüş; paket zirvesi
110: Matrakçı Nasuh ve şehir anlatımı; mikro-final
```

- [ ] **Step 3: Kart, kaynak ve provenance kayıtlarını ekle**

- [ ] **Step 4: Test ve commit**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
git add src/data/levels106to110.ts src/data/levelStories106to110.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts
git commit -m "feat: add levels 106 to 110 city-map journey"
```

### Task 12: Paket P8 - Seviye 111-115, Rasathanenin Gecesi

**Files:**
- Create: `src/data/levels111to115.ts`
- Create: `src/data/levelStories111to115.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`

- [ ] **Step 1: [111,112,113,114,115] kırmızı paket testini ekle**

- [ ] **Step 2: Seviyeleri yaz**

```text
111: rasat ve gece
112: saat ve hassasiyet
113: konum ve açı
114: ölçüm ve kayıt; paket zirvesi
115: Takiyüddin ve rasathane; mikro-final
```

- [ ] **Step 3: İsteğe bağlı anlam yardımının otomatik tetiklenmediğini test et**

```ts
expect(session.hintState).toBeNull();
```

- [ ] **Step 4: Test ve commit**

```powershell
npx vitest run src/data/levels.test.ts src/store/contexts/SessionContext.test.tsx
git add src/data/levels111to115.ts src/data/levelStories111to115.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts src/store/contexts/SessionContext.test.tsx
git commit -m "feat: add levels 111 to 115 observatory journey"
```

### Task 13: Paket P9 - Seviye 116-120, Bilginin Büyük Mührü

**Files:**
- Create: `src/data/levels116to120.ts`
- Create: `src/data/levelStories116to120.ts`
- Modify: `src/data/journeyEditorial.ts`
- Modify: `vault/07-Production/Content-Provenance-Ledger-v1.md`
- Test: `src/data/levels.test.ts`
- Test: `src/components/RewardModal.test.ts`

- [ ] **Step 1: [116,117,118,119,120] ve final sözleşmesi testini yaz**

```ts
expect(levels.at(-1)?.levelId).toBe(120);
expect(isFinalLevel(120, levels)).toBe(true);
```

- [ ] **Step 2: Seviyeleri yaz**

```text
116: yapı ve denge
117: kemer/kubbe ve ölçü
118: eser ve kaynak
119: bilgi ve miras; final hazırlığı
120: Sinan, Kâtip Çelebi ve katkı zinciri; büyük final
```

- [ ] **Step 3: Level 120 final kurallarını uygula**

- En az 4 ana kelime.
- En az 2 gizli kelime.
- Önceki katalogla havuz çakışması yok.
- `seal_master_120` final mührü.
- Sonraki seviye CTA yerine harita/kasa CTA'sı.
- Ana ödül yalnız ilk tamamlamada.

- [ ] **Step 4: 45 metadata kaydının tamamlandığını doğrula**

Completeness assertion:

```ts
const extension = journeyEditorial.filter((entry) => entry.levelId >= 76);
expect(extension).toHaveLength(45);
expect(extension.every((entry) => entry.reviewStatus === 'approved')).toBe(true);
```

Run:

```powershell
npx vitest run src/data/journeyEditorial.test.ts
```

Expected: 45/45 approved and two-source gate PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/data/levels116to120.ts src/data/levelStories116to120.ts src/data/journeyEditorial.ts vault/07-Production/Content-Provenance-Ledger-v1.md src/data/levels.test.ts src/components/RewardModal.test.ts
git commit -m "feat: add levels 116 to 120 mastery finale"
```

### Task 14: Ana kataloğu ve hikaye kataloğunu entegre et

**Files:**
- Modify: `src/data/levels.ts`
- Modify: `src/data/levelStories.ts`
- Modify: `src/data/levels.test.ts`

- [ ] **Step 1: Dokuz level paketini import et**

```ts
import { levels76to80 } from './levels76to80';
import { levels81to85 } from './levels81to85';
import { levels86to90 } from './levels86to90';
import { levels91to95 } from './levels91to95';
import { levels96to100 } from './levels96to100';
import { levels101to105 } from './levels101to105';
import { levels106to110 } from './levels106to110';
import { levels111to115 } from './levels111to115';
import { levels116to120 } from './levels116to120';
```

- [ ] **Step 2: Deterministik extension dizisini ekle**

```ts
const release1016Levels = [
  ...levels76to80,
  ...levels81to85,
  ...levels86to90,
  ...levels91to95,
  ...levels96to100,
  ...levels101to105,
  ...levels106to110,
  ...levels111to115,
  ...levels116to120,
];

export const levels: LevelData[] = [...baseLevels, ...authoredMasteryLevels, ...release1016Levels];
```

- [ ] **Step 3: Dokuz story paketini aynı sırayla birleştir**

`levelStories` uzunluğu `levels` uzunluğuna eşit olmalı; generated story çağrısı bulunmamalı.

- [ ] **Step 4: Katalog testini ve auditi çalıştır**

```powershell
npx vitest run src/data/levels.test.ts src/data/journeyEditorial.test.ts
npm run audit:levels
```

Expected: 120 level, 120 story, 45 approved extension metadata, zero error.

- [ ] **Step 5: Commit**

```powershell
git add src/data/levels.ts src/data/levelStories.ts src/data/levels.test.ts scripts/audit-levels.mjs
git commit -m "feat: integrate 120-level authored catalog"
```

### Task 15: Bonus kelime tepkisini 76-120 için tamamla

**Files:**
- Modify: `src/game/bonusDictionary.ts`
- Modify: `src/game/wordRewards.test.ts`
- Modify: `src/store/contexts/SessionContext.test.tsx`

- [ ] **Step 1: Her yeni havuz için hedef dışı geçerli kelime fixture testi yaz**

```ts
it.each(extensionBonusFixtures)('accepts $word as a bonus discovery on level $levelId', ({ levelId, word }) => {
  expect(resolveWord(levelId, word).kind).toBe('bonus');
});
```

Fixture her seviye için en az iki bonus aday içerir ve ana/gizli kelimeyle çakışmaz.

- [ ] **Step 2: Testi kırmızı çalıştır**

Run: `npx vitest run src/game/wordRewards.test.ts src/store/contexts/SessionContext.test.tsx`  
Expected: yeni kelimeler sözlükte olmadığı için FAIL.

- [ ] **Step 3: Normalize bonus sözlüğünü genişlet**

Her kayıt anlam ve normalize anahtar taşır. Kelime havuzdan üretilemiyorsa audit FAIL verir.

- [ ] **Step 4: Ödül idempotency testini ekle**

```ts
submitBonusWord(levelId, word);
submitBonusWord(levelId, word);
expect(addCoins).toHaveBeenCalledTimes(1);
```

- [ ] **Step 5: Test ve commit**

```powershell
npx vitest run src/game/wordRewards.test.ts src/store/contexts/SessionContext.test.tsx
git add src/game/bonusDictionary.ts src/game/wordRewards.test.ts src/store/contexts/SessionContext.test.tsx
git commit -m "feat: expand bonus discoveries for levels 76 to 120"
```

### Task 16: Save, harita, yıldız ve final entegrasyonunu doğrula

**Files:**
- Modify: `src/game/playerSave.test.ts`
- Modify: `src/store/contexts/SessionContext.test.tsx`
- Modify: `src/components/RewardModal.test.ts`
- Modify: `vault/07-Production/Closed-Test-Checklist-v1.md`

- [ ] **Step 1: 1.0.15 save fixture testi yaz**

Fixture:

```ts
const oldSave = {
  version: 2,
  currentLevelId: 75,
  coins: 420,
  completedLevels: [1, 2, 75],
  awardedLevels: [1, 2, 75],
  rewardedWordKeys: [],
  collectedWords: [],
  favoriteWords: [],
  soundEnabled: true,
  soundVolume: 70,
  hapticsEnabled: true,
  levelMastery: { 75: { stars: 3, objectives: ['complete', 'discovery', 'noHint'] } },
  ownedShopItems: ['seal_gold'],
  selectedThemeId: null,
  selectedSealId: 'seal_gold',
  hintsRemaining: 0,
  lanternCount: 0,
  coinMultiplier: 1,
  doublerRemaining: 0,
  freeHintNext: false,
  levelStats: {},
};
```

Assertions:

```ts
expect(migrated.currentLevelId).toBe(76);
expect(migrated.coins).toBe(420);
expect(migrated.levelMastery[75].stars).toBe(3);
expect(migrated.ownedShopItems).toContain('seal_gold');
expect(migrated.soundVolume).toBe(70);
```

`sanitize` içinde geçerli görünen fakat tamamlanmış bir `currentLevelId`, `inferredCurrentLevelId` ile ilerletilir:

```ts
const requestedCurrentLevelId = typeof data.currentLevelId === 'number'
  && validLevelIds.has(data.currentLevelId)
  ? data.currentLevelId
  : null;
const currentLevelId = requestedCurrentLevelId !== null
  && !completedLevels.includes(requestedCurrentLevelId)
  ? requestedCurrentLevelId
  : inferredCurrentLevelId;
```

- [ ] **Step 2: Level 75 tamamlamasının 76'yı açtığını test et**

Mevcut save 75 tamamlandıysa katalog genişledikten sonra `nextLevelId` 76 olmalıdır; veri resetlenmemelidir.

- [ ] **Step 3: Harita yıldız tek kaynak testini çalıştır**

Harita düğümü, detay popup ve reward modal aynı `levelMastery[levelId].stars` değerini göstermelidir.

- [ ] **Step 4: Final davranışını doğrula**

Level 120 sonrası `Sonraki Seviye` yerine `Haritaya Dön` ve `Kasayı Aç` eylemleri görünür.

- [ ] **Step 5: Test ve commit**

```powershell
npx vitest run src/game/playerSave.test.ts src/store/contexts/SessionContext.test.tsx src/components/RewardModal.test.ts
git add src/game/playerSave.test.ts src/store/contexts/SessionContext.test.tsx src/components/RewardModal.test.ts vault/07-Production/Closed-Test-Checklist-v1.md
git commit -m "test: protect progression through level 120"
```

### Task 17: Bölüm görsel, animasyon ve ses paketini uygula

**Files:**
- Create: `public/assets/chapters/machines-sky/*`
- Create: `public/assets/chapters/anatolian-science/*`
- Create: `public/assets/audio/chapters/*`
- Modify: `src/data/themes.ts`
- Modify: `src/styles/game.css`
- Modify: `vault/07-Production/Asset-License-Ledger-v1.md`
- Modify: `scripts/audit-ui-assets.mjs`

- [ ] **Step 1: Asset audit için kırmızı bütçe testi ekle**

Limits:

```text
icon <= 60 KB
level node <= 300 KB
seal <= 400 KB
hero object <= 800 KB
vertical background <= 1.5 MB
```

Eksik provenance veya limit aşımı audit error olmalıdır.

- [ ] **Step 2: İki bölüm paketini üret ve optimize et**

Required assets per chapter:

```text
1 vertical background
1 chapter plaque
1 chapter gate
1 final seal
4 node states
1 hero object
3 collection objects
1 discovery-card frame
1 chest
1 static reduced-motion alternative
```

- [ ] **Step 3: Tasarım tokenlarını uygula**

```css
[data-chapter='machines-sky'] {
  --chapter-primary: #17213f;
  --chapter-accent: #c28b38;
  --chapter-info: #6f9fc4;
}

[data-chapter='anatolian-science'] {
  --chapter-primary: #103b4a;
  --chapter-accent: #c9973f;
  --chapter-final: #8f2633;
}
```

- [ ] **Step 4: Hareket ve ses kurallarını uygula**

- Harf geri bildirimi 100 ms altında başlar.
- Kelime onayı 120-180 ms.
- Mikro-final 2.5 saniye altında ve atlanabilir.
- `prefers-reduced-motion` statik alternatife geçer.
- Ses seviyesi mevcut slider ve mute ayarını izler.

- [ ] **Step 5: UI audit ve build çalıştır**

```powershell
npm run audit:ui
npm run build
```

Expected: zero missing/oversized/unlicensed asset error.

- [ ] **Step 6: Commit**

```powershell
git add public/assets/chapters public/assets/audio/chapters src/data/themes.ts src/styles/game.css scripts/audit-ui-assets.mjs vault/07-Production/Asset-License-Ledger-v1.md
git commit -m "feat: add chapter atmosphere for levels 76 to 120"
```

### Task 18: Tam kalite kapısını çalıştır

**Files:**
- Modify: `vault/07-Production/Closed-Test-Checklist-v1.md`
- Modify: `vault/07-Production/APK-Readiness-v1.md`

- [ ] **Step 1: Tam test ve statik kontrolleri çalıştır**

```powershell
npm run test
npm run lint
npm run audit:levels
npm run audit:ui
npm run build
```

Expected:

```text
All test files pass
ESLint exit 0
Level audit: 120 levels, zero unexplained warning
UI audit: zero error
Vite production build exit 0
```

- [ ] **Step 2: Release auditini artifact öncesi çalıştır**

```powershell
npm run audit:release
```

Expected: yalnız pending hash/missing artifact hataları.

- [ ] **Step 3: Test sonuçlarını readiness belgesine gerçek sayılarla kaydet**

Kayıt alanları: tarih, commit, test dosyası, test sayısı, audit sonucu, build boyutu.

- [ ] **Step 4: Commit**

```powershell
git add vault/07-Production/Closed-Test-Checklist-v1.md vault/07-Production/APK-Readiness-v1.md
git commit -m "docs: record 1.0.16 quality gate"
```

### Task 19: Android cihaz smoke ve update testini yap

**Files:**
- Modify: `vault/07-Production/Closed-Test-Checklist-v1.md`

- [ ] **Step 1: 1.0.15 APK'yı test cihazına kur ve fixture ilerlemesi oluştur**

Record: current level, coins, stars, hidden words, owned item, sound volume.

- [ ] **Step 2: 1.0.16 debug/release candidate'ı `adb install -r` ile güncelle**

Expected: uygulama verisi silinmeden kurulum başarılı.

- [ ] **Step 3: Sınır seviyelerini oyna**

```text
75 -> 76
80 -> 81
100 -> 101
119 -> 120
120 -> map/vault finale
```

- [ ] **Step 4: Cihaz matrisi kontrolünü tamamla**

```text
Android 10/11 short-screen device
Android 13-15 long-screen device
mute/volume
reduced motion
low quality
background/foreground
process restart
```

- [ ] **Step 5: Kanıtları checklist'e kaydet ve commit et**

```powershell
git add vault/07-Production/Closed-Test-Checklist-v1.md
git commit -m "test: record 1.0.16 Android smoke results"
```

### Task 20: İmzalı 1.0.16 APK/AAB üret ve doğrula

**Files:**
- Create: `artifacts/SozUstasi-1.0.16-release.apk`
- Create: `artifacts/SozUstasi-1.0.16-release.aab`
- Modify: `vault/07-Production/Release-Manifest-v1.md`
- Modify: `vault/07-Production/Google-Play-Listing-v1.md`

- [ ] **Step 1: Web varlıklarını üret ve Android'e senkronize et**

```powershell
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
npx cap sync android
```

- [ ] **Step 2: Temiz imzalı paketleri üret**

```powershell
Push-Location android
.\gradlew.bat --no-daemon clean assembleRelease bundleRelease
Pop-Location
```

Expected: `BUILD SUCCESSFUL`, version code `18`, version name `1.0.16`.

- [ ] **Step 3: Artifactleri sabit isimlere kopyala ve hash al**

```powershell
Copy-Item android\app\build\outputs\apk\release\app-release.apk artifacts\SozUstasi-1.0.16-release.apk
Copy-Item android\app\build\outputs\bundle\release\app-release.aab artifacts\SozUstasi-1.0.16-release.aab
Get-FileHash artifacts\SozUstasi-1.0.16-release.apk -Algorithm SHA256
Get-FileHash artifacts\SozUstasi-1.0.16-release.aab -Algorithm SHA256
```

- [ ] **Step 4: İmzaları ve native kod durumunu doğrula**

```powershell
& 'D:\Android\Sdk\build-tools\36.0.0\apksigner.bat' verify --verbose --print-certs artifacts\SozUstasi-1.0.16-release.apk
jarsigner -verify artifacts\SozUstasi-1.0.16-release.aab
jar tf artifacts\SozUstasi-1.0.16-release.aab | Select-String '^base/lib/|\.so$'
```

Expected: APK v2 signature verifies, AAB verifies. `.so` yoksa native symbols `not applicable`; varsa symbols zip üretilmeden release gate geçmez.

- [ ] **Step 5: Manifest hashlerini yaz ve son auditi çalıştır**

```powershell
npm run audit:release
```

Expected: `Release audit OK: version 1.0.16, code 18, 0 warning.`

- [ ] **Step 6: Play sürüm notunu güncelle**

```text
Söz Ustası 1.0.16:
- 45 yeni ve özgün kelime seviyesi
- Toplam 120 seviyelik öğrenme yolculuğu
- Mekanik, astronomi, haritacılık ve Anadolu bilim tarihi kartları
- Geliştirilmiş bonus kelime tepkileri
- Dengelenmiş zorluk ve bölüm finalleri
- İlerleme, ödül ve kararlılık iyileştirmeleri
```

- [ ] **Step 7: Commit**

```powershell
git add vault/07-Production/Release-Manifest-v1.md vault/07-Production/Google-Play-Listing-v1.md
git commit -m "chore: finalize 1.0.16 release candidate"
```

### Task 21: Kapalı test yayın kapısını tamamla

**Files:**
- Modify: `vault/07-Production/Closed-Test-Checklist-v1.md`

- [ ] **Step 1: AAB'yi yalnız kapalı test kanalına yükle**

Upload: `artifacts/SozUstasi-1.0.16-release.aab`.

- [ ] **Step 2: Play Console doğrulamalarını kaydet**

```text
Package: com.sozustasi.game
Version: 1.0.16 (18)
Country: Türkiye
Tester list: configured
Ads declaration: no ads in this build
Data safety: no collected/shared data
Target audience: current approved declaration
Store listing: 120-level wording
```

- [ ] **Step 3: 12 test kullanıcısı ve 14 günlük sürekli opt-in sürecini başlat**

Her test geri bildirimi cihaz, Android sürümü, level ID, tekrar adımı, beklenen ve gerçek sonuçla kaydedilir.

- [ ] **Step 4: İlk 48 saat kritik kontrolü**

Review:

```text
crash/ANR
progression loss
75->76 lock
reward duplication
unaccepted valid words
modal overflow
audio too low/high
repetitive/boring feedback
```

- [ ] **Step 5: Production erişimi öncesi checklist'i kapat**

12/14 şartı, kritik hata düzeltmeleri ve feedback özeti tamamlanmadan production başvurusu yapılmaz.

## 5. Definition of Done Checklist

- [ ] `1.0.16`, version code `18`.
- [ ] 120 ardışık, runtime'da açıkça tanımlanmış seviye.
- [ ] 76-120 içinde 45 benzersiz harf havuzu.
- [ ] 76-120 içinde yinelenmeyen ana kelimeler.
- [ ] 45 kaynak kontrollü ve onaylı keşif kartı.
- [ ] Her seviye için geçerli bonus kelime tepkisi.
- [ ] Otomatik ipucu yok.
- [ ] Tekrar oynayarak sınırsız altın yok.
- [ ] Save, yıldız, eşya ve ayarlar güncellemede korunuyor.
- [ ] Level 120 final akışı çalışıyor.
- [ ] Asset lisans/provenance kayıtları tamam.
- [ ] Test, lint, level audit, UI audit ve build başarılı.
- [ ] İki fiziksel Android cihazda smoke test tamam.
- [ ] İmzalı APK/AAB ve doğrulanmış SHA-256 hashleri mevcut.
- [ ] Release audit sıfır hata ve sıfır açıklanmamış uyarıyla geçiyor.
- [ ] Kapalı test sürümü ve geri bildirim kaydı hazır.

## 6. Araştırma Kaynakları

- Android Core App Quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Google Play closed testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Self-Determination Theory and HCI Games Research: https://arxiv.org/abs/2405.12639
- Learning Mechanics and Game Mechanics under SDT: https://arxiv.org/abs/1805.08053
- Procedurally generating rules to adapt difficulty: https://arxiv.org/abs/2307.05518

Tarihsel içerik kaynakları her seviye paketi uygulanırken iki-kaynak kapısından geçirilir ve provenance ledger'a gerçek URL, inceleyen kişi, durum ve metin hash'iyle kaydedilir.

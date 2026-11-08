# Bonus Sözlük v1 - Karar Kaydı

Tarih: 2026-11-07 · Durum: UYGULAMAYA BAĞLI (src/data/bonusWords.generated.ts, npm run generate:bonus-lexicon).

## Kaynak ve lisans
- Aday kaynağı: https://github.com/tdd-ai/hunspell-tr (`tr_TR.dic`), lisans **MPL 2.0** (`MPL-2.0-LICENSE.txt`).
- Katkıda bulunanlar (README'den): Ali Safaya, Arda Göktoğan, Deniz Yuret, Emirhan Kurtuluş, Taner Sezer.
- Doğrulama: `tr_TR.dic` sha256 `48e5352c5770956b24f355265aef7649b25bcb4d933c0b254ea8b419c241f4bd`.
- Bilinen belirsizlik: README kaynağı "word lists ... extracted from Turkish text corpora and dictionaries" diye tarif ediyor; TDK'yı adlandırmıyor.
- Bu dizindeki liste MPL kapsamındaki dosyadan türetilmiştir; MPL 2.0 koşulları (lisans metni + kaynak bağlantısı) korunur.
- Bonus kelime anlamları TDK'dan kopyalanmaz.

## Yöntem
1. 3-7 harf, Türkçe fonotaktik filtre, level harflerinden kurulabilen, level'ın kendi kelimeleri hariç: 4.234 aday.
2. 1. geçiş: 6 bağımsız inceleme (geçerli yalın sözcük, tanınırlık, uygunluk): 460 tekil.
3. 2. geçiş: iki farklı model, ikisi de onaylamalı + muhafazakâr eklemeler: 404.
4. Değer filtresi (olumsuz, kırıcı, korkutucu, üzücü, dini hassasiyet): 42 kelime çıkarıldı -> 362.
5. Bağımsız saldırgan inceleme (2 model): çıplak fiil gövdeleri/emir kipi (proje içerik standardı, commit 49ce9ed) ve ek olumsuz çağrışımlar çıkarıldı -> **300 tekil** (üretilmiş katman) + 39 elle anlamlı kelime.

## Dosyalar
- `allowlist-by-level.json`: { levelId: [KELİME...] }, kapalı kabul listesi (sayılar 362 aşamasına aittir; üretim betiği denied listesini her seferinde uygular).
- `denied-by-values.json`: değer filtresiyle çıkarılanlar ve nedenleri. Üretim betiği bu listeyi sabit kara liste olarak kullanmalı.

## Kural
Listede olmayan kelime ödül almaz. Yeni kelime: çift model onayı + değer filtresi.

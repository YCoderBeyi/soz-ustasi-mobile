# Audio & Animation Decisions

## Karar

Ses ve animasyon sistemi kısa, okunabilir ve ödül anında tatmin edici olmalı. Oyuncunun dikkatini sömürmek yerine doğru zamanda geri bildirim vermeli.

## Uygulanan İlkeler

- Harf seçimi: 40 ms civarı kısa, hafif değişken mikro ses.
- Doğru kelime: yükselen majör motif, 300 ms altında.
- Yanlış kelime: düşük şiddetli, cezalandırmayan iniş.
- Gizli kelime: daha parlak ve katmanlı ödül motifi.
- Mühür: düşük frekans başlangıcı + parlak kapanış.
- Animasyon: kısa, fiziksel, 150-760 ms arası.
- Erişilebilirlik: `prefers-reduced-motion` desteği.

## Kaçınılanlar

- Sürekli arka plan bipleri.
- Aşırı parlak veya uzun hata sesi.
- Her butonda büyük animasyon.
- UI okunurluğunu bozan partikül yoğunluğu.

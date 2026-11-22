# Söz Ustası Tema Görselleri

Tema arka planlarını bu klasöre koy.

## Aktif klasörler

```txt
public/assets/themes/old_istanbul/background.png
public/assets/themes/cappadocia/background.png
public/assets/themes/ege_coast/background.png
public/assets/themes/ottoman_library/background.png
public/assets/themes/anatolian_autumn/background.png
public/assets/themes/seljuk_courtyard/background.png
public/assets/themes/nemrut_dawn/background.png
public/assets/themes/blacksea_highland/background.png
```

## Önerilen görsel standardı

```txt
Format: png veya webp
İsim: background.png veya background.webp
Oran: 9:16 portrait
Önerilen boyut: 1080 x 1920 veya 1080 x 2340
İçerik: metinsiz, UI'sız, özgün arka plan
Merkez alan: kelime kutuları ve harf çemberi için çok kalabalık olmamalı
```

Görsel yolunu `src/data/themes.ts` içindeki `backgroundImage` alanı belirler.

Üretimde kullanılmayan ham görseller ve alternatif varyasyonlar `art-source/` altında tutulur. `public/` altına yalnızca uygulamada gerçekten referans verilen görseller eklenmelidir; aksi halde APK/AAB boyutu gereksiz büyür.

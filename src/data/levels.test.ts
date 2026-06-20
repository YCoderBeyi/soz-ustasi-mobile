import { describe, it, expect } from 'vitest';
import { levels } from './levels';
import { getTheme } from './themes';
import { getLevelStory, levelStories } from './levelStories';
import { buildCrosswordLayout } from '../game/crossword';
import { normalizeWord } from '../game/normalize';

describe('level data integrity', () => {
  for (const level of levels) {
    it(`Level ${level.levelId}: geçerli tema referansı`, () => {
      expect(getTheme(level.themeId).themeId).toBe(level.themeId);
    });

    it(`Level ${level.levelId}: geçerli story referansı`, () => {
      const story = getLevelStory(level.levelId);
      expect(story.levelId).toBe(level.levelId);
    });

    it(`Level ${level.levelId}: en az 2 ana kelime`, () => {
      expect(level.mainWords.length).toBeGreaterThanOrEqual(2);
    });

    it(`Level ${level.levelId}: her kelimenin harfleri havuzda yeterli sayıda`, () => {
      const pool = level.letters.map((l) => normalizeWord(l));
      const words = [...level.mainWords, ...level.hiddenWords];
      for (const entry of words) {
        const wordLetters = [...entry.word].map((c) => normalizeWord(c));
        const poolCopy = [...pool];
        for (const letter of wordLetters) {
          const idx = poolCopy.indexOf(letter);
          expect(idx, `${entry.word} → '${letter}' normalize edilmiş hali havuzda yok (${pool.join(',')})`).not.toBe(-1);
          poolCopy.splice(idx, 1);
        }
      }
    });

    it(`Level ${level.levelId}: tüm ana kelimeler benzersiz (normalize)`, () => {
      const normalized = level.mainWords.map((w) => normalizeWord(w.word));
      expect(new Set(normalized).size).toBe(normalized.length);
    });

    it(`Level ${level.levelId}: tüm gizli kelimeler benzersiz (normalize)`, () => {
      const normalized = level.hiddenWords.map((w) => normalizeWord(w.word));
      expect(new Set(normalized).size).toBe(normalized.length);
    });

    it(`Level ${level.levelId}: gizli kelimeler ana kelimelerden farklı`, () => {
      const mainNorm = new Set(level.mainWords.map((w) => normalizeWord(w.word)));
      for (const hw of level.hiddenWords) {
        expect(mainNorm.has(normalizeWord(hw.word))).toBe(false);
      }
    });

    it(`Level ${level.levelId}: pozitif ödül`, () => {
      expect(level.reward.baseCoin).toBeGreaterThan(0);
    });

    it(`Level ${level.levelId}: hiddenWordBonus yalnız gizli kelime varsa pozitif olmalı`, () => {
      if (level.hiddenWords.length === 0) {
        expect(level.reward.hiddenWordBonus).toBe(0);
      } else {
        expect(level.reward.hiddenWordBonus).toBeGreaterThan(0);
      }
    });

    it(`Level ${level.levelId}: gizli kelimeler bağımsız sözlük maddesi olmalı (çekim eki kabul edilmez)`, () => {
      for (const hw of level.hiddenWords) {
        const word = hw.word;
        // ÖZÜ gibi kök+iyelik/belirtme biçimlerini tespit etmek için blocklist
        const KNOWN_INVALID = ['ÖZÜ', 'SUYU', 'EVİ', 'ADAYI'];
        expect(
          KNOWN_INVALID.includes(word),
          `${word} gizli kelimesi bağımsız sözlük maddesi değil (çekim hali)`,
        ).toBe(false);
      }
    });

    it(`Level ${level.levelId}: kelimeler boş değil`, () => {
      for (const entry of level.mainWords) {
        expect(entry.word.length).toBeGreaterThan(0);
        expect(entry.meaning.length).toBeGreaterThan(0);
      }
      for (const entry of level.hiddenWords) {
        expect(entry.word.length).toBeGreaterThan(0);
        expect(entry.meaning.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('crossword layout generation', () => {
  for (const level of levels) {
    it(`Level ${level.levelId}: buildCrosswordLayout sonuç verir`, () => {
      const result = buildCrosswordLayout(level.mainWords);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.placements.length).toBe(level.mainWords.length);
        expect(result.cells.length).toBeGreaterThan(0);
        // Her hücrenin koordinatları 0 tabanlı
        for (const cell of result.cells) {
          expect(cell.row).toBeGreaterThanOrEqual(0);
          expect(cell.col).toBeGreaterThanOrEqual(0);
          expect(cell.row).toBeLessThan(result.rowCount);
          expect(cell.col).toBeLessThan(result.colCount);
        }
      }
    });
  }
});

describe('learning progression quality', () => {
  it('authors the Cebirin Anahtari pilot instead of cloning legacy levels', () => {
    const pilot = levels.slice(45, 50);

    expect(pilot.map((level) => level.levelId)).toEqual([46, 47, 48, 49, 50]);
    expect(pilot.map((level) => normalizeWord(level.mainWords[0].word))).toEqual([
      'CEBİR',
      'RAKAM',
      'DENKLEM',
      'SAYMAK',
      'YÖNTEM',
    ]);
    expect(pilot.map((level) => level.letters.map(normalizeWord).sort().join(''))).toEqual([
      'BCELRİİ',
      'AAKMR',
      'DEEKLMN',
      'AAKMSY',
      'EMNTYÖ',
    ]);
  });

  it('gives every Cebirin Anahtari level an authored discovery card', () => {
    const expectedTitles = [
      'Cebirin Dili',
      'Rakamların Yolculuğu',
      'Denklemi Düzenlemek',
      'Gündelik Soruların Hesabı',
      'Adım Adım Yöntem',
    ];

    expect(levelStories.slice(45, 50).map((story) => normalizeWord(story.title))).toEqual(
      expectedTitles.map(normalizeWord),
    );
  });

  it('authors the Gizli Mesajlar micro-adventure instead of cloning legacy levels', () => {
    const levels51to55 = levels.slice(50, 55);

    expect(levels51to55.map((level) => level.levelId)).toEqual([51, 52, 53, 54, 55]);
    expect(levels51to55.map((level) => normalizeWord(level.mainWords[0].word))).toEqual([
      'ŞİFRELİ',
      'HARFLER',
      'SIKLIK',
      'ÖRÜNTÜ',
      'ANAHTAR',
    ]);
  });

  it('gives every Gizli Mesajlar level an authored discovery card', () => {
    const expectedTitles = [
      'Saklı Yazının Sorusu',
      'Harfleri Saymak',
      'Dildeki İz',
      'Tekrarlayan Örüntü',
      'Anahtarın Dönüşü',
    ];

    expect(levelStories.slice(50, 55).map((story) => normalizeWord(story.title))).toEqual(
      expectedTitles.map(normalizeWord),
    );
  });

  it('authors the Bilgelik Evi micro-adventure instead of cloning legacy levels', () => {
    const levels56to60 = levels.slice(55, 60);

    expect(levels56to60.map((level) => level.levelId)).toEqual([56, 57, 58, 59, 60]);
    expect(levels56to60.map((level) => normalizeWord(level.mainWords[0].word))).toEqual([
      'TERCÜME',
      'KİTAPLIK',
      'GEOMETRİ',
      'GÖZLEM',
      'MAKİNE',
    ]);
  });

  it('gives every Bilgelik Evi level an authored discovery card', () => {
    const expectedTitles = [
      'Diller Arasında Köprü',
      'Yazmaların Toplandığı Yer',
      'Şekilleri Ölçmek',
      'Göğe Açılan Pencere',
      'Üç Kardeş Bir Atölye',
    ];

    expect(levelStories.slice(55, 60).map((story) => normalizeWord(story.title))).toEqual(
      expectedTitles.map(normalizeWord),
    );
  });

  it('authors the Isigin Izinde micro-adventure instead of cloning legacy levels', () => {
    const levels61to65 = levels.slice(60, 65);

    expect(levels61to65.map((level) => level.levelId)).toEqual([61, 62, 63, 64, 65]);
    expect(levels61to65.map((level) => normalizeWord(level.mainWords[0].word))).toEqual([
      'PARILTI',
      'GÖRMEK',
      'YANSIMA',
      'KARANLIK',
      'MERCEK',
    ]);
  });

  it('gives every Isigin Izinde level an authored discovery card', () => {
    const expectedTitles = [
      'Işığın Doğrusal Yolu',
      'Görmenin Yönü',
      'Aynadaki Açı',
      'Karanlık Odanın Görüntüsü',
      'Merceğe Giden Yol',
    ];

    expect(levelStories.slice(60, 65).map((story) => normalizeWord(story.title))).toEqual(
      expectedTitles.map(normalizeWord),
    );
  });

  it('authors the Sifanin Haritasi micro-adventure instead of cloning legacy levels', () => {
    const levels66to70 = levels.slice(65, 70);

    expect(levels66to70.map((level) => level.levelId)).toEqual([66, 67, 68, 69, 70]);
    expect(levels66to70.map((level) => normalizeWord(level.mainWords[0].word))).toEqual([
      'BELİRTİ',
      'HEKİMLİK',
      'İLAÇLAR',
      'AMELİYAT',
      'REÇETE',
    ]);
  });

  it('gives every Sifanin Haritasi level an authored discovery card', () => {
    const expectedTitles = [
      'Belirtiyi İzlemek',
      'Hekimin Gözlemi',
      'İlacın Ölçüsü',
      'Dikkatli Müdahale',
      'Bilgiyi Düzenleyen Kitap',
    ];

    expect(levelStories.slice(65, 70).map((story) => normalizeWord(story.title))).toEqual(
      expectedTitles.map(normalizeWord),
    );
  });

  it('keeps the authored 46-70 package free of internal pool and word repeats', () => {
    const authored = levels.slice(45, 70);
    const pools = authored.map((level) => level.letters.map(normalizeWord).sort().join(''));
    const mainWords = authored.flatMap((level) => level.mainWords.map((entry) => normalizeWord(entry.word)));
    const hiddenWords = authored.flatMap((level) => level.hiddenWords.map((entry) => normalizeWord(entry.word)));
    const duplicates = (items: string[]) => [...new Set(items.filter((item, index) => items.indexOf(item) !== index))];

    expect(duplicates(pools), 'tekrarlanan harf havuzlari').toEqual([]);
    expect(duplicates(mainWords), 'tekrarlanan ana kelimeler').toEqual([]);
    expect(duplicates(hiddenWords), 'tekrarlanan gizli kelimeler').toEqual([]);
  });

  it('authors the Cerrahin Aletleri micro-adventure instead of cloning legacy levels', () => {
    const levels71to75 = levels.slice(70, 75);

    expect(levels71to75.map((level) => level.levelId)).toEqual([71, 72, 73, 74, 75]);
    expect(levels71to75.map((level) => normalizeWord(level.mainWords[0].word))).toEqual([
      'ALETLER',
      'BIÇAK',
      'DİKİŞ',
      'TEMİZLİK',
      'TEDAVİ',
    ]);
  });

  it('gives every Cerrahin Aletleri level an authored discovery card', () => {
    const expectedTitles = [
      'Aletin İşlevi',
      'Keskin Kenarın Sorumluluğu',
      'Dikişle Birleştirmek',
      'Temiz Çalışma',
      'El-Tasrif’in Çizimleri',
    ];

    expect(levelStories.slice(70, 75).map((story) => normalizeWord(story.title))).toEqual(
      expectedTitles.map(normalizeWord),
    );
  });

  it('contains exactly 75 sequential levels in the first release', () => {
    expect(levels).toHaveLength(75);
    expect(levels.map((level) => level.levelId)).toEqual(
      Array.from({ length: 75 }, (_, index) => index + 1),
    );
  });

  it('keeps adjacent letter pools different', () => {
    const pool = (level: (typeof levels)[number]) =>
      level.letters.map(normalizeWord).sort().join('');

    for (let index = 1; index < levels.length; index++) {
      expect(pool(levels[index])).not.toBe(pool(levels[index - 1]));
    }
  });

  it('uses a globally unique letter pool for every main-journey level', () => {
    const seen = new Map<string, number>();

    for (const level of levels) {
      const pool = level.letters.map(normalizeWord).sort().join('');
      const previousLevel = seen.get(pool);
      expect(
        previousLevel,
        `Level ${level.levelId}, Level ${previousLevel} ile ayni harf havuzunu kullaniyor: ${pool}`,
      ).toBeUndefined();
      seen.set(pool, level.levelId);
    }
  });

  it('does not reuse a main word within twelve levels', () => {
    const lastSeen = new Map<string, number>();
    for (const level of levels.slice(45)) {
      for (const entry of level.mainWords) {
        const word = normalizeWord(entry.word);
        const previous = lastSeen.get(word);
        if (previous !== undefined) {
          expect(level.levelId - previous, `${entry.word} çok erken tekrarlandı`).toBeGreaterThanOrEqual(12);
        }
        lastSeen.set(word, level.levelId);
      }
    }
  });

  it('keeps at least ten levels between repeated main words', () => {
    const lastSeen = new Map<string, number>();

    for (const level of levels) {
      for (const entry of level.mainWords) {
        const word = normalizeWord(entry.word);
        const previousLevel = lastSeen.get(word);
        if (previousLevel !== undefined) {
          expect(
            level.levelId - previousLevel,
            `${entry.word}, Level ${previousLevel} sonrasinda Level ${level.levelId} icinde erken tekrarlandi`,
          ).toBeGreaterThanOrEqual(10);
        }
        lastSeen.set(word, level.levelId);
      }
    }
  });

  it('keeps at least ten levels between repeated hidden words', () => {
    const lastSeen = new Map<string, number>();

    for (const level of levels) {
      for (const entry of level.hiddenWords) {
        const word = normalizeWord(entry.word);
        const previousLevel = lastSeen.get(word);
        if (previousLevel !== undefined) {
          expect(
            level.levelId - previousLevel,
            `${entry.word}, Level ${previousLevel} sonrasinda Level ${level.levelId} icinde erken gizli tekrarlandi`,
          ).toBeGreaterThanOrEqual(10);
        }
        lastSeen.set(word, level.levelId);
      }
    }
  });

  it('keeps at least ten levels between any repeated word, even across main/hidden', () => {
    // Mevcut testler main↔main ve hidden↔hidden tekrarını ayrı izliyordu; bir
    // kelimenin bir bölümde ana, yakın bir bölümde gizli olarak tekrarı kaçıyordu.
    const lastSeen = new Map<string, number>();
    for (const level of levels) {
      const seenThisLevel = new Set<string>();
      for (const entry of [...level.mainWords, ...level.hiddenWords]) {
        const word = normalizeWord(entry.word);
        if (seenThisLevel.has(word)) continue;
        seenThisLevel.add(word);
        const previousLevel = lastSeen.get(word);
        if (previousLevel !== undefined) {
          expect(
            level.levelId - previousLevel,
            `${entry.word}, Level ${previousLevel} ve Level ${level.levelId} arasinda 10'dan az araliklatekrar ediyor (main/hidden ayrimi gozetmeksizin)`,
          ).toBeGreaterThanOrEqual(10);
        }
        lastSeen.set(word, level.levelId);
      }
    }
  });

  it('has one learning card for every level', () => {
    expect(levelStories).toHaveLength(levels.length);
    for (const level of levels) {
      const story = getLevelStory(level.levelId);
      expect(story.levelId).toBe(level.levelId);
      expect(story.title.length).toBeGreaterThanOrEqual(6);
      expect(story.body.length).toBeGreaterThanOrEqual(40);
    }
  });

  it('does not use generated mastery filler as a learning card', () => {
    for (const story of levelStories) {
      expect(story.title, `Level ${story.levelId} jenerik baslik kullaniyor`).not.toMatch(/^Ustalık Adımı \d+$/u);
      expect(story.body, `Level ${story.levelId} tekrar dolgusu kullaniyor`).not.toContain(
        'Tanıdık sözcüklerin farklı sırayla yeniden çağrılması',
      );
    }
  });

  it('keeps obscure or fragmentary words out of main objectives', () => {
    const unsuitableMainWords = new Set(['KEM', 'DEREN', 'EĞ', 'OL']);
    const mainWords = levels.flatMap((level) => level.mainWords.map((entry) => entry.word));

    for (const word of mainWords) {
      expect(unsuitableMainWords.has(word), `${word} geniş kitle için ana hedef olmamalı`).toBe(false);
    }
  });

  it('keeps disputed short forms out of hidden discoveries', () => {
    const unsuitableHiddenWords = new Set(['DAV', 'EZ', 'TU']);
    const hiddenWords = levels.flatMap((level) => level.hiddenWords.map((entry) => entry.word));

    for (const word of hiddenWords) {
      expect(unsuitableHiddenWords.has(word), `${word} güvenilir bonus kelime değil`).toBe(false);
    }
  });

  it('keeps sensitive or easily misunderstood words out of level targets', () => {
    const sensitiveWords = new Set(['MAL', 'DİK', 'İLAH', 'RUM', 'SARA', 'DİN', 'ÇİN']);
    const allLevelWords = levels.flatMap((level) => [
      ...level.mainWords.map((entry) => entry.word),
      ...level.hiddenWords.map((entry) => entry.word),
    ]);

    for (const word of allLevelWords) {
      expect(sensitiveWords.has(word), `${word} genel kitle için hedef kelime olmamalı`).toBe(false);
    }
  });

  it('does not advertise unsupported wordsearch levels', () => {
    for (const level of levels) {
      expect(level.puzzleType, `Level ${level.levelId} gerçek kelime avı modu olmadan wordsearch olmamalı`).not.toBe('wordsearch');
    }
  });

  it('starts accessible and ends with a clearly higher challenge', () => {
    const averageDifficulty = (from: number, to: number) => {
      const words = levels
        .filter((level) => level.levelId >= from && level.levelId <= to)
        .flatMap((level) => level.mainWords);
      return words.reduce((sum, word) => sum + (word.difficulty ?? 1), 0) / words.length;
    };

    expect(averageDifficulty(1, 5)).toBeLessThanOrEqual(2);
    expect(averageDifficulty(71, 75)).toBeGreaterThanOrEqual(3);
  });

  it('keeps chapter difficulty trending upward without removing recovery levels', () => {
    const difficultyScore = (level: (typeof levels)[number]) => {
      const averageDifficulty = level.mainWords.reduce(
        (sum, word) => sum + (word.difficulty ?? 1),
        0,
      ) / level.mainWords.length;
      const averageLength = level.mainWords.reduce(
        (sum, word) => sum + normalizeWord(word.word).length,
        0,
      ) / level.mainWords.length;

      return level.letters.length * 1.2
        + level.mainWords.length * 1.5
        + averageLength * 1.8
        + averageDifficulty * 2;
    };

    const chapterAverages = Array.from({ length: 5 }, (_, chapter) => {
      const chapterLevels = levels.slice(chapter * 15, chapter * 15 + 15);
      return chapterLevels.reduce((sum, level) => sum + difficultyScore(level), 0) / chapterLevels.length;
    });

    expect(chapterAverages.at(-1)).toBeGreaterThan(chapterAverages[0]);
    for (let index = 1; index < chapterAverages.length; index++) {
      expect(chapterAverages[index] + 1).toBeGreaterThanOrEqual(chapterAverages[index - 1]);
    }
  });
});

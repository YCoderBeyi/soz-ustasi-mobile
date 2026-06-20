import type { DifficultyLevel, LevelData } from '../types';
import { normalizeWord } from '../game/normalize';

const MASTERY_START_LEVEL = 46;
const MASTERY_LEVEL_COUNT = 75;
const RECENT_WINDOW = 11;

const masteryStories = [
  'Dikkatli gözlem, tanıdık harflerden yeni yollar kurmayı ve çözüm hızını artırmayı öğretir.',
  'Usta oyuncu, bildiği kelimeleri farklı bir düzende görerek hafızasını daha esnek kullanır.',
  'Kısa bir tekrar yolculuğu, zor kelimeleri hatırlamayı ve yeni bağlantılar kurmayı kolaylaştırır.',
  'Sabırlı denemeler, sözcük bilgisini kalıcı bir beceriye dönüştürür ve özgüveni güçlendirir.',
  'Harflerin değişen düzeni, anlamı yeniden çağırmayı ve dikkatli seçim yapmayı destekler.',
];

function normalizedPool(level: LevelData): string {
  return level.letters.map(normalizeWord).sort().join('');
}

function mainWordSet(level: LevelData): Set<string> {
  return new Set(level.mainWords.map((entry) => normalizeWord(entry.word)));
}

function canFollow(candidate: LevelData, recent: LevelData[], previous?: LevelData): boolean {
  if (previous && normalizedPool(candidate) === normalizedPool(previous)) return false;
  const recentWords = new Set(recent.flatMap((level) => [...mainWordSet(level)]));
  return candidate.mainWords.every((entry) => !recentWords.has(normalizeWord(entry.word)));
}

function difficultyFor(levelId: number, sourceDifficulty: number): DifficultyLevel {
  const floor = levelId >= 101 ? 4 : levelId >= 76 ? 3 : 3;
  const cyclePeak = levelId % 5 === 4 ? 1 : 0;
  return Math.min(5, Math.max(floor, sourceDifficulty, floor + cyclePeak)) as DifficultyLevel;
}

export function createMasteryLevels(baseLevels: LevelData[]): LevelData[] {
  const result: LevelData[] = [];
  const eligibleLevels = baseLevels.filter((level) => {
    const averageLength = level.mainWords.reduce((sum, entry) => sum + entry.word.length, 0)
      / level.mainWords.length;
    return level.mainWords.length >= 3 && averageLength >= 3.5;
  });
  const finalSource = baseLevels.find((level) => level.mainWords.some((entry) => entry.word === 'ADALET'))
    ?? eligibleLevels.at(-1);
  if (!finalSource) throw new Error('Mastery level source catalog is empty');
  let cursor = 0;

  for (let offset = 0; offset < MASTERY_LEVEL_COUNT; offset++) {
    const recent = result.slice(-RECENT_WINDOW);
    const previous = result.at(-1) ?? baseLevels.at(-1);
    let source: LevelData | undefined;
    const isFinal = offset === MASTERY_LEVEL_COUNT - 1;
    const reserveFinal = offset >= MASTERY_LEVEL_COUNT - RECENT_WINDOW - 1;
    const candidates = isFinal
      ? [finalSource]
      : reserveFinal
        ? eligibleLevels.filter((level) => level.levelId !== finalSource.levelId)
        : eligibleLevels;

    for (let attempt = 0; attempt < candidates.length; attempt++) {
      const candidate = candidates[(cursor + attempt) % candidates.length];
      if (canFollow(candidate, recent, previous)) {
        source = candidate;
        cursor = (cursor + attempt + 1) % candidates.length;
        break;
      }
    }

    if (!source) {
      source = candidates[cursor % candidates.length];
      cursor = (cursor + 1) % candidates.length;
    }

    const levelId = MASTERY_START_LEVEL + offset;
    const masteryStep = offset + 1;
    const cycleBonus = levelId % 5 === 0 ? 12 : 0;

    result.push({
      ...source,
      levelId,
      sealId: `seal_mastery_${String(masteryStep).padStart(2, '0')}`,
      story: `${masteryStories[offset % masteryStories.length]} Bu bölüm, ustalık yolculuğunun ${masteryStep}. adımıdır.`,
      puzzleType: offset % 3 === 1 ? 'anagram' : 'crossword',
      mainWords: source.mainWords.map((entry) => ({
        ...entry,
        difficulty: difficultyFor(levelId, entry.difficulty ?? 1),
      })),
      hiddenWords: source.hiddenWords.map((entry) => ({
        ...entry,
        reward: Math.max(entry.reward ?? 8, 12 + Math.floor(offset / 15)),
      })),
      reward: {
        baseCoin: 120 + offset * 2 + cycleBonus,
        hiddenWordBonus: 15 + Math.floor(offset / 15),
      },
    });
  }

  return result;
}

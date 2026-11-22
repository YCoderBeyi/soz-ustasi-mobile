import type { WordEntry } from '../types';
import { levels } from '../data/levels';
import { findBonusDictionaryWord } from './bonusDictionary';
import { normalizeWord } from './normalize';

// Single source of truth for "which word is this and how is its reward keyed".
// Reward keys are persisted in player saves (rewardedWordKeys); keep the format stable.
export type RewardKind = 'main' | 'hidden' | 'bonus';

export function rewardKey(levelId: number, kind: RewardKind, word: string): string {
  return `${levelId}:${kind}:${normalizeWord(word)}`;
}

export function rewardKeyPrefix(levelId: number, kind: RewardKind): string {
  return `${levelId}:${kind}:`;
}

export function findWordEntry(entries: readonly WordEntry[], word: string): WordEntry | undefined {
  const normalized = normalizeWord(word);
  return entries.find((entry) => normalizeWord(entry.word) === normalized);
}

let catalogIndex: Map<string, WordEntry> | null = null;

// First authored occurrence across all levels wins, then the curated bonus dictionary.
function getCatalogIndex(): Map<string, WordEntry> {
  if (catalogIndex) return catalogIndex;
  const index = new Map<string, WordEntry>();
  for (const level of levels) {
    for (const entry of [...level.mainWords, ...level.hiddenWords]) {
      const key = normalizeWord(entry.word);
      if (!index.has(key)) index.set(key, entry);
    }
  }
  catalogIndex = index;
  return index;
}

export function findCatalogWord(word: string): WordEntry | undefined {
  const normalized = normalizeWord(word);
  return getCatalogIndex().get(normalized) ?? findBonusDictionaryWord(normalized);
}

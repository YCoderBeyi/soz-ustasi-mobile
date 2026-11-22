// Söz Hazinesi counter: celebrates growth, never shows loss or scarcity.
export const COLLECTION_MILESTONES: readonly number[] = [10, 25, 50, 100, 200, 350, 500];

export interface CollectionProgress {
  count: number;
  /** Last milestone reached, 0 before the first. */
  reached: number;
  /** Next milestone, or null once all are reached. */
  next: number | null;
  /** Progress between `reached` and `next`, 0..1. */
  ratio: number;
}

export function collectionProgress(count: number): CollectionProgress {
  const safe = Math.max(0, Math.floor(count));
  const reached = [...COLLECTION_MILESTONES].reverse().find((m) => safe >= m) ?? 0;
  const next = COLLECTION_MILESTONES.find((m) => m > safe) ?? null;
  const ratio = next === null ? 1 : (safe - reached) / (next - reached);
  return { count: safe, reached, next, ratio };
}

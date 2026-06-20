import { describe, it, expect } from 'vitest';
import { chapters, chapterForLevel, isChapterFinale, isBigDiscovery, resolveChapter } from './chapters';

describe('chapters (Plan §4)', () => {
  it('12 bölüm, kesintisiz 1-240 aralığı', () => {
    expect(chapters).toHaveLength(12);
    expect(chapters[0].range[0]).toBe(1);
    expect(chapters[11].range[1]).toBe(240);
    for (let i = 1; i < chapters.length; i++) {
      expect(chapters[i].range[0]).toBe(chapters[i - 1].range[1] + 1);
    }
  });

  it('levelId doğru bölüme eşlenir', () => {
    expect(chapterForLevel(1).chapterId).toBe('ch01-ilk-izler');
    expect(chapterForLevel(20).index).toBe(1);
    expect(chapterForLevel(21).index).toBe(2);
    expect(chapterForLevel(61).chapterId).toBe('ch04-isik-tip-doga');
    expect(chapterForLevel(240).index).toBe(12);
  });

  it('bölüm finali her 20. seviyede', () => {
    expect(isChapterFinale(20)).toBe(true);
    expect(isChapterFinale(120)).toBe(true);
    expect(isChapterFinale(19)).toBe(false);
  });

  it('büyük keşif her 5. seviyede (Plan §9.2)', () => {
    expect(isBigDiscovery(5)).toBe(true);
    expect(isBigDiscovery(15)).toBe(true);
    expect(isBigDiscovery(7)).toBe(false);
  });

  it('açık chapterId override edilir, geçersizde türetilir', () => {
    expect(resolveChapter(5, 'ch06-anadolu-osmanli').index).toBe(6);
    expect(resolveChapter(5, 'bilinmeyen').index).toBe(1);
    expect(resolveChapter(5).index).toBe(1);
  });
});

import type { LevelData, LevelStory } from '../types';

const eras = ['Bellek Atölyesi', 'Sözcük Yolculuğu', 'Ustalık Dönemi', 'Keşif Rotası', 'Bilgi Bahçesi'];
const places = ['Anadolu', 'İstanbul', 'Ege', 'Kapadokya', 'Karadeniz'];

export function createMasteryLevelStories(levels: LevelData[]): LevelStory[] {
  return levels.map((level, index) => ({
    levelId: level.levelId,
    era: eras[index % eras.length],
    place: places[index % places.length],
    title: `Ustalık Adımı ${index + 1}`,
    body: `${level.story} Tanıdık sözcüklerin farklı sırayla yeniden çağrılması, hatırlama gücünü ve çözüm esnekliğini destekler.`,
  }));
}

import { useState, type CSSProperties } from 'react';
import '../styles/vault.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { normalizeWord } from '../game/normalize';
import { collectionProgress } from '../game/collectionMilestones';
import { BottomNav } from '../components/ui/BottomNav';
import { ScreenHeader } from '../components/ScreenHeader';
import { TabPill3D } from '../components/TabPill3D';
import { FavButton } from '../components/FavButton';
import { MeaningCard3D } from '../components/MeaningCard3D';

function isHiddenWord(word: string) {
  const nw = normalizeWord(word);
  for (const entry of levels) {
    if (entry.hiddenWords.some((hw) => normalizeWord(hw.word) === nw)) return true;
  }
  return false;
}

type DictTab = 'all' | 'hidden' | 'favorites';

export function DictionaryScreen() {
  const { play, setScreen, collectedWords, favoriteWords, toggleFavorite, theme } = useGame();
  const [tab, setTab] = useState<DictTab>('all');

  const progress = collectionProgress(collectedWords.length);

  const filtered = tab === 'all' ? collectedWords
    : tab === 'hidden' ? collectedWords.filter((w) => isHiddenWord(w.word))
    : collectedWords.filter((w) => favoriteWords.includes(w.word));

  return (
    <main className="screen vaultScreen" style={{ '--accent': theme.primaryColor } as CSSProperties}>
      <ScreenHeader title="Söz Hazinesi" onBack={() => { play('tap'); setScreen('map'); }} showSound={false} />
      <div className="tabs tabs3d">
        <TabPill3D label="Tüm Kelimeler" active={tab === 'all'} onClick={() => { play('tap'); setTab('all'); }} />
        <TabPill3D label="Gizli" active={tab === 'hidden'} onClick={() => { play('tap'); setTab('hidden'); }} />
        <TabPill3D label="Favoriler" active={tab === 'favorites'} onClick={() => { play('tap'); setTab('favorites'); }} />
      </div>
      <div className="vaultScroll">
        <section className="collectionProgress" aria-label="Koleksiyon ilerlemesi">
          <strong>{progress.count} kelime keşfedildi</strong>
          <div
            className="collectionBar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress.ratio * 100)}
          >
            <span style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
          </div>
          <small>
            {progress.next === null
              ? 'Tüm kilometre taşlarına ulaştın.'
              : `Sıradaki kilometre taşı: ${progress.next} kelime`}
          </small>
        </section>
        {filtered.length === 0 ? (
          <div className="dictionaryEmptyZone">
            <MeaningCard3D className="emptyMeaningCard">
              <div className="emptyMeaningContent">
                <strong>{tab === 'favorites' ? 'Henüz favori yok' : 'Henüz kelime yok'}</strong>
                <p>Kelimeleri buldukça Söz Hazinesi burada kalıcı olarak büyür.</p>
              </div>
            </MeaningCard3D>
          </div>
        ) : (
          <div className="dictionaryGrid">
            {filtered.map((entry) => (
              <MeaningCard3D key={entry.word} className="dictionaryWordCard">
                <div className="wordCardHeader">
                  <strong>{entry.word}</strong>
                  <FavButton active={favoriteWords.includes(entry.word)} onClick={() => toggleFavorite(entry.word)} />
                </div>
                <p>{entry.meaning}</p>
                <div className="wordCardFooter">
                  <span className="statusTag">KEŞFEDİLDİ</span>
                </div>
              </MeaningCard3D>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="dictionary" />
    </main>
  );
}

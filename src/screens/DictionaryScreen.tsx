import { useState } from 'react';
import '../styles/vault.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { normalizeWord } from '../game/normalize';
import { BottomNavBar } from '../components/BottomNavBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { TabPill3D } from '../components/TabPill3D';
import { FavButton } from '../components/FavButton';

function isHiddenWord(word: string) {
  const nw = normalizeWord(word);
  for (const entry of levels) {
    if (entry.hiddenWords.some((hw) => normalizeWord(hw.word) === nw)) return true;
  }
  return false;
}

type DictTab = 'all' | 'hidden' | 'favorites';

export function DictionaryScreen() {
  const { play, setScreen, collectedWords, favoriteWords, toggleFavorite } = useGame();
  const [tab, setTab] = useState<DictTab>('all');

  const filtered = tab === 'all' ? collectedWords
    : tab === 'hidden' ? collectedWords.filter((w) => isHiddenWord(w.word))
    : collectedWords.filter((w) => favoriteWords.includes(w.word));

  return (
    <main className="screen vaultScreen">
      <ScreenHeader title="Söz Hazinesi" onBack={() => { play('tap'); setScreen('map'); }} showSound={false} />
      <div className="tabs tabs3d">
        <TabPill3D label="Tüm Kelimeler" active={tab === 'all'} onClick={() => { play('tap'); setTab('all'); }} />
        <TabPill3D label="Gizli" active={tab === 'hidden'} onClick={() => { play('tap'); setTab('hidden'); }} />
        <TabPill3D label="Favoriler" active={tab === 'favorites'} onClick={() => { play('tap'); setTab('favorites'); }} />
      </div>
      <div className="vaultScroll">
        {filtered.length === 0 ? (
          <article className="wordCard">
            <strong>{tab === 'favorites' ? 'Henüz favori yok' : 'Henüz kelime yok'}</strong>
            <p>Kelimeleri buldukça Söz Hazinesi burada kalıcı olarak büyür.</p>
            <small>Keşfe başla</small>
          </article>
        ) : (
          filtered.map((entry) => (
            <article className="wordCard" key={entry.word}>
              <div className="wordCardHeader">
                <strong>{entry.word}</strong>
                <FavButton active={favoriteWords.includes(entry.word)} onClick={() => toggleFavorite(entry.word)} />
              </div>
              <p>{entry.meaning}</p>
              <small>Bulundu</small>
            </article>
          ))
        )}
      </div>
      <BottomNavBar />
    </main>
  );
}

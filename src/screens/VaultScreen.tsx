import { useState } from 'react';
import '../styles/vault.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { normalizeWord } from '../game/normalize';

function isHiddenWord(word: string) {
  const nw = normalizeWord(word);
  for (const entry of levels) {
    if (entry.hiddenWords.some((hw) => normalizeWord(hw.word) === nw)) return true;
  }
  return false;
}

type VaultTab = 'all' | 'hidden' | 'favorites';

export function VaultScreen() {
  const { play, setScreen, collectedWords, favoriteWords, toggleFavorite, coins, soundEnabled, setSoundEnabled, coinPulse } = useGame();
  const [tab, setTab] = useState<VaultTab>('all');

  const filtered = tab === 'all' ? collectedWords
    : tab === 'hidden' ? collectedWords.filter((w) => isHiddenWord(w.word))
    : collectedWords.filter((w) => favoriteWords.includes(w.word));

  return (
    <main className="screen vaultScreen">
      <header className="topBar">
        <button className="iconButton" onClick={() => { play('tap'); setScreen('map'); }}>‹</button>
        <strong>Söz Hazinesi</strong>
        <div className="topTools">
          <span className={`coin ${coinPulse ? 'coinPulse' : ''}`}><span className="currencyIcon">💎</span>{coins}</span>
          <button className="soundButton" onClick={() => setSoundEnabled(!soundEnabled)} aria-label={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}>
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>
      <div className="tabs">
        <button className={tab === 'all' ? 'active' : ''} onClick={() => { play('tap'); setTab('all'); }}>Tüm Kelimeler</button>
        <button className={tab === 'hidden' ? 'active' : ''} onClick={() => { play('tap'); setTab('hidden'); }}>Gizli</button>
        <button className={tab === 'favorites' ? 'active' : ''} onClick={() => { play('tap'); setTab('favorites'); }}>Favoriler</button>
      </div>
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
              <button
                className={`favStar ${favoriteWords.includes(entry.word) ? 'favStarActive' : ''}`}
                onClick={() => toggleFavorite(entry.word)}
                aria-label={favoriteWords.includes(entry.word) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              >
                {favoriteWords.includes(entry.word) ? '★' : '☆'}
              </button>
            </div>
            <p>{entry.meaning}</p>
            <small>Bulundu</small>
          </article>
        ))
      )}
    </main>
  );
}

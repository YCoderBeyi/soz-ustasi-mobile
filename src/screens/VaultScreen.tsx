import { useState } from 'react';
import '../styles/vault.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { levelStories } from '../data/levelStories';
import { normalizeWord } from '../game/normalize';
import { WaxSeal } from '../components/WaxSeal';
import { V2Icon } from '../components/Icon';

function isHiddenWord(word: string) {
  const nw = normalizeWord(word);
  for (const entry of levels) {
    if (entry.hiddenWords.some((hw) => normalizeWord(hw.word) === nw)) return true;
  }
  return false;
}

type VaultTab = 'all' | 'hidden' | 'favorites' | 'seals';

export function VaultScreen() {
  const { play, setScreen, collectedWords, favoriteWords, toggleFavorite, coins, soundEnabled, setSoundEnabled, coinPulse, completedLevels } = useGame();
  const [tab, setTab] = useState<VaultTab>('all');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const filtered = tab === 'all' ? collectedWords
    : tab === 'hidden' ? collectedWords.filter((w) => isHiddenWord(w.word))
    : tab === 'favorites' ? collectedWords.filter((w) => favoriteWords.includes(w.word))
    : [];

  const earnedSeals = levels.filter(l => completedLevels.includes(l.levelId));
  const selectedStory = selectedLevelId ? levelStories.find(s => s.levelId === selectedLevelId) : null;

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

      <div className="tabs vaultTabs">
        <button className={tab === 'all' ? 'active' : ''} onClick={() => { play('tap'); setTab('all'); setSelectedLevelId(null); }}>Kelimeler</button>
        <button className={tab === 'hidden' ? 'active' : ''} onClick={() => { play('tap'); setTab('hidden'); setSelectedLevelId(null); }}>Gizli</button>
        <button className={tab === 'favorites' ? 'active' : ''} onClick={() => { play('tap'); setTab('favorites'); setSelectedLevelId(null); }}>Favoriler</button>
        <button className={tab === 'seals' ? 'active' : ''} onClick={() => { play('tap'); setTab('seals'); setSelectedLevelId(null); }}>Mühürler</button>
      </div>

      <div className="vaultContent">
        {tab === 'seals' ? (
          <div className="sealsContainer">
            {earnedSeals.length === 0 ? (
              <article className="wordCard">
                <strong>Henüz mühür yok</strong>
                <p>Level'ları tamamlayarak mühürlerini burada toplayabilirsin.</p>
              </article>
            ) : (
              <>
                <div className="sealsGrid">
                  {earnedSeals.map((l) => (
                    <button
                      key={l.levelId}
                      className={`sealNode ${selectedLevelId === l.levelId ? 'selected' : ''}`}
                      onClick={() => { play('tap'); setSelectedLevelId(l.levelId); }}
                    >
                      <WaxSeal className="sealNodeGraphic" label={`${l.levelId}`} />
                      <small>Level {l.levelId}</small>
                    </button>
                  ))}
                </div>
                {selectedStory && (
                  <article className="wordCard sealStoryCard">
                    <div className="wordCardHeader">
                      <strong>{selectedStory.title}</strong>
                      <span className="eraTag">{selectedStory.era}</span>
                    </div>
                    <p>{selectedStory.body}</p>
                    {selectedStory.person && (
                      <div className="personInfo">
                        <V2Icon name="bottomProfile" className="personIcon" />
                        <div>
                          <strong>{selectedStory.person}</strong>
                          <small>{selectedStory.personInfo}</small>
                        </div>
                      </div>
                    )}
                  </article>
                )}
              </>
            )}
          </div>
        ) : filtered.length === 0 ? (
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
      </div>
    </main>
  );
}

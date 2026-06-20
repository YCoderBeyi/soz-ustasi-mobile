import { useState, type CSSProperties } from 'react';
import '../styles/vault.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { levelStories } from '../data/levelStories';
import { normalizeWord } from '../game/normalize';
import { WaxSeal } from '../components/WaxSeal';
import { V2Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { TabPill3D } from '../components/TabPill3D';
import { FavButton } from '../components/FavButton';
import { BottomNav } from '../components/ui/BottomNav';

function isHiddenWord(word: string) {
  const nw = normalizeWord(word);
  for (const entry of levels) {
    if (entry.hiddenWords.some((hw) => normalizeWord(hw.word) === nw)) return true;
  }
  return false;
}

type VaultTab = 'all' | 'hidden' | 'favorites' | 'seals';

export function VaultScreen() {
  const { play, setScreen, collectedWords, favoriteWords, toggleFavorite, completedLevels, theme } = useGame();
  const [tab, setTab] = useState<VaultTab>('all');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const filtered = tab === 'all' ? collectedWords
    : tab === 'hidden' ? collectedWords.filter((w) => isHiddenWord(w.word))
    : tab === 'favorites' ? collectedWords.filter((w) => favoriteWords.includes(w.word))
    : [];

  const earnedSeals = levels.filter(l => completedLevels.includes(l.levelId));
  const selectedStory = selectedLevelId ? levelStories.find(s => s.levelId === selectedLevelId) : null;

  return (
    <main className="screen vaultScreen" style={{ '--accent': theme.primaryColor } as CSSProperties}>
      <ScreenHeader title="Söz Hazinesi" onBack={() => { play('tap'); setScreen('map'); }} />

      <div className="tabs vaultTabs tabs3d">
        <TabPill3D label="Kelimeler" active={tab === 'all'} onClick={() => { play('tap'); setTab('all'); setSelectedLevelId(null); }} />
        <TabPill3D label="Gizli" active={tab === 'hidden'} onClick={() => { play('tap'); setTab('hidden'); setSelectedLevelId(null); }} />
        <TabPill3D label="Favoriler" active={tab === 'favorites'} onClick={() => { play('tap'); setTab('favorites'); setSelectedLevelId(null); }} />
        <TabPill3D label="Mühürler" active={tab === 'seals'} onClick={() => { play('tap'); setTab('seals'); setSelectedLevelId(null); }} />
      </div>

      <div className="vaultContent">
        {tab === 'seals' ? (
          <div className="sealsContainer">
            {earnedSeals.length === 0 ? (
              <article className="wordCard">
                <strong>Henüz mühür yok</strong>
                <p>Seviyeleri tamamlayarak mühürlerini burada toplayabilirsin.</p>
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
                      <small>Seviye {l.levelId}</small>
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
                    {selectedStory.impact && (
                      <p className="storyImpact"><b>Neden önemli?</b> {selectedStory.impact}</p>
                    )}
                    {selectedStory.today && (
                      <p className="storyToday"><b>Bugün nerede?</b> {selectedStory.today}</p>
                    )}
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
                <FavButton active={favoriteWords.includes(entry.word)} onClick={() => toggleFavorite(entry.word)} />
              </div>
              <p>{entry.meaning}</p>
              <small>Bulundu</small>
            </article>
          ))
        )}
      </div>
      <BottomNav active="dictionary" />
    </main>
  );
}

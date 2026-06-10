import '../styles/game.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import '../styles/modal.css';
import '../styles/level-modal.css';
import type { CSSProperties } from 'react';
import { useState, useRef, useCallback } from 'react';
import { useGame } from '../store/GameContext';
import { GameBoard } from '../game/three/GameBoard';
import { HintModal } from '../components/HintModal';
import { PauseModal } from '../components/PauseModal';
import { PrivacyModal } from '../components/PrivacyModal';
import { RewardModal } from '../components/RewardModal';
import { WaxSeal } from '../components/WaxSeal';
import { Confetti } from '../components/Confetti';
import { V2Icon } from '../components/Icon';
import { FavButton } from '../components/FavButton';
import { MeaningCard3D } from '../components/MeaningCard3D';
import { ResourcePill } from '../components/ResourcePill';
import { BottomNav } from '../components/ui/BottomNav';
import { ParticleBurst } from '../components/ParticleBurst';
import { ActionIconButton } from '../components/ActionIconButton';

const puzzleTypeLabels: Record<string, string> = {
  crossword: 'ÇAPRAZ',
  anagram: 'ANAGRAM',
  wordsearch: 'KELİME AVI',
};

export function GameScreen() {
  const {
    level, theme, letters, selected, found,
    revealedLetters, meaning, toast, setToast,
    feedback, sealOpen, canSeal,
    streak, maxStreak,
    coins, coinPulse, lanternCount,
    modal,
    play, setModal, setScreen,
    shuffleLetters,
    currentWord,
    levelTransitionKey,
    clearSelection,
    favoriteWords, toggleFavorite,
    submitWord,
    manualOpenSeal,
  } = useGame();

  const wheelSeqRef = useRef<number[]>([]);
  const [localSelected, setLocalSelected] = useState<number[]>([]);

  const handle3DLetterSelect = useCallback((index: number) => {
    const seq = wheelSeqRef.current;
    const lastIndex = seq.length > 0 ? seq[seq.length - 1] : null;

    if (index === lastIndex) return;

    if (seq.length >= 2 && index === seq[seq.length - 2]) {
      wheelSeqRef.current = seq.slice(0, -1);
      setLocalSelected([...wheelSeqRef.current]);
      return;
    }

    if (seq.includes(index)) return;

    play('letter');
    wheelSeqRef.current = [...seq, index];
    setLocalSelected([...wheelSeqRef.current]);
  }, [play]);

  const displaySelected = localSelected.length > 0 ? localSelected : selected;
  const displayWord = displaySelected.map((index) => letters[index]).join('');

  function clearWheelSelection() {
    wheelSeqRef.current = [];
    setLocalSelected([]);
    clearSelection();
  }

  return (
    <main
      key={levelTransitionKey}
      className="screen game gameRef"
      style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}
    >
      <div className="themeBackdrop" />

      <header className="gameRefHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('map'); }} ariaLabel="Haritaya dön" size="lg" />
        
        <div className="levelBadge3d" aria-label={`Level ${level.levelId}`}>
          <V2Icon name="levelBadge" className="levelBadge3dBg" />
          <span className="levelBadge3dLabel">Level {level.levelId}</span>
        </div>

        <div className="gameRefHeaderTools">
          <ResourcePill type="coin" value={coins} compact className={coinPulse ? 'coinPulse' : ''} />
          <ActionIconButton icon="settings" onClick={() => { play('tap'); setModal('pause'); }} ariaLabel="Ayarlar" size="lg" />
        </div>
      </header>

      <section className="gameBoard3D" style={{ gridRow: '2 / 4', position: 'relative', minHeight: 0 }}>
        <GameBoard
          level={level}
          found={found}
          selectedIndices={displaySelected}
          revealedLetters={revealedLetters}
          onLetterSelect={handle3DLetterSelect}
        />
        {meaning && (
          <div className="gameMeaningOverlay">
            <MeaningCard3D className="visible">
              <div className="meaningHeader">
                <strong>{meaning.word}</strong>
                <FavButton active={favoriteWords.includes(meaning.word)} onClick={() => toggleFavorite(meaning.word)} />
              </div>
              <p>{meaning.meaning}</p>
            </MeaningCard3D>
          </div>
        )}
      </section>

      <nav className="gameActionRow" aria-label="Aksiyonlar">
        <div className="gameActionFiller" />
        <button
          className={`gameSealAction ${canSeal ? 'canSealActive' : ''}`}
          onClick={() => {
            if (canSeal) {
              manualOpenSeal();
            } else {
              play('tap');
              setToast(`Mühür: ${found.length}/${level.mainWords.length}`);
            }
          }}
          aria-label={canSeal ? 'Mührü bas ve tamamla' : 'Mühür ilerlemesi'}
        >
          <WaxSeal className={`gameSealMark ${canSeal ? 'glowing' : ''}`} label={canSeal ? 'BAS' : `${found.length}`} />
        </button>
      </nav>

      <BottomNav active="map" />

      {toast && <div className="toast">{toast}</div>}
      {streak >= 3 && (
        <div className={`streakBadge tier${streak >= 8 ? 8 : streak >= 5 ? 5 : 3}`} aria-hidden="true">
          {streak >= 8 ? 'Efsane' : streak >= 5 ? 'Usta' : 'Çırak'} Serisi · {streak}x
        </div>
      )}
      
      <div className="feedbackOverlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
        <ParticleBurst active={feedback === 'correct'} type="gold" count={16} />
        <ParticleBurst active={feedback === 'hidden'} type="hidden" count={20} />
        <ParticleBurst active={feedback === 'seal'} type="seal" count={30} />
      </div>

      {sealOpen && (
        <>
          <WaxSeal className="sealOpen" label="Söz Mührü\nAçıldı" multiline ariaLabel="Söz Mührü Açıldı" />
          <Confetti />
        </>
      )}
      {feedback === 'wrong' && <div className="shakeOverlay" aria-hidden="true" />}
      {modal === 'hint' && <HintModal />}
      {modal === 'pause' && <PauseModal />}
      {modal === 'privacy' && <PrivacyModal />}
      {modal === 'reward' && <RewardModal />}
    </main>
  );
}

import '../styles/game.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import '../styles/modal.css';
import '../styles/level-modal.css';
import type { CSSProperties } from 'react';
import { useState, useRef, useCallback } from 'react';
import { useGame } from '../store/GameContext';
import { WordPuzzle } from '../components/WordPuzzle';
import { HintModal } from '../components/HintModal';
import { PauseModal } from '../components/PauseModal';
import { PrivacyModal } from '../components/PrivacyModal';
import { RewardModal } from '../components/RewardModal';
import { WaxSeal } from '../components/WaxSeal';
import { Confetti } from '../components/Confetti';
import { V2Icon } from '../components/Icon';
import { FavButton } from '../components/FavButton';
import { MeaningCard3D } from '../components/MeaningCard3D';
import { findWheelLetterAtPoint, letterCenterPercent } from '../game/wheelDrag';

export function GameScreen() {
  const {
    level, theme, letters, selected, found,
    revealedLetters, meaning, toast, setToast,
    feedback, sealOpen, canSeal,
    streak, maxStreak,
    coins, coinPulse,
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

  const ringRef = useRef<HTMLDivElement>(null);
  const tileSizeRef = useRef(56);
  const dragSeqRef = useRef<number[]>([]);
  const draggingRef = useRef(false);
  const [localSelected, setLocalSelected] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pointerPoint, setPointerPoint] = useState<{ x: number; y: number } | null>(null);

  const getWheelPoint = useCallback((clientX: number, clientY: number) => {
    const ring = ringRef.current;
    if (!ring) return null;
    const rect = ring.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const getLetterPoint = useCallback((index: number) => letterCenterPercent(index, letters.length), [letters.length]);

  const findLetterAtPoint = useCallback((clientX: number, clientY: number, lastIndex: number | null = null): number | null => {
    const ring = ringRef.current;
    if (!ring) return null;
    const ringRect = ring.getBoundingClientRect();
    const sample = ring.querySelector<HTMLElement>('.wheelLetter');
    if (sample) {
      const rect = sample.getBoundingClientRect();
      tileSizeRef.current = Math.min(rect.width, rect.height);
    }
    return findWheelLetterAtPoint(clientX, clientY, ringRect, letters.length, tileSizeRef.current, lastIndex);
  }, [letters.length]);

  const finishDrag = useCallback((pointerId: number) => {
    const ring = ringRef.current;
    if (ring?.hasPointerCapture(pointerId)) ring.releasePointerCapture(pointerId);
    draggingRef.current = false;
    setIsDragging(false);
    setPointerPoint(null);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const ring = ringRef.current;
    if (!ring) return;
    ring.setPointerCapture(e.pointerId);
    const idx = findLetterAtPoint(e.clientX, e.clientY, null);
    if (idx === null) return;
    draggingRef.current = true;
    setIsDragging(true);
    dragSeqRef.current = [idx];
    setLocalSelected([idx]);
    setPointerPoint(getWheelPoint(e.clientX, e.clientY));
  }, [findLetterAtPoint, getWheelPoint]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    setPointerPoint(getWheelPoint(e.clientX, e.clientY));
    const lastIndex = dragSeqRef.current[dragSeqRef.current.length - 1] ?? null;
    const idx = findLetterAtPoint(e.clientX, e.clientY, lastIndex);
    if (idx === null || idx === lastIndex) return;
    const previousIndex = dragSeqRef.current[dragSeqRef.current.length - 2];
    if (idx === previousIndex) {
      dragSeqRef.current = dragSeqRef.current.slice(0, -1);
      setLocalSelected(dragSeqRef.current);
      return;
    }
    if (dragSeqRef.current.includes(idx)) return;
    play('letter');
    dragSeqRef.current = [...dragSeqRef.current, idx];
    setLocalSelected(dragSeqRef.current);
  }, [findLetterAtPoint, getWheelPoint, play]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const lastIndex = dragSeqRef.current[dragSeqRef.current.length - 1] ?? null;
    const idx = findLetterAtPoint(e.clientX, e.clientY, lastIndex);
    if (idx !== null && idx !== lastIndex && !dragSeqRef.current.includes(idx)) {
      dragSeqRef.current = [...dragSeqRef.current, idx];
    }
    const word = dragSeqRef.current.map((i) => letters[i]).join('');
    dragSeqRef.current = [];
    setLocalSelected([]);
    finishDrag(e.pointerId);
    if (word.length >= 2) submitWord(word);
    else clearSelection();
  }, [findLetterAtPoint, letters, submitWord, clearSelection, finishDrag]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    dragSeqRef.current = [];
    setLocalSelected([]);
    finishDrag(e.pointerId);
    clearSelection();
  }, [clearSelection, finishDrag]);

  const displaySelected = localSelected.length > 0 ? localSelected : selected;
  const displayWord = displaySelected.map((index) => letters[index]).join('');

  function clearWheelSelection() {
    dragSeqRef.current = [];
    setLocalSelected([]);
    setPointerPoint(null);
    clearSelection();
  }

  const trailPointsList = displaySelected
    .map(getLetterPoint)
    .concat(pointerPoint && draggingRef.current ? [pointerPoint] : []);

  let trailPath = '';
  if (trailPointsList.length > 0) {
    trailPath = `M ${trailPointsList[0].x} ${trailPointsList[0].y}`;
    for (let i = 0; i < trailPointsList.length - 1; i++) {
      const p1 = trailPointsList[i];
      const p2 = trailPointsList[i + 1];
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      const cx = mx + 0.18 * (50 - mx);
      const cy = my + 0.18 * (50 - my);
      trailPath += ` Q ${cx} ${cy}, ${p2.x} ${p2.y}`;
    }
  }

  const flawlessTarget = Math.min(2, level.mainWords.length);

  return (
    <main
      key={levelTransitionKey}
      className="screen game gameRef"
      style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}
    >
      <div className="themeBackdrop" />

      <div className="gameTopBar">
        <button className="svgBtn" onClick={() => { play('tap'); setScreen('map'); }} aria-label="Haritaya dön">
          <V2Icon name="back" />
        </button>
        <div className="gameTopIdentity">
          <strong>Level {level.levelId}</strong>
          <span>{theme.title}</span>
        </div>
        <div className={`gameCoinPill ${coinPulse ? 'coinPulse' : ''}`} aria-label={`Altın: ${coins}`}>
          <img src="/assets/map/topbar-3d/topbar-coin.png" alt="" />
          <strong>{coins}</strong>
        </div>
        <button className="svgBtn" onClick={() => { play('tap'); setModal('pause'); }} aria-label="Ayarlar">
          <V2Icon name="settings" />
        </button>
      </div>

      <section className="gameBoard" aria-label="Bulmaca alanı">
        <div className="gameGridPanel">
          <V2Icon name="gridPanel" className="gameGridPanelBg" />
          <div className="gameGridPanelContent">
            <WordPuzzle
              words={level.mainWords}
              found={found}
              revealedLetters={revealedLetters}
              currentWord={displayWord || currentWord}
            />
          </div>
        </div>
        <div className="gameStatsRow" aria-label="İstatistikler">
          <div className="gameStatChip">
            <V2Icon name="statChip" className="gameStatChipBg" />
            <span className="gameStatChipLabel">Ana Hedef</span>
            <strong>{found.length}/{level.mainWords.length}</strong>
          </div>
          <div className="gameStatChip">
            <V2Icon name="statChip" className="gameStatChipBg" />
            <span className="gameStatChipLabel">Hatasız Seri</span>
            <strong>{Math.min(maxStreak, flawlessTarget)}/{flawlessTarget}</strong>
          </div>
          <div className="gameStatChip">
            <V2Icon name="statChip" className="gameStatChipBg" />
            <span className="gameStatChipLabel">Seri</span>
            <strong>{streak > 0 ? streak : '—'}</strong>
          </div>
        </div>
      </section>

      <section className="gameWheelZone" aria-label="Harf çemberi">
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
        {displayWord && (
          <div className="wheelWordPill" aria-live="polite">
            <span>{displayWord}</span>
          </div>
        )}
        <div className="letterWheel">
          <div
            ref={ringRef}
            className="wheelRing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: 'none' }}
          >
            <img className="wheelRingFrame" src="/assets/gameplay/wheel-v3/ring.png" alt="" />
            {!displayWord && (
              <div className="wheelCurrentWord">
                {canSeal ? (
                  <button
                    type="button"
                    className="wheelCenterSealBtn"
                    onClick={() => {
                      manualOpenSeal();
                    }}
                    aria-label="Mührü bas ve tamamla"
                  >
                    <WaxSeal className="gameSealMark glowing" label="BAS" />
                    <span className="wheelCenterSealLabel">Mühürle</span>
                  </button>
                ) : (
                  <span className="wheelPlaceholder">Sürükle ve birleştir</span>
                )}
              </div>
            )}
            <svg className="wheelTrail" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f1c96a" />
                  <stop offset="100%" stopColor="#d9a441" />
                </linearGradient>
              </defs>
              {displaySelected.length > 0 && trailPath && <path d={trailPath} />}
            </svg>
            {letters.map((letter, index) => {
              const pos = letterCenterPercent(index, letters.length);
              return (
                <div
                  key={index}
                  className={`wheelLetter ${displaySelected.includes(index) ? 'wheelSelected' : ''}`}
                  data-letter-index={index}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  aria-hidden="true"
                >
                  <img
                    className="wheelLetterBg"
                    src={`/assets/gameplay/wheel-v3/${displaySelected.includes(index) ? 'letter-selected' : 'letter'}.png`}
                    alt=""
                  />
                  <span className="wheelLetterChar">{letter}</span>
                </div>
              );
            })}
          </div>
          {displaySelected.length > 0 && !isDragging && (
            <button type="button" className="wheelClearBtn" onClick={clearWheelSelection} aria-label="Temizle">⌫</button>
          )}
        </div>

        <div className="wheelControls">
          <button className="wheelCtrlBtn" onClick={() => { play('tap'); setModal('hint'); }} aria-label="İpucu">
            <img src="/assets/gameplay/v2/hint.png" alt="" />
            <span>İpucu</span>
          </button>
          <button className="wheelCtrlBtn" onClick={() => { play('tap'); shuffleLetters(); }} aria-label="Karıştır">
            <img src="/assets/gameplay/v2/shuffle.png" alt="" />
            <span>Karıştır</span>
          </button>
          <button
            className={`gameSealAction ${canSeal ? 'canSealActive' : ''}`}
            style={canSeal ? { display: 'none' } : undefined}
            onClick={() => {
              if (canSeal) {
                manualOpenSeal();
              } else {
                play('tap');
                setToast(`Mühür: ${found.length}/${level.mainWords.length}`);
                window.setTimeout(() => setToast(''), 1400);
              }
            }}
            aria-label={canSeal ? 'Mührü bas ve tamamla' : 'Mühür ilerlemesi'}
          >
            <WaxSeal className={`gameSealMark ${canSeal ? 'glowing' : ''}`} label={canSeal ? 'BAS' : `${found.length}`} />
            <span>Mühür</span>
          </button>
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
      {streak >= 3 && (
        <div className={`streakBadge tier${streak >= 8 ? 8 : streak >= 5 ? 5 : 3}`} aria-hidden="true">
          {streak >= 8 ? 'Efsane' : streak >= 5 ? 'Usta' : 'Çırak'} Serisi · {streak}x
        </div>
      )}
      {feedback === 'hidden' && <div className="burst hiddenBurst" aria-hidden="true" />}
      {feedback === 'correct' && <div className="burst correctBurst" aria-hidden="true" />}
      {sealOpen && (
        <>
          <div className="sealReveal" role="status" aria-label="Söz Mührü Açıldı">
            <div className="sealRevealFlash" />
            <div className="sealRevealRing" />
            <WaxSeal className="sealOpen" label="S" ariaLabel="Söz Mührü" />
            <div className="sealRevealTitle">
              <span>SÖZ MÜHRÜ</span>
              <strong>AÇILDI</strong>
            </div>
          </div>
          <Confetti count={34} />
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

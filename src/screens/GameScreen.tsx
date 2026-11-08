import '../styles/game.css';
import '../styles/game-layout.css';
import '../styles/topbar.css';
import '../styles/seal.css';
import '../styles/modal.css';
import type { CSSProperties } from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { WordPuzzle } from '../components/WordPuzzle';
import { HintModal } from '../components/HintModal';
import { PauseModal } from '../components/PauseModal';
import { PrivacyModal } from '../components/PrivacyModal';
import { RewardModal } from '../components/RewardModal';
import { SecondChanceModal } from '../components/SecondChanceModal';
import { WaxSeal } from '../components/WaxSeal';
import { Confetti } from '../components/Confetti';
import { V2Icon } from '../components/Icon';
import { FavButton } from '../components/FavButton';
import { MeaningCard3D } from '../components/MeaningCard3D';
import { letterCenterPercent } from '../game/wheelDrag';
import { useWheelGesture } from '../hooks/useWheelGesture';
import { StreakBadge } from '../components/StreakBadge';
import { ComboRing } from '../components/ComboRing';
import { skinEvolution, skinForLevel } from '../game/tileSkins';
import { Modal } from '../components/Modal';
import { Button3D } from '../components/Button3D';

export function GameScreen() {
  const {
    level, theme, letters, selected, found,
    revealedLetters, meaning, toast, setToast,
    feedback, sealOpen, canSeal,
    streak, score, multiplier, comboTier, comboProgress,
    coins, coinPulse,
    modal,
    play, haptic, setModal, setScreen,
    shuffleLetters,
    currentWord,
    levelTransitionKey,
    clearSelection,
    favoriteWords, toggleFavorite,
    submitWord,
    manualOpenSeal, selectedSealId,
    hiddenFound, missingHiddenCount, missingHiddenWordLengths,
    reduceMotion, calmMode,
    stallAssistOffer, acceptStallAssist, dismissStallAssist,
  } = useGame();

  const ringRef = useRef<HTMLDivElement>(null);
  const [sealConfirmationOpen, setSealConfirmationOpen] = useState(false);
  const [a11ySelected, setA11ySelected] = useState<number[]>([]);
  const progressToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (progressToastTimerRef.current) clearTimeout(progressToastTimerRef.current);
  }, []);

  // Seviye değişiminde klavye seçimini temizle (stale harf indeksi kalmasın)
  useEffect(() => { setA11ySelected([]); }, [levelTransitionKey]);

  const requestSeal = useCallback(() => {
    play('tap');
    if (missingHiddenCount > 0) {
      setSealConfirmationOpen(true);
      return;
    }
    manualOpenSeal();
  }, [manualOpenSeal, missingHiddenCount, play]);

  const wheel = useWheelGesture({
    letters,
    ringRef,
    onSubmit: submitWord,
    onCancel: clearSelection,
    onLetter: () => { play('letter'); haptic(6); },
  });
  const { isDragging } = wheel;

  const displaySelected = wheel.selected.length > 0 ? wheel.selected : selected;
  const displayWord = displaySelected.map((index) => letters[index]).join('');

  function clearWheelSelection() {
    wheel.reset();
    clearSelection();
  }

  // Klavye/ekran-okuyucu için harf seçimi (sürükle akışından bağımsız alternatif giriş)
  const a11yToggleLetter = useCallback((index: number) => {
    play('letter');
    setA11ySelected((prev) => (
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    ));
  }, [play]);

  const a11ySubmit = useCallback(() => {
    const word = a11ySelected.map((i) => letters[i]).join('');
    setA11ySelected([]);
    if (word.length >= 2) submitWord(word);
    else clearSelection();
  }, [a11ySelected, letters, submitWord, clearSelection]);

  const a11yClear = useCallback(() => {
    setA11ySelected([]);
    clearSelection();
  }, [clearSelection]);

  const trailPointsList = wheel.isDragging
    ? wheel.trail
    : displaySelected.map((index) => letterCenterPercent(index, letters.length));

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
          <strong>Seviye {level.levelId}</strong>
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
        {stallAssistOffer && !displayWord && !meaning && (
          <div className="gameStallOffer" role="group" aria-label="Yardım teklifi">
            <span>Takıldın mı? Bir harfi senin için açayım.</span>
            <button type="button" className="stallAccept" onClick={() => { play('tap'); acceptStallAssist(); }}>Aç</button>
            <button type="button" className="stallDismiss" onClick={() => { play('tap'); dismissStallAssist(); }} aria-label="Şimdi değil">×</button>
          </div>
        )}
        {displayWord && (
          <div className="gamePreviewStrip" aria-hidden="true">
            {[...displayWord].map((letter, index) => (
              <span className="previewChip" key={`${index}-${letter}`}>{letter}</span>
            ))}
          </div>
        )}
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
        <div className="gameGridPanel">
          <V2Icon name="gridPanel" className="gameGridPanelBg" />
          <div className="gameGridPanelContent">
            <WordPuzzle
              words={level.mainWords}
              found={found}
              revealedLetters={revealedLetters}
              currentWord={displayWord || currentWord}
              skin={skinForLevel(level.levelId)}
              evolution={skinEvolution(comboTier)}
              calm={calmMode || reduceMotion}
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
            <span className="gameStatChipLabel">Gizli</span>
            <strong>{hiddenFound.length}/{level.hiddenWords.length}</strong>
            {missingHiddenWordLengths.length > 0 && (
              <span className="gameStatChipHintLengths" aria-label="Kalan gizli kelime uzunlukları">
                {missingHiddenWordLengths.map((len) => '_'.repeat(len)).join('  ')}
              </span>
            )}
          </div>
          <div className="gameStatChip">
            <V2Icon name="statChip" className="gameStatChipBg" />
            <span className="gameStatChipLabel">Seri</span>
            <strong>{streak > 0 ? streak : '—'}</strong>
          </div>
          <div className="gameStatChip gameScoreChip" aria-label={`Puan ${score}`}>
            <V2Icon name="statChip" className="gameStatChipBg" />
            <span className="gameStatChipLabel">Puan</span>
            <strong>{score}</strong>
            {!calmMode && <ComboRing progress={comboProgress} multiplier={multiplier} />}
          </div>
        </div>
      </section>

      <section
        className="gameWheelZone"
        aria-label="Harf çemberi"
        style={{ touchAction: 'none' }}
        {...wheel.handlers}
      >
        {/* Erişilebilir canlı bölgeler — görünmez, ekran okuyucuya açık */}
        <div className="visually-hidden" aria-live="polite" aria-atomic="true">
          {displayWord ? `Seçilen harfler: ${[...displayWord].join(' ')}` : ''}
          {stallAssistOffer ? ' Takıldın mı? Bir harfi senin için açabilirim.' : ''}
        </div>
        <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {feedback === 'correct' ? 'Doğru kelime bulundu' : ''}
          {feedback === 'hidden' ? 'Gizli kelime bulundu' : ''}
          {feedback === 'unknown' ? 'Bu giriş ödül kazandırmadı, seri bozulmadı' : ''}
          {feedback === 'wrong' ? 'Yanlış, tekrar deneyin' : ''}
        </div>
        {/* Klavye / ekran-okuyucu için harf seçimi — görünmez alternatif giriş */}
        <div className="visually-hidden keyboardLetterInput">
          <h2>Harf çemberi — klavye ile seçim</h2>
          <p>Harflere odaklanıp Enter ile seçin, sonra "Kelimeyi onayla" düğmesine basın.</p>
          <ul>
            {letters.map((letter, index) => (
              <li key={index}>
                <button
                  type="button"
                  aria-pressed={a11ySelected.includes(index)}
                  onClick={() => a11yToggleLetter(index)}
                >
                  {letter}{a11ySelected.includes(index) ? ' (seçili)' : ''}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={a11ySubmit}>
            Kelimeyi onayla: {a11ySelected.map((i) => letters[i]).join('') || 'boş'}
          </button>
          <button type="button" onClick={a11yClear}>Seçimi temizle</button>
        </div>
        <div className="letterWheel">
          <div
            ref={ringRef}
            className="wheelRing"
            data-letters={letters.length}
          >
            <img className="wheelRingFrame" src="/assets/gameplay/wheel-v3/ring.webp" alt="" />
            {!displayWord && (
              <div className="wheelCurrentWord">
                {canSeal ? (
                  <button
                    type="button"
                    className="wheelCenterSealBtn"
                    onClick={requestSeal}
                    aria-label="Mührü bas ve tamamla"
                  >
                    <WaxSeal className="gameSealMark glowing" label="BAS" variant={selectedSealId} />
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
          {/* Mühürleme tek yoldan yapılır: çark merkezindeki wheelCenterSealBtn (yalnız canSeal).
              Bu buton yalnızca ilerleme göstergesidir; canSeal'de gizlenir. */}
          <button
            className="gameSealAction"
            style={canSeal ? { display: 'none' } : undefined}
            onClick={() => {
              play('tap');
              setToast(`Mühür: ${found.length}/${level.mainWords.length}`);
              if (progressToastTimerRef.current) clearTimeout(progressToastTimerRef.current);
              progressToastTimerRef.current = setTimeout(() => setToast(''), 1400);
            }}
            aria-label="Mühür ilerlemesi"
          >
            <WaxSeal className="gameSealMark" label={`${found.length}`} variant={selectedSealId} />
            <span>Mühür</span>
          </button>
        </div>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}
      <StreakBadge streak={streak} />
      {!reduceMotion && feedback === 'hidden' && <div className="burst hiddenBurst" aria-hidden="true" />}
      {!reduceMotion && feedback === 'correct' && <div className="burst correctBurst" aria-hidden="true" />}
      {sealOpen && (
        <>
          <div className="sealReveal" role="status" aria-label="Söz Mührü Açıldı">
            <div className="sealRevealFlash" />
            <div className="sealRevealRing" />
            <WaxSeal className="sealOpen" label="S" ariaLabel="Söz Mührü" variant={selectedSealId} />
            <div className="sealRevealTitle">
              <span>SÖZ MÜHRÜ</span>
              <strong>AÇILDI</strong>
            </div>
          </div>
          {!reduceMotion && <Confetti count={34} />}
        </>
      )}
      {!reduceMotion && feedback === 'wrong' && <div className="shakeOverlay" aria-hidden="true" />}
      {modal === 'hint' && <HintModal />}
      {modal === 'pause' && <PauseModal />}
      {modal === 'privacy' && <PrivacyModal />}
      {modal === 'reward' && <RewardModal />}
      {modal === 'secondChance' && <SecondChanceModal />}
      {sealConfirmationOpen && (
        <Modal title="Gizli Kelimeler Kaldı" onClose={() => setSealConfirmationOpen(false)}>
          <p>
            Bu seviyede keşfedilmeyi bekleyen {missingHiddenCount} gizli kelime var.
            Şimdi mühürlersen bu turu 1 yıldızla tamamlarsın.
          </p>
          <Button3D variant="blue" onClick={() => { play('tap'); setSealConfirmationOpen(false); }}>
            Aramaya Devam Et
          </Button3D>
          <Button3D
            variant="gold"
            onClick={() => {
              setSealConfirmationOpen(false);
              manualOpenSeal();
            }}
          >
            Yine de Mühürle (1★)
          </Button3D>
        </Modal>
      )}
    </main>
  );
}

import { useEffect, useState, type CSSProperties } from 'react';
import '../styles/onboarding.css';
import '../styles/seal.css';
import '../styles/wheel-letter.css';
import { useGame } from '../store/GameContext';
import { WaxSeal } from '../components/WaxSeal';
import { PremiumPrimaryButton } from '../components/PremiumPrimaryButton';
import { WheelLetterContents } from '../components/WheelLetterContents';
import { levels } from '../data/levels';

function wordLetterIndexes(letters: string[], word: string) {
  const used: number[] = [];
  for (const character of word) {
    const index = letters.findIndex((letter, candidate) => letter === character && !used.includes(candidate));
    if (index < 0) return [];
    used.push(index);
  }
  return used;
}

export function OnboardingScreen() {
  const { play, setScreen, setLevel, theme } = useGame();
  const [step, setStep] = useState(0);
  const firstLevelExample = levels[0].mainWords[1]?.word ?? levels[0].mainWords[0].word;
  const firstLevelLetters = levels[0].letters;
  const firstWordIndexes = wordLetterIndexes(firstLevelLetters, firstLevelExample);
  const [demoProgress, setDemoProgress] = useState(0);
  const slides = [
    { title: 'Harfleri Birleştir', body: 'Komşu harflerin üzerinde sürükleyerek kelimeyi kur.', word: firstLevelExample, accent: 'Bağla' },
    { title: 'Anlamı Keşfet', body: 'Her kelimenin anlamını gör; yeni sözcükleri keşfet.', word: 'GÜL', accent: 'Anlam' },
    { title: 'Mührü Doldur', body: 'Hedefleri tamamla, mührü aç ve ödülünü al.', word: 'SÖZ', accent: 'Ödül' },
  ];
  const activeSlide = slides[step];
  const selectedIndexes = firstWordIndexes.slice(0, step === 0 ? demoProgress : firstWordIndexes.length);
  const demoWord = selectedIndexes.length === firstWordIndexes.length
    ? firstLevelExample
    : selectedIndexes.map((index) => firstLevelLetters[index]).join('') || firstLevelExample;
  const trailPoints = selectedIndexes
    .map((index) => `${((index + 0.5) / firstLevelLetters.length) * 100},50`)
    .join(' L ');

  useEffect(() => {
    setDemoProgress(0);
    if (step !== 0) return undefined;
    const timer = window.setInterval(() => {
      setDemoProgress((current) => current >= firstWordIndexes.length ? 0 : current + 1);
    }, 680);
    return () => window.clearInterval(timer);
  }, [step, firstWordIndexes.length]);

  return (
    <main className="screen onboarding" style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}>
      <div className="themeBackdrop" />
      <section className="onboardStage" aria-label="Oyun demosu">
        <WaxSeal className="onboardSeal" label="S" />
        <div className="demoBank">
          <svg className="demoPath" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {trailPoints && <path d={`M ${trailPoints}`} />}
          </svg>
          {firstLevelLetters.map((letter, index) => (
            <div
              key={`${letter}-${index}`}
              className={`demoLetterNode ${selectedIndexes.includes(index) ? 'isSelected' : ''}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <WheelLetterContents letter={letter} selected={selectedIndexes.includes(index)} />
            </div>
          ))}
        </div>
        <div className="demoResult">
          <span>{activeSlide.accent}</span>
          <strong>{demoWord}</strong>
        </div>
      </section>

      <section className="onboardCopy" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">Söz Ustası</p>
        <h1>{activeSlide.title}</h1>
        <p>{activeSlide.body}</p>
      </section>

      <div className="onboardSteps" aria-label="Tanıtım ilerlemesi">
        <span className="onboardStepCount" role="status">{step + 1} / {slides.length}</span>
        {slides.map((slide, index) => (
          <span className={index === step ? 'active' : ''} key={slide.title} aria-hidden="true" />
        ))}
      </div>

      <PremiumPrimaryButton
        className="onboardingContinue"
        onClick={() => {
          play('tap');
          if (step === slides.length - 1) {
            setLevel(levels[0]);
            setScreen('level-start');
          } else setStep(step + 1);
        }}
      >
        {step === slides.length - 1 ? 'İlk Seviyeye Başla' : 'Devam Et'}
      </PremiumPrimaryButton>
      <div className="onboardNavigation">
        <button type="button" disabled={step === 0} onClick={() => { play('tap'); setStep(step - 1); }}>Önceki</button>
        <button type="button" onClick={() => { play('tap'); setScreen('map'); }}>Tanıtımı Atla</button>
      </div>
    </main>
  );
}

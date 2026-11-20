import { useState, type CSSProperties } from 'react';
import '../styles/onboarding.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { WaxSeal } from '../components/WaxSeal';
import { Button3D } from '../components/Button3D';
import { V2Icon } from '../components/Icon';
import { levels } from '../data/levels';

export function OnboardingScreen() {
  const { play, setScreen, setLevel, theme } = useGame();
  const [step, setStep] = useState(0);
  const firstLevelExample = levels[0].mainWords[1]?.word ?? levels[0].mainWords[0].word;
  const slides = [
    { title: 'Harfleri Birleştir', body: 'Komşu harflerin üzerinde sürükleyerek kelimeyi kur.', word: firstLevelExample, accent: 'Bağla' },
    { title: 'Anlamı Keşfet', body: 'Her kelimenin anlamını gör; yeni sözcükleri keşfet.', word: 'GÜL', accent: 'Anlam' },
    { title: 'Mührü Doldur', body: 'Hedefleri tamamla, mührü aç ve ödülünü al.', word: 'SÖZ', accent: 'Ödül' },
  ];
  const activeSlide = slides[step];

  return (
    <main className="screen onboarding" style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}>
      <div className="themeBackdrop" />
      <section className="onboardStage" aria-label="Oyun demosu">
        <WaxSeal className="onboardSeal" label="S" />
        <div className="demoBank">
          <div className="demoPath" aria-hidden="true" />
          {activeSlide.word.split('').map((letter, index) => (
            <div key={`${letter}-${index}`} className={`demoLetterNode demoLetter${index}`}>
              <V2Icon name="letterNode" className="demoLetterBg" />
              <span className="demoLetterChar">{letter}</span>
            </div>
          ))}
        </div>
        <div className="demoResult">
          <span>{activeSlide.accent}</span>
          <strong>{activeSlide.word}</strong>
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

      <Button3D
        variant={step === slides.length - 1 ? 'green' : 'gold'}
        onClick={() => {
          play('tap');
          if (step === slides.length - 1) {
            setLevel(levels[0]);
            setScreen('level-start');
          } else setStep(step + 1);
        }}
      >
        {step === slides.length - 1 ? 'İlk Seviyeye Başla' : 'Devam Et'}
      </Button3D>
      <div className="onboardNavigation">
        <button type="button" disabled={step === 0} onClick={() => { play('tap'); setStep(step - 1); }}>Önceki</button>
        <button type="button" onClick={() => { play('tap'); setScreen('map'); }}>Tanıtımı Atla</button>
      </div>
    </main>
  );
}

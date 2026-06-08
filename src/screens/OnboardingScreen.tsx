import { useState, type CSSProperties } from 'react';
import '../styles/onboarding.css';
import '../styles/seal.css';
import { useGame } from '../store/GameContext';
import { WaxSeal } from '../components/WaxSeal';
import { Button3D } from '../components/Button3D';

export function OnboardingScreen() {
  const { play, setScreen, theme } = useGame();
  const [step, setStep] = useState(0);
  const slides = [
    { title: 'Harfleri Birleştir', body: 'Parmağını kaldırmadan akışı yakala.', word: 'ARI', accent: 'Bağla' },
    { title: "Mührü Doldur", body: 'Doğru kelimeler kutulara yerleşir.', word: 'SÖZ', accent: 'Aç' },
    { title: 'Anlamı Keşfet', body: 'Her level küçük bir olayı görünür kılar.', word: 'YÂD', accent: 'Başla' },
  ];
  const activeSlide = slides[step];

  return (
    <main className="screen onboarding" style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}>
      <div className="themeBackdrop" />
      <section className="onboardStage" aria-label="Oyun demosu">
        <WaxSeal className="onboardSeal" label="S" />
        <div className="demoPath" aria-hidden="true" />
        <div className="demoBank">
          {activeSlide.word.split('').map((letter, index) => (
            <span key={`${letter}-${index}`} className={`demoLetter demoLetter${index}`}>{letter}</span>
          ))}
        </div>
        <div className="demoResult">
          <span>{activeSlide.accent}</span>
          <strong>{activeSlide.word}</strong>
        </div>
      </section>

      <section className="onboardCopy">
        <p className="eyebrow">Söz Ustası</p>
        <h1>{activeSlide.title}</h1>
        <p>{activeSlide.body}</p>
      </section>

      <div className="onboardSteps" aria-label="Tanıtım ilerlemesi">
        {slides.map((slide, index) => (
          <span className={index === step ? 'active' : ''} key={slide.title} />
        ))}
      </div>

      <Button3D
        variant={step === slides.length - 1 ? 'green' : 'gold'}
        onClick={() => { play('tap'); if (step === slides.length - 1) setScreen('map'); else setStep(step + 1); }}
      >
        {step === slides.length - 1 ? 'Haritaya Geç' : 'Devam Et'}
      </Button3D>
    </main>
  );
}

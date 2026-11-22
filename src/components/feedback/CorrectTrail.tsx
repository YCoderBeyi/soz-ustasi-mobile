import './FeedbackFx.css';

interface CorrectTrailProps {
  feedback: string | null | undefined;
  reduceMotion: boolean;
  calmMode: boolean;
}

/** Doğru ana kelimede kısa, sıcak ışık izi + yetkinlik bloom'u. Reduce-motion/calm'de yok. */
export function CorrectTrail({ feedback, reduceMotion, calmMode }: CorrectTrailProps) {
  if (reduceMotion || calmMode || feedback !== 'correct') return null;
  return (
    <>
      <div
        className="correctTrail"
        data-testid="correct-trail"
        data-feedback-fx="correct-trail"
        aria-hidden="true"
      />
      <div
        className="correctBloom"
        data-testid="correct-bloom"
        data-feedback-fx="correct-bloom"
        aria-hidden="true"
      />
    </>
  );
}

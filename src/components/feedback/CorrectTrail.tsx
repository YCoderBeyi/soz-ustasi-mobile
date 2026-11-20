interface CorrectTrailProps {
  feedback: string | null | undefined;
  reduceMotion: boolean;
  calmMode: boolean;
}

/** Doğru ana kelimede kısa (≤400ms), sıcak bir ışık izi. Reduce-motion/calm modda render edilmez. */
export function CorrectTrail({ feedback, reduceMotion, calmMode }: CorrectTrailProps) {
  if (reduceMotion || calmMode || feedback !== 'correct') return null;
  return (
    <div
      className="correctTrail"
      data-testid="correct-trail"
      data-feedback-fx="correct-trail"
      aria-hidden="true"
    />
  );
}

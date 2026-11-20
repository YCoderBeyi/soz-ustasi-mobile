interface HiddenSparkleProps {
  feedback: string | null | undefined;
  reduceMotion: boolean;
  calmMode: boolean;
}

/** Gizli kelime bonusunda kısa (≤760ms) yeşil-altın parıltı. Konfeti yok; reduce-motion/calm modda render edilmez. */
export function HiddenSparkle({ feedback, reduceMotion, calmMode }: HiddenSparkleProps) {
  if (reduceMotion || calmMode || feedback !== 'hidden') return null;
  return (
    <div
      className="hiddenSparkle"
      data-testid="hidden-sparkle"
      data-feedback-fx="hidden-sparkle"
      aria-hidden="true"
    />
  );
}

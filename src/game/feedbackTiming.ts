/** Lifetimes for feedback state and its matching CSS effects, in milliseconds. */
export const FEEDBACK_DURATION_MS = {
  correct: 600,
  hidden: 760,
  neutral: 700,
  wrong: 600,
  hint: 700,
} as const;

export function installFeedbackDurationTokens(root: HTMLElement): void {
  for (const [name, duration] of Object.entries(FEEDBACK_DURATION_MS)) {
    root.style.setProperty(`--feedback-${name}-duration`, `${duration}ms`);
  }
}

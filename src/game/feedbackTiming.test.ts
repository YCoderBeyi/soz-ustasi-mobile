import { describe, expect, it } from 'vitest';
import { FEEDBACK_DURATION_MS, installFeedbackDurationTokens } from './feedbackTiming';

describe('feedbackTiming SSOT', () => {
  it('exposes durations for every SessionContext feedback clear path', () => {
    expect(FEEDBACK_DURATION_MS.correct).toBe(600);
    expect(FEEDBACK_DURATION_MS.hidden).toBe(760);
    expect(FEEDBACK_DURATION_MS.neutral).toBe(700);
    expect(FEEDBACK_DURATION_MS.wrong).toBe(600);
    expect(FEEDBACK_DURATION_MS.hint).toBe(700);
  });

  it('installs matching CSS custom properties on the document root', () => {
    const root = document.createElement('div');
    installFeedbackDurationTokens(root);
    expect(root.style.getPropertyValue('--feedback-correct-duration')).toBe('600ms');
    expect(root.style.getPropertyValue('--feedback-hidden-duration')).toBe('760ms');
    expect(root.style.getPropertyValue('--feedback-neutral-duration')).toBe('700ms');
    expect(root.style.getPropertyValue('--feedback-wrong-duration')).toBe('600ms');
    expect(root.style.getPropertyValue('--feedback-hint-duration')).toBe('700ms');
  });
});

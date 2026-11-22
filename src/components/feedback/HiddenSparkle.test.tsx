// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CorrectTrail } from './CorrectTrail';
import { HiddenSparkle } from './HiddenSparkle';

afterEach(cleanup);

describe('HiddenSparkle', () => {
  it('gizli kelimede parıltıyı gösterir', () => {
    render(<HiddenSparkle feedback="hidden" reduceMotion={false} calmMode={false} />);
    const el = screen.getByTestId('hidden-sparkle');
    expect(el.getAttribute('data-feedback-fx')).toBe('hidden-sparkle');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toContain('hiddenSparkle');
    expect(el.className).not.toContain('correctTrail');
  });

  it('reduceMotion açıkken göstermez', () => {
    render(<HiddenSparkle feedback="hidden" reduceMotion calmMode={false} />);
    expect(screen.queryByTestId('hidden-sparkle')).toBeNull();
  });

  it('calmMode açıkken göstermez', () => {
    render(<HiddenSparkle feedback="hidden" reduceMotion={false} calmMode />);
    expect(screen.queryByTestId('hidden-sparkle')).toBeNull();
  });

  it('gizli dışındaki geri bildirimlerde göstermez', () => {
    for (const feedback of ['correct', 'wrong', 'bonus', null, undefined]) {
      const { unmount } = render(<HiddenSparkle feedback={feedback} reduceMotion={false} calmMode={false} />);
      expect(screen.queryByTestId('hidden-sparkle')).toBeNull();
      unmount();
    }
  });

  it('correct-trail ile karşılıklı dışlayıcıdır', () => {
    for (const feedback of ['correct', 'hidden']) {
      const { unmount } = render(
        <>
          <CorrectTrail feedback={feedback} reduceMotion={false} calmMode={false} />
          <HiddenSparkle feedback={feedback} reduceMotion={false} calmMode={false} />
        </>,
      );
      const trail = screen.queryByTestId('correct-trail');
      const sparkle = screen.queryByTestId('hidden-sparkle');
      expect(Number(!!trail) + Number(!!sparkle)).toBe(1);
      expect(!!trail).toBe(feedback === 'correct');
      unmount();
    }
  });
});

// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CorrectTrail } from './CorrectTrail';

afterEach(cleanup);

describe('CorrectTrail', () => {
  it('doğru kelimede ışık izini ve yetkinlik bloom gösterir', () => {
    render(<CorrectTrail feedback="correct" reduceMotion={false} calmMode={false} />);
    const el = screen.getByTestId('correct-trail');
    expect(el.getAttribute('data-feedback-fx')).toBe('correct-trail');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toContain('correctTrail');
    const bloom = screen.getByTestId('correct-bloom');
    expect(bloom.getAttribute('data-feedback-fx')).toBe('correct-bloom');
  });

  it('reduceMotion açıkken göstermez', () => {
    render(<CorrectTrail feedback="correct" reduceMotion calmMode={false} />);
    expect(screen.queryByTestId('correct-trail')).toBeNull();
  });

  it('calmMode açıkken göstermez', () => {
    render(<CorrectTrail feedback="correct" reduceMotion={false} calmMode />);
    expect(screen.queryByTestId('correct-trail')).toBeNull();
  });

  it('doğru dışındaki geri bildirimlerde göstermez', () => {
    for (const feedback of ['wrong', 'hidden', 'bonus', null]) {
      const { unmount } = render(<CorrectTrail feedback={feedback} reduceMotion={false} calmMode={false} />);
      expect(screen.queryByTestId('correct-trail')).toBeNull();
      unmount();
    }
  });
});

// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal keyboard interaction', () => {
  it('focuses inside, wraps Tab and restores the trigger on close', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const { unmount } = render(<Modal title="Test" onClose={() => {}}><button>Last</button></Modal>);
    const close = screen.getByRole('button', { name: 'Kapat' });
    const last = screen.getByRole('button', { name: 'Last' });
    expect(document.activeElement).toBe(close);
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('uses the latest close callback without resetting focus on rerender', () => {
    const close = vi.fn();
    const nextClose = vi.fn();
    const { rerender } = render(<Modal title="Test" onClose={close}><button>Last</button></Modal>);
    const last = screen.getByRole('button', { name: 'Last' });
    last.focus();
    rerender(<Modal title="Test" onClose={nextClose}><button>Last</button></Modal>);
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(last, { key: 'Escape' });
    expect(close).not.toHaveBeenCalled();
    expect(nextClose).toHaveBeenCalledOnce();
  });
});

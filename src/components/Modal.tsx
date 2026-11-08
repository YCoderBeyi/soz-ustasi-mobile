import { useEffect, type ReactNode } from 'react';
import { V2Icon } from './Icon';

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  // Escape closes every dialog the same way the close button does.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modalShade">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <button className="svgBtn modalClose3d" onClick={onClose} aria-label="Kapat"><V2Icon name="closeButton" /></button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}

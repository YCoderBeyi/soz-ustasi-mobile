import type { ReactNode } from 'react';
import { V2Icon } from './Icon';

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modalShade">
      <section className="modal">
        <button className="svgBtn modalClose3d" onClick={onClose} aria-label="Kapat"><V2Icon name="closeButton" /></button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}

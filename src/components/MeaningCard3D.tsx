import type { ReactNode } from 'react';
export function MeaningCard3D({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`meaningCard3d ${className}`}>
      <div className="meaningCard3dContent">{children}</div>
    </section>
  );
}

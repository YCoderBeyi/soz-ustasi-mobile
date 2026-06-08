import type { ReactNode } from 'react';
import { V2Icon } from './Icon';

export function MeaningCard3D({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`meaningCard3d ${className}`}>
      <V2Icon name="meaningCard" className="meaningCard3dBg" />
      <div className="meaningCard3dContent">{children}</div>
    </section>
  );
}

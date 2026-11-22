import { useEffect, useState } from 'react';

const DISPLAY_DURATION_MS = 1800;

export function StreakBadge({ streak }: { streak: number }) {
  const [visible, setVisible] = useState(streak >= 3);

  useEffect(() => {
    if (streak < 3) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), DISPLAY_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [streak]);

  if (!visible || streak < 3) return null;

  const tier = streak >= 8 ? 8 : streak >= 5 ? 5 : 3;
  const label = streak >= 8 ? 'Efsane' : streak >= 5 ? 'Usta' : 'Çırak';

  return (
    <div className={`streakBadge tier${tier}`} aria-live="polite">
      {label} Serisi · {streak}x
    </div>
  );
}

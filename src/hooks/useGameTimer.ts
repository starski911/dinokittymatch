import { useCallback, useEffect, useRef, useState } from 'react';
import type { Settings } from '../types/game';
import { sound } from '../services/sound';

export const getRemainingSeconds = (s: Settings, now = Date.now()): number =>
  s.timerEndTimestamp
    ? Math.max(0, Math.ceil((s.timerEndTimestamp - now) / 1000))
    : Math.max(0, s.timerRemainingSec || 0);

export const formatTime = (totalSec: number): string => {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

interface Options {
  getSettings: () => Settings;
  patchSettings: (p: Partial<Settings>) => void;
  /** Called once when a running countdown reaches 00:00. */
  onExpire: () => void;
  onWarn: (text: string, className: string) => void;
}

/** Session countdown: ticks every 400ms, fires 1m / 30s / 10..1s alerts, then expires. */
export function useGameTimer({ getSettings, patchSettings, onExpire, onWarn }: Options) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(getSettings()));
  const lastMark = useRef<number | null>(null);
  const cb = useRef({ patchSettings, onExpire, onWarn });
  cb.current = { patchSettings, onExpire, onWarn };

  const refresh = useCallback(() => setRemaining(getRemainingSeconds(getSettings())), [getSettings]);
  const resetAlerts = useCallback(() => { lastMark.current = null; }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const s = getSettings();
      const rem = getRemainingSeconds(s);
      setRemaining(rem);

      if (s.timerEndTimestamp && rem > 0) {
        if (rem === 60 && lastMark.current !== 60) {
          lastMark.current = 60;
          sound.timerWarning(false);
          cb.current.onWarn('⏰ 1 minute left to play!', 'bg-amber-600');
        } else if (rem === 30 && lastMark.current !== 30) {
          lastMark.current = 30;
          sound.timerWarning(false);
          cb.current.onWarn('⚠️ 30 seconds left! Finish your pair!', 'bg-orange-600');
        } else if (rem <= 10 && rem >= 1 && lastMark.current !== rem) {
          lastMark.current = rem;
          sound.timerWarning(true);
          if (rem === 10) cb.current.onWarn('🚨 10 seconds left!', 'bg-rose-600');
        }
      }

      if (s.timerEndTimestamp && rem <= 0) {
        lastMark.current = null;
        cb.current.patchSettings({ timerEndTimestamp: null, timerRemainingSec: 0 });
        cb.current.onExpire();
      }
    }, 400);
    return () => window.clearInterval(id);
  }, [getSettings]);

  return { remaining, refresh, resetAlerts };
}

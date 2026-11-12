import { useEffect } from 'react';
import { sound } from '../services/sound';

/** Keeps the synth engine's enabled flag in sync with the persisted setting. */
export function useAudio(enabled: boolean) {
  useEffect(() => {
    sound.enabled = enabled;
  }, [enabled]);
  return sound;
}

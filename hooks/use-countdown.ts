import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export function useCountdown(durationSeconds: number) {
  const endTimeRef = useRef(Date.now() + durationSeconds * 1000);
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  const recalc = useCallback(() => {
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setSecondsLeft(remaining);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(recalc, 1000);
    return () => clearInterval(intervalId);
  }, [secondsLeft, recalc]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        recalc();
      }
    });
    return () => subscription.remove();
  }, [recalc]);

  const restart = useCallback(() => {
    endTimeRef.current = Date.now() + durationSeconds * 1000;
    setSecondsLeft(durationSeconds);
  }, [durationSeconds]);

  const formatTime = useCallback((seconds: number): string => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return { secondsLeft, restart, formatTime };
}

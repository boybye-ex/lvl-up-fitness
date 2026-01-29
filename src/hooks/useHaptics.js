import { useCallback } from 'react';

export function useHaptics() {
  const vibrate = useCallback((pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const light = useCallback(() => vibrate(10), [vibrate]);
  const medium = useCallback(() => vibrate(40), [vibrate]);
  const heavy = useCallback(() => vibrate([50, 50, 50]), [vibrate]);
  const success = useCallback(() => vibrate([30, 50, 30, 50, 100]), [vibrate]);

  return { light, medium, heavy, success };
}

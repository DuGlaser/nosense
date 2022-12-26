import { useCallback, useRef } from 'react';

export const useTimeoutTransition = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearTransition = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const startTransition = useCallback(
    (callback: () => void, timeoutMs: number) => {
      clearTransition();
      timerRef.current = setTimeout(callback, timeoutMs);
    },
    [clearTransition]
  );

  return { startTransition, clearTransition };
};

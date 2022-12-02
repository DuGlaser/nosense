import { useCallback } from 'react';

export const useDamegaInput = () => {
  const getInputEventCallback = useCallback(() => {
    return () =>
      new Promise<string | undefined>((resolve) => {
        // NOTE: RxJSを使おうかなと思ってる
        const input = prompt('プログラムが入力待ちです。');
        return resolve(input ?? undefined);
      });
  }, []);

  return { getInputEventCallback };
};

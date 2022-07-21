import { OutputText } from '@nosense/damega';
import { useCallback } from 'react';

export const useDamegaInput = () => {
  const getInputEventCallback = useCallback(() => {
    return () =>
      new Promise<OutputText>((resolve) => {
        // NOTE: RxJSを使おうかなと思ってる
        const input: OutputText = prompt('プログラムが入力待ちです。');
        if (!isNaN(Number(input))) {
          return resolve(Number(input));
        }

        return resolve(input);
      });
  }, []);

  return { getInputEventCallback };
};

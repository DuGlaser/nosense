import { useCallback } from 'react';

import { useExecResultState } from '@/store/exec';

export const useDamegaOutput = () => {
  const [, setExecResult] = useExecResultState();

  const getOutputEventCallback = useCallback(() => {
    setExecResult([]);

    return (output: string) => {
      console.log(output);
      setExecResult((cur) => [...cur, output]);
    };
  }, []);

  return { getOutputEventCallback };
};

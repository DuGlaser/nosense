import { useCallback, useEffect } from 'react';

import { useExecModeState, useExecResultState } from '@/store/exec';

export const useDamegaOutput = () => {
  const [, setExecResult] = useExecResultState();
  const [execMode] = useExecModeState();

  useEffect(() => {
    if (execMode === 'exec') {
      setExecResult([]);
    }
  }, [execMode, setExecResult]);

  const getOutputEventCallback = useCallback(() => {
    setExecResult([]);

    return (output: string) => {
      setExecResult((cur) => [...cur, output]);
    };
  }, [setExecResult]);

  return { getOutputEventCallback };
};

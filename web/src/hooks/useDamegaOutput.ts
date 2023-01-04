import { useCallback } from 'react';

import { useExecResult } from '@/store';

export const useDamegaOutput = () => {
  const { addResult } = useExecResult();

  const getOutputEventCallback = useCallback(() => {
    return (output: string) => {
      addResult(output);
    };
  }, []);

  return { getOutputEventCallback };
};

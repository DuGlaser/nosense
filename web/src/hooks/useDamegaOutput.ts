import { useCallback } from 'react';

import { useExecResult } from '@/store/execResult';

export const useDamegaOutput = () => {
  const { addResult } = useExecResult();

  const getOutputEventCallback = useCallback(() => {
    return (output: string) => {
      addResult(output);
    };
  }, []);

  return { getOutputEventCallback };
};

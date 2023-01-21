import { useCallback } from 'react';

import { useExecResult } from '@/store';

import { useDamega } from './useDamega';
import { useDamegaInput } from './useDamegaInput';
import { useDamegaOutput } from './useDamegaOutput';

export const useExecCode = () => {
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback } = useDamegaOutput();
  const { clearResult } = useExecResult();

  const { execCode: _execCode, cancelExecCode } = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  const execCode = useCallback(() => {
    clearResult();
    _execCode();
  }, [_execCode, clearResult]);

  return { execCode, cancelExecCode };
};

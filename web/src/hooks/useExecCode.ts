import { useCallback } from 'react';
import { flushSync } from 'react-dom';

import { useExecModeState } from '@/store/exec';

import { useDamega } from './useDamega';
import { useDamegaInput } from './useDamegaInput';
import { useDamegaOutput } from './useDamegaOutput';

export const useExecCode = () => {
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback } = useDamegaOutput();
  const [, setMode] = useExecModeState();

  const { execCode: _execCode } = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  const execCode = useCallback(() => {
    flushSync(() => {
      setMode('exec');
    });
    _execCode();
    flushSync(() => {
      setMode('none');
    });
  }, [_execCode, setMode]);

  return execCode;
};

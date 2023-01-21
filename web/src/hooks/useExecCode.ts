import { useCallback } from 'react';

import { useExecResult } from '@/store';

import { useDamega } from './useDamega';
import { useDamegaInput } from './useDamegaInput';
import { useDamegaOutput } from './useDamegaOutput';

export const useExecCode = () => {
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback } = useDamegaOutput();
  const { clearResult, addResult } = useExecResult();

  const { execCode: _execCode, cancelExecCode } = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  const execCode = useCallback(async () => {
    const start = performance.now();
    clearResult();
    const { evaluated } = await _execCode();

    if (!evaluated) {
      addResult('[ 実行を中断しました ]');
    } else {
      const end = performance.now();
      const execTime = Math.floor(((end - start) / 1000) * 100) / 100;
      addResult(`[ 実行終了 (実行時間: ${execTime}s) ]`);
    }
  }, [_execCode, clearResult]);

  return { execCode, cancelExecCode };
};

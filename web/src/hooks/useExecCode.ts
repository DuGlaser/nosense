import { useDamega } from './useDamega';
import { useDamegaInput } from './useDamegaInput';
import { useDamegaOutput } from './useDamegaOutput';

export const useExecCode = () => {
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback } = useDamegaOutput();

  const { execCode } = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  return execCode;
};

import { OutputText } from '@nosense/damega';
import { useCallback, useState } from 'react';

export const useDamegaOutput = () => {
  const [outputs, setOutputs] = useState<OutputText[]>([]);

  const getOutputEventCallback = useCallback(() => {
    setOutputs([]);

    return (output: OutputText) => {
      setOutputs((cur) => [...cur, output]);
    };
  }, []);

  return { getOutputEventCallback, outputs };
};

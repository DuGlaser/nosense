import { useCallback, useState } from 'react';

export const useDamegaOutput = () => {
  const [outputs, setOutputs] = useState<string[]>([]);

  const getOutputEventCallback = useCallback(() => {
    setOutputs([]);

    return (output: string) => {
      setOutputs((cur) => [...cur, output]);
    };
  }, []);

  return { getOutputEventCallback, outputs };
};

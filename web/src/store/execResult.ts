import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';

type ExecResultRow = string;

const execResultState = atom<ExecResultRow[]>({
  key: 'execResult',
  default: [],
});

export const useExecResult = () => {
  const [execResult, setExecResult] = useRecoilState(execResultState);

  const clearResult = useCallback(() => {
    setExecResult([]);
  }, [setExecResult]);

  const addResult = useCallback(
    (newResultRow: ExecResultRow) => {
      setExecResult((cur) => cur.concat(newResultRow));
    },
    [setExecResult]
  );

  return { execResult, clearResult, addResult };
};

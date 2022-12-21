import { atom, useRecoilState } from 'recoil';

type ExecResult = string;

const execResultState = atom<ExecResult[]>({
  key: 'execResult',
  default: [],
});

export const useExecResultState = () => {
  return useRecoilState(execResultState);
};

type ExecMode = 'none' | 'exec' | 'debug';

const execModeState = atom<ExecMode>({
  key: 'execMode',
  default: 'none',
});

export const useExecModeState = () => {
  return useRecoilState(execModeState);
};

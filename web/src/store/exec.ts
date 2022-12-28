import { Environment, EvaluatorGenerator } from '@nosense/damega';
import { PositionContext } from '@nosense/damega/dist/contexts';
import { useCallback } from 'react';
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import { useDamega, useDamegaInput, useDamegaOutput } from '@/hooks';

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

type DebugInfo = {
  enviroment?: Record<string, any>;
  position?: PositionContext;
};

type ExecDebug = {
  generator: EvaluatorGenerator;
} & DebugInfo;

const execDebugState = atom<ExecDebug | undefined>({
  key: 'execDebug',
  default: undefined,
});

export const useStartDebug = () => {
  const setExecDebugState = useSetRecoilState(execDebugState);
  const setExecMode = useSetRecoilState(execModeState);
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback } = useDamegaOutput();

  const { getExecCodeGenerator } = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  const start = useCallback(async () => {
    const generator = await getExecCodeGenerator();

    setExecMode('debug');
    setExecDebugState(() => ({
      generator: generator,
    }));
  }, [getExecCodeGenerator, setExecMode, setExecDebugState]);

  return start;
};

export const useDebugInfo = (): DebugInfo => {
  const state = useRecoilValue(execDebugState);

  return {
    enviroment: state?.enviroment,
    position: state?.position,
  };
};

export const useDebug = () => {
  const [debugState, setDebugState] = useRecoilState(execDebugState);
  const [mode, setMode] = useRecoilState(execModeState);

  const cleanUp = () => {
    // setDebugState();
    setMode('none');
  };

  const next = async () => {
    if (!debugState || mode === 'none') return cleanUp();

    const result = await debugState.generator.next();
    if (result.done) {
      return cleanUp();
    }

    setDebugState({
      generator: debugState.generator,
      enviroment: result.value.env.toObject(),
      position: result.value.node.ctx,
    });
  };
  // TODO: const nextFlag = () => {};

  const stop = () => {
    cleanUp();
  };

  const finish = async () => {
    if (!debugState || mode === 'none') return cleanUp();

    let done = false;
    let enviroment: Environment | undefined = undefined;
    let position: PositionContext | undefined = undefined;

    while (done) {
      const result = await debugState.generator.next();
      done = !!result.done;
      if (!result.done) {
        enviroment = result.value.env;
        position = result.value.node.ctx;
      }
    }

    setDebugState({
      generator: debugState.generator,
      enviroment,
      position,
    });
    cleanUp();
  };

  return { next, finish, stop };
};

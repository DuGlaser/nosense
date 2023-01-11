import {
  Environment,
  EvaluatorGenerator,
  PositionContext,
} from '@nosense/damega';
import { useCallback } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { useDamega, useDamegaInput, useDamegaOutput } from '@/hooks';

export type DebugInfo = {
  enviroment: ReturnType<Environment['toObject']>;
  position: PositionContext;
};

export type ExecDebug = {
  generator?: EvaluatorGenerator;
  histories: DebugInfo[];
} & Partial<DebugInfo>;

const execDebugState = atom<ExecDebug | undefined>({
  key: 'execDebug',
  default: undefined,
});

export const useDebugInfo = (): Partial<DebugInfo> => {
  const state = useRecoilValue(execDebugState);

  return {
    enviroment: state?.enviroment,
    position: state?.position,
  };
};

export const useDebug = () => {
  const [debugState, setDebugState] = useRecoilState(execDebugState);
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback } = useDamegaOutput();

  const { getExecCodeGenerator } = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  const cleanUp = () => {
    setDebugState((cur) =>
      cur
        ? {
            ...cur,
            generator: undefined,
            position: undefined,
          }
        : cur
    );
  };

  const start = useCallback(async () => {
    const generator = await getExecCodeGenerator();

    setDebugState(() => ({
      generator: generator,
      histories: [],
    }));
  }, [getExecCodeGenerator, setDebugState]);

  const next = async () => {
    if (!debugState || !debugState.generator) return;

    const result = await debugState.generator.next();
    if (result.done) {
      return cleanUp();
    }

    const enviroment = result.value.env.toObject();
    const position = result.value.node.ctx;

    setDebugState((cur) => ({
      generator: debugState.generator,
      histories:
        cur?.histories.concat({
          enviroment,
          position,
        }) ?? [],
      enviroment,
      position,
    }));
  };

  const stop = () => {
    cleanUp();
  };

  const finish = async () => {
    if (!debugState || !debugState.generator) return;

    let done = false;
    let enviroment: DebugInfo['enviroment'] | undefined = undefined;
    let position: PositionContext | undefined = undefined;
    const histories: ExecDebug['histories'] = [];

    while (!done) {
      const result = await debugState.generator.next();
      done = !!result.done;
      if (!result.done) {
        enviroment = result.value.env.toObject();
        position = result.value.node.ctx;
        histories.push({
          enviroment,
          position,
        });
      }
    }

    setDebugState({
      generator: debugState.generator,
      histories,
      enviroment,
      position,
    });
    cleanUp();
  };

  return { next, start, finish, stop, debugState };
};

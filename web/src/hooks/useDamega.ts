import {
  Environment,
  Evaluator,
  InputEventCallback,
  Lexer,
  OutputEventCallback,
  Parser,
} from '@nosense/damega';
import { useCallback, useMemo } from 'react';

import { useStatements } from '@/features/editor/store';
import { programConvertor } from '@/lib/converter';

export const useDamega = (args: {
  returnInputEventFn: () => InputEventCallback;
  returnOutputEventFn: () => OutputEventCallback;
}) => {
  const getStatements = useStatements();

  const parseToken = useCallback(async () => {
    const statements = await getStatements();
    const code = programConvertor.toDamega(statements);
    const l = new Lexer(code);
    return new Parser(l).parseToken();
  }, [getStatements]);

  const evaluator = useMemo(() => {
    return new Evaluator({
      inputEventCallback: args.returnInputEventFn(),
      outputEventCallback: args.returnOutputEventFn(),
    });
  }, [JSON.stringify(args)]);

  const execCode = useCallback(async () => {
    const parsed = await parseToken();
    const env = new Environment();

    const evaluated = evaluator.Eval(parsed, env);
    return { evaluated, env };
  }, [evaluator, parseToken]);

  const getExecCodeGenerator = useCallback(async () => {
    const parsed = await parseToken();
    const env = new Environment();

    return evaluator.EvalGenerator(parsed, env);
  }, [evaluator, parseToken]);

  return {
    execCode,
    getExecCodeGenerator,
  };
};

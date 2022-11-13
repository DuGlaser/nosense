import {
  Environment,
  Evaluator,
  InputEventCallback,
  Lexer,
  OutputEventCallback,
  Parser,
} from '@nosense/damega';
import { useCallback } from 'react';

import { useStatements } from '@/features/editor/store';
import { programConvertor } from '@/lib/converter';

export const useDamega = (args: {
  returnInputEventFn: () => InputEventCallback;
  returnOutputEventFn: () => OutputEventCallback;
}) => {
  const getStatements = useStatements();
  const execCode = useCallback(async () => {
    const statements = await getStatements();
    const code = programConvertor.toDamega(statements);
    const l = new Lexer(code);
    const p = new Parser(l);

    const e = new Evaluator({
      inputEventCallback: args.returnInputEventFn(),
      outputEventCallback: args.returnOutputEventFn(),
    });
    const env = new Environment();

    const evaluated = e.Eval(p.parseToken(), env);
    return { evaluated, env };
  }, [JSON.stringify(args)]);

  return execCode;
};

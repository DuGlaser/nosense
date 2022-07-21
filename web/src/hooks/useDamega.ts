import {
  Environment,
  Evaluator,
  InputEventCallback,
  Lexer,
  OutputEventCallback,
  Parser,
} from '@nosense/damega';
import { useCallback } from 'react';

export const useDamega = (args: {
  returnInputEventFn: () => InputEventCallback;
  returnOutputEventFn: () => OutputEventCallback;
}) => {
  const execCode = useCallback(
    (code: string) => {
      const l = new Lexer(code);
      const p = new Parser(l);

      const e = new Evaluator({
        inputEventCallback: args.returnInputEventFn(),
        outputEventCallback: args.returnOutputEventFn(),
      });
      const env = new Environment();

      const evaluated = e.Eval(p.parseToken(), env);
      return { evaluated, env };
    },
    [JSON.stringify(args)]
  );

  return execCode;
};

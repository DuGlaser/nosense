import { match, P } from 'ts-pattern';

import {
  BooleanObject,
  BuiltinObject,
  NumberObject,
  Obj,
  StringObject,
} from '@/object';

import { FALSE, NULL, TRUE } from '.';

export type OutputText = string | number | boolean | null;

export type InputEventCallback = () => Promise<OutputText>;
export type OutputEventCallback = (text: OutputText) => void;

export const builtins = ({
  outputEventCallback,
  inputEventCallback,
}: {
  outputEventCallback: OutputEventCallback;
  inputEventCallback: InputEventCallback;
}) =>
  ({
    Println: new BuiltinObject({
      fn: (obj: Obj) => {
        const value = match(obj)
          .with(P.instanceOf(NumberObject), (o) => o.value)
          .with(P.instanceOf(StringObject), (o) => o.value)
          .with(P.instanceOf(BooleanObject), (o) => o.value)
          .otherwise(() => null);

        outputEventCallback(value);
      },
    }),
    Input: new BuiltinObject({
      fn: async () => {
        const value: OutputText = await inputEventCallback();

        return match(value)
          .with(P.number, (v) => new NumberObject({ value: v }))
          .with(P.string, (v) => new StringObject({ value: v }))
          .with(P.boolean, (v) => (v ? TRUE : FALSE))
          .otherwise(() => NULL);
      },
    }),
  } as const);

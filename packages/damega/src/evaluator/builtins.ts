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

type BuiltinObjectGenerator = (ctx: {
  commands: string[];
  inputEventCallback: InputEventCallback;
  outputEventCallback: OutputEventCallback;
}) => BuiltinObject<any> | undefined;

type AsyncBuiltinObjectGenerator = (ctx: {
  commands: string[];
  inputEventCallback: InputEventCallback;
  outputEventCallback: OutputEventCallback;
}) => Promise<BuiltinObject<any> | undefined>;

const generatePrintln: BuiltinObjectGenerator = (ctx) =>
  new BuiltinObject({
    fn: (obj: Obj) => {
      const value = match(obj)
        .with(P.instanceOf(NumberObject), (o) => o.value)
        .with(P.instanceOf(StringObject), (o) => o.value)
        .with(P.instanceOf(BooleanObject), (o) => o.value)
        .otherwise(() => null);

      ctx.outputEventCallback(value);
    },
  });

const generateInput: BuiltinObjectGenerator = (ctx) =>
  new BuiltinObject({
    fn: async () => {
      const value: OutputText = await ctx.inputEventCallback();

      return match(value)
        .with(P.number, (v) => new NumberObject({ value: v }))
        .with(P.string, (v) => new StringObject({ value: v }))
        .with(P.boolean, (v) => (v ? TRUE : FALSE))
        .otherwise(() => NULL);
    },
  });

const generateObnizFn: AsyncBuiltinObjectGenerator = async (ctx) => {
  const o = await import('./obniz');
  const cmd = new o.DamegaObniz().getCommand(ctx.commands);

  if (cmd instanceof BuiltinObject) {
    return cmd;
  }

  return undefined;
};

export const generateBuiltinFunctions = ({
  inputEventCallback,
  outputEventCallback,
}: {
  inputEventCallback: InputEventCallback;
  outputEventCallback: OutputEventCallback;
}) => {
  const defaultCtx = {
    commands: [],
    inputEventCallback,
    outputEventCallback,
  };

  const cmdMap: Record<
    string,
    | BuiltinObject<any>
    | BuiltinObjectGenerator
    | AsyncBuiltinObjectGenerator
    | undefined
  > = {
    Println: generatePrintln(defaultCtx),
    Input: generateInput(defaultCtx),
    Obniz: generateObnizFn,
  };

  return async (command: string) => {
    const commands = command.split('.');

    const first = commands.shift();
    if (!first) return undefined;

    const matched = cmdMap[first];
    if (!matched) return undefined;

    if (matched instanceof BuiltinObject) {
      return matched;
    }

    return await matched({
      commands,
      inputEventCallback,
      outputEventCallback,
    });
  };
};

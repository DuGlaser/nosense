import { match, P } from 'ts-pattern';

import {
  BooleanObject,
  BuiltinObject,
  NumberObject,
  Obj,
  StringObject,
} from '@/object';

import { FALSE, NULL, TRUE } from '.';

export type InputEventCallback = () => Promise<string | undefined>;
export type OutputEventCallback = (text: string) => void;

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

      ctx.outputEventCallback(value?.toString() ?? '');
    },
  });

const isDamegaNumber = (target: string): boolean => {
  const matched = target.match(/[0-9]+(\.[0-9]+)?/);

  if (!matched) return false;
  return matched?.length > 0 && matched[0] === target;
};

const isDamegaBoolean = (target: string): boolean => {
  return ['true', 'false'].includes(target);
};

const generateInput: BuiltinObjectGenerator = (ctx) =>
  new BuiltinObject({
    fn: async () => {
      const value = await ctx.inputEventCallback();

      if (value === undefined) {
        return NULL;
      }

      if (isDamegaNumber(value)) {
        return new NumberObject({ value: Number(value) });
      }

      if (isDamegaBoolean(value)) {
        return value === 'true' ? TRUE : FALSE;
      }

      return new StringObject({ value: value });
    },
  });

const generateObnizFn: AsyncBuiltinObjectGenerator = async (ctx) => {
  console.warn('Load obniz module.');
  try {
    const o = await import('./obniz')
      .then((res) => {
        console.warn('complete load: ', res);
        return res;
      })
      .catch((resoun) => {
        console.log(resoun);
        console.error('!!');
        throw new Error(JSON.stringify(resoun));
      });
    const cmd = new o.DamegaObniz().getCommand(ctx.commands);

    if (cmd instanceof BuiltinObject) {
      return cmd;
    }

    return undefined;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
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

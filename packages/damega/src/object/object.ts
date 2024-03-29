import { BlockStatement, Identifier } from '@/ast';
import { TOKEN } from '@/token';

import { Environment } from './environment';

export enum OBJECT {
  NUMBER = 'NUMBER',
  BOOL = 'BOOL',
  NULL = 'NULL',
  RETURN_VALUE = 'RETURN_VALUE',
  ERROR = 'ERROR',
  FUNCTION = 'FUNCTION',
  STRING = 'STRING',
  BUILTIN = 'BUILTIN',
}

export abstract class Obj {
  public abstract type(): OBJECT;
}

export class NumberObject extends Obj {
  private _value: number;

  constructor(args: { value: number }) {
    super();
    this._value = args.value;
  }

  public type(): OBJECT {
    return OBJECT.NUMBER;
  }

  get value() {
    return this._value;
  }
}

export class BooleanObject extends Obj {
  private _value: boolean;

  constructor(args: { value: boolean }) {
    super();
    this._value = args.value;
  }

  public type(): OBJECT {
    return OBJECT.BOOL;
  }

  get value() {
    return this._value;
  }
}

export class StringObject extends Obj {
  private _value: string;

  constructor(args: { value: string }) {
    super();
    this._value = args.value;
  }

  public type(): OBJECT {
    return OBJECT.STRING;
  }

  get value() {
    return this._value;
  }
}

export class NullObject extends Obj {
  constructor() {
    super();
  }

  public type(): OBJECT {
    return OBJECT.NULL;
  }
}

export class ReturnValueObject extends Obj {
  private _value: Obj;

  constructor(args: { value: Obj }) {
    super();
    this._value = args.value;
  }

  public type(): OBJECT {
    return OBJECT.RETURN_VALUE;
  }

  get value() {
    return this._value;
  }
}

export class FunctionObject extends Obj {
  private _parameters: Identifier[];
  private _body: BlockStatement;
  private _env: Environment;

  constructor(args: {
    parameters: Identifier[];
    body: BlockStatement;
    env: Environment;
  }) {
    super();
    this._parameters = args.parameters;
    this._body = args.body;
    this._env = args.env;
  }

  public type(): OBJECT {
    return OBJECT.FUNCTION;
  }

  get parameters() {
    return this._parameters;
  }

  get body() {
    return this._body;
  }

  get env() {
    return this._env;
  }
}

export class BuiltinObject<T> extends Obj {
  private _fn: T;

  constructor(args: { fn: T }) {
    super();
    this._fn = args.fn;
  }

  public type(): OBJECT {
    return OBJECT.BUILTIN;
  }

  get fn() {
    return this._fn;
  }
}

export class ErrorObject extends Obj {
  private _message: string;

  constructor(args: { message: string }) {
    super();
    this._message = args.message;
  }

  public type(): OBJECT {
    return OBJECT.ERROR;
  }

  get message() {
    return this._message;
  }
}

const typeMap: Record<string, OBJECT> = {
  [TOKEN.TYPE_BOOLEAN]: OBJECT.BOOL,
  [TOKEN.TYPE_NUMBER]: OBJECT.NUMBER,
  [TOKEN.TYPE_STRING]: OBJECT.STRING,
};

export const getMatchedType = (token: TOKEN): OBJECT | undefined => {
  return typeMap[token];
};

export const isTypeMatched = (token: TOKEN, obj: Obj): boolean => {
  const t = getMatchedType(token);
  if (!t) return false;

  return t === obj.type();
};

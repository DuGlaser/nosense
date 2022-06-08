import { token, TokenType } from '@/token';

export enum OBJECT {
  NUMBER = 'NUMBER',
  BOOL = 'BOOL',
  NULL = 'NULL',
  RETURN_VALUE = 'RETURN_VALUE',
  ERROR = 'ERROR',
  // FUNCTION = 'FUNCTION',
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
  [token.TYPE_BOOLEAN]: OBJECT.BOOL,
  [token.TYPE_NUMBER]: OBJECT.NUMBER,
  [token.TYPE_STRING]: OBJECT.STRING,
};

export const getMatchedType = (token: TokenType): OBJECT | undefined => {
  return typeMap[token];
};

export const isTypeMatched = (token: TokenType, obj: Obj): boolean => {
  const t = getMatchedType(token);
  if (!t) return false;

  return t === obj.type();
};

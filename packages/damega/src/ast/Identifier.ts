import { Token } from '@/token';

import { Expression } from './base';

export class Identifier extends Expression {
  private _token: Token;
  private _value: string;

  constructor({ token, value }: { token: Token; value: string }) {
    super();
    this._token = token;
    this._value = value;
  }

  public string(): string {
    return this._value;
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get value() {
    return this._value;
  }
}

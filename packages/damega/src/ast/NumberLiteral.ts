import { Token } from '@/token';

import { Expression } from './base';

export class NumberLiteral extends Expression {
  private _token: Token;
  private _value: number;

  constructor({ token, value }: { token: Token; value: number }) {
    super();
    this._token = token;
    this._value = value;
  }

  public string(): string {
    return this._value.toString();
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

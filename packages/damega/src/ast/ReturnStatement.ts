import { Token } from '@/token';

import { Expression, Statement } from './base';

export class ReturnStatement extends Statement {
  private _token: Token;
  private _valueExpression: Expression;

  constructor(arg: { token: Token; valueExpression: Expression }) {
    super();
    this._token = arg.token;
    this._valueExpression = arg.valueExpression;
  }

  public lines(): string[] {
    this.toStringConverter.write('return', { right: ' ' });
    this.toStringConverter.write(this._valueExpression.string(), {
      right: ';',
    });

    this.toStringConverter.toString;
    return this.toStringConverter.toList();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get valueExpression() {
    return this._valueExpression;
  }
}

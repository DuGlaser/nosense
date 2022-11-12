import { PositionContext } from '@/contexts';
import { Token } from '@/token';

import { Expression, Statement } from './base';

export class ReturnStatement extends Statement {
  private _token: Token;
  private _valueExpression: Expression;

  readonly ctx: PositionContext;

  constructor(args: { token: Token; valueExpression: Expression }) {
    super();
    this._token = args.token;
    this._valueExpression = args.valueExpression;
    this.ctx = args.token.ctx;
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

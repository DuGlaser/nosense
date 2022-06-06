import { Token } from '@/token';

import { Expression, Statement } from './base';

export class ExpressionStatement extends Statement {
  private _token: Token;
  private _expression: Expression;

  constructor(arg: { token: Token; expression: Expression }) {
    super();
    this._token = arg.token;
    this._expression = arg.expression;
  }

  public lines(): string[] {
    return [this._expression.string()];
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get expression() {
    return this._expression;
  }
}

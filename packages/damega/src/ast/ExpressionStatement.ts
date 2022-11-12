import { PositionContext } from '@/contexts';
import { Token } from '@/token';

import { Expression, Statement } from './base';

export class ExpressionStatement extends Statement {
  private _token: Token;
  private _expression: Expression;

  readonly ctx: PositionContext;

  constructor(args: { token: Token; expression: Expression }) {
    super();
    this._token = args.token;
    this._expression = args.expression;
    this.ctx = args.token.ctx;
  }

  public lines(): string[] {
    return [this._expression.string() + ';'];
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

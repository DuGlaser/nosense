import { Token } from '@/token';

import { Expression } from './base';
import { InfixExpression } from './InfixExpression';

export class PrefixExpression extends Expression {
  private _token: Token;
  private _operator: string;
  private _right: Expression;

  constructor(args: { token: Token; operator: string; right: Expression }) {
    super();

    this._token = args.token;
    this._operator = args.operator;
    this._right = args.right;
  }

  public string(): string {
    return this._operator + this._right.string();
  }

  public inspect(): string {
    const right =
      this._right instanceof InfixExpression
        ? this._right.inspect()
        : this._right.string();

    return this._operator + right;
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get operator() {
    return this._operator;
  }

  get right() {
    return this._right;
  }
}

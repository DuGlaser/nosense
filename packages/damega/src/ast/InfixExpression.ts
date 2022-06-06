import { Token } from '@/token';

import { Expression } from './base';

export class InfixExpression extends Expression {
  private _token: Token;
  private _left: Expression;
  private _operator: string;
  private _right: Expression;

  constructor({
    token,
    left,
    operator,
    right,
  }: {
    token: Token;
    left: Expression;
    operator: string;
    right: Expression;
  }) {
    super();
    this._token = token;
    this._left = left;
    this._operator = operator;
    this._right = right;
  }

  public string(): string {
    this.toStringConverter.write(this._left.string());
    this.toStringConverter.write(this._operator, { left: ' ', right: ' ' });
    this.toStringConverter.write(this._right.string());

    return this.toStringConverter.toString();
  }

  public inspect(): string {
    const left =
      this._left instanceof InfixExpression
        ? this._left.inspect()
        : this._left.string();
    const right =
      this._right instanceof InfixExpression
        ? this._right.inspect()
        : this._right.string();

    this.toStringConverter.write(left, { left: '(' });
    this.toStringConverter.write(this._operator, { left: ' ', right: ' ' });
    this.toStringConverter.write(right, { right: ')' });

    return this.toStringConverter.toString();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get left() {
    return this._left;
  }

  get operator() {
    return this._operator;
  }

  get right() {
    return this._right;
  }
}

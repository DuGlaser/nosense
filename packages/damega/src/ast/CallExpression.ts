import { Token } from '@/token';

import { Expression } from './base';
import { Identifier } from './Identifier';

export class CallExpression extends Expression {
  private _token: Token;
  private _name: Identifier;
  private _args: Expression[];

  constructor({
    token,
    name,
    args,
  }: {
    token: Token;
    name: Identifier;
    args: Expression[];
  }) {
    super();
    this._token = token;
    this._name = name;
    this._args = args;
  }

  public string(): string {
    this.toStringConverter.write(this._name.string());
    this.toStringConverter.write(this._args.map((_) => _.string()).join(', '), {
      left: '(',
      right: ')',
    });
    this.toStringConverter.write(';');

    return this.toStringConverter.toString();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get name() {
    return this._name;
  }

  get args() {
    return this._args;
  }
}

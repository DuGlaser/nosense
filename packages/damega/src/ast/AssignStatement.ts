import { Token } from '@/token';

import { Expression, Statement } from './base';
import { Identifier } from './Identifier';

export class AssignStatement extends Statement {
  private _token: Token;
  private _name: Identifier;
  private _value: Expression;

  constructor(args: { token: Token; name: Identifier; value: Expression }) {
    super();

    this._token = args.token;
    this._name = args.name;
    this._value = args.value;
  }

  public lines(): string[] {
    this.toStringConverter.write(this._name.string(), { right: ' ' });
    this.toStringConverter.write('=', { right: ' ' });
    this.toStringConverter.write(this._value.string(), { right: ';' });

    return this.toStringConverter.toList();
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

  get value() {
    return this._value;
  }
}

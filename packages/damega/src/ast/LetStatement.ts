import { Token } from '@/token';

import { Expression, Statement } from './base';
import { Identifier } from './Identifier';
import { TypeIdentifier } from './TypeIdentifier';

export class LetStatement extends Statement {
  private _token: Token;
  private _value: Expression;
  private _name: Identifier;
  private _type: TypeIdentifier;

  constructor({
    token,
    value,
    name,
    type,
  }: {
    token: Token;
    value: Expression;
    name: Identifier;
    type: TypeIdentifier;
  }) {
    super();
    this._token = token;
    this._value = value;
    this._name = name;
    this._type = type;
  }

  public lines(): string[] {
    this.toStringConverter.write('let', { right: ' ' });
    this.toStringConverter.write(this._name.string());
    this.toStringConverter.write(':', { right: ' ' });
    this.toStringConverter.write(this._type.string(), { right: ' ' });
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

  get value() {
    return this._value;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }
}

import { PositionContext } from '@/contexts';
import { Token } from '@/token';

import { Expression, Statement } from './base';
import { Identifier } from './Identifier';
import { TypeIdentifier } from './TypeIdentifier';

export class LetStatement extends Statement {
  private _token: Token;
  private _value: Expression | undefined;
  private _names: Identifier[];
  private _type: TypeIdentifier;

  readonly ctx: PositionContext;

  constructor({
    token,
    value,
    names,
    type,
  }: {
    token: Token;
    value?: Expression;
    names: Identifier[];
    type: TypeIdentifier;
  }) {
    super();
    this._token = token;
    this._value = value;
    this._names = names;
    this._type = type;
    this.ctx = token.ctx;
  }

  public lines(): string[] {
    this.toStringConverter.write('let', { right: ' ' });
    this.toStringConverter.write(
      this._names.map((name) => name.value).join(', ')
    );
    this.toStringConverter.write(':', { right: ' ' });
    this.toStringConverter.write(this._type.string());
    if (this._value) {
      this.toStringConverter.write('=', { right: ' ', left: ' ' });
      this.toStringConverter.write(this._value.string(), { right: '' });
    }
    this.toStringConverter.write(';');

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

  get names() {
    return this._names;
  }

  get type() {
    return this._type;
  }
}

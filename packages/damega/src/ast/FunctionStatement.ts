import { Token } from '@/token';

import { Statement } from './base';
import { BlockStatement } from './BlockStatement';
import { Identifier } from './Identifier';

export class FunctionStatement extends Statement {
  private _token: Token;
  private _body: BlockStatement;
  private _name: Identifier;
  private _parameters: Identifier[];

  constructor({
    token,
    body,
    name,
    parameters,
  }: {
    token: Token;
    body: BlockStatement;
    name: Identifier;
    parameters: Identifier[];
  }) {
    super();
    this._token = token;
    this._body = body;
    this._name = name;
    this._parameters = parameters;
  }

  public lines(): string[] {
    this.toStringConverter.write('func', { right: ' ' });
    this.toStringConverter.write(this._name.string());

    const parameters = this.parameters.map((p) => p.string()).join(', ');
    this.toStringConverter.write(parameters, { left: '(', right: ') ' });

    this.toStringConverter.write('{');
    this.toStringConverter.return();
    this.toStringConverter.nest((_) => {
      this._body.lines().forEach((line) => {
        _.write(line);
        _.return();
      });
    });
    this.toStringConverter.write('}');

    return this.toStringConverter.toList();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get body() {
    return this._body;
  }

  get name() {
    return this._name;
  }

  get parameters() {
    return this._parameters;
  }
}

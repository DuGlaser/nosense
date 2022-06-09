import { Token } from '@/token';

import { Statement } from './base';

export class BlockStatement extends Statement {
  private _token: Token;
  private _statements: Statement[];

  constructor({
    token,
    statements,
  }: {
    token: Token;
    statements: Statement[];
  }) {
    super();
    this._token = token;
    this._statements = statements;
  }

  public lines(): string[] {
    return this._statements.flatMap((stmt) => stmt.lines());
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get statements() {
    return this._statements;
  }
}

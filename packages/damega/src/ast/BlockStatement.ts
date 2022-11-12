import { PositionContext } from '@/contexts';
import { Token } from '@/token';

import { Statement } from './base';

export class BlockStatement extends Statement {
  private _token: Token;
  private _statements: Statement[];
  readonly ctx: PositionContext;

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
    this.ctx = token.ctx;
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

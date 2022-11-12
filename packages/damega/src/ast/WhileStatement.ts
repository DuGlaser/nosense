import { PositionContext } from '@/contexts';
import { Token } from '@/token';

import { Expression, Statement } from './base';
import { BlockStatement } from './BlockStatement';

export class WhileStatement extends Statement {
  private _token: Token;
  private _condition: Expression;
  private _consequence: BlockStatement;

  readonly ctx: PositionContext;

  constructor(args: {
    token: Token;
    condition: Expression;
    consequence: BlockStatement;
  }) {
    super();
    this._token = args.token;
    this._condition = args.condition;
    this._consequence = args.consequence;
    this.ctx = args.token.ctx;
  }

  public lines(): string[] {
    this.toStringConverter.write('while');
    this.toStringConverter.write(this._condition.string(), {
      left: ' (',
      right: ') ',
    });

    this.toStringConverter.write('{');
    this.toStringConverter.return();
    this.toStringConverter.nest((_) => {
      this._consequence.lines().forEach((line) => {
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

  get condition() {
    return this._condition;
  }

  get consequence() {
    return this._consequence;
  }
}

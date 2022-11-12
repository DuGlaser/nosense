import { PositionContext } from '@/contexts';
import { Token } from '@/token';

import { Expression, Statement } from './base';
import { BlockStatement } from './BlockStatement';

export class IfStatement extends Statement {
  private _token: Token;
  private _condition: Expression;
  private _consequence: BlockStatement;
  private _alternative: BlockStatement | undefined;

  readonly ctx: PositionContext;

  constructor(args: {
    token: Token;
    condition: Expression;
    consequence: BlockStatement;
    alternative: BlockStatement | undefined;
  }) {
    super();
    this._token = args.token;
    this._condition = args.condition;
    this._consequence = args.consequence;
    this._alternative = args.alternative;
    this.ctx = args.token.ctx;
  }

  public lines(): string[] {
    this.toStringConverter.write('if');
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

    if (this._alternative) {
      this.toStringConverter.write('else', {
        left: ' ',
        right: ' ',
      });
      this.toStringConverter.write('{');
      this.toStringConverter.return();
      const nested = this.toStringConverter.getNestedInstance();
      this._alternative.lines().forEach((stmt) => nested.write(stmt));
      nested.return();

      this.toStringConverter.write('}');
    }

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

  get alternative() {
    return this._alternative;
  }
}

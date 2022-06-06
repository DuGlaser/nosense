import { Token } from '@/token';
import { Ast2StringConverter } from '@/utils/Ast2StringConverter';

export abstract class Expression {
  protected toStringConverter = new Ast2StringConverter({
    type: 'SPACE',
    count: 2,
  });

  public abstract string(): string;
  public abstract tokenLiteral(): string;
}

export abstract class Statement {
  protected toStringConverter = new Ast2StringConverter({
    type: 'SPACE',
    count: 2,
  });

  public abstract string(): string;
  public abstract tokenLiteral(): string;
}

export class Program {
  public statements: Statement[];

  constructor(statements: Statement[] = []) {
    this.statements = statements;
  }

  public appendStatement(statement: Statement) {
    this.statements.push(statement);
  }

  public string(): string {
    const outs = this.statements.map((stmt) => stmt.string());
    return outs.join('\n');
  }
}

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

  public string(): string {
    this.toStringConverter.write('let', { right: ' ' });
    this.toStringConverter.write(this._name.string());
    this.toStringConverter.write(':', { right: ' ' });
    this.toStringConverter.write(this._type.string(), { right: ' ' });
    this.toStringConverter.write('=', { right: ' ' });
    this.toStringConverter.write(this._value.string(), { right: ';' });

    return this.toStringConverter.toString();
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

export class TypeIdentifier {
  private _token: Token;

  constructor({ token }: { token: Token }) {
    this._token = token;
  }

  public string(): string {
    return this._token.ch;
  }

  public inspect(): string {
    return this.string();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }
}

export class Identifier extends Expression {
  private _token: Token;
  private _value: string;

  constructor({ token, value }: { token: Token; value: string }) {
    super();
    this._token = token;
    this._value = value;
  }

  public string(): string {
    return this._value;
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
}

export class StringLiteral extends Expression {
  private _token: Token;
  private _value: string;

  constructor({ token, value }: { token: Token; value: string }) {
    super();
    this._token = token;
    this._value = value;
  }

  public string(): string {
    return '"' + this._value + '"';
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
}

export class NumberLiteral extends Expression {
  private _token: Token;
  private _value: number;

  constructor({ token, value }: { token: Token; value: number }) {
    super();
    this._token = token;
    this._value = value;
  }

  public string(): string {
    return this._value.toString();
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
}

export class BooleanLiteral extends Expression {
  private _token: Token;
  private _value: boolean;

  constructor({ token, value }: { token: Token; value: boolean }) {
    super();
    this._token = token;
    this._value = value;
  }

  public string(): string {
    return this._value.toString();
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
}

export class ExpressionStatement extends Statement {
  private _token: Token;
  private _expression: Expression;

  constructor(arg: { token: Token; expression: Expression }) {
    super();
    this._token = arg.token;
    this._expression = arg.expression;
  }

  public string(): string {
    return this._expression.string();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get expression() {
    return this._expression;
  }
}

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

  public string(): string {
    return this._statements.map((stmt) => stmt.string()).join('\n');
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

export class IfStatement extends Statement {
  private _token: Token;
  private _condition: Expression;
  private _consequence: BlockStatement;
  private _alternative: BlockStatement | undefined;

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
  }

  public string(): string {
    this.toStringConverter.write('if');
    this.toStringConverter.write(this._condition.string(), {
      left: ' (',
      right: ') ',
    });

    this.toStringConverter.write('{');
    this.toStringConverter.return();
    this.toStringConverter.nest((_) => {
      this._consequence
        .string()
        .split('\n')
        .forEach((line) => {
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
      nested.write(this._alternative.string());
      nested.return();

      this.toStringConverter.write('}');
    }

    return this.toStringConverter.toString();
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

export class WhileStatement extends Statement {
  private _token: Token;
  private _condition: Expression;
  private _consequence: BlockStatement;

  constructor(args: {
    token: Token;
    condition: Expression;
    consequence: BlockStatement;
  }) {
    super();
    this._token = args.token;
    this._condition = args.condition;
    this._consequence = args.consequence;
  }

  public string(): string {
    this.toStringConverter.write('while');
    this.toStringConverter.write(this._condition.string(), {
      left: ' (',
      right: ') ',
    });

    this.toStringConverter.write('{');
    this.toStringConverter.return();
    this.toStringConverter.nest((_) => {
      _.write(this._consequence.string());
      _.return();
    });
    this.toStringConverter.write('}');

    return this.toStringConverter.toString();
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

export class ReturnStatement extends Statement {
  private _token: Token;
  private _valueExpression: Expression;

  constructor(arg: { token: Token; valueExpression: Expression }) {
    super();
    this._token = arg.token;
    this._valueExpression = arg.valueExpression;
  }

  public string(): string {
    this.toStringConverter.write('return', { right: ' ' });
    this.toStringConverter.write(this._valueExpression.string(), {
      right: ';',
    });

    return this.toStringConverter.toString();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }

  get valueExpression() {
    return this._valueExpression;
  }
}

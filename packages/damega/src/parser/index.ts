import {
  AssignStatement,
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionStatement,
  Identifier,
  IfStatement,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  PrefixExpression,
  Program,
  ReturnStatement,
  Statement,
  StringLiteral,
  TypeIdentifier,
  WhileStatement,
} from '@/ast';
import { Lexer } from '@/lexer';
import { TOKEN, Token } from '@/token';

type PrefixParserFn = () => Expression | undefined;
type InfixParserFn = (left: Expression) => Expression | undefined;

type ParseError = {
  message: string;
};

enum Precedence {
  'LOWEST' = 1,
  'EQUALS',
  'LESSGREATER',
  'SUM',
  'MINUS',
  'PRODUCT',
  'PREFIX',
  'CALL',
}

const getPrecedence = (token: TOKEN): Precedence => {
  switch (token) {
    case TOKEN.EQ:
    case TOKEN.NOT_EQ:
      return Precedence.EQUALS;

    case TOKEN.LT:
    case TOKEN.GT:
      return Precedence.LESSGREATER;

    case TOKEN.PLUS:
    case TOKEN.MINUS:
      return Precedence.SUM;

    case TOKEN.SLASH:
    case TOKEN.ASTERISK:
      return Precedence.PRODUCT;

    case TOKEN.LPAREN:
      return Precedence.CALL;

    default:
      return Precedence.LOWEST;
  }
};

export class Parser {
  private lexer: Lexer;
  private curToken: Token = new Token(TOKEN.EOF, 'EOF');
  private peekToken: Token = new Token(TOKEN.EOF, 'EOF');

  private prefixParseFns = new Map<TOKEN, PrefixParserFn>();
  private infixParseFns = new Map<TOKEN, InfixParserFn>();

  public errors: ParseError[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;

    this.nextToken();
    this.nextToken();

    this.registerPrefix(TOKEN.IDENT, () => this.parseIdentifier());
    this.registerPrefix(TOKEN.STRING, () => this.parseStringLiteral());
    this.registerPrefix(TOKEN.NUMBER, () => this.parseNumberLiteral());
    this.registerPrefix(TOKEN.TRUE, () => this.parseBooleanLiteral());
    this.registerPrefix(TOKEN.FALSE, () => this.parseBooleanLiteral());
    this.registerPrefix(TOKEN.BANG, () => this.parsePrefixExpression());
    this.registerPrefix(TOKEN.MINUS, () => this.parsePrefixExpression());
    this.registerPrefix(TOKEN.LPAREN, () => this.parseGroupedExpression());

    this.registerInfix(TOKEN.PLUS, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.MINUS, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.ASTERISK, (left) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(TOKEN.SLASH, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.EQ, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.NOT_EQ, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.LT, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.GT, (left) => this.parseInfixExpression(left));
    this.registerInfix(TOKEN.LPAREN, (left) => this.parseCallExpression(left));
  }

  public parseToken(): Program {
    const program = new Program();

    while (this.curToken.type !== 'EOF') {
      const stmt = this.parseStatement();
      if (stmt) {
        program.appendStatement(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  private registerPrefix(key: TOKEN, fn: PrefixParserFn) {
    if (this.prefixParseFns.get(key)) {
      throw new Error(`${key} prefix parser is already registered.`);
    }

    this.prefixParseFns.set(key, fn);
  }

  private registerInfix(key: TOKEN, fn: InfixParserFn) {
    if (this.infixParseFns.get(key)) {
      throw new Error(`${key} infix parser is already registered.`);
    }

    this.infixParseFns.set(key, fn);
  }

  private getPrefixFn(key: TOKEN): PrefixParserFn | undefined {
    return this.prefixParseFns.get(key);
  }

  private getInfixFn(key: TOKEN): InfixParserFn | undefined {
    return this.infixParseFns.get(key);
  }

  /**
   * Statement
   */

  private parseStatement(): Statement | undefined {
    switch (this.curToken.type) {
      case TOKEN.LET:
        return this.parseLetStatement();

      case TOKEN.IF:
        return this.parseIfStatement();

      case TOKEN.WHILE:
        return this.parseWhileStatement();

      case TOKEN.FUNCTION:
        return this.parseFunctionStatement();

      case TOKEN.RETURN:
        return this.parseReturnStatement();

      default:
        if (this.peekTokenIs(TOKEN.ASSIGN)) {
          return this.parseAssignStatement();
        } else {
          return this.parseExpressionStatement();
        }
    }
  }

  private parseExpressionStatement(): ExpressionStatement | undefined {
    const token = this.curToken;
    const expression = this.parseExpression(Precedence.LOWEST);
    if (!expression) {
      return undefined;
    }

    return new ExpressionStatement({ token, expression });
  }

  private parseLetStatement(): LetStatement | undefined {
    const token = this.curToken;

    if (!this.expectPeek(TOKEN.IDENT)) {
      return undefined;
    }

    const name = new Identifier({
      token: this.curToken,
      value: this.curToken.ch,
    });

    if (!this.expectPeek(TOKEN.COLON)) {
      return undefined;
    }
    this.nextToken();

    const type = new TypeIdentifier({
      token: this.curToken,
    });

    if (!this.expectPeek(TOKEN.ASSIGN)) {
      return undefined;
    }
    this.nextToken();

    const value = this.parseExpression(Precedence.LOWEST);
    if (!value) {
      return undefined;
    }

    if (!this.expectPeek(TOKEN.SEMICOLON)) {
      return undefined;
    }

    return new LetStatement({ token, value, name, type });
  }

  private parseIfStatement(): IfStatement | undefined {
    const token = this.curToken;

    if (!this.expectPeek(TOKEN.LPAREN)) return undefined;
    this.nextToken();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (!condition) return undefined;

    if (!this.expectPeek(TOKEN.RPAREN)) return undefined;
    if (!this.expectPeek(TOKEN.LBRACE)) return undefined;

    const consequence = this.parseBlockStatement();
    if (!consequence) return undefined;

    let alternative: BlockStatement | undefined = undefined;

    if (this.peekTokenIs(TOKEN.ELSE)) {
      this.nextToken();

      if (!this.expectPeek(TOKEN.LBRACE)) return undefined;
      alternative = this.parseBlockStatement();
      if (!alternative) return undefined;
    }

    return new IfStatement({
      token,
      condition,
      consequence,
      alternative,
    });
  }

  private parseWhileStatement(): WhileStatement | undefined {
    const token = this.curToken;

    if (!this.expectPeek(TOKEN.LPAREN)) return undefined;
    this.nextToken();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (!condition) return undefined;

    if (!this.expectPeek(TOKEN.RPAREN)) return undefined;
    if (!this.expectPeek(TOKEN.LBRACE)) return undefined;

    const consequence = this.parseBlockStatement();
    if (!consequence) return undefined;

    return new WhileStatement({ token, condition, consequence });
  }

  private parseBlockStatement(): BlockStatement | undefined {
    const token = this.curToken;
    this.nextToken();

    const stmts: Statement[] = [];

    while (!this.curTokenIs(TOKEN.RBRACE) && !this.curTokenIs(TOKEN.EOF)) {
      const stmt = this.parseStatement();
      if (stmt) {
        stmts.push(stmt);
      }
      this.nextToken();
    }

    return new BlockStatement({ token, statements: stmts });
  }

  private parseAssignStatement(): AssignStatement | undefined {
    const token = this.curToken;
    const name = this.parseIdentifier();

    if (!this.expectPeek(TOKEN.ASSIGN)) return undefined;
    this.nextToken();

    const value = this.parseExpression(Precedence.LOWEST);
    if (!value) return undefined;

    if (!this.expectPeek(TOKEN.SEMICOLON)) return undefined;

    return new AssignStatement({ token, name, value });
  }

  private parseReturnStatement(): ReturnStatement | undefined {
    const token = this.curToken;
    this.nextToken();

    const valueExpression = this.parseExpression(Precedence.LOWEST);
    if (!valueExpression) return undefined;

    return new ReturnStatement({
      token,
      valueExpression,
    });
  }

  private parseFunctionStatement(): FunctionStatement | undefined {
    const token = this.curToken;

    if (!this.expectPeek(TOKEN.IDENT)) return undefined;
    const name = this.parseIdentifier();

    if (!this.expectPeek(TOKEN.LPAREN)) return undefined;
    const parameters = this.parseFunctionParameters();
    if (!parameters) return undefined;

    if (!this.expectPeek(TOKEN.LBRACE)) return undefined;
    const body = this.parseBlockStatement();
    if (!body) return undefined;

    return new FunctionStatement({ token, name, parameters, body });
  }

  private parseFunctionParameters(): Identifier[] | undefined {
    const idents: Identifier[] = [];

    if (!this.curTokenIs(TOKEN.LPAREN)) {
      return undefined;
    }

    if (this.peekTokenIs(TOKEN.RPAREN)) {
      this.nextToken();
      return idents;
    }

    do {
      this.nextToken();
      idents.push(this.parseIdentifier());
      this.nextToken();
    } while (this.curTokenIs(TOKEN.COMMA));

    return idents;
  }

  /**
   * Expression
   */

  private parseExpression(precedence: Precedence): Expression | undefined {
    const prefixFn = this.getPrefixFn(this.curToken.type);
    if (!prefixFn) {
      return undefined;
    }
    let leftExp = prefixFn();
    if (!leftExp) {
      return undefined;
    }

    while (
      !this.peekTokenIs(TOKEN.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infixFn = this.getInfixFn(this.peekToken.type);
      if (!infixFn) {
        return undefined;
      }

      this.nextToken();
      const newLeftExp = infixFn(leftExp);
      if (!newLeftExp) {
        return undefined;
      }

      leftExp = newLeftExp;
    }

    return leftExp;
  }

  private parsePrefixExpression(): PrefixExpression | undefined {
    const token = this.curToken;

    this.nextToken();
    const right = this.parseExpression(Precedence.PREFIX);
    if (!right) return undefined;

    return new PrefixExpression({ token, right, operator: token.ch });
  }

  private parseGroupedExpression(): Expression | undefined {
    this.nextToken();

    const exp = this.parseExpression(Precedence.LOWEST);
    if (!this.expectPeek(TOKEN.RPAREN)) return undefined;

    return exp;
  }

  private parseInfixExpression(left: Expression): InfixExpression | undefined {
    const token = this.curToken;
    const precedence = this.curPrecedence();

    this.nextToken();
    const right = this.parseExpression(precedence);
    if (!right) {
      return undefined;
    }

    return new InfixExpression({
      token,
      left,
      right,
      operator: token.ch,
    });
  }

  private parseCallExpression(name: Expression): CallExpression | undefined {
    if (!(name instanceof Identifier)) return;

    const token = this.curToken;

    const args = this.parseExpressionList();
    if (!args) return undefined;

    return new CallExpression({
      token,
      name,
      args,
    });
  }

  private parseExpressionList(): Expression[] | undefined {
    const exps: Expression[] = [];

    if (!this.curTokenIs(TOKEN.LPAREN)) {
      return undefined;
    }

    if (this.peekTokenIs(TOKEN.RPAREN)) {
      this.nextToken();
      return exps;
    }

    do {
      this.nextToken();
      const exp = this.parseExpression(Precedence.LOWEST);
      if (!exp) return undefined;

      exps.push(exp);
      this.nextToken();
    } while (this.curTokenIs(TOKEN.COMMA));

    return exps;
  }

  /**
   * Literal
   */

  private parseStringLiteral() {
    return new StringLiteral({ token: this.curToken, value: this.curToken.ch });
  }

  private parseIdentifier() {
    return new Identifier({ token: this.curToken, value: this.curToken.ch });
  }

  private parseNumberLiteral(): NumberLiteral | undefined {
    const num = Number(this.curToken.ch);
    if (isNaN(num)) {
      return undefined;
    }

    return new NumberLiteral({
      token: this.curToken,
      value: num,
    });
  }

  private parseBooleanLiteral() {
    return new BooleanLiteral({
      token: this.curToken,
      value: this.curToken.type === 'TRUE',
    });
  }

  private peekPrecedence(): Precedence {
    return getPrecedence(this.peekToken.type);
  }

  private curPrecedence(): Precedence {
    return getPrecedence(this.curToken.type);
  }

  private expectPeek(type: TOKEN): boolean {
    if (this.peekTokenIs(type)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(type);
      return false;
    }
  }

  private curTokenIs(type: TOKEN): boolean {
    return this.curToken.type === type;
  }

  private peekTokenIs(type: TOKEN): boolean {
    return this.peekToken.type === type;
  }

  private peekError(type: TOKEN) {
    this.errors.push({
      message: `expected next token to be ${type}, got ${JSON.stringify(
        this.peekToken
      )} instead`,
    });
  }

  private nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.NextToken();
  }
}

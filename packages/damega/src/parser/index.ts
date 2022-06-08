import {
  BlockStatement,
  BooleanLiteral,
  Expression,
  ExpressionStatement,
  Identifier,
  IfStatement,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  PrefixExpression,
  Program,
  Statement,
  StringLiteral,
  TypeIdentifier,
  WhileStatement,
} from '@/ast';
import { Lexer } from '@/lexer';
import { Token, token, TokenType } from '@/token';

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
}

const getPrecedence = (token: TokenType): Precedence => {
  switch (token) {
    case 'EQ':
    case 'NOT_EQ':
      return Precedence.EQUALS;

    case 'LT':
    case 'GT':
      return Precedence.LESSGREATER;

    case 'PLUS':
    case 'MINUS':
      return Precedence.SUM;

    case 'SLASH':
    case 'ASTERISK':
      return Precedence.PRODUCT;

    default:
      return Precedence.LOWEST;
  }
};

export class Parser {
  private lexer: Lexer;
  private curToken: Token = new Token('EOF', 'EOF');
  private peekToken: Token = new Token('EOF', 'EOF');

  private prefixParseFns = new Map<TokenType, PrefixParserFn>();
  private infixParseFns = new Map<TokenType, InfixParserFn>();

  public errors: ParseError[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;

    this.nextToken();
    this.nextToken();

    this.registerPrefix(token.STRING, () => this.parseStringLiteral());
    this.registerPrefix(token.NUMBER, () => this.parseNumberLiteral());
    this.registerPrefix(token.TRUE, () => this.parseBooleanLiteral());
    this.registerPrefix(token.FALSE, () => this.parseBooleanLiteral());
    this.registerPrefix('BANG', () => this.parsePrefixExpression());
    this.registerPrefix('MINUS', () => this.parsePrefixExpression());

    this.registerInfix('PLUS', (left) => this.parseInfixExpression(left));
    this.registerInfix('MINUS', (left) => this.parseInfixExpression(left));
    this.registerInfix('ASTERISK', (left) => this.parseInfixExpression(left));
    this.registerInfix('SLASH', (left) => this.parseInfixExpression(left));
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

  private registerPrefix(key: TokenType, fn: PrefixParserFn) {
    if (this.prefixParseFns.get(key)) {
      throw new Error(`${key} prefix parser is already registered.`);
    }

    this.prefixParseFns.set(key, fn);
  }

  private registerInfix(key: TokenType, fn: InfixParserFn) {
    if (this.infixParseFns.get(key)) {
      throw new Error(`${key} infix parser is already registered.`);
    }

    this.infixParseFns.set(key, fn);
  }

  private getPrefixFn(key: TokenType): PrefixParserFn | undefined {
    return this.prefixParseFns.get(key);
  }

  private getInfixFn(key: TokenType): InfixParserFn | undefined {
    return this.infixParseFns.get(key);
  }

  private parseStatement(): Statement | undefined {
    switch (this.curToken.type) {
      case 'LET':
        return this.parseLetStatement();

      case 'IF':
        return this.parseIfStatement();

      case 'WHILE':
        return this.parseWhileStatement();

      default:
        return this.parseExpressionStatement();
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
      !this.peekTokenIs('SEMICOLON') &&
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

  private parseLetStatement(): LetStatement | undefined {
    const token = this.curToken;

    if (!this.expectPeek('IDENT')) {
      return undefined;
    }

    const name = new Identifier({
      token: this.curToken,
      value: this.curToken.ch,
    });

    if (!this.expectPeek('COLON')) {
      return undefined;
    }
    this.nextToken();

    const type = new TypeIdentifier({
      token: this.curToken,
    });

    if (!this.expectPeek('ASSIGN')) {
      return undefined;
    }
    this.nextToken();

    const value = this.parseExpression(Precedence.LOWEST);
    if (!value) {
      return undefined;
    }

    if (!this.expectPeek('SEMICOLON')) {
      return undefined;
    }

    return new LetStatement({ token, value, name, type });
  }

  private parseIfStatement(): IfStatement | undefined {
    const token = this.curToken;

    if (!this.expectPeek('LPAREN')) return undefined;
    this.nextToken();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (!condition) return undefined;

    if (!this.curTokenIs('RPAREN')) return undefined;
    this.nextToken();

    if (!this.expectPeek('LBRACE')) return undefined;

    const consequence = this.parseBlockStatement();
    if (!consequence) return undefined;

    let alternative: BlockStatement | undefined = undefined;

    if (this.peekTokenIs('ELSE')) {
      if (!this.expectPeek('LBRACE')) return undefined;
      alternative = this.parseBlockStatement();
      if (!consequence) return undefined;
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

    if (!this.expectPeek('LPAREN')) return undefined;
    this.nextToken();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (!condition) return undefined;

    if (!this.curTokenIs('RPAREN')) return undefined;
    this.nextToken();

    if (!this.expectPeek('LBRACE')) return undefined;

    const consequence = this.parseBlockStatement();
    if (!consequence) return undefined;

    return new WhileStatement({ token, condition, consequence });
  }

  private parseBlockStatement(): BlockStatement | undefined {
    const token = this.curToken;
    this.nextToken();

    const stmts: Statement[] = [];

    while (!this.curTokenIs('RBRACE') && !this.curTokenIs('EOF')) {
      const stmt = this.parseStatement();
      if (stmt) {
        stmts.push(stmt);
      }
      this.nextToken();
    }

    return new BlockStatement({ token, statements: stmts });
  }

  private parsePrefixExpression(): PrefixExpression | undefined {
    const token = this.curToken;

    this.nextToken();
    const right = this.parseExpression(Precedence.PREFIX);
    if (!right) return undefined;

    return new PrefixExpression({ token, right, operator: token.ch });
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

  private parseStringLiteral() {
    return new StringLiteral({ token: this.curToken, value: this.curToken.ch });
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

  private expectPeek(type: TokenType): boolean {
    if (this.peekTokenIs(type)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(type);
      return false;
    }
  }

  private curTokenIs(type: TokenType): boolean {
    return this.peekToken.type === type;
  }

  private peekTokenIs(type: TokenType): boolean {
    return this.peekToken.type === type;
  }

  private peekError(type: TokenType) {
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

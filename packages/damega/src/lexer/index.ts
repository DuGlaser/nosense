import { LookUpKeyword, Token, token, TokenType } from '@/token';

type ToTokenFn = () => Token;

export class Lexer {
  private input: string;
  private position: number;
  private readPosition: number;
  private ch: string;

  private toTokenMap = new Map<string, ToTokenFn>();

  constructor(input: string) {
    this.input = input;
    this.readPosition = 0;
    this.position = 0;
    this.ch = '';

    this.readChar();

    this.registerTokenMap(token.EOF, () => this.newToken('EOF'));

    this.registerTokenMap(token.ASSIGN, () => this.readAssign());
    this.registerTokenMap(token.ASTERISK, () => this.newToken('ASTERISK'));
    this.registerTokenMap(token.PLUS, () => this.newToken('PLUS'));
    this.registerTokenMap(token.MINUS, () => this.newToken('MINUS'));
    this.registerTokenMap(token.BANG, () => this.readBang());
    this.registerTokenMap(token.SLASH, () => this.newToken('SLASH'));

    this.registerTokenMap(token.LT, () => this.readLT());
    this.registerTokenMap(token.GT, () => this.readGT());

    this.registerTokenMap(token.COMMA, () => this.newToken('COMMA'));

    this.registerTokenMap(token.SEMICOLON, () => this.newToken('SEMICOLON'));
    this.registerTokenMap(token.LPAREN, () => this.newToken('LPAREN'));
    this.registerTokenMap(token.RPAREN, () => this.newToken('RPAREN'));
    this.registerTokenMap(token.LBRACE, () => this.newToken('LBRACE'));
    this.registerTokenMap(token.RBRACE, () => this.newToken('RBRACE'));
    this.registerTokenMap(token.LBRACKET, () => this.newToken('LBRACKET'));
    this.registerTokenMap(token.RBRACKET, () => this.newToken('RBRACKET'));
  }

  public NextToken(): Token {
    this.skipWhiteSpace();

    const fn = this.getToTokenFn(this.ch);
    if (fn) {
      const token = fn();
      this.readChar();
      return token;
    }

    if (this.isLetter(this.ch)) {
      const ident = this.readIdent();
      const type = LookUpKeyword(ident);

      return this.newToken(type, ident);
    }

    if (this.isDegit(this.ch)) {
      const num = this.readNumber();

      return this.newToken('NUMBER', num);
    }

    return this.newToken('ILLEGAL', '');
  }

  private registerTokenMap(key: string, fn: ToTokenFn) {
    if (this.toTokenMap.get(key)) {
      throw new Error(`${key} is already registered.`);
    }

    this.toTokenMap.set(key, fn);
  }

  private getToTokenFn(key: string): ToTokenFn | undefined {
    return this.toTokenMap.get(key);
  }

  private readAssign(): Token {
    if (this.peekChar() == token.ASSIGN) {
      this.readChar();
      return this.newToken('EQ', token.EQ);
    } else {
      return this.newToken('ASSIGN');
    }
  }

  private readBang(): Token {
    if (this.peekChar() == token.ASSIGN) {
      this.readChar();
      return this.newToken('NOT_EQ', token.NOT_EQ);
    } else {
      return this.newToken('BANG', token.BANG);
    }
  }

  private readLT(): Token {
    if (this.peekChar() == token.ASSIGN) {
      this.readChar();
      return this.newToken('LT_EQ', token.LT_EQ);
    } else {
      return this.newToken('LT');
    }
  }

  private readGT(): Token {
    if (this.peekChar() == token.ASSIGN) {
      this.readChar();
      return this.newToken('GT_EQ', token.GT_EQ);
    } else {
      return this.newToken('GT');
    }
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = 'EOF';
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition++;
  }

  private newToken(type: TokenType, ch: string = this.ch) {
    return new Token(type, ch);
  }

  private skipWhiteSpace() {
    while (this.isWhiteSpace(this.ch)) {
      this.readChar();
    }
  }

  private isWhiteSpace(char: string) {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }

  // NOTE: 英文字しか変数として使えない
  private isLetter(char: string): boolean {
    if (char.length > 1) {
      return false;
    }

    return ('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z');
  }

  private readIdent() {
    const startPos = this.position;

    while (this.isLetter(this.ch)) {
      this.readChar();
    }

    return this.input.substring(startPos, this.position);
  }

  private isDegit(char: string): boolean {
    if (char.length > 1) {
      return false;
    }

    return '0' <= char && char <= '9';
  }

  private readNumber(): string {
    const startPos = this.position;

    while (this.isDegit(this.ch)) {
      this.readChar();
    }

    return this.input.substring(startPos, this.position);
  }

  private peekChar() {
    if (this.readPosition >= this.input.length) {
      return 'EOF';
    } else {
      return this.input[this.readPosition];
    }
  }
}

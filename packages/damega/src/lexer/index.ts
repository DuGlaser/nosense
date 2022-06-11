import { LookUpKeyword, TOKEN, Token } from '@/token';

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

    this.registerTokenMap('EOF', () => this.newToken(TOKEN.EOF));

    this.registerTokenMap('=', () => this.readAssign());
    this.registerTokenMap('*', () => this.newToken(TOKEN.ASTERISK));
    this.registerTokenMap('+', () => this.newToken(TOKEN.PLUS));
    this.registerTokenMap('-', () => this.newToken(TOKEN.MINUS));
    this.registerTokenMap('!', () => this.readBang());
    this.registerTokenMap('/', () => this.newToken(TOKEN.SLASH));

    this.registerTokenMap('<', () => this.readLT());
    this.registerTokenMap('>', () => this.readGT());

    this.registerTokenMap('"', () => this.readString());
    this.registerTokenMap(',', () => this.newToken(TOKEN.COMMA));
    this.registerTokenMap(';', () => this.newToken(TOKEN.SEMICOLON));
    this.registerTokenMap(':', () => this.newToken(TOKEN.COLON));

    this.registerTokenMap('(', () => this.newToken(TOKEN.LPAREN));
    this.registerTokenMap(')', () => this.newToken(TOKEN.RPAREN));
    this.registerTokenMap('{', () => this.newToken(TOKEN.LBRACE));
    this.registerTokenMap('}', () => this.newToken(TOKEN.RBRACE));
    this.registerTokenMap('[', () => this.newToken(TOKEN.LBRACKET));
    this.registerTokenMap(']', () => this.newToken(TOKEN.RBRACKET));
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

      return this.newToken(TOKEN.NUMBER, num);
    }

    return this.newToken(TOKEN.ILLEGAL, '');
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
    if (this.peekChar() === '=') {
      this.readChar();
      return this.newToken(TOKEN.EQ, '==');
    } else {
      return this.newToken(TOKEN.ASSIGN);
    }
  }

  private readBang(): Token {
    if (this.peekChar() === '=') {
      this.readChar();
      return this.newToken(TOKEN.NOT_EQ, '!=');
    } else {
      return this.newToken(TOKEN.BANG);
    }
  }

  private readLT(): Token {
    if (this.peekChar() === '=') {
      this.readChar();
      return this.newToken(TOKEN.LT_EQ, '<=');
    } else {
      return this.newToken(TOKEN.LT);
    }
  }

  private readGT(): Token {
    if (this.peekChar() === '=') {
      this.readChar();
      return this.newToken(TOKEN.GT_EQ, '>=');
    } else {
      return this.newToken(TOKEN.GT);
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

  private newToken(type: TOKEN, ch: string = this.ch) {
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

  private readString(): Token {
    this.readChar();
    const startPos = this.position;

    while (this.ch !== '"') {
      this.readChar();
    }

    const str = this.input.substring(startPos, this.position);
    return this.newToken(TOKEN.STRING, str);
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

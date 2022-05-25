import { LookUpKeyword, Token, token, TokenType } from '@/token';

export class Lexer {
  private input: string;
  private position: number;
  private readPosition: number;
  private ch: string;

  constructor(input: string) {
    this.input = input;
    this.readPosition = 0;
    this.position = 0;
    this.ch = '';

    this.readChar();
  }

  public NextToken(): Token {
    let tok: Token;

    this.skipWhiteSpace();

    switch (this.ch) {
      case token.EOF:
        tok = this.newToken('EOF');
        break;

      case token.ASSIGN:
        if (this.peekChar() == token.ASSIGN) {
          tok = this.newToken('EQ', token.EQ);
          this.readChar();
        } else {
          tok = this.newToken('ASSIGN');
        }
        break;

      case token.PLUS:
        tok = this.newToken('PLUS');
        break;

      case token.MINUS:
        tok = this.newToken('MINUS');
        break;

      case token.BANG:
        if (this.peekChar() == token.ASSIGN) {
          tok = this.newToken('NOT_EQ', token.NOT_EQ);
          this.readChar();
        } else {
          tok = this.newToken('BANG', token.BANG);
        }
        break;

      case token.ASTERISK:
        tok = this.newToken('ASTERISK');
        break;

      case token.SLASH:
        tok = this.newToken('SLASH');
        break;

      case token.LT:
        if (this.peekChar() == token.ASSIGN) {
          this.readChar();
          tok = this.newToken('LT_EQ', token.LT_EQ);
        } else {
          tok = this.newToken('LT');
        }
        break;

      case token.GT:
        if (this.peekChar() == token.ASSIGN) {
          this.readChar();
          tok = this.newToken('GT_EQ', token.GT_EQ);
        } else {
          tok = this.newToken('GT');
        }
        break;

      case token.COMMA:
        tok = this.newToken('COMMA');
        break;

      case token.SEMICOLON:
        tok = this.newToken('SEMICOLON');
        break;

      case token.LPAREN:
        tok = this.newToken('LPAREN');
        break;

      case token.RPAREN:
        tok = this.newToken('RPAREN');
        break;

      case token.LBRACE:
        tok = this.newToken('LBRACE');
        break;

      case token.RBRACE:
        tok = this.newToken('RBRACE');
        break;

      default:
        if (this.isLetter(this.ch)) {
          const ident = this.readIdent();
          const type = LookUpKeyword(ident);

          return this.newToken(type, ident);
        } else if (this.isDegit(this.ch)) {
          const num = this.readNumber();

          return this.newToken('NUMBER', num);
        } else {
          tok = this.newToken('ILLEGAL', '');
        }
    }

    this.readChar();
    return tok;
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

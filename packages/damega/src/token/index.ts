export const token = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',
  IDENT: 'IDENT',
  NUMBER: 'NUMBER',

  ASSIGN: '=',
  PLUS: '+',
  MINUS: '-',
  BANG: '!',
  ASTERISK: '*',
  SLASH: '/',
  LT: '<',
  LT_EQ: '<=',
  GT: '>',
  GT_EQ: '>=',

  COMMA: ',',
  SEMICOLON: ';',

  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',

  FUNCTION: 'FUNCTION',
  VAR_STRING: 'VAR_STRING',
  VAR_NUMBER: 'VAR_NUMBER',
  VAR_BOOLEAN: 'VAR_BOOLEAN',
  IF: 'IF',
  ELSE: 'ELSE',
  WHILE: 'WHILE',
  TRUE: 'TRUE',
  FALSE: 'FALSE',

  EQ: '==',
  NOT_EQ: '!=',
} as const;

export type TokenType = keyof typeof token;

export class Token {
  readonly type: TokenType;
  readonly ch: string;

  constructor(type: TokenType, ch: string) {
    this.type = type;
    this.ch = ch;
  }
}

type Keywords = {
  [key in string]: TokenType;
};

export const keywords: Keywords = {
  func: token.FUNCTION,
  String: token.VAR_STRING,
  Number: token.VAR_NUMBER,
  Bool: token.VAR_BOOLEAN,
  if: token.IF,
  else: token.ELSE,
  while: token.WHILE,
  true: token.TRUE,
  false: token.FALSE,
};

export const LookUpKeyword = (keyword: string): TokenType => {
  const type = keywords[keyword];

  if (!type) {
    return 'IDENT';
  }

  return type;
};

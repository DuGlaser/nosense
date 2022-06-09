export const token = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',
  IDENT: 'IDENT',
  NUMBER: 'NUMBER',
  STRING: 'STRING',

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
  COLON: ':',

  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',
  LBRACKET: '[',
  RBRACKET: ']',

  FUNCTION: 'FUNCTION',
  TYPE_STRING: 'TYPE_STRING',
  TYPE_NUMBER: 'TYPE_NUMBER',
  TYPE_BOOLEAN: 'TYPE_BOOLEAN',
  RETURN: 'RETURN',
  IF: 'IF',
  ELSE: 'ELSE',
  WHILE: 'WHILE',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  LET: 'LET',

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
  string: token.TYPE_STRING,
  number: token.TYPE_NUMBER,
  bool: token.TYPE_BOOLEAN,
  return: token.RETURN,
  let: token.LET,
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

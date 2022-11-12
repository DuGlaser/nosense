import { INITIAL_POSITION_CONTEXT, PositionContext } from '@/contexts';

export enum TOKEN {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',
  IDENT = 'IDENT',
  NUMBER = 'NUMBER',
  STRING = 'STRING',

  ASSIGN = 'ASSIGN',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  BANG = 'BANG',
  ASTERISK = 'ASTERISK',
  SLASH = 'SLASH',
  LT = 'LT',
  LT_EQ = 'LT_EQ',
  GT = 'GT',
  GT_EQ = 'GT_EQ',

  COMMA = 'COMMA',
  SEMICOLON = 'SEMICOLON',
  COLON = 'COLON',

  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',

  FUNCTION = 'FUNCTION',
  TYPE_STRING = 'TYPE_STRING',
  TYPE_NUMBER = 'TYPE_NUMBER',
  TYPE_BOOLEAN = 'TYPE_BOOLEAN',
  RETURN = 'RETURN',
  IF = 'IF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  LET = 'LET',

  EQ = 'EQ',
  NOT_EQ = 'NOT_EQ',
}

export class Token {
  readonly type: TOKEN;
  readonly ch: string;
  readonly ctx: PositionContext;

  constructor(type: TOKEN, ch: string, ctx?: PositionContext) {
    this.type = type;
    this.ch = ch;
    this.ctx = ctx ?? { ...INITIAL_POSITION_CONTEXT };
  }
}

type Keywords = {
  [key in string]: TOKEN;
};

export const keywords: Keywords = {
  func: TOKEN.FUNCTION,
  string: TOKEN.TYPE_STRING,
  number: TOKEN.TYPE_NUMBER,
  bool: TOKEN.TYPE_BOOLEAN,
  return: TOKEN.RETURN,
  let: TOKEN.LET,
  if: TOKEN.IF,
  else: TOKEN.ELSE,
  while: TOKEN.WHILE,
  true: TOKEN.TRUE,
  false: TOKEN.FALSE,
};

export const LookUpKeyword = (keyword: string): TOKEN => {
  const type = keywords[keyword];

  if (!type) {
    return TOKEN.IDENT;
  }

  return type;
};

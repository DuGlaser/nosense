import {
  BlockStatement,
  Identifier,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  TOKEN,
  Token,
  TypeIdentifier,
  WhileStatement,
} from '@nosense/damega';

import { convert2WhileStatementObject } from '@/lib/converter/WhileStatement';
import { TYPE_IDENTIFIER, WhileStatementObject } from '@/lib/models/astObjects';

describe('WhileStatement', () => {
  test('consequenceが一行以上ある', () => {
    const expected: WhileStatementObject = {
      _type: 'WhileStatement',
      condition: 'x > 10',
      consequence: [
        {
          _type: 'LetStatement',
          name: 'x',
          typeIdentifier: TYPE_IDENTIFIER.NUMBER,
          expression: '10',
        },
      ],
    };

    const input = new WhileStatement({
      token: new Token(TOKEN.WHILE, 'while'),
      condition: new InfixExpression({
        token: new Token(TOKEN.IDENT, 'x'),
        left: new Identifier({
          token: new Token(TOKEN.IDENT, 'x'),
          value: 'x',
        }),
        operator: '>',
        right: new NumberLiteral({
          token: new Token(TOKEN.NUMBER, '10'),
          value: 10,
        }),
      }),
      consequence: new BlockStatement({
        token: new Token(TOKEN.LBRACKET, '{'),
        statements: [
          new LetStatement({
            token: new Token(TOKEN.LET, 'let'),
            value: new NumberLiteral({
              token: new Token(TOKEN.NUMBER, '10'),
              value: 10,
            }),
            name: new Identifier({
              token: new Token(TOKEN.IDENT, 'x'),
              value: 'x',
            }),
            type: new TypeIdentifier({
              token: new Token(TOKEN.TYPE_NUMBER, 'number'),
            }),
          }),
        ],
      }),
    });

    const got = convert2WhileStatementObject(input);
    expect(got).toStrictEqual(expected);
  });

  test('consequenceがない', () => {
    const expected: WhileStatementObject = {
      _type: 'WhileStatement',
      condition: 'x > 10',
      consequence: [],
    };

    const input = new WhileStatement({
      token: new Token(TOKEN.WHILE, 'while'),
      condition: new InfixExpression({
        token: new Token(TOKEN.IDENT, 'x'),
        left: new Identifier({
          token: new Token(TOKEN.IDENT, 'x'),
          value: 'x',
        }),
        operator: '>',
        right: new NumberLiteral({
          token: new Token(TOKEN.NUMBER, '10'),
          value: 10,
        }),
      }),
      consequence: new BlockStatement({
        token: new Token(TOKEN.LBRACKET, '{'),
        statements: [],
      }),
    });

    const got = convert2WhileStatementObject(input);
    expect(got).toStrictEqual(expected);
  });
});

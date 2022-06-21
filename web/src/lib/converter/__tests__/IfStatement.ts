import {
  BlockStatement,
  BooleanLiteral,
  Identifier,
  IfStatement,
  LetStatement,
  NumberLiteral,
  TOKEN,
  Token,
  TypeIdentifier,
} from '@nosense/damega';

import { convert2IfStatementObject } from '@/lib/converter/IfStatement';
import { IfStatementObject, TYPE_IDENTIFIER } from '@/lib/models/astObjects';

describe('IfStatement', () => {
  test('else句がない', () => {
    const expected: IfStatementObject = {
      _type: 'IfStatement',
      condition: 'true',
      consequence: [
        {
          _type: 'LetStatement',
          typeIdentifier: TYPE_IDENTIFIER.NUMBER,
          expression: '10',
          name: 'x',
        },
      ],
      alternative: undefined,
    };

    const ast = new IfStatement({
      token: new Token(TOKEN.IF, 'if'),
      condition: new BooleanLiteral({
        token: new Token(TOKEN.TRUE, 'true'),
        value: true,
      }),
      consequence: new BlockStatement({
        token: new Token(TOKEN.LBRACE, '{'),
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
      alternative: undefined,
    });

    const got = convert2IfStatementObject(ast);
    expect(got).toStrictEqual(expected);
  });

  test('else句がある', () => {
    const expected: IfStatementObject = {
      _type: 'IfStatement',
      condition: 'true',
      consequence: [
        {
          _type: 'LetStatement',
          typeIdentifier: TYPE_IDENTIFIER.NUMBER,
          expression: '10',
          name: 'x',
        },
      ],
      alternative: [
        {
          _type: 'LetStatement',
          typeIdentifier: TYPE_IDENTIFIER.NUMBER,
          expression: '10',
          name: 'x',
        },
      ],
    };

    const ast = new IfStatement({
      token: new Token(TOKEN.IF, 'if'),
      condition: new BooleanLiteral({
        token: new Token(TOKEN.TRUE, 'true'),
        value: true,
      }),
      consequence: new BlockStatement({
        token: new Token(TOKEN.LBRACE, '{'),
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
      alternative: new BlockStatement({
        token: new Token(TOKEN.LBRACE, '{'),
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

    const got = convert2IfStatementObject(ast);
    expect(got).toStrictEqual(expected);
  });
});

import {
  BooleanLiteral,
  Identifier,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  PrefixExpression,
  StringLiteral,
  TOKEN,
  Token,
  TypeIdentifier,
} from '@nosense/damega';

import { convert2LetStatementObject } from '@/lib/converter/LetStatement';
import { LetStatementObject, TYPE_IDENTIFIER } from '@/lib/models/astObjects';

describe('LetStatement', () => {
  test('数値型', () => {
    const expected: LetStatementObject = {
      _type: 'LetStatement',
      typeIdentifier: TYPE_IDENTIFIER.NUMBER,
      expression: '10',
      name: 'x',
    };

    const input = new LetStatement({
      token: new Token(TOKEN.LET, 'let'),
      type: new TypeIdentifier({
        token: new Token(TOKEN.TYPE_NUMBER, 'number'),
      }),
      name: new Identifier({
        token: new Token(TOKEN.IDENT, 'x'),
        value: 'x',
      }),
      value: new NumberLiteral({
        token: new Token(TOKEN.NUMBER, '10'),
        value: 10,
      }),
    });

    const got = convert2LetStatementObject(input);
    expect(got).toStrictEqual(expected);
  });

  test('infixExpression', () => {
    const expected: LetStatementObject = {
      _type: 'LetStatement',
      typeIdentifier: TYPE_IDENTIFIER.NUMBER,
      expression: '10 * 10',
      name: 'x',
    };

    const input = new LetStatement({
      token: new Token(TOKEN.LET, 'let'),
      type: new TypeIdentifier({
        token: new Token(TOKEN.TYPE_NUMBER, 'number'),
      }),
      name: new Identifier({
        token: new Token(TOKEN.IDENT, 'x'),
        value: 'x',
      }),
      value: new InfixExpression({
        token: new Token(TOKEN.NUMBER, '10'),
        left: new NumberLiteral({
          token: new Token(TOKEN.NUMBER, '10'),
          value: 10,
        }),
        operator: '*',
        right: new NumberLiteral({
          token: new Token(TOKEN.NUMBER, '10'),
          value: 10,
        }),
      }),
    });

    const got = convert2LetStatementObject(input);
    expect(got).toStrictEqual(expected);
  });

  test('prefixExpression', () => {
    const expected: LetStatementObject = {
      _type: 'LetStatement',
      typeIdentifier: TYPE_IDENTIFIER.NUMBER,
      expression: '-10',
      name: 'x',
    };

    const input = new LetStatement({
      token: new Token(TOKEN.LET, 'let'),
      type: new TypeIdentifier({
        token: new Token(TOKEN.TYPE_NUMBER, 'number'),
      }),
      name: new Identifier({
        token: new Token(TOKEN.IDENT, 'x'),
        value: 'x',
      }),
      value: new PrefixExpression({
        token: new Token(TOKEN.NUMBER, '10'),
        operator: '-',
        right: new NumberLiteral({
          token: new Token(TOKEN.NUMBER, '10'),
          value: 10,
        }),
      }),
    });

    const got = convert2LetStatementObject(input);
    expect(got).toStrictEqual(expected);
  });

  test('文字列型', () => {
    const expected: LetStatementObject = {
      _type: 'LetStatement',
      typeIdentifier: TYPE_IDENTIFIER.STRING,
      expression: '"test"',
      name: 'x',
    };

    const input = new LetStatement({
      token: new Token(TOKEN.LET, 'let'),
      type: new TypeIdentifier({
        token: new Token(TOKEN.TYPE_STRING, 'string'),
      }),
      name: new Identifier({
        token: new Token(TOKEN.IDENT, 'x'),
        value: 'x',
      }),
      value: new StringLiteral({
        token: new Token(TOKEN.NUMBER, 'test'),
        value: 'test',
      }),
    });

    const got = convert2LetStatementObject(input);
    expect(got).toStrictEqual(expected);
  });

  test('論理型', () => {
    const expected: LetStatementObject = {
      _type: 'LetStatement',
      typeIdentifier: TYPE_IDENTIFIER.BOOLEAN,
      expression: 'true',
      name: 'x',
    };

    const input = new LetStatement({
      token: new Token(TOKEN.LET, 'let'),
      type: new TypeIdentifier({
        token: new Token(TOKEN.TYPE_BOOLEAN, 'bool'),
      }),
      name: new Identifier({
        token: new Token(TOKEN.IDENT, 'x'),
        value: 'x',
      }),
      value: new BooleanLiteral({
        token: new Token(TOKEN.TYPE_BOOLEAN, 'true'),
        value: true,
      }),
    });

    const got = convert2LetStatementObject(input);
    expect(got).toStrictEqual(expected);
  });
});

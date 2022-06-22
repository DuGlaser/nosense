import {
  AssignStatement,
  Identifier,
  NumberLiteral,
  TOKEN,
  Token,
} from '@nosense/damega';

import { convert2AssignStatementObject } from '@/lib/converter/AssignStatement';
import { AssignStatementObject } from '@/lib/models/astObjects';

describe('AssignStatement', () => {
  test('simple', () => {
    const expected: AssignStatementObject = {
      _type: 'AssignStatement',
      value: '10',
      name: 'x',
    };

    const input = new AssignStatement({
      token: new Token(TOKEN.IDENT, 'x'),
      name: new Identifier({
        token: new Token(TOKEN.IDENT, 'x'),
        value: 'x',
      }),
      value: new NumberLiteral({
        token: new Token(TOKEN.IDENT, '10'),
        value: 10,
      }),
    });

    const got = convert2AssignStatementObject(input);
    expect(got).toStrictEqual(expected);
  });
});

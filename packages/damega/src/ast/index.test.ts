import { Token } from '../token';
import {
  BlockStatement,
  BooleanLiteral,
  Identifier,
  IfStatement,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  Program,
  ReturnStatement,
  StringLiteral,
  TypeIdentifier,
} from '.';

describe('Ast', () => {
  test('let test: string = "test";', () => {
    const p = new Program([
      new LetStatement({
        token: new Token('LET', 'let'),
        value: new StringLiteral({
          token: new Token('STRING', 'test'),
          value: 'test',
        }),
        name: new Identifier({
          token: new Token('IDENT', 'test'),
          value: 'test',
        }),
        type: new TypeIdentifier({
          token: new Token('TYPE_STRING', 'string'),
        }),
      }),
    ]);

    expect(`let test: string = "test";`).toBe(p.string());
  });

  test('let test: number = 5;', () => {
    const p = new Program([
      new LetStatement({
        token: new Token('LET', 'let'),
        value: new NumberLiteral({
          token: new Token('NUMBER', '5'),
          value: 5,
        }),
        name: new Identifier({
          token: new Token('IDENT', 'test'),
          value: 'test',
        }),
        type: new TypeIdentifier({
          token: new Token('TYPE_NUMBER', 'number'),
        }),
      }),
    ]);

    expect(`let test: number = 5;`).toBe(p.string());
  });

  test('let test: bool = true;', () => {
    const p = new Program([
      new LetStatement({
        token: new Token('LET', 'let'),
        value: new BooleanLiteral({
          token: new Token('TRUE', 'true'),
          value: true,
        }),
        name: new Identifier({
          token: new Token('IDENT', 'test'),
          value: 'test',
        }),
        type: new TypeIdentifier({
          token: new Token('TYPE_BOOLEAN', 'bool'),
        }),
      }),
    ]);

    expect(`let test: bool = true;`).toBe(p.string());
  });

  test('let x: number = 1 + 1', () => {
    const p = new Program([
      new LetStatement({
        token: new Token('LET', 'let'),
        value: new InfixExpression({
          token: new Token('PLUS', '+'),
          right: new NumberLiteral({
            token: new Token('NUMBER', '1'),
            value: 1,
          }),
          operator: '+',
          left: new NumberLiteral({
            token: new Token('NUMBER', '1'),
            value: 1,
          }),
        }),
        name: new Identifier({
          token: new Token('IDENT', 'x'),
          value: 'x',
        }),
        type: new TypeIdentifier({
          token: new Token('TYPE_NUMBER', 'number'),
        }),
      }),
    ]);

    expect(`let x: number = (1 + 1);`).toBe(p.statements[0].inspect());
  });

  test('if statement', () => {
    const expected = `
if (true) {
  return 10;
} else {
  return 10;
}
`;

    const p = new Program([
      new IfStatement({
        token: new Token('IF', 'if'),
        condition: new BooleanLiteral({
          token: new Token('TRUE', 'true'),
          value: true,
        }),
        consequence: new BlockStatement({
          token: new Token('LBRACE', '{'),
          statements: [
            new ReturnStatement({
              token: new Token('RETURN', 'return'),
              valueExpression: new NumberLiteral({
                token: new Token('NUMBER', '10'),
                value: 10,
              }),
            }),
          ],
        }),
        alternative: new BlockStatement({
          token: new Token('LBRACE', '{'),
          statements: [
            new ReturnStatement({
              token: new Token('RETURN', 'return'),
              valueExpression: new NumberLiteral({
                token: new Token('NUMBER', '10'),
                value: 10,
              }),
            }),
          ],
        }),
      }),
    ]);

    expect(expected.trim()).toBe(p.inspect());
  });
});

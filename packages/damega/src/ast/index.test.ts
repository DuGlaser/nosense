import { TOKEN, Token } from '@/token';

import {
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  ExpressionStatement,
  FunctionStatement,
  Identifier,
  IfStatement,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  PrefixExpression,
  Program,
  ReturnStatement,
  StringLiteral,
  TypeIdentifier,
  WhileStatement,
} from '.';

describe('Ast', () => {
  test('let test: string = "test";', () => {
    const p = new Program([
      new LetStatement({
        token: new Token(TOKEN.LET, 'let'),
        value: new StringLiteral({
          token: new Token(TOKEN.STRING, 'test'),
          value: 'test',
        }),
        name: new Identifier({
          token: new Token(TOKEN.IDENT, 'test'),
          value: 'test',
        }),
        type: new TypeIdentifier({
          token: new Token(TOKEN.TYPE_STRING, 'string'),
        }),
      }),
    ]);

    expect(`let test: string = "test";`).toBe(p.string());
  });

  test('let test: number = 5;', () => {
    const p = new Program([
      new LetStatement({
        token: new Token(TOKEN.LET, 'let'),
        value: new NumberLiteral({
          token: new Token(TOKEN.NUMBER, '5'),
          value: 5,
        }),
        name: new Identifier({
          token: new Token(TOKEN.IDENT, 'test'),
          value: 'test',
        }),
        type: new TypeIdentifier({
          token: new Token(TOKEN.TYPE_NUMBER, 'number'),
        }),
      }),
    ]);

    expect(`let test: number = 5;`).toBe(p.string());
  });

  test('let test: bool = true;', () => {
    const p = new Program([
      new LetStatement({
        token: new Token(TOKEN.LET, 'let'),
        value: new BooleanLiteral({
          token: new Token(TOKEN.TRUE, 'true'),
          value: true,
        }),
        name: new Identifier({
          token: new Token(TOKEN.IDENT, 'test'),
          value: 'test',
        }),
        type: new TypeIdentifier({
          token: new Token(TOKEN.TYPE_BOOLEAN, 'bool'),
        }),
      }),
    ]);

    expect(`let test: bool = true;`).toBe(p.string());
  });

  test('1 + 1', () => {
    const p = new Program([
      new ExpressionStatement({
        token: new Token(TOKEN.NUMBER, '1'),
        expression: new InfixExpression({
          token: new Token(TOKEN.PLUS, '+'),
          right: new NumberLiteral({
            token: new Token(TOKEN.NUMBER, '1'),
            value: 1,
          }),
          operator: '+',
          left: new NumberLiteral({
            token: new Token(TOKEN.NUMBER, '1'),
            value: 1,
          }),
        }),
      }),
    ]);

    expect(`1 + 1`).toBe(p.string());
  });

  test('let x: number = 1 + 1', () => {
    const p = new Program([
      new LetStatement({
        token: new Token(TOKEN.LET, 'let'),
        value: new InfixExpression({
          token: new Token(TOKEN.PLUS, '+'),
          right: new NumberLiteral({
            token: new Token(TOKEN.NUMBER, '1'),
            value: 1,
          }),
          operator: '+',
          left: new NumberLiteral({
            token: new Token(TOKEN.NUMBER, '1'),
            value: 1,
          }),
        }),
        name: new Identifier({
          token: new Token(TOKEN.IDENT, 'x'),
          value: 'x',
        }),
        type: new TypeIdentifier({
          token: new Token(TOKEN.TYPE_NUMBER, 'number'),
        }),
      }),
    ]);

    expect(`let x: number = 1 + 1;`).toBe(p.string());
  });

  test('if statement', () => {
    const expected = `
if (true) {
  let x: number = 1 + 1;
  return 10;
  if (false) {
    let x: number = 1 + 1;
    return 10;
  }
} else {
  return 10;
}
`;

    const p = new Program([
      new IfStatement({
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
              value: new InfixExpression({
                token: new Token(TOKEN.PLUS, '+'),
                right: new NumberLiteral({
                  token: new Token(TOKEN.NUMBER, '1'),
                  value: 1,
                }),
                operator: '+',
                left: new NumberLiteral({
                  token: new Token(TOKEN.NUMBER, '1'),
                  value: 1,
                }),
              }),
              name: new Identifier({
                token: new Token(TOKEN.IDENT, 'x'),
                value: 'x',
              }),
              type: new TypeIdentifier({
                token: new Token(TOKEN.TYPE_NUMBER, 'number'),
              }),
            }),
            new ReturnStatement({
              token: new Token(TOKEN.RETURN, 'return'),
              valueExpression: new NumberLiteral({
                token: new Token(TOKEN.NUMBER, '10'),
                value: 10,
              }),
            }),
            new IfStatement({
              token: new Token(TOKEN.IF, 'if'),
              condition: new BooleanLiteral({
                token: new Token(TOKEN.FALSE, 'false'),
                value: false,
              }),
              alternative: undefined,
              consequence: new BlockStatement({
                token: new Token(TOKEN.LBRACE, '{'),
                statements: [
                  new LetStatement({
                    token: new Token(TOKEN.LET, 'let'),
                    value: new InfixExpression({
                      token: new Token(TOKEN.PLUS, '+'),
                      right: new NumberLiteral({
                        token: new Token(TOKEN.NUMBER, '1'),
                        value: 1,
                      }),
                      operator: '+',
                      left: new NumberLiteral({
                        token: new Token(TOKEN.NUMBER, '1'),
                        value: 1,
                      }),
                    }),
                    name: new Identifier({
                      token: new Token(TOKEN.IDENT, 'x'),
                      value: 'x',
                    }),
                    type: new TypeIdentifier({
                      token: new Token(TOKEN.TYPE_NUMBER, 'number'),
                    }),
                  }),
                  new ReturnStatement({
                    token: new Token(TOKEN.RETURN, 'return'),
                    valueExpression: new NumberLiteral({
                      token: new Token(TOKEN.NUMBER, '10'),
                      value: 10,
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
        alternative: new BlockStatement({
          token: new Token(TOKEN.LBRACE, '{'),
          statements: [
            new ReturnStatement({
              token: new Token(TOKEN.RETURN, 'return'),
              valueExpression: new NumberLiteral({
                token: new Token(TOKEN.NUMBER, '10'),
                value: 10,
              }),
            }),
          ],
        }),
      }),
    ]);

    expect(expected.trim()).toBe(p.string());
  });

  test('while statement', () => {
    const expected = `
while (1 > 10) {
  let x: number = 10;
  return 10;
}
`;

    const p = new Program([
      new WhileStatement({
        token: new Token(TOKEN.WHILE, 'while'),
        condition: new InfixExpression({
          token: new Token(TOKEN.NUMBER, '1'),
          left: new NumberLiteral({
            token: new Token(TOKEN.NUMBER, '1'),
            value: 1,
          }),
          operator: '>',
          right: new NumberLiteral({
            token: new Token(TOKEN.NUMBER, '10'),
            value: 10,
          }),
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
            new ReturnStatement({
              token: new Token(TOKEN.RETURN, 'return'),
              valueExpression: new NumberLiteral({
                token: new Token(TOKEN.NUMBER, '10'),
                value: 10,
              }),
            }),
          ],
        }),
      }),
    ]);

    expect(expected.trim()).toBe(p.string());
  });

  test('prefix expression', () => {
    const expected = `let x: bool = !true;`;

    const p = new Program([
      new LetStatement({
        token: new Token(TOKEN.BANG, '!'),
        value: new PrefixExpression({
          token: new Token(TOKEN.BANG, '!'),
          operator: '!',
          right: new BooleanLiteral({
            token: new Token(TOKEN.TRUE, 'true'),
            value: true,
          }),
        }),
        name: new Identifier({
          token: new Token(TOKEN.IDENT, 'x'),
          value: 'x',
        }),
        type: new TypeIdentifier({
          token: new Token(TOKEN.TYPE_BOOLEAN, 'bool'),
        }),
      }),
    ]);

    expect(expected.trim()).toBe(p.string());
  });

  test('function statement', () => {
    const expected = `
func something(a, b) {
  return a + b;
}
`;

    const p = new Program([
      new FunctionStatement({
        token: new Token(TOKEN.FUNCTION, 'func'),
        name: new Identifier({
          token: new Token(TOKEN.IDENT, 'something'),
          value: 'something',
        }),
        body: new BlockStatement({
          token: new Token(TOKEN.LBRACE, '{'),
          statements: [
            new ReturnStatement({
              token: new Token(TOKEN.RETURN, 'return'),
              valueExpression: new InfixExpression({
                token: new Token(TOKEN.NUMBER, '+'),
                left: new Identifier({
                  token: new Token(TOKEN.IDENT, 'a'),
                  value: 'a',
                }),
                operator: '+',
                right: new Identifier({
                  token: new Token(TOKEN.IDENT, 'b'),
                  value: 'b',
                }),
              }),
            }),
          ],
        }),
        parameters: [
          new Identifier({
            token: new Token(TOKEN.IDENT, 'a'),
            value: 'a',
          }),
          new Identifier({
            token: new Token(TOKEN.IDENT, 'b'),
            value: 'b',
          }),
        ],
      }),
    ]);

    expect(expected.trim()).toBe(p.string());
  });

  test('call expression', () => {
    const expected = `something(a, b);`;

    const p = new Program([
      new ExpressionStatement({
        token: new Token(TOKEN.IDENT, 'something'),
        expression: new CallExpression({
          token: new Token(TOKEN.IDENT, 'something'),
          name: new Identifier({
            token: new Token(TOKEN.IDENT, 'something'),
            value: 'something',
          }),
          args: [
            new Identifier({
              token: new Token(TOKEN.IDENT, 'a'),
              value: 'a',
            }),
            new Identifier({
              token: new Token(TOKEN.IDENT, 'b'),
              value: 'b',
            }),
          ],
        }),
      }),
    ]);

    expect(expected.trim()).toBe(p.string());
  });
});

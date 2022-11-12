import { PositionContext } from '@/contexts';
import { TOKEN } from '@/token';

import { Lexer } from '.';

type Test = {
  expectedType: TOKEN;
  expectedLiteral: string;
  ctx: PositionContext;
};

const testLexer = (input: string, tests: Test[]) => {
  const l = new Lexer(input.trim());

  tests.forEach((test) => {
    const token = l.NextToken();

    expect(test.expectedType).toBe(token.type);
    expect(test.expectedLiteral).toBe(token.ch);
    expect(test.ctx.line).toBe(token.ctx.line);
  });
};

describe('Lexer', () => {
  test('number', () => {
    const input = `let value: number = 0;`;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'value', ctx: { line: 1 } },
      { expectedType: TOKEN.COLON, expectedLiteral: ':', ctx: { line: 1 } },
      {
        expectedType: TOKEN.TYPE_NUMBER,
        expectedLiteral: 'number',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '0', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('ident', () => {
    const tests = [
      {
        input: 'test0',
        expected: [
          {
            expectedType: TOKEN.IDENT,
            expectedLiteral: 'test0',
            ctx: { line: 1 },
          },
          { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
        ],
      },
      {
        input: 'test_0',
        expected: [
          {
            expectedType: TOKEN.IDENT,
            expectedLiteral: 'test_0',
            ctx: { line: 1 },
          },
          { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
        ],
      },
      {
        input: '_test0',
        expected: [
          {
            expectedType: TOKEN.ILLEGAL,
            expectedLiteral: '',
            ctx: { line: 1 },
          },
          {
            expectedType: TOKEN.IDENT,
            expectedLiteral: 'test0',
            ctx: { line: 1 },
          },
          { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
        ],
      },
      {
        input: '0test',
        expected: [
          {
            expectedType: TOKEN.NUMBER,
            expectedLiteral: '0',
            ctx: { line: 1 },
          },
          {
            expectedType: TOKEN.IDENT,
            expectedLiteral: 'test',
            ctx: { line: 1 },
          },
          { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
        ],
      },
    ];

    tests.forEach((test) => {
      testLexer(test.input, test.expected);
    });
  });

  test('bool', () => {
    const input = `
      let flag: bool = true;
      let flag: bool = false;
    `;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'flag', ctx: { line: 1 } },
      { expectedType: TOKEN.COLON, expectedLiteral: ':', ctx: { line: 1 } },
      {
        expectedType: TOKEN.TYPE_BOOLEAN,
        expectedLiteral: 'bool',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 1 } },
      { expectedType: TOKEN.TRUE, expectedLiteral: 'true', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.LET, expectedLiteral: 'let', ctx: { line: 2 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'flag', ctx: { line: 2 } },
      { expectedType: TOKEN.COLON, expectedLiteral: ':', ctx: { line: 2 } },
      {
        expectedType: TOKEN.TYPE_BOOLEAN,
        expectedLiteral: 'bool',
        ctx: { line: 2 },
      },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 2 } },
      { expectedType: TOKEN.FALSE, expectedLiteral: 'false', ctx: { line: 2 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 2 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 2 } },
    ];

    testLexer(input, tests);
  });

  test('演算子', () => {
    const input = `
      1 + 1 - 1 * 1 / 1
    `;

    const tests: Test[] = [
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },
      { expectedType: TOKEN.PLUS, expectedLiteral: '+', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },
      { expectedType: TOKEN.MINUS, expectedLiteral: '-', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },
      { expectedType: TOKEN.ASTERISK, expectedLiteral: '*', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },
      { expectedType: TOKEN.SLASH, expectedLiteral: '/', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('if', () => {
    const input = `if () {} else {}`;

    const tests: Test[] = [
      { expectedType: TOKEN.IF, expectedLiteral: 'if', ctx: { line: 1 } },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },

      { expectedType: TOKEN.LBRACE, expectedLiteral: '{', ctx: { line: 1 } },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}', ctx: { line: 1 } },

      { expectedType: TOKEN.ELSE, expectedLiteral: 'else', ctx: { line: 1 } },

      { expectedType: TOKEN.LBRACE, expectedLiteral: '{', ctx: { line: 1 } },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}', ctx: { line: 1 } },
      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('while', () => {
    const input = `while () {}`;

    const tests: Test[] = [
      { expectedType: TOKEN.WHILE, expectedLiteral: 'while', ctx: { line: 1 } },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },

      { expectedType: TOKEN.LBRACE, expectedLiteral: '{', ctx: { line: 1 } },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('> < >= <=', () => {
    const input = `> < >= <=`;

    const tests: Test[] = [
      { expectedType: TOKEN.GT, expectedLiteral: '>', ctx: { line: 1 } },
      { expectedType: TOKEN.LT, expectedLiteral: '<', ctx: { line: 1 } },
      { expectedType: TOKEN.GT_EQ, expectedLiteral: '>=', ctx: { line: 1 } },
      { expectedType: TOKEN.LT_EQ, expectedLiteral: '<=', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('関数', () => {
    const input = `
      func something() { return 1; }
      something();
    `;

    const tests: Test[] = [
      {
        expectedType: TOKEN.FUNCTION,
        expectedLiteral: 'func',
        ctx: { line: 1 },
      },
      {
        expectedType: TOKEN.IDENT,
        expectedLiteral: 'something',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },
      { expectedType: TOKEN.LBRACE, expectedLiteral: '{', ctx: { line: 1 } },

      {
        expectedType: TOKEN.RETURN,
        expectedLiteral: 'return',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.RBRACE, expectedLiteral: '}', ctx: { line: 1 } },

      {
        expectedType: TOKEN.IDENT,
        expectedLiteral: 'something',
        ctx: { line: 2 },
      },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 2 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 2 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 2 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 2 } },
    ];

    testLexer(input, tests);
  });

  test('= ! == !=', () => {
    const input = `= ! == !=`;

    const tests: Test[] = [
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 1 } },
      { expectedType: TOKEN.BANG, expectedLiteral: '!', ctx: { line: 1 } },
      { expectedType: TOKEN.EQ, expectedLiteral: '==', ctx: { line: 1 } },
      { expectedType: TOKEN.NOT_EQ, expectedLiteral: '!=', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('配列', () => {
    const input = `[1, 2]`;

    const tests: Test[] = [
      { expectedType: TOKEN.LBRACKET, expectedLiteral: '[', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1', ctx: { line: 1 } },
      { expectedType: TOKEN.COMMA, expectedLiteral: ',', ctx: { line: 1 } },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '2', ctx: { line: 1 } },
      { expectedType: TOKEN.RBRACKET, expectedLiteral: ']', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('string', () => {
    const input = `let value: string = "test";`;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'value', ctx: { line: 1 } },
      { expectedType: TOKEN.COLON, expectedLiteral: ':', ctx: { line: 1 } },
      {
        expectedType: TOKEN.TYPE_STRING,
        expectedLiteral: 'string',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 1 } },
      { expectedType: TOKEN.STRING, expectedLiteral: 'test', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('文字列', () => {
    const input = `"test1""test2""";`;

    const tests: Test[] = [
      {
        expectedType: TOKEN.STRING,
        expectedLiteral: 'test1',
        ctx: { line: 1 },
      },
      {
        expectedType: TOKEN.STRING,
        expectedLiteral: 'test2',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.STRING, expectedLiteral: '', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('関数', () => {
    const input = `something();`;

    const tests: Test[] = [
      {
        expectedType: TOKEN.IDENT,
        expectedLiteral: 'something',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('引数付き関数', () => {
    const input = `something(a, true, "string");`;

    const tests: Test[] = [
      {
        expectedType: TOKEN.IDENT,
        expectedLiteral: 'something',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'a', ctx: { line: 1 } },
      { expectedType: TOKEN.COMMA, expectedLiteral: ',', ctx: { line: 1 } },
      { expectedType: TOKEN.TRUE, expectedLiteral: 'true', ctx: { line: 1 } },
      { expectedType: TOKEN.COMMA, expectedLiteral: ',', ctx: { line: 1 } },
      {
        expectedType: TOKEN.STRING,
        expectedLiteral: 'string',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('関数宣言', () => {
    const input = `func something() { return true; }`;

    const tests: Test[] = [
      {
        expectedType: TOKEN.FUNCTION,
        expectedLiteral: 'func',
        ctx: { line: 1 },
      },
      {
        expectedType: TOKEN.IDENT,
        expectedLiteral: 'something',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },
      { expectedType: TOKEN.LBRACE, expectedLiteral: '{', ctx: { line: 1 } },
      {
        expectedType: TOKEN.RETURN,
        expectedLiteral: 'return',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.TRUE, expectedLiteral: 'true', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('引数付き関数宣言', () => {
    const input = `func something(a, b) { return a + b; }`;

    const tests: Test[] = [
      {
        expectedType: TOKEN.FUNCTION,
        expectedLiteral: 'func',
        ctx: { line: 1 },
      },
      {
        expectedType: TOKEN.IDENT,
        expectedLiteral: 'something',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'a', ctx: { line: 1 } },
      { expectedType: TOKEN.COMMA, expectedLiteral: ',', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'b', ctx: { line: 1 } },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')', ctx: { line: 1 } },
      { expectedType: TOKEN.LBRACE, expectedLiteral: '{', ctx: { line: 1 } },
      {
        expectedType: TOKEN.RETURN,
        expectedLiteral: 'return',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'a', ctx: { line: 1 } },
      { expectedType: TOKEN.PLUS, expectedLiteral: '+', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'b', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}', ctx: { line: 1 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 1 } },
    ];

    testLexer(input, tests);
  });

  test('改行', () => {
    const input = `
      let flag: bool = true;

      let flag: bool = false;
    `;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let', ctx: { line: 1 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'flag', ctx: { line: 1 } },
      { expectedType: TOKEN.COLON, expectedLiteral: ':', ctx: { line: 1 } },
      {
        expectedType: TOKEN.TYPE_BOOLEAN,
        expectedLiteral: 'bool',
        ctx: { line: 1 },
      },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 1 } },
      { expectedType: TOKEN.TRUE, expectedLiteral: 'true', ctx: { line: 1 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 1 } },

      { expectedType: TOKEN.LET, expectedLiteral: 'let', ctx: { line: 3 } },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'flag', ctx: { line: 3 } },
      { expectedType: TOKEN.COLON, expectedLiteral: ':', ctx: { line: 3 } },
      {
        expectedType: TOKEN.TYPE_BOOLEAN,
        expectedLiteral: 'bool',
        ctx: { line: 3 },
      },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=', ctx: { line: 3 } },
      { expectedType: TOKEN.FALSE, expectedLiteral: 'false', ctx: { line: 3 } },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';', ctx: { line: 3 } },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF', ctx: { line: 3 } },
    ];

    testLexer(input, tests);
  });
});

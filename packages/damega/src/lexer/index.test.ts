import { TOKEN } from '@/token';

import { Lexer } from '.';

type Test = {
  expectedType: TOKEN;
  expectedLiteral: string;
};

const testLexer = (input: string, tests: Test[]) => {
  const l = new Lexer(input);

  tests.forEach((test) => {
    const token = l.NextToken();

    expect(test.expectedType).toBe(token.type);
    expect(test.expectedLiteral).toBe(token.ch);
  });
};

describe('Lexer', () => {
  test('number', () => {
    const input = `let value: number = 0;`;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let' },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'value' },
      { expectedType: TOKEN.COLON, expectedLiteral: ':' },
      { expectedType: TOKEN.TYPE_NUMBER, expectedLiteral: 'number' },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '0' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('bool', () => {
    const input = `
      let flag: bool = true;
      let flag: bool = false;
    `;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let' },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'flag' },
      { expectedType: TOKEN.COLON, expectedLiteral: ':' },
      { expectedType: TOKEN.TYPE_BOOLEAN, expectedLiteral: 'bool' },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=' },
      { expectedType: TOKEN.TRUE, expectedLiteral: 'true' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.LET, expectedLiteral: 'let' },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'flag' },
      { expectedType: TOKEN.COLON, expectedLiteral: ':' },
      { expectedType: TOKEN.TYPE_BOOLEAN, expectedLiteral: 'bool' },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=' },
      { expectedType: TOKEN.FALSE, expectedLiteral: 'false' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('演算子', () => {
    const input = `
      1 + 1 - 1 * 1 / 1
    `;

    const tests: Test[] = [
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },
      { expectedType: TOKEN.PLUS, expectedLiteral: '+' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },
      { expectedType: TOKEN.MINUS, expectedLiteral: '-' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },
      { expectedType: TOKEN.ASTERISK, expectedLiteral: '*' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },
      { expectedType: TOKEN.SLASH, expectedLiteral: '/' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('if', () => {
    const input = `if () {} else {}`;

    const tests: Test[] = [
      { expectedType: TOKEN.IF, expectedLiteral: 'if' },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(' },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')' },

      { expectedType: TOKEN.LBRACE, expectedLiteral: '{' },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}' },

      { expectedType: TOKEN.ELSE, expectedLiteral: 'else' },

      { expectedType: TOKEN.LBRACE, expectedLiteral: '{' },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}' },
      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('while', () => {
    const input = `while () {}`;

    const tests: Test[] = [
      { expectedType: TOKEN.WHILE, expectedLiteral: 'while' },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(' },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')' },

      { expectedType: TOKEN.LBRACE, expectedLiteral: '{' },
      { expectedType: TOKEN.RBRACE, expectedLiteral: '}' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('> < >= <=', () => {
    const input = `> < >= <=`;

    const tests: Test[] = [
      { expectedType: TOKEN.GT, expectedLiteral: '>' },
      { expectedType: TOKEN.LT, expectedLiteral: '<' },
      { expectedType: TOKEN.GT_EQ, expectedLiteral: '>=' },
      { expectedType: TOKEN.LT_EQ, expectedLiteral: '<=' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('関数', () => {
    const input = `
      func something() { return 1; }
      something();
    `;

    const tests: Test[] = [
      { expectedType: TOKEN.FUNCTION, expectedLiteral: 'func' },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'something' },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(' },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')' },
      { expectedType: TOKEN.LBRACE, expectedLiteral: '{' },

      { expectedType: TOKEN.RETURN, expectedLiteral: 'return' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.RBRACE, expectedLiteral: '}' },

      { expectedType: TOKEN.IDENT, expectedLiteral: 'something' },
      { expectedType: TOKEN.LPAREN, expectedLiteral: '(' },
      { expectedType: TOKEN.RPAREN, expectedLiteral: ')' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('= ! == !=', () => {
    const input = `= ! == !=`;

    const tests: Test[] = [
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=' },
      { expectedType: TOKEN.BANG, expectedLiteral: '!' },
      { expectedType: TOKEN.EQ, expectedLiteral: '==' },
      { expectedType: TOKEN.NOT_EQ, expectedLiteral: '!=' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('配列', () => {
    const input = `[1, 2]`;

    const tests: Test[] = [
      { expectedType: TOKEN.LBRACKET, expectedLiteral: '[' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '1' },
      { expectedType: TOKEN.COMMA, expectedLiteral: ',' },
      { expectedType: TOKEN.NUMBER, expectedLiteral: '2' },
      { expectedType: TOKEN.RBRACKET, expectedLiteral: ']' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('string', () => {
    const input = `let value: string = "test";`;

    const tests: Test[] = [
      { expectedType: TOKEN.LET, expectedLiteral: 'let' },
      { expectedType: TOKEN.IDENT, expectedLiteral: 'value' },
      { expectedType: TOKEN.COLON, expectedLiteral: ':' },
      { expectedType: TOKEN.TYPE_STRING, expectedLiteral: 'string' },
      { expectedType: TOKEN.ASSIGN, expectedLiteral: '=' },
      { expectedType: TOKEN.STRING, expectedLiteral: 'test' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('文字列', () => {
    const input = `"test1""test2""";`;

    const tests: Test[] = [
      { expectedType: TOKEN.STRING, expectedLiteral: 'test1' },
      { expectedType: TOKEN.STRING, expectedLiteral: 'test2' },
      { expectedType: TOKEN.STRING, expectedLiteral: '' },
      { expectedType: TOKEN.SEMICOLON, expectedLiteral: ';' },

      { expectedType: TOKEN.EOF, expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });
});

import { TokenType } from '../token';
import { Lexer } from '.';

type Test = {
  expectedType: TokenType;
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
      { expectedType: 'LET', expectedLiteral: 'let' },
      { expectedType: 'IDENT', expectedLiteral: 'value' },
      { expectedType: 'COLON', expectedLiteral: ':' },
      { expectedType: 'TYPE_NUMBER', expectedLiteral: 'number' },
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'NUMBER', expectedLiteral: '0' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('bool', () => {
    const input = `
      let flag: bool = true;
      let flag: bool = false;
    `;

    const tests: Test[] = [
      { expectedType: 'LET', expectedLiteral: 'let' },
      { expectedType: 'IDENT', expectedLiteral: 'flag' },
      { expectedType: 'COLON', expectedLiteral: ':' },
      { expectedType: 'TYPE_BOOLEAN', expectedLiteral: 'bool' },
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'TRUE', expectedLiteral: 'true' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'LET', expectedLiteral: 'let' },
      { expectedType: 'IDENT', expectedLiteral: 'flag' },
      { expectedType: 'COLON', expectedLiteral: ':' },
      { expectedType: 'TYPE_BOOLEAN', expectedLiteral: 'bool' },
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'FALSE', expectedLiteral: 'false' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('演算子', () => {
    const input = `
      1 + 1 - 1 * 1 / 1
    `;

    const tests: Test[] = [
      { expectedType: 'NUMBER', expectedLiteral: '1' },
      { expectedType: 'PLUS', expectedLiteral: '+' },
      { expectedType: 'NUMBER', expectedLiteral: '1' },
      { expectedType: 'MINUS', expectedLiteral: '-' },
      { expectedType: 'NUMBER', expectedLiteral: '1' },
      { expectedType: 'ASTERISK', expectedLiteral: '*' },
      { expectedType: 'NUMBER', expectedLiteral: '1' },
      { expectedType: 'SLASH', expectedLiteral: '/' },
      { expectedType: 'NUMBER', expectedLiteral: '1' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('if', () => {
    const input = `if () {} else {}`;

    const tests: Test[] = [
      { expectedType: 'IF', expectedLiteral: 'if' },
      { expectedType: 'LPAREN', expectedLiteral: '(' },
      { expectedType: 'RPAREN', expectedLiteral: ')' },

      { expectedType: 'LBRACE', expectedLiteral: '{' },
      { expectedType: 'RBRACE', expectedLiteral: '}' },

      { expectedType: 'ELSE', expectedLiteral: 'else' },

      { expectedType: 'LBRACE', expectedLiteral: '{' },
      { expectedType: 'RBRACE', expectedLiteral: '}' },
      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('while', () => {
    const input = `while () {}`;

    const tests: Test[] = [
      { expectedType: 'WHILE', expectedLiteral: 'while' },
      { expectedType: 'LPAREN', expectedLiteral: '(' },
      { expectedType: 'RPAREN', expectedLiteral: ')' },

      { expectedType: 'LBRACE', expectedLiteral: '{' },
      { expectedType: 'RBRACE', expectedLiteral: '}' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('> < >= <=', () => {
    const input = `> < >= <=`;

    const tests: Test[] = [
      { expectedType: 'GT', expectedLiteral: '>' },
      { expectedType: 'LT', expectedLiteral: '<' },
      { expectedType: 'GT_EQ', expectedLiteral: '>=' },
      { expectedType: 'LT_EQ', expectedLiteral: '<=' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('関数', () => {
    const input = `
      func something() { return 1; }
      something();
    `;

    const tests: Test[] = [
      { expectedType: 'FUNCTION', expectedLiteral: 'func' },
      { expectedType: 'IDENT', expectedLiteral: 'something' },
      { expectedType: 'LPAREN', expectedLiteral: '(' },
      { expectedType: 'RPAREN', expectedLiteral: ')' },
      { expectedType: 'LBRACE', expectedLiteral: '{' },

      { expectedType: 'RETURN', expectedLiteral: 'return' },
      { expectedType: 'NUMBER', expectedLiteral: '1' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'RBRACE', expectedLiteral: '}' },

      { expectedType: 'IDENT', expectedLiteral: 'something' },
      { expectedType: 'LPAREN', expectedLiteral: '(' },
      { expectedType: 'RPAREN', expectedLiteral: ')' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('= ! == !=', () => {
    const input = `= ! == !=`;

    const tests: Test[] = [
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'BANG', expectedLiteral: '!' },
      { expectedType: 'EQ', expectedLiteral: '==' },
      { expectedType: 'NOT_EQ', expectedLiteral: '!=' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('配列', () => {
    const input = `[1, 2]`;

    const tests: Test[] = [
      { expectedType: 'LBRACKET', expectedLiteral: '[' },
      { expectedType: 'NUMBER', expectedLiteral: '1' },
      { expectedType: 'COMMA', expectedLiteral: ',' },
      { expectedType: 'NUMBER', expectedLiteral: '2' },
      { expectedType: 'RBRACKET', expectedLiteral: ']' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('string', () => {
    const input = `let value: string = "test";`;

    const tests: Test[] = [
      { expectedType: 'LET', expectedLiteral: 'let' },
      { expectedType: 'IDENT', expectedLiteral: 'value' },
      { expectedType: 'COLON', expectedLiteral: ':' },
      { expectedType: 'TYPE_STRING', expectedLiteral: 'string' },
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'STRING', expectedLiteral: 'test' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('文字列', () => {
    const input = `"test1""test2""";`;

    const tests: Test[] = [
      { expectedType: 'STRING', expectedLiteral: 'test1' },
      { expectedType: 'STRING', expectedLiteral: 'test2' },
      { expectedType: 'STRING', expectedLiteral: '' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });
});

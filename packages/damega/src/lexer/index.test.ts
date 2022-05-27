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
  test('Number', () => {
    const input = `Number value = 0;`;

    const tests: Test[] = [
      { expectedType: 'VAR_NUMBER', expectedLiteral: 'Number' },
      { expectedType: 'IDENT', expectedLiteral: 'value' },
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'NUMBER', expectedLiteral: '0' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'EOF', expectedLiteral: 'EOF' },
    ];

    testLexer(input, tests);
  });

  test('Bool', () => {
    const input = `
      Bool flag = true;
      Bool flag = false;
    `;

    const tests: Test[] = [
      { expectedType: 'VAR_BOOLEAN', expectedLiteral: 'Bool' },
      { expectedType: 'IDENT', expectedLiteral: 'flag' },
      { expectedType: 'ASSIGN', expectedLiteral: '=' },
      { expectedType: 'TRUE', expectedLiteral: 'true' },
      { expectedType: 'SEMICOLON', expectedLiteral: ';' },

      { expectedType: 'VAR_BOOLEAN', expectedLiteral: 'Bool' },
      { expectedType: 'IDENT', expectedLiteral: 'flag' },
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
      func something() {}
      something();
    `;

    const tests: Test[] = [
      { expectedType: 'FUNCTION', expectedLiteral: 'func' },
      { expectedType: 'IDENT', expectedLiteral: 'something' },
      { expectedType: 'LPAREN', expectedLiteral: '(' },
      { expectedType: 'RPAREN', expectedLiteral: ')' },
      { expectedType: 'LBRACE', expectedLiteral: '{' },
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
});

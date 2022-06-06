import {
  BooleanLiteral,
  Expression,
  ExpressionStatement,
  IfStatement,
  InfixExpression,
  LetStatement,
  NumberLiteral,
  Program,
  Statement,
  StringLiteral,
  WhileStatement,
} from '../ast';
import { Lexer } from '../lexer';
import { Token, token } from '../token';
import { Parser } from '.';

describe('Parser', () => {
  test('let string', () => {
    const tests = [
      {
        input: `let test: string = "test";`,
        expectedIdentifier: 'test',
        expectedValue: 'test',
      },
      {
        input: `let test: string = "";`,
        expectedIdentifier: 'test',
        expectedValue: '',
      },
    ];

    tests.forEach((test) => {
      const program = testParse(test.input);

      const stmt = program.statements[0];

      expect(stmt instanceof LetStatement).toBeTruthy();
      expect(program.string()).toBe(test.input);

      if (!(stmt instanceof LetStatement)) {
        throw new Error(`stmt is not StringStatement.`);
      }

      expect(stmt.name.value).toBe(test.expectedIdentifier);
      expect(stmt.type.token.type).toBe(token.TYPE_STRING);
      testStringLiteral(test.expectedValue, stmt.value);
    });
  });

  test('let number', () => {
    const tests = [
      {
        input: `let test: number = 1;`,
        expectedIdentifier: 'test',
        expectedValue: 1,
      },
      {
        input: `let test: number = 100;`,
        expectedIdentifier: 'test',
        expectedValue: 100,
      },
    ];

    tests.forEach((test) => {
      const program = testParse(test.input);

      const stmt = program.statements[0];

      expect(stmt instanceof LetStatement).toBeTruthy();
      expect(program.string()).toBe(test.input);

      if (!(stmt instanceof LetStatement)) {
        throw new Error(`stmt is not NumberStatement.`);
      }

      expect(stmt.name.value).toBe(test.expectedIdentifier);
      testNumberLiteral(test.expectedValue, stmt.value);
    });
  });

  test('let bool', () => {
    const tests = [
      {
        input: `let test: bool = true;`,
        expectedIdentifier: 'test',
        expectedValue: true,
      },
      {
        input: `let test: bool = false;`,
        expectedIdentifier: 'test',
        expectedValue: false,
      },
    ];

    tests.forEach((test) => {
      const program = testParse(test.input);

      const stmt = program.statements[0];

      expect(stmt instanceof LetStatement).toBeTruthy();
      expect(program.string()).toBe(test.input);

      if (!(stmt instanceof LetStatement)) {
        throw new Error(`stmt is not BooleanStatement.`);
      }

      expect(stmt.name.value).toBe(test.expectedIdentifier);
      testBooleanLiteral(test.expectedValue, stmt.value);
    });
  });

  test('infix expression', () => {
    const tests = [
      {
        input: `let x: number = 1 + 1;`,
        expectedLeftValue: 1,
        expectedOperator: '+',
        expectedRightValue: 1,
      },
      {
        input: `let x: number = 1 - 1;`,
        expectedLeftValue: 1,
        expectedOperator: '-',
        expectedRightValue: 1,
      },
      {
        input: `let x: number = 1 * 1;`,
        expectedLeftValue: 1,
        expectedOperator: '*',
        expectedRightValue: 1,
      },
      {
        input: `let x: number = 1 / 1;`,
        expectedLeftValue: 1,
        expectedOperator: '/',
        expectedRightValue: 1,
      },
      {
        input: `let x: string = "test" + "test";`,
        expectedLeftValue: 'test',
        expectedOperator: '+',
        expectedRightValue: 'test',
      },
      {
        input: `let x: bool = true + false;`,
        expectedLeftValue: true,
        expectedOperator: '+',
        expectedRightValue: false,
      },
    ];

    tests.forEach((test) => {
      const program = testParse(test.input);

      const stmt = program.statements[0];
      if (!(stmt instanceof LetStatement)) {
        throw new Error(`stmt is not LetStatement.`);
      }

      const exp = stmt.value;
      if (!(exp instanceof InfixExpression)) {
        throw new Error(`exp is not InfixExpression.`);
      }

      testInfixExpression(
        exp,
        test.expectedLeftValue,
        test.expectedOperator,
        test.expectedRightValue
      );
    });
  });

  test('infix precedence', () => {
    const tests = [
      {
        input: `1 + 1;`,
        expected: `(1 + 1)`,
      },
      {
        input: `1 - 1;`,
        expected: `(1 - 1)`,
      },
      {
        input: `1 + 1 + 1;`,
        expected: `((1 + 1) + 1)`,
      },
      {
        input: `1 * 1 + 1;`,
        expected: `((1 * 1) + 1)`,
      },
      {
        input: `1 + 1 * 2;`,
        expected: `(1 + (1 * 2))`,
      },
      {
        input: `1 * 1 * 2;`,
        expected: `((1 * 1) * 2)`,
      },
      {
        input: `1 * 1 + 2 * 2;`,
        expected: `((1 * 1) + (2 * 2))`,
      },
      {
        input: `1 * 1 + 2 * 2 / 2;`,
        expected: `((1 * 1) + ((2 * 2) / 2))`,
      },
    ];

    tests.forEach((test) => {
      const program = testParse(test.input);

      const stmt = program.statements[0];
      if (!(stmt instanceof ExpressionStatement)) {
        throw new Error(`stmt is not LetStatement.`);
      }

      const exp = stmt.expression;
      if (!(exp instanceof InfixExpression)) {
        throw new Error(`exp is not InfixExpression.`);
      }

      expect(exp.inspect()).toBe(test.expected);
    });
  });

  test('while statement', () => {
    const input = `
while (true) {
  let x: number = 1;
  let x: number = 1;
}
`;

    const program = testParse(input);

    const stmt = program.statements[0];
    if (!(stmt instanceof WhileStatement)) {
      throw new Error(`stmt is not WhileStatement.`);
    }

    const exp = stmt.condition;
    if (!(exp instanceof Expression)) {
      throw new Error(`exp is not condition.`);
    }

    testLiteral(exp, true);

    const blockStmt = stmt.consequence;
    blockStmt.statements.forEach((letStmt) => {
      if (!(letStmt instanceof LetStatement)) {
        throw new Error(`letStmt is not LetStatement.`);
      }

      testLetStatement({
        statement: letStmt,
        expectedType: 'number',
        expectedValue: 1,
        expectedIdentifier: 'x',
      });
    });
  });

  test('if statement', () => {
    const input = `
if (true) {
  let x: number = 1;
  let x: number = 1;
} else {
  let x: number = 1;
  let x: number = 1;
}
`;

    const program = testParse(input);

    const stmt = program.statements[0];
    if (!(stmt instanceof IfStatement)) {
      throw new Error(`stmt is not IfStatement.`);
    }

    const exp = stmt.condition;
    if (!(exp instanceof Expression)) {
      throw new Error(`exp is not condition.`);
    }

    testLiteral(exp, true);

    stmt.consequence.statements.forEach((letStmt) => {
      if (!(letStmt instanceof LetStatement)) {
        throw new Error(`letStmt is not LetStatement.`);
      }

      testLetStatement({
        statement: letStmt,
        expectedType: 'number',
        expectedValue: 1,
        expectedIdentifier: 'x',
      });
    });

    stmt.alternative?.statements.forEach((letStmt) => {
      if (!(letStmt instanceof LetStatement)) {
        throw new Error(`letStmt is not LetStatement.`);
      }

      testLetStatement({
        statement: letStmt,
        expectedType: 'number',
        expectedValue: 1,
        expectedIdentifier: 'x',
      });
    });
  });

  test('if statement (non else)', () => {
    const input = `
if (true) {
  let x: number = 1;
  let x: number = 1;
}`;

    const program = testParse(input);

    const stmt = program.statements[0];
    if (!(stmt instanceof IfStatement)) {
      throw new Error(`stmt is not IfStatement.`);
    }

    const exp = stmt.condition;
    if (!(exp instanceof Expression)) {
      throw new Error(`exp is not condition.`);
    }

    testLiteral(exp, true);

    stmt.consequence.statements.forEach((letStmt) => {
      if (!(letStmt instanceof LetStatement)) {
        throw new Error(`letStmt is not LetStatement.`);
      }

      testLetStatement({
        statement: letStmt,
        expectedType: 'number',
        expectedValue: 1,
        expectedIdentifier: 'x',
      });
    });
  });
});

function testParse(input: string): Program {
  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseToken();
  if (p.errors.length > 0) {
    throw new Error(JSON.stringify(p.errors));
  }
  return program;
}

function testStringLiteral(expected: string, literal: Expression) {
  if (!(literal instanceof StringLiteral)) {
    throw new Error(`literal is not StringLiteral.`);
  }

  expect(literal.value).toBe(expected);
}

function testNumberLiteral(expected: number, literal: Expression) {
  if (!(literal instanceof NumberLiteral)) {
    throw new Error(`literal is not NumberLiteral.`);
  }

  expect(literal.value).toBe(expected);
}

function testBooleanLiteral(expected: boolean, literal: Expression) {
  if (!(literal instanceof BooleanLiteral)) {
    throw new Error(`literal is not NumberLiteral.`);
  }

  expect(literal.value).toBe(expected);
}

function testLiteral<T>(exp: Expression, expected: T) {
  if (exp instanceof StringLiteral && typeof expected === 'string') {
    return testStringLiteral(expected, exp);
  }

  if (exp instanceof NumberLiteral && typeof expected === 'number') {
    return testNumberLiteral(expected, exp);
  }

  if (exp instanceof BooleanLiteral && typeof expected === 'boolean') {
    return testBooleanLiteral(expected, exp);
  }
}

type LetParameter = {
  statement: Statement;
  expectedIdentifier: string;
} & (
  | {
      expectedType: 'number';
      expectedValue: number;
    }
  | {
      expectedType: 'string';
      expectedValue: string;
    }
  | {
      expectedType: 'bool';
      expectedValue: boolean;
    }
);

function testLetStatement(args: LetParameter) {
  const { statement, expectedType, expectedIdentifier, expectedValue } = args;

  if (!(statement instanceof LetStatement)) {
    throw new Error(`statement is not LetStatement.`);
  }

  const t = statement.type.token;
  if (!(t instanceof Token)) {
    throw new Error(`statement is not LetStatement.`);
  }

  expect(expectedType).toBe(t.ch);

  const name = statement.name;
  expect(expectedIdentifier).toBe(name.string());

  testLiteral(statement.value, expectedValue);
}

function testInfixExpression<T>(
  exp: Expression,
  left: T,
  operator: string,
  right: T
) {
  if (!(exp instanceof InfixExpression)) {
    throw new Error(`exp is not InfixExpression.`);
  }

  testLiteral<T>(exp.left, left);
  expect(exp.operator).toBe(operator);
  testLiteral<T>(exp.right, right);
}

import { Lexer } from '../lexer';
import {
  BooleanObject,
  Environment,
  ErrorObject,
  NumberObject,
  Obj,
  OBJECT,
  StringObject,
} from '../object';
import { Parser } from '../parser';
import { Evaluator } from '.';

describe('Evaluator', () => {
  test('let statement', () => {
    const tests = [
      {
        input: `let x: number = 10; x;`,
        expected: new NumberObject({ value: 10 }),
      },
      {
        input: `let x: number = 10 + 10; x;`,
        expected: new NumberObject({ value: 20 }),
      },
      {
        input: `let x: number = 10 - 10; x;`,
        expected: new NumberObject({ value: 0 }),
      },
      {
        input: `let x: number = 10 * 10; x;`,
        expected: new NumberObject({ value: 100 }),
      },
      {
        input: `let x: number = 10 / 10; x;`,
        expected: new NumberObject({ value: 1 }),
      },
      {
        input: `let x: number = 10 == 10; x;`,
        expected: new ErrorObject({
          message: `type mismatch: got=${OBJECT.BOOL}, expected=${OBJECT.NUMBER}`,
        }),
      },
      {
        input: `let x: bool = 10 == 10; x;`,
        expected: new BooleanObject({ value: true }),
      },
      {
        input: `let x: bool = 10 != 10; x;`,
        expected: new BooleanObject({ value: false }),
      },
      {
        input: `let x: bool = true; x;`,
        expected: new BooleanObject({ value: true }),
      },
      {
        input: `let x: bool = false; x;`,
        expected: new BooleanObject({ value: false }),
      },
      {
        input: `let x: bool = true == true; x;`,
        expected: new BooleanObject({ value: true }),
      },
      {
        input: `let x: bool = false != false; x;`,
        expected: new BooleanObject({ value: false }),
      },
      {
        input: `let x: string = "test"; x;`,
        expected: new StringObject({ value: 'test' }),
      },
    ];

    tests.forEach((test) => {
      const evaluated = testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    });
  });

  test('assign statement', () => {
    const tests = [
      {
        input: `
          let x: number = 0;
          x = 10;
          x;
        `,
        expected: new NumberObject({ value: 10 }),
      },
      {
        input: `
          let x: number = 10;
          x = x + 10;
          x;
        `,
        expected: new NumberObject({ value: 20 }),
      },
      {
        input: `
          let x: number = 100;
          x = x / 10;
          x;
        `,
        expected: new NumberObject({ value: 10 }),
      },
      {
        input: `
          let x: number = 100;
          x = x * 10;
          x;
        `,
        expected: new NumberObject({ value: 1000 }),
      },
      {
        input: `
          let x: number = 100;
          x = x - 10;
          x;
        `,
        expected: new NumberObject({ value: 90 }),
      },
      {
        input: `
          let x: number = 100;
          x = x + (-10);
          x;
        `,
        expected: new NumberObject({ value: 90 }),
      },
      {
        input: `
          let x: number = 100;
          x = x * (-10);
          x;
        `,
        expected: new NumberObject({ value: -1000 }),
      },
      {
        input: `
          let x: number = 10;
          x = x * x * x;
          x;
        `,
        expected: new NumberObject({ value: 1000 }),
      },
      {
        input: `
          let x: bool = true;
          x = false;
          x;
        `,
        expected: new BooleanObject({ value: false }),
      },
      {
        input: `
          let x: bool = true;
          x = !x;
          x;
        `,
        expected: new BooleanObject({ value: false }),
      },
      {
        input: `
          let x: bool = true;
          !x;
        `,
        expected: new BooleanObject({ value: false }),
      },
      {
        input: `
          let x: bool = true;
          x = 1 != 1;
          x;
        `,
        expected: new BooleanObject({ value: false }),
      },
    ];

    tests.forEach((test) => {
      const evaluated = testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    });
  });

  test('if statement', () => {
    const tests = [
      {
        input: `
          let x: number = 0;
          if (true) {
            x = 10;
          }
          x;
        `,
        expected: new NumberObject({ value: 10 }),
      },
      {
        input: `
          let x: number = 0;
          if (!true) {
            x = 10;
          }
          x;
        `,
        expected: new NumberObject({ value: 0 }),
      },
      {
        input: `
          let x: number = 0;
          if (true) {
            x = 10;
            x = x + 10;
          }
          x;
        `,
        expected: new NumberObject({ value: 20 }),
      },
      {
        input: `
          let x: number = 0;
          let y: number = 1;
          let z: number = 0;
          if (y > x) {
            z = 10;
          } else {
            z = 20;
          }
          z;
        `,
        expected: new NumberObject({ value: 10 }),
      },
      {
        input: `
          let x: number = 0;
          let y: number = 1;
          let z: number = 0;
          if (y < x) {
            z = 10;
          } else {
            z = 20;
          }
          z;
        `,
        expected: new NumberObject({ value: 20 }),
      },
      {
        input: `
          let x: bool = true;

          if (1 == 1) {
            x = true;
          } else {
            x = false;
          }
          x;
        `,
        expected: new BooleanObject({ value: true }),
      },
      {
        input: `
          let x: bool = true;

          if (1 != 1) {
            x = true;
          } else {
            x = false;
          }
          x;
        `,
        expected: new BooleanObject({ value: false }),
      },
    ];

    tests.forEach((test) => {
      const evaluated = testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    });
  });

  test('while statement', () => {
    const tests = [
      {
        input: `
          let x: number = 0;

          while (x < 10) {
            x = x + 1;
          }

          x;
        `,
        expected: new NumberObject({ value: 10 }),
      },
      {
        input: `
          let x: number = 0;

          while (false) {
            x = x + 1;
          }

          x;
        `,
        expected: new NumberObject({ value: 0 }),
      },
    ];

    tests.forEach((test) => {
      const evaluated = testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    });
  });
});

function testEval(input: string): Obj {
  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseToken();
  if (p.errors.length > 0) {
    throw new Error(JSON.stringify(p.errors));
  }
  const env = new Environment();

  return new Evaluator().Eval(program, env);
}

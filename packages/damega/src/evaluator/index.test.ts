import { Lexer } from '@/lexer';
import {
  BooleanObject,
  Environment,
  ErrorObject,
  NumberObject,
  Obj,
  OBJECT,
  StringObject,
} from '@/object';
import { Parser } from '@/parser';

import { Evaluator } from '.';

const mockInputCallback = jest.fn();
const mockOutputCallback = jest.fn((args) => {
  console.log(args);
});

describe('Evaluator', () => {
  beforeEach(() => {
    mockInputCallback.mockClear();
    mockOutputCallback.mockClear();
  });

  test('let statement', async () => {
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

    for (const test of tests) {
      const evaluated = await testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    }
  });

  test('assign statement', async () => {
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

    for (const test of tests) {
      const evaluated = await testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    }
  });

  test('if statement', async () => {
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

    for (const test of tests) {
      const evaluated = await testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    }
  });

  test('infix expression', async () => {
    const tests = [
      {
        input: '1 + 1;',
        expected: new NumberObject({ value: 2 }),
      },
      {
        input: '2 - 1;',
        expected: new NumberObject({ value: 1 }),
      },
      {
        input: '2 * 1;',
        expected: new NumberObject({ value: 2 }),
      },
      {
        input: '2 / 2;',
        expected: new NumberObject({ value: 1 }),
      },
      {
        input: '2 == 2;',
        expected: new BooleanObject({ value: true }),
      },
      {
        input: '2 != 2;',
        expected: new BooleanObject({ value: false }),
      },
      {
        input: 'true == true;',
        expected: new BooleanObject({ value: true }),
      },
      {
        input: 'true != true;',
        expected: new BooleanObject({ value: false }),
      },
      {
        input: '"a" + "b";',
        expected: new StringObject({ value: 'ab' }),
      },
      {
        input: '"aa" > "ab";',
        expected: new BooleanObject({ value: false }),
      },
      {
        input: '"aa" < "ab";',
        expected: new BooleanObject({ value: true }),
      },
      {
        input: '"a" == "b";',
        expected: new BooleanObject({ value: false }),
      },
      {
        input: '"a" != "b";',
        expected: new BooleanObject({ value: true }),
      },
    ];

    for (const test of tests) {
      const evaluated = await testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    }
  });

  test('while statement', async () => {
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

          while(false) {
            x = 10;
          }

          x;
        `,
        expected: new NumberObject({ value: 0 }),
      },
    ];

    for (const test of tests) {
      const evaluated = await testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    }
  });

  test('call expression', async () => {
    const tests = [
      {
        input: `
          func something(a, b) {
            return a + b;
          }

          something(10, 20);
        `,
        expected: new NumberObject({ value: 30 }),
      },
      {
        input: `
          func something(a, b) {
            return a + b;
          }

          something(something(10, 10), 20);
        `,
        expected: new NumberObject({ value: 40 }),
      },
      {
        input: `
          func something(a, b) {
            return 10 + a + b;
          }

          something(10, 20);
        `,
        expected: new NumberObject({ value: 40 }),
      },
      {
        input: `
          func something(a, b) {
            let x: number = 10;
            return x + a + b;
          }

          something(10, 20);
        `,
        expected: new NumberObject({ value: 40 }),
      },
      {
        input: `
          func double(a) {
            return a * 2;
          }

          func add(a, b) {
            return double(a) + double(b);
          }

          add(10, 20);
        `,
        expected: new NumberObject({ value: 60 }),
      },
      {
        input: `
          func fib(a) {
            if (a < 3) {
              return 1;
            }

            return fib(a - 2) + fib(a - 1);
          }

          fib(5);
        `,
        expected: new NumberObject({ value: 5 }),
      },
      {
        input: `
          func test() {
            let count: number = 10;
            while (true) {
              count = count - 1;
              if (count < 1) {
                return "OK";
              }
            }

            return "NG";
          }

          test();
        `,
        expected: new StringObject({ value: 'OK' }),
      },
    ];

    for (const test of tests) {
      const evaluated = await testEval(test.input);
      expect(test.expected).toEqual(evaluated);
    }
  });

  test('Println', async () => {
    const tests = [
      {
        input: `
          Println("test");
        `,
        expectedArgument: [['test']],
      },
      {
        input: `
          let message: string = "Hello, World!";
          Println(message);
        `,
        expectedArgument: [['Hello, World!']],
      },
    ];

    for (const test of tests) {
      await testEval(test.input);
      expect(test.expectedArgument).toEqual(mockOutputCallback.mock.calls);
      mockOutputCallback.mockClear();
    }
  });

  test('Input', async () => {
    const tests = [
      {
        input: `
          let input: number = Input();
          input;
        `,
        inputValue: 10,
        expectedValue: new NumberObject({ value: 10 }),
      },
    ];

    for (const test of tests) {
      mockInputCallback.mockResolvedValueOnce(test.inputValue);
      const evaluated = await testEval(test.input);

      expect(mockInputCallback).toHaveBeenCalledTimes(1);
      expect(test.expectedValue).toEqual(evaluated);

      mockInputCallback.mockClear();
    }
  });
});

async function testEval(input: string): Promise<Obj> {
  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseToken();
  if (p.errors.length > 0) {
    throw new Error(JSON.stringify(p.errors));
  }
  const env = new Environment();

  return await new Evaluator({
    inputEventCallback: mockInputCallback,
    outputEventCallback: mockOutputCallback,
  }).Eval(program, env);
}

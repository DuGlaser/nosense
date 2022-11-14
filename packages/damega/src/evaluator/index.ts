import {
  AssignStatement,
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  Expression,
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
  Statement,
  StringLiteral,
  WhileStatement,
} from '@/ast';
import {
  BooleanObject,
  BuiltinObject,
  Environment,
  ErrorObject,
  FunctionObject,
  getMatchedType,
  isTypeMatched,
  NullObject,
  NumberObject,
  Obj,
  OBJECT,
  ReturnValueObject,
  StringObject,
} from '@/object';

import { builtins, InputEventCallback, OutputEventCallback } from './builtins';

export type {
  InputEventCallback,
  OutputEventCallback,
  OutputText,
} from './builtins';

export type EvaluatorGenerator = AsyncGenerator<
  {
    node: Statement;
    env: Environment;
  },
  Obj
>;

export const TRUE = new BooleanObject({ value: true });
export const FALSE = new BooleanObject({ value: false });
export const NULL = new NullObject();

const MAX_CALL_STACK = 3000_000_000 as const;

export class Evaluator {
  private builtins: ReturnType<typeof builtins>;

  constructor(args: {
    inputEventCallback: InputEventCallback;
    outputEventCallback: OutputEventCallback;
  }) {
    this.builtins = builtins(args);
  }

  public async Eval(program: Program, env: Environment): Promise<Obj> {
    const generator = this.EvalGenerator(program, env);
    let count = 0;

    while (MAX_CALL_STACK > count) {
      count++;
      const result = await generator.next();

      if (result.done) {
        return result.value;
      }
    }

    throw new Error('Infinity loop');
  }

  public async *EvalGenerator(
    program: Program,
    env: Environment
  ): EvaluatorGenerator {
    let result: Obj = NULL;

    for (const stmt of program.statements) {
      result = yield* this.evalStatement(stmt, env);

      if (result instanceof ReturnValueObject) {
        return result.value;
      }

      if (result instanceof ErrorObject) {
        return result;
      }
    }

    return result;
  }

  private async *evalStatement(
    stmt: Statement,
    env: Environment
  ): EvaluatorGenerator {
    let returnValue: Obj = new ErrorObject({
      message: `cannot match node: ${JSON.stringify(stmt)}`,
    });

    if (stmt instanceof AssignStatement) {
      returnValue = yield* this.evalAssignStatement(stmt, env);
    }
    if (stmt instanceof BlockStatement) {
      returnValue = yield* this.evalBlockStatement(stmt, env);
    }
    if (stmt instanceof ExpressionStatement) {
      returnValue = yield* this.evalExpression(stmt.expression, env);
      yield { node: stmt, env };
    }
    if (stmt instanceof FunctionStatement) {
      returnValue = this.evalFunctionStatement(stmt, env);
    }
    if (stmt instanceof IfStatement) {
      returnValue = yield* this.evalIfStatement(stmt, env);
    }
    if (stmt instanceof LetStatement) {
      returnValue = yield* this.evalLetStatement(stmt, env);
    }
    if (stmt instanceof ReturnStatement) {
      returnValue = yield* this.evalReturnStatement(stmt, env);
    }
    if (stmt instanceof WhileStatement) {
      returnValue = yield* this.evalWhileStatement(stmt, env);
    }

    return returnValue;
  }

  private async *evalExpression(
    exp: Expression,
    env: Environment
  ): EvaluatorGenerator {
    if (exp instanceof NumberLiteral) {
      return new Promise((resolve) =>
        resolve(new NumberObject({ value: exp.value }))
      );
    }

    if (exp instanceof StringLiteral) {
      return new Promise((resolve) =>
        resolve(new StringObject({ value: exp.value }))
      );
    }

    if (exp instanceof BooleanLiteral) {
      return new Promise((resolve) =>
        resolve(this.nativeBoolToBooleanObject(exp.value))
      );
    }

    if (exp instanceof Identifier) {
      return new Promise((resolve) => resolve(this.evalIdentifier(exp, env)));
    }

    if (exp instanceof CallExpression) {
      return yield* this.evalCallExpression(exp, env);
    }

    if (exp instanceof InfixExpression) {
      return yield* this.evalInfixExpression(exp, env);
    }

    if (exp instanceof PrefixExpression) {
      return yield* this.evalPrefixExpression(exp, env);
    }

    return new Promise((resolve) =>
      resolve(
        new ErrorObject({
          message: `cannot match node: ${JSON.stringify(exp)}`,
        })
      )
    );
  }

  private async *evalIfStatement(node: IfStatement, env: Environment) {
    const nestedEnv = new Environment(env);
    const condition = yield* this.evalExpression(node.condition, nestedEnv);

    yield { node, env };

    let evaluated: Obj = NULL;

    if (condition === TRUE) {
      evaluated = yield* this.evalStatement(node.consequence, nestedEnv);
    } else if (node.alternative) {
      evaluated = yield* this.evalStatement(node.alternative, nestedEnv);
    }

    if (evaluated.type() === OBJECT.RETURN_VALUE) {
      return evaluated;
    }

    return NULL;
  }

  private async *evalWhileStatement(node: WhileStatement, env: Environment) {
    const nestedEnv = new Environment(env);

    const evalExpression = this.evalExpression.bind(this);

    async function* getCondition() {
      const condition = yield* evalExpression(node.condition, env);
      yield { node, env };
      return condition === TRUE;
    }

    let condition = yield* getCondition();

    let evaluated: Obj = NULL;
    while (condition) {
      evaluated = yield* this.evalStatement(node.consequence, nestedEnv);

      if (evaluated.type() === OBJECT.RETURN_VALUE) {
        return evaluated;
      }

      condition = yield* getCondition();
    }

    return NULL;
  }

  private async *evalLetStatement(node: LetStatement, env: Environment) {
    const value = node.value
      ? yield* this.evalExpression(node.value, env)
      : NULL;
    if (!value) throw new Error('invalid object.');

    if (this.isError(value)) {
      return value;
    }

    if (value !== NULL && !isTypeMatched(node.type.token.type, value)) {
      const expectedType = getMatchedType(node.type.token.type);

      return new ErrorObject({
        message: `type mismatch: got=${value.type()}, expected=${expectedType}`,
      });
    }

    node.names.forEach((name) => {
      env.set(name.value, value);
    });

    yield { node, env };
    return NULL;
  }

  private async *evalAssignStatement(node: AssignStatement, env: Environment) {
    const value = yield* this.evalExpression(node.value, env);

    const error = env.update(node.name.value, value);
    if (error) {
      return error;
    }

    yield { node, env };
    return NULL;
  }

  private async *evalReturnStatement(node: ReturnStatement, env: Environment) {
    const value =
      (yield* this.evalExpression(node.valueExpression, env)) ?? NULL;
    if (this.isError(value)) return value;

    yield { node, env };
    return new ReturnValueObject({ value });
  }

  private async *evalBlockStatement(node: BlockStatement, env: Environment) {
    let result: Obj = NULL;

    for (const stmt of node.statements) {
      result = (yield* this.evalStatement(stmt, env)) ?? NULL;

      if (result) {
        if (
          result.type() === OBJECT.RETURN_VALUE ||
          result.type() === OBJECT.ERROR
        ) {
          break;
        }
      }
    }

    return result;
  }

  private evalFunctionStatement(
    node: FunctionStatement,
    env: Environment
  ): Obj {
    const fn = new FunctionObject({
      parameters: node.parameters,
      body: node.body,
      env,
    });

    env.set(node.name.value, fn);

    return NULL;
  }

  private async *evalInfixExpression(node: InfixExpression, env: Environment) {
    const left = yield* this.evalExpression(node.left, env);
    if (this.isError(left)) {
      return left;
    }

    const right = yield* this.evalExpression(node.right, env);
    if (this.isError(right)) {
      return right;
    }

    if (left instanceof NumberObject && right instanceof NumberObject) {
      return this.evalNumberInfixExpression(node.operator, left, right);
    }

    if (left instanceof StringObject && right instanceof StringObject) {
      return this.evalStringInfixExpression(node.operator, left, right);
    }

    if (node.operator === '==') {
      return this.nativeBoolToBooleanObject(left === right);
    }

    if (node.operator === '!=') {
      return this.nativeBoolToBooleanObject(left !== right);
    }

    if (left.type() !== right.type()) {
      return new ErrorObject({
        message: `type mismatch: ${left.type()} ${
          node.operator
        } ${right.type()}`,
      });
    }

    return new ErrorObject({
      message: `unknown operator: ${left.type()} ${
        node.operator
      } ${right.type()}`,
    });
  }

  private async *evalPrefixExpression(
    node: PrefixExpression,
    env: Environment
  ) {
    const right = yield* this.evalExpression(node.right, env);
    if (!right) return NULL;

    switch (node.operator) {
      case '!':
        return this.evalBangOperatorExpression(right);
      case '-':
        return this.evalMinusOperatorExpression(right);
      default:
        return new ErrorObject({
          message: `unknown operator:${node.operator}${right.type()}`,
        });
    }
  }

  private evalBangOperatorExpression(obj: Obj): Obj {
    switch (obj) {
      case TRUE:
        return FALSE;
      case FALSE:
        return TRUE;
      default:
        return FALSE;
    }
  }

  private evalMinusOperatorExpression(obj: Obj): Obj {
    if (obj instanceof NumberObject) {
      return new NumberObject({ value: -obj.value });
    }

    return new ErrorObject({ message: `unknown operator: -${obj.type()}` });
  }

  private evalNumberInfixExpression(
    operator: string,
    left: NumberObject,
    right: NumberObject
  ): Obj {
    const leftValue = left.value;
    const rightValue = right.value;

    switch (operator) {
      case '+':
        return new NumberObject({ value: leftValue + rightValue });
      case '-':
        return new NumberObject({ value: leftValue - rightValue });
      case '*':
        return new NumberObject({ value: leftValue * rightValue });
      case '/':
        return new NumberObject({ value: leftValue / rightValue });
      case '<':
        return this.nativeBoolToBooleanObject(leftValue < rightValue);
      case '>':
        return this.nativeBoolToBooleanObject(leftValue > rightValue);
      case '==':
        return this.nativeBoolToBooleanObject(leftValue === rightValue);
      case '!=':
        return this.nativeBoolToBooleanObject(leftValue !== rightValue);
      default:
        return new ErrorObject({
          message: `unknown operator: ${left.type()} ${operator} ${right.type()}`,
        });
    }
  }

  private evalStringInfixExpression(
    operator: string,
    left: StringObject,
    right: StringObject
  ): Obj {
    const leftValue = left.value;
    const rightValue = right.value;

    switch (operator) {
      case '+':
        return new StringObject({ value: leftValue + rightValue });
      case '<':
        return this.nativeBoolToBooleanObject(leftValue < rightValue);
      case '>':
        return this.nativeBoolToBooleanObject(leftValue > rightValue);
      case '==':
        return this.nativeBoolToBooleanObject(leftValue === rightValue);
      case '!=':
        return this.nativeBoolToBooleanObject(leftValue !== rightValue);
      default:
        return new ErrorObject({
          message: `unknown operator: ${left.type()} ${operator} ${right.type()}`,
        });
    }
  }

  private async *evalCallExpression(node: CallExpression, env: Environment) {
    const fn = yield* this.evalExpression(node.name, env);
    if (this.isError(fn)) {
      return fn;
    }

    const args: Obj[] = [];
    for (const asyncGenerator of node.args.map((arg) =>
      this.evalExpression(arg, env)
    )) {
      const arg = yield* asyncGenerator;
      args.push(arg);
    }

    const errors = args.filter((arg) => this.isError(arg));
    if (errors.length > 0) {
      return new ErrorObject({
        message: 'invalid argument: ' + JSON.stringify(errors),
      });
    }

    if (fn instanceof BuiltinObject) {
      const builtinFn = fn.fn;
      return await builtinFn(...args);
    }

    if (!(fn instanceof FunctionObject)) {
      return new ErrorObject({
        message: 'not a function: ' + JSON.stringify(fn),
      });
    }

    const extendEnv = fn.env.extend();

    if (fn.parameters.length !== args.length) {
      return new ErrorObject({
        message: `wrong number of arguments for function: expected ${fn.parameters.length}, got ${args.length}`,
      });
    }

    fn.parameters.forEach((params, index) => {
      extendEnv.set(params.value, args[index]);
    });

    const evaluated = yield* this.evalStatement(fn.body, extendEnv);

    return this.unwrapReturnValue(evaluated);
  }

  private nativeBoolToBooleanObject(b: boolean) {
    return b ? TRUE : FALSE;
  }

  private evalIdentifier(node: Identifier, env: Environment): Obj {
    const value = env.get(node.value);
    if (value) return value;

    const builtin = this.builtins[node.value];
    if (builtin) return builtin;

    return new ErrorObject({ message: 'identifier not found: ' + node.value });
  }

  private isError(obj: Obj): boolean {
    return obj instanceof ErrorObject;
  }

  private unwrapReturnValue(obj: Obj): Obj {
    if (obj instanceof ReturnValueObject) {
      return obj.value;
    }

    return obj;
  }
}

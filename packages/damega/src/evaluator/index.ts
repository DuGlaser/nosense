import {
  AssignStatement,
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  ExpressionStatement,
  FunctionStatement,
  Identifier,
  IfStatement,
  InfixExpression,
  LetStatement,
  Node,
  NumberLiteral,
  PrefixExpression,
  Program,
  ReturnStatement,
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

export const TRUE = new BooleanObject({ value: true });
export const FALSE = new BooleanObject({ value: false });
export const NULL = new NullObject();

export class Evaluator {
  private builtins: ReturnType<typeof builtins>;

  constructor(args: {
    inputEventCallback: InputEventCallback;
    outputEventCallback: OutputEventCallback;
  }) {
    this.builtins = builtins(args);
  }

  public async Eval(node: Node, env: Environment): Promise<Obj> {
    if (node instanceof Program) {
      return this.evalProgram(node, env);
    }

    if (node instanceof IfStatement) {
      return this.evalIfStatement(node, env);
    }

    if (node instanceof WhileStatement) {
      return this.evalWhileStatement(node, env);
    }

    if (node instanceof LetStatement) {
      return this.evalLetStatement(node, env);
    }

    if (node instanceof AssignStatement) {
      return this.evalAssignStatement(node, env);
    }

    if (node instanceof ReturnStatement) {
      return this.evalReturnStatement(node, env);
    }

    if (node instanceof BlockStatement) {
      return this.evalBlockStatement(node, env);
    }

    if (node instanceof FunctionStatement) {
      return this.evalFunctionStatement(node, env);
    }

    if (node instanceof ExpressionStatement) {
      return this.Eval(node.expression, env);
    }

    if (node instanceof InfixExpression) {
      return this.evalInfixExpression(node, env);
    }

    if (node instanceof PrefixExpression) {
      return this.evalPrefixExpression(node, env);
    }

    if (node instanceof CallExpression) {
      return await this.evalCallExpression(node, env);
    }

    if (node instanceof NumberLiteral) {
      return new NumberObject({ value: node.value });
    }

    if (node instanceof StringLiteral) {
      return new StringObject({ value: node.value });
    }

    if (node instanceof BooleanLiteral) {
      return this.nativeBoolToBooleanObject(node.value);
    }

    if (node instanceof Identifier) {
      return this.evalIdentifier(node, env);
    }

    return new ErrorObject({ message: 'cannot match node' });
  }

  private async evalProgram(program: Program, env: Environment): Promise<Obj> {
    let result: Obj = NULL;

    for (const stmt of program.statements) {
      result = await this.Eval(stmt, env);

      if (result instanceof ReturnValueObject) {
        return result.value;
      }

      if (result instanceof ErrorObject) {
        return result;
      }
    }

    return result;
  }

  private async evalIfStatement(
    node: IfStatement,
    env: Environment
  ): Promise<Obj> {
    const nestedEnv = new Environment(env);
    const condition = await this.Eval(node.condition, nestedEnv);

    let evaluated: Obj = NULL;

    if (condition === TRUE) {
      evaluated = await this.Eval(node.consequence, nestedEnv);
    } else if (node.alternative) {
      evaluated = await this.Eval(node.alternative, nestedEnv);
    }

    if (evaluated.type() === OBJECT.RETURN_VALUE) {
      return evaluated;
    }

    return NULL;
  }

  private async evalWhileStatement(
    node: WhileStatement,
    env: Environment
  ): Promise<Obj> {
    const nestedEnv = new Environment(env);

    const getCondition = async () => {
      const condition = await this.Eval(node.condition, env);
      return condition === TRUE;
    };

    let condition = await getCondition();

    let evaluated: Obj = NULL;
    while (condition) {
      evaluated = await this.Eval(node.consequence, nestedEnv);

      if (evaluated.type() === OBJECT.RETURN_VALUE) {
        return evaluated;
      }

      condition = await getCondition();
    }

    return NULL;
  }

  private async evalLetStatement(
    node: LetStatement,
    env: Environment
  ): Promise<Obj> {
    const value = await this.Eval(node.value, env);
    if (!value) throw new Error('invalid object.');

    if (this.isError(value)) {
      return value;
    }

    if (!isTypeMatched(node.type.token.type, value)) {
      const expectedType = getMatchedType(node.type.token.type);

      return new ErrorObject({
        message: `type mismatch: got=${value.type()}, expected=${expectedType}`,
      });
    }

    env.set(node.name.value, value);
    return NULL;
  }

  private async evalAssignStatement(
    node: AssignStatement,
    env: Environment
  ): Promise<Obj> {
    const value = await this.Eval(node.value, env);

    const error = env.update(node.name.value, value);
    if (error) {
      return error;
    }

    return NULL;
  }

  private async evalReturnStatement(
    node: ReturnStatement,
    env: Environment
  ): Promise<Obj> {
    const value = (await this.Eval(node.valueExpression, env)) ?? NULL;
    if (this.isError(value)) return value;

    return new ReturnValueObject({ value });
  }

  private async evalBlockStatement(
    node: BlockStatement,
    env: Environment
  ): Promise<Obj> {
    let result: Obj = NULL;

    for (const stmt of node.statements) {
      result = (await this.Eval(stmt, env)) ?? NULL;

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

  private async evalInfixExpression(
    node: InfixExpression,
    env: Environment
  ): Promise<Obj> {
    const left = await this.Eval(node.left, env);
    if (this.isError(left)) {
      return left;
    }

    const right = await this.Eval(node.right, env);
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

  private async evalPrefixExpression(
    node: PrefixExpression,
    env: Environment
  ): Promise<Obj> {
    const right = await this.Eval(node.right, env);
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

  private async evalCallExpression(
    node: CallExpression,
    env: Environment
  ): Promise<Obj> {
    const fn = await this.Eval(node.name, env);
    if (this.isError(fn)) {
      return fn;
    }

    const args = await Promise.all(node.args.map((arg) => this.Eval(arg, env)));
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

    const evaluated = await this.Eval(fn.body, extendEnv);

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

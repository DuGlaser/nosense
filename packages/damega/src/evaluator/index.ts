import {
  AssignStatement,
  BlockStatement,
  BooleanLiteral,
  ExpressionStatement,
  Identifier,
  IfStatement,
  InfixExpression,
  LetStatement,
  Node,
  NumberLiteral,
  Program,
  ReturnStatement,
  StringLiteral,
} from '@/ast';
import {
  BooleanObject,
  Environment,
  ErrorObject,
  getMatchedType,
  isTypeMatched,
  NullObject,
  NumberObject,
  Obj,
  OBJECT,
  ReturnValueObject,
  StringObject,
} from '@/object';

const TRUE = new BooleanObject({ value: true });
const FALSE = new BooleanObject({ value: false });
const NULL = new NullObject();

export class Evaluator {
  public Eval(node: Node, env: Environment): Obj {
    if (node instanceof Program) {
      return this.evalProgram(node, env);
    }

    if (node instanceof IfStatement) {
      return this.evalIfStatement(node, env);
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

    if (node instanceof ExpressionStatement) {
      return this.Eval(node.expression, env);
    }

    if (node instanceof InfixExpression) {
      return this.evalInfixExpression(node, env);
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

  private evalProgram(program: Program, env: Environment): Obj {
    let result: Obj = NULL;

    for (const stmt of program.statements) {
      result = this.Eval(stmt, env);

      if (result instanceof ReturnValueObject) {
        return result.value;
      }

      if (result instanceof ErrorObject) {
        return result;
      }
    }

    return result;
  }

  private evalIfStatement(node: IfStatement, env: Environment): Obj {
    const nestedEnv = new Environment(env);
    const condition = this.Eval(node.condition, nestedEnv);

    if (condition === TRUE) {
      this.Eval(node.consequence, nestedEnv);
    } else if (node.alternative) {
      this.Eval(node.alternative, nestedEnv);
    }

    return NULL;
  }

  private evalLetStatement(node: LetStatement, env: Environment): Obj {
    const value = this.Eval(node.value, env);
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

  private evalAssignStatement(node: AssignStatement, env: Environment): Obj {
    const value = this.Eval(node.value, env);

    env.update(node.name.value, value);

    return NULL;
  }

  private evalReturnStatement(node: ReturnStatement, env: Environment): Obj {
    const value = this.Eval(node.valueExpression, env) ?? NULL;
    if (this.isError(value)) return value;

    return value;
  }

  private evalBlockStatement(node: BlockStatement, env: Environment): Obj {
    let result: Obj = NULL;

    for (const stmt of node.statements) {
      result = this.Eval(stmt, env) ?? NULL;

      if (result) {
        if (
          result.type() === OBJECT.RETURN_VALUE ||
          result.type() === OBJECT.ERROR
        ) {
          return result;
        }
      }
    }

    return result;
  }

  private evalInfixExpression(node: InfixExpression, env: Environment): Obj {
    const left = this.Eval(node.left, env);
    if (this.isError(left)) {
      return left;
    }

    const right = this.Eval(node.right, env);
    if (this.isError(right)) {
      return right;
    }

    if (left instanceof NumberObject && right instanceof NumberObject) {
      return this.evalNumberInfixExpression(node.operator, left, right);
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

  private nativeBoolToBooleanObject(b: boolean) {
    return b ? TRUE : FALSE;
  }

  private evalIdentifier(node: Identifier, env: Environment): Obj {
    const value = env.get(node.value);
    if (value) return value;

    return new ErrorObject({ message: 'identifier not found: ' + node.value });
  }

  private isError(obj: Obj): boolean {
    return obj instanceof ErrorObject;
  }
}

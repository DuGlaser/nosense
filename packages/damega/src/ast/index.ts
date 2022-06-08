import { Statement } from './base';

export class Program {
  public statements: Statement[];

  constructor(statements: Statement[] = []) {
    this.statements = statements;
  }

  public appendStatement(statement: Statement) {
    this.statements.push(statement);
  }

  public string(): string {
    const outs = this.statements.flatMap((stmt) => stmt.lines());
    return outs.join('\n');
  }
}

export * from './base';
export * from './BlockStatement';
export * from './BooleanLiteral';
export * from './ExpressionStatement';
export * from './Identifier';
export * from './IfStatement';
export * from './InfixExpression';
export * from './LetStatement';
export * from './NumberLiteral';
export * from './PrefixExpression';
export * from './ReturnStatement';
export * from './StringLiteral';
export * from './TypeIdentifier';
export * from './WhileStatement';

import { PositionContext } from '@/contexts';
import { Ast2StringConverter } from '@/utils/Ast2StringConverter';

export abstract class Node {
  public abstract tokenLiteral(): string;
}

export abstract class Expression extends Node {
  protected toStringConverter = new Ast2StringConverter({
    type: 'SPACE',
    count: 2,
  });

  public abstract string(): string;
}

export abstract class Statement extends Node {
  protected toStringConverter = new Ast2StringConverter({
    type: 'SPACE',
    count: 2,
  });

  public abstract lines(): string[];
  abstract get ctx(): PositionContext;
}

export class Program extends Node {
  public statements: Statement[];

  constructor(statements: Statement[] = []) {
    super();
    this.statements = statements;
  }

  public appendStatement(statement: Statement) {
    this.statements.push(statement);
  }

  public string(): string {
    const outs = this.statements.flatMap((stmt) => stmt.lines());
    return outs.join('\n');
  }

  public tokenLiteral(): string {
    return '';
  }
}

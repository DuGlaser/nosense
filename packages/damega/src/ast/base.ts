import { Ast2StringConverter } from '@/utils/Ast2StringConverter';

export abstract class Expression {
  protected toStringConverter = new Ast2StringConverter({
    type: 'SPACE',
    count: 2,
  });

  public abstract string(): string;
  public abstract tokenLiteral(): string;
}

export abstract class Statement {
  protected toStringConverter = new Ast2StringConverter({
    type: 'SPACE',
    count: 2,
  });

  public abstract lines(): string[];
  public abstract tokenLiteral(): string;
}

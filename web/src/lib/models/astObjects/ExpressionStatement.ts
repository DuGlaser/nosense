import { BaseAstObject } from '.';

export interface ExpressionStatementObject
  extends BaseAstObject<'ExpressionStatement'> {
  expression: string;
}

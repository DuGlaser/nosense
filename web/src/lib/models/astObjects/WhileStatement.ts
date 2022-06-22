import { AstObject, BaseAstObject } from '.';

export interface WhileStatementObject extends BaseAstObject<'WhileStatement'> {
  condition: string;
  consequence: AstObject[];
}

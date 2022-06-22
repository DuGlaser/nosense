import { AstObject, BaseAstObject } from '.';

export interface IfStatementObject extends BaseAstObject<'IfStatement'> {
  condition: string;
  consequence: AstObject[];
  alternative: AstObject[] | undefined;
}

import { BaseAstObject } from '.';

export interface AssignStatementObject
  extends BaseAstObject<'AssignStatement'> {
  value: string;
  name: string;
}

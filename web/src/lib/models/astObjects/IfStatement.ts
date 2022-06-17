import { AstObject } from '.';

export interface IfStatementObject {
  _type: 'IfStatement';
  condition: string;
  consequence: AstObject[];
  alternative: AstObject[] | undefined;
  meta: {
    indentLevel: number;
  };
}

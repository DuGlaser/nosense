import { IfStatement } from '@nosense/damega';

import { IfStatementObject } from '@/lib/models/astObjects';

import { convert2AstObject } from './convert2AstObject';

export const convert2IfStatementObject = (
  stmt: IfStatement
): IfStatementObject => {
  return {
    _type: 'IfStatement',
    condition: stmt.condition.string(),
    consequence: stmt.consequence.statements.map((_) => convert2AstObject(_)),
    alternative: stmt.alternative
      ? stmt.alternative.statements.map((_) => convert2AstObject(_))
      : undefined,
  };
};

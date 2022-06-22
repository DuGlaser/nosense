import { WhileStatement } from '@nosense/damega';

import { WhileStatementObject } from '@/lib/models/astObjects';

import { convert2AstObject } from './convert2AstObject';

export const convert2WhileStatementObject = (
  stmt: WhileStatement
): WhileStatementObject => {
  return {
    _type: 'WhileStatement',
    condition: stmt.condition.string(),
    consequence: stmt.consequence.statements.map((_) => convert2AstObject(_)),
  };
};

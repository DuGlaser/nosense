import { ExpressionStatement } from '@nosense/damega';

import { ExpressionStatementObject } from '@/lib/models/astObjects';

export const convert2ExpressionStatementObject = (
  stmt: ExpressionStatement
): ExpressionStatementObject => {
  return {
    _type: 'ExpressionStatement',
    expression: stmt.expression.string(),
  };
};

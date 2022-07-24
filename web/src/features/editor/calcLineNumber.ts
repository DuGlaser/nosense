import { match, P } from 'ts-pattern';

import {
  AstObject,
  IfStatementObject,
  WhileStatementObject,
} from '@/lib/models/astObjects';

export const calcLinesNumber = (astObjects: AstObject[]): number => {
  return astObjects.reduce((sum, cur) => sum + calcLineNumber(cur), 0);
};

export const calcLineNumber = (astObject: AstObject): number => {
  return match(astObject)
    .with({ _type: 'LetStatement' }, () => 1)
    .with({ _type: 'IfStatement' }, (stmt) => calcIfStatement(stmt))
    .with({ _type: 'WhileStatement' }, (stmt) => calcWhileStatement(stmt))
    .with({ _type: 'AssignStatement' }, () => 1)
    .with({ _type: 'ExpressionStatement' }, () => 1)
    .with(P.nullish, () => 0)
    .exhaustive();
};

const calcIfStatement = (stmt: IfStatementObject) => {
  const consequence = 2 + calcLinesNumber(stmt.consequence);
  const alternative =
    stmt.alternative !== undefined ? 1 + calcLinesNumber(stmt.alternative) : 0;

  return consequence + alternative;
};

const calcWhileStatement = (stmt: WhileStatementObject) => {
  return 2 + calcLinesNumber(stmt.consequence);
};

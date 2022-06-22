import { match, P } from 'ts-pattern';

import { AstObject } from '@/lib/models/astObjects';

export const calcLinesNumber = (astObjects: AstObject[]): number => {
  return astObjects.reduce((sum, cur) => sum + calcLineNumber(cur), 0);
};

const calcLineNumber = (astObject: AstObject): number => {
  return match(astObject)
    .with({ _type: 'LetStatement' }, () => 1)
    .with({ _type: 'IfStatement' }, (stmt) => {
      const consequence = 2 + calcLinesNumber(stmt.consequence);
      const alternative =
        stmt.alternative !== undefined
          ? 1 + calcLinesNumber(stmt.alternative)
          : 0;

      return consequence + alternative;
    })
    .with({ _type: 'WhileStatement' }, (stmt) => {
      return 2 + calcLinesNumber(stmt.consequence);
    })
    .with({ _type: 'AssignStatement' }, () => 1)
    .with(P.nullish, () => 0)
    .exhaustive();
};

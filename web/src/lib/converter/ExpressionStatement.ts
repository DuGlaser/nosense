import { ExpressionStatement as DamegaExpressionStatement } from '@nosense/damega';

import {
  createExpressionStatement,
  ExpressionStatement,
} from '@/lib/models/editorObject';

export const expressionStatementConvertor = {
  fromDamega: (
    stmt: DamegaExpressionStatement,
    indent: number
  ): [ExpressionStatement] => {
    return [
      createExpressionStatement({ exp: stmt.expression.string(), indent }),
    ];
  },
  toDamega: (stmt: ExpressionStatement): string => {
    const [exp] = stmt.nodes;
    return `${exp.content};`;
  },
};

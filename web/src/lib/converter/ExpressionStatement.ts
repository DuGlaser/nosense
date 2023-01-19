import {
  CallExpression,
  ExpressionStatement as DamegaExpressionStatement,
} from '@nosense/damega';

import {
  CallFunctionStatement,
  createExpressionStatement,
  ExpressionStatement,
} from '@/lib/models/editorObject';

import { callFunctionStatementConvertor } from './CallFunctionStatement';

export const expressionStatementConvertor = {
  fromDamega: (
    stmt: DamegaExpressionStatement,
    indent: number
  ): [ExpressionStatement | CallFunctionStatement] => {
    if (stmt.expression instanceof CallExpression) {
      return callFunctionStatementConvertor.fromDamega(stmt.expression, indent);
    }

    return [
      createExpressionStatement({ exp: stmt.expression.string(), indent }),
    ];
  },
  toDamega: (stmt: ExpressionStatement): string => {
    const [exp] = stmt.nodes;
    return `${exp.content};`;
  },
};

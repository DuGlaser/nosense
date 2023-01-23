import {
  CallExpression,
  ExpressionStatement as DamegaExpressionStatement,
} from '@nosense/damega';

import {
  CallFunctionStatement,
  createExpressionStatement,
  CreateExpressionStatementParams,
  ExpressionStatement,
  statementTypeLiteral,
} from '@/lib/models/editorObject';

import { Convert2CreatorParams } from '.';
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
  toCreatorParams: (
    stmt: ExpressionStatement
  ): Convert2CreatorParams<
    CreateExpressionStatementParams,
    'ExpressionStatement'
  > => {
    const { _type, nodes, indent } = stmt;

    return {
      _type: statementTypeLiteral[_type],
      params: {
        exp: nodes[0].content,
        indent,
      },
    };
  },
  toDamega: (stmt: ExpressionStatement): string => {
    const [exp] = stmt.nodes;
    return `${exp.content};`;
  },
};

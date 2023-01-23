import { WhileStatement as DamegawhileStatemest } from '@nosense/damega';

import {
  createWhileStatementEnd,
  CreateWhileStatementEndParams,
  createWhileStatementStart,
  CreateWhileStatementStartParams,
  Statement,
  statementTypeLiteral,
  WhileStatementEnd,
  WhileStatementStart,
} from '@/lib/models/editorObject';

import { Convert2CreatorParams, statementConvertor } from '.';

export const whileStatemestConvertor = {
  fromDamega: (
    stmt: DamegawhileStatemest,
    indent: number
  ): [WhileStatementStart, ...Statement[], WhileStatementEnd] => {
    return [
      createWhileStatementStart({ condition: stmt.condition.string(), indent }),
      ...statementConvertor.fromDamega(stmt.consequence, indent + 1),
      createWhileStatementEnd({ indent }),
    ];
  },
};

export const whileStatemestStartConvertor = {
  toCreatorParams: (
    stmt: WhileStatementStart
  ): Convert2CreatorParams<
    CreateWhileStatementStartParams,
    'WhileStatementStart'
  > => {
    const { _type, nodes, indent } = stmt;

    return {
      _type: statementTypeLiteral[_type],
      params: {
        indent,
        condition: nodes[1].content,
      },
    };
  },
  toDamega: (stmt: WhileStatementStart): string => {
    const [, condition] = stmt.nodes;
    return `while (${condition.content}) {`;
  },
};

export const whileStatemestEndConvertor = {
  toCreatorParams: (
    stmt: WhileStatementEnd
  ): Convert2CreatorParams<
    CreateWhileStatementEndParams,
    'WhileStatementEnd'
  > => {
    const { _type, indent } = stmt;

    return {
      _type: statementTypeLiteral[_type],
      params: {
        indent,
      },
    };
  },
  toDamega: (): string => {
    return `}`;
  },
};

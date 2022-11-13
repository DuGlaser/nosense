import { WhileStatement as DamegawhileStatemest } from '@nosense/damega';

import {
  createWhileStatementEnd,
  createWhileStatementStart,
  Statement,
  WhileStatementEnd,
  WhileStatementStart,
} from '@/lib/models/editorObject';

import { statementConvertor } from '.';

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
  toDamega: (stmt: WhileStatementStart): string => {
    const [, condition] = stmt.nodes;
    return `while (${condition.content}) {`;
  },
};

export const whileStatemestEndConvertor = {
  toDamega: (): string => {
    return `}`;
  },
};

import { IfStatement as DamegaIfStatemest } from '@nosense/damega';

import {
  createIfStatementElse,
  createIfStatementEnd,
  createIfStatementStart,
  IfStatementEnd,
  IfStatementStart,
  Statement,
} from '@/lib/models/editorObject';

import { statementConvertor } from '.';

export const ifStatemestConvertor = {
  fromDamega: (
    stmt: DamegaIfStatemest,
    indent: number
  ): [IfStatementStart, ...Statement[], IfStatementEnd] => {
    const alts = stmt.alternative
      ? [
          createIfStatementElse({ indent }),
          ...statementConvertor.fromDamega(stmt.alternative, indent + 1),
        ]
      : [];

    return [
      createIfStatementStart({ condition: stmt.condition.string(), indent }),
      ...statementConvertor.fromDamega(stmt.consequence, indent + 1),
      ...alts,
      createIfStatementEnd({ indent }),
    ];
  },
};

export const ifStatemestStartConvertor = {
  toDamega: (stmt: IfStatementStart): string => {
    const [, condition] = stmt.nodes;
    return `if (${condition.content}) {`;
  },
};

export const ifStatemestElseConvertor = {
  toDamega: (): string => {
    return `} else {`;
  },
};

export const ifStatemestEndConvertor = {
  toDamega: (): string => {
    return `}`;
  },
};

import { IfStatement as DamegaIfStatemest } from '@nosense/damega';

import {
  createIfStatementElse,
  CreateIfStatementElseParams,
  createIfStatementEnd,
  CreateIfStatementEndParams,
  createIfStatementStart,
  CreateIfStatementStartParams,
  IfStatementElse,
  IfStatementEnd,
  IfStatementStart,
  Statement,
  statementTypeLiteral,
} from '@/lib/models/editorObject';

import { Convert2CreatorParams, statementConvertor } from '.';

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
  toCreatorParams: (
    stmt: IfStatementStart
  ): Convert2CreatorParams<
    CreateIfStatementStartParams,
    'IfStatementStart'
  > => {
    const { _type, nodes, indent } = stmt;
    return {
      _type: statementTypeLiteral[_type],
      params: {
        condition: nodes[1].content,
        indent,
      },
    };
  },
  toDamega: (stmt: IfStatementStart): string => {
    const [, condition] = stmt.nodes;
    return `if (${condition.content}) {`;
  },
};

export const ifStatemestElseConvertor = {
  toCreatorParams: (
    stmt: IfStatementElse
  ): Convert2CreatorParams<CreateIfStatementElseParams, 'IfStatementElse'> => {
    const { _type, indent } = stmt;
    return {
      _type: statementTypeLiteral[_type],
      params: {
        indent,
      },
    };
  },
  toDamega: (): string => {
    return `} else {`;
  },
};

export const ifStatemestEndConvertor = {
  toCreatorParams: (
    stmt: IfStatementEnd
  ): Convert2CreatorParams<CreateIfStatementEndParams, 'IfStatementEnd'> => {
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

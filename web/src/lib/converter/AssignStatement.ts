import { AssignStatement as DamegaAssignStatement } from '@nosense/damega';

import {
  AssignStatement,
  createAssignStatement,
  CreateAssignStatementParams,
  statementTypeLiteral,
} from '@/lib/models/editorObject';

import { Convert2CreatorParams } from '.';

export const assignStatementConvertor = {
  fromDamega: (
    stmt: DamegaAssignStatement,
    indent: number
  ): [AssignStatement] => {
    return [
      createAssignStatement({
        name: stmt.name.string(),
        value: stmt.value.string(),
        indent,
      }),
    ];
  },
  toCreatorParams: (
    stmt: AssignStatement
  ): Convert2CreatorParams<CreateAssignStatementParams, 'AssignStatement'> => {
    const { _type, nodes, indent } = stmt;
    const [name, value] = nodes.map((node) => node.content);
    return {
      _type: statementTypeLiteral[_type],
      params: { name, value, indent },
    };
  },
  toDamega: (stmt: AssignStatement): string => {
    const [varName, exp] = stmt.nodes;
    return `${varName.content} = ${exp.content};`;
  },
};

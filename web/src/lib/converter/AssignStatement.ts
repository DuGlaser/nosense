import { AssignStatement as DamegaAssignStatement } from '@nosense/damega';

import {
  AssignStatement,
  createAssignStatement,
} from '@/lib/models/editorObject';

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
  toDamega: (stmt: AssignStatement): string => {
    const [varName, exp] = stmt.nodes;
    return `${varName.content} = ${exp.content};`;
  },
};

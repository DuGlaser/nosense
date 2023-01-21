import { CallExpression } from '@nosense/damega';

import {
  CallFunctionStatement,
  createCallFunctionStatement,
} from '@/lib/models/editorObject';

export const callFunctionStatementConvertor = {
  fromDamega: (
    exp: CallExpression,
    indent: number
  ): [CallFunctionStatement] => {
    return [
      createCallFunctionStatement({
        functionName: exp.name.string(),
        args: exp.args.map((arg) => ({ defaultValue: arg.string() })),
        indent,
      }),
    ];
  },
  toDamega: (stmt: CallFunctionStatement): string => {
    return `${stmt.functionName}(${stmt.nodes
      .slice(0, stmt.nodes.length - 1)
      .map((arg) => arg.content)
      .join(',')});`;
  },
};

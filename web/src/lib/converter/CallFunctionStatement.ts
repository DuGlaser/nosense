import { CallExpression } from '@nosense/damega';

import {
  CallFunctionStatement,
  createCallFunctionStatement,
  CreateCallFunctionStatementParams,
  EditableNode,
  statementTypeLiteral,
} from '@/lib/models/editorObject';

import { Convert2CreatorParams } from '.';

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
  toCreatorParams: (
    stmt: CallFunctionStatement
  ): Convert2CreatorParams<
    CreateCallFunctionStatementParams,
    'CallFunctionStatement'
  > => {
    const { _type, nodes, indent, functionName } = stmt;
    const args = nodes
      .slice(1, nodes.length - 1)
      .filter((node): node is EditableNode => 'placeholder' in node)
      .map((node) => ({
        defaultValue: node.content,
        placeholder: node.placeholder,
      }));

    return {
      _type: statementTypeLiteral[_type],
      params: {
        indent,
        functionName,
        args,
      },
    };
  },
  toDamega: (stmt: CallFunctionStatement): string => {
    return `${stmt.functionName}(${stmt.nodes
      .slice(1, stmt.nodes.length - 1)
      .map((arg) => arg.content)
      .join(',')});`;
  },
};

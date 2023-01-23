import { v4 as uuidv4 } from 'uuid';

import {
  BaseStatement,
  createCursorNode,
  CursorNode,
  PickStatementType,
} from '.';
import { createEditableNode, EditableNode } from './EditableNode';

export interface CallFunctionStatement
  extends BaseStatement<PickStatementType<'CallFunctionStatement'>> {
  functionName: string;
  nodes: [...EditableNode[], CursorNode];
}

type FunctionArgument = {
  defaultValue: string;
  placeholder?: string;
};

export type CreateCallFunctionStatementParams = {
  functionName: string;
  args: FunctionArgument[];
  indent: number;
};

export const createCallFunctionStatement = ({
  functionName,
  args,
  indent,
}: CreateCallFunctionStatementParams): CallFunctionStatement => {
  const id = uuidv4();

  return {
    id,
    functionName,
    _type: 'CallFunctionStatement',
    nodes: [
      ...args.map((arg) =>
        createEditableNode({
          content: arg.defaultValue,
          placeholder: arg.placeholder,
          parentId: id,
        })
      ),
      createCursorNode(id),
    ],
    indent,
  };
};

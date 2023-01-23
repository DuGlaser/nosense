import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createEditableNode, EditableNode } from './EditableNode';

/**
 * <EditableNode> <- <EditableNode>
 */
export interface ExpressionStatement
  extends BaseStatement<PickStatementType<'ExpressionStatement'>> {
  nodes: [EditableNode];
}

export type CreateExpressionStatementParams = {
  exp: string;
  indent: number;
};

export const createExpressionStatement = ({
  exp,
  indent,
}: CreateExpressionStatementParams): ExpressionStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'ExpressionStatement',
    nodes: [createEditableNode({ content: exp, parentId: id })],
    indent,
  };
};

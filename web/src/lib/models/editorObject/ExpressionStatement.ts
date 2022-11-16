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

export const createExpressionStatement = ({
  exp,
  indent,
}: {
  exp: string;
  indent: number;
}): ExpressionStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'ExpressionStatement',
    nodes: [createEditableNode(exp, id)],
    indent,
  };
};

import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createEditableNode, EditableNode } from './EditableNode';

/**
 * <EditableNode> <- <EditableNode>
 */
export interface AssignStatement
  extends BaseStatement<PickStatementType<'AssignStatement'>> {
  nodes: [EditableNode, EditableNode];
}

export const createAssignStatement = ({
  name,
  value,
  indent,
}: {
  name: string;
  value: string;
  indent: number;
}): AssignStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'AssignStatement',
    nodes: [createEditableNode(name, id), createEditableNode(value, id)],
    indent,
  };
};

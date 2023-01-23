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

export type CreateAssignStatementParams = {
  name: string;
  value: string;
  indent: number;
};

export const createAssignStatement = ({
  name,
  value,
  indent,
}: CreateAssignStatementParams): AssignStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'AssignStatement',
    nodes: [
      createEditableNode({ content: name, parentId: id }),
      createEditableNode({ content: value, parentId: id }),
    ],
    indent,
  };
};

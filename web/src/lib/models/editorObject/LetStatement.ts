import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createEditableNode, EditableNode } from './EditableNode';

/**
 * <EditableNode>: <EditableNode>,<EditableNode>...
 */
export interface LetStatement
  extends BaseStatement<PickStatementType<'LetStatement'>> {
  nodes: [EditableNode, ...EditableNode[]];
}

export const createLetStatement = ({
  type,
  varNames,
}: {
  type: string;
  varNames: string[];
}): LetStatement => {
  const id = uuidv4();
  const newNode = varNames.length === 0 ? [createEditableNode('', id)] : [];
  return {
    id,
    _type: 'LetStatement',
    nodes: [
      createEditableNode(type, id),
      ...newNode,
      ...varNames.map((name) => createEditableNode(name, id)),
    ],
    indent: 0,
  };
};

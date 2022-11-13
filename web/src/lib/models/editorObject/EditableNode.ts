import { v4 as uuidv4 } from 'uuid';

import { BaseNode, PickNodeType, Statement } from '.';

export type EditableNode = BaseNode<PickNodeType<'EditableNode'>>;

export const createEditableNode = (
  content: string,
  parentId: Statement['id']
): EditableNode => {
  return {
    _type: 'EditableNode',
    id: uuidv4(),
    parentId,
    content,
    editable: true,
    deletable: true,
  };
};

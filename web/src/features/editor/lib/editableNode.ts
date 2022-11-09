import { v4 as uuidv4 } from 'uuid';

import { EditableNode, Statement } from './node';

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

import { v4 as uuidv4 } from 'uuid';

import { createEditableNode } from './editableNode';
import { AssignStatement } from './node';

export const createAssignStatement = (
  name: string,
  value: string,
  indent: number
): AssignStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'AssignStatement',
    nodes: [createEditableNode(name, id), createEditableNode(value, id)],
    indent,
  };
};

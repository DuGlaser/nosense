import { v4 as uuidv4 } from 'uuid';

import { createCursorNode } from './cursorNode';
import { createEditableNode } from './editableNode';
import { IfStatementElse, IfStatementEnd, IfStatementStart } from './node';

export const createIfStatementStart = (
  condition: string,
  indent: number
): IfStatementStart => {
  const id = uuidv4();
  return {
    id,
    _type: 'IfStatementStart',
    nodes: [createCursorNode(id), createEditableNode(condition, id)],
    indent,
  };
};

export const createIfStatementEnd = (indent: number): IfStatementEnd => {
  const id = uuidv4();
  return {
    id,
    _type: 'IfStatementEnd',
    nodes: [createCursorNode(id)],
    indent: indent,
  };
};

export const createIfStatementElse = (indent: number): IfStatementElse => {
  const id = uuidv4();
  return {
    id,
    _type: 'IfStatementElse',
    nodes: [createCursorNode(id)],
    indent: indent,
  };
};

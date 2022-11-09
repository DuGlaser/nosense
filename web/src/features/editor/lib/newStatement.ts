import { createCursorNode, NewStatement } from '@editor/lib';
import { v4 as uuidv4 } from 'uuid';

export const createNewStatement = (indent: number): NewStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'NewStatement',
    nodes: [createCursorNode(id)],
    indent,
  };
};

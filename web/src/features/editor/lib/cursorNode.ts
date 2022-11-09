import { v4 as uuidv4 } from 'uuid';

import { CursorNode, Statement } from './node';

export const createCursorNode = (parentId: Statement['id']): CursorNode => {
  return {
    _type: 'CursorNode',
    id: uuidv4(),
    parentId,
    content: '',
    editable: false,
    deletable: false,
  };
};

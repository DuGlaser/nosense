import { v4 as uuidv4 } from 'uuid';

import { BaseNode, PickNodeType, Statement } from '.';

export type CursorNode = BaseNode<PickNodeType<'CursorNode'>>;

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

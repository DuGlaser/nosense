import { v4 as uuidv4 } from 'uuid';

import { BaseNode, PickNodeType, Statement } from '.';

export type DisplayTextNode = BaseNode<PickNodeType<'DisplayTextNode'>>;

export const createDisplayTextNode = (
  content: string,
  parentId: Statement['id']
): DisplayTextNode => {
  return {
    _type: 'DisplayTextNode',
    id: uuidv4(),
    parentId,
    content,
    editable: false,
    deletable: false,
  };
};

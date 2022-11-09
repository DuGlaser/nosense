import { v4 as uuidv4 } from 'uuid';

import { createEditableNode } from './editableNode';
import { LetStatement } from './node';

// TODO: typeは数値型,文字列型,真偽値型のいずれかしか取り得ないのでいい感じの方にする。
export const createLetStatement = (
  type: string,
  ...varNames: string[]
): LetStatement => {
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

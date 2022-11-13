import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createCursorNode, CursorNode } from './CursorNode';

export interface NewStatement
  extends BaseStatement<PickStatementType<'NewStatement'>> {
  nodes: [CursorNode];
}

export const createNewStatement = ({
  indent,
}: {
  indent: number;
}): NewStatement => {
  const id = uuidv4();
  return {
    id,
    _type: 'NewStatement',
    nodes: [createCursorNode(id)],
    indent,
  };
};

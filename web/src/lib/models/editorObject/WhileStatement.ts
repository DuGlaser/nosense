import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createCursorNode, CursorNode } from './CursorNode';
import { createEditableNode, EditableNode } from './EditableNode';

/**
 * <CursorNode> while (<EditableNode>)
 */
export interface WhileStatementStart
  extends BaseStatement<PickStatementType<'WhileStatementStart'>> {
  nodes: [CursorNode, EditableNode, CursorNode];
}

/**
 * endwhile <CursorNode>
 */
export interface WhileStatementEnd
  extends BaseStatement<PickStatementType<'WhileStatementEnd'>> {
  nodes: [CursorNode];
}

export type CreateWhileStatementStartParams = {
  condition: string;
  indent: number;
};

export const createWhileStatementStart = ({
  condition,
  indent,
}: CreateWhileStatementStartParams): WhileStatementStart => {
  const id = uuidv4();
  return {
    id,
    _type: 'WhileStatementStart',
    nodes: [
      createCursorNode(id),
      createEditableNode({ content: condition, parentId: id }),
      createCursorNode(id),
    ],
    indent,
  };
};

export type CreateWhileStatementEndParams = {
  indent: number;
};

export const createWhileStatementEnd = ({
  indent,
}: CreateWhileStatementEndParams): WhileStatementEnd => {
  const id = uuidv4();
  return {
    id,
    _type: 'WhileStatementEnd',
    nodes: [createCursorNode(id)],
    indent,
  };
};

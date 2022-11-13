import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createCursorNode, CursorNode } from './CursorNode';
import { createEditableNode, EditableNode } from './EditableNode';

/**
 * <CursorNode> while (<EditableNode>)
 */
export interface WhileStatementStart
  extends BaseStatement<PickStatementType<'WhileStatementStart'>> {
  nodes: [CursorNode, EditableNode];
}

/**
 * endwhile <CursorNode>
 */
export interface WhileStatementEnd
  extends BaseStatement<PickStatementType<'WhileStatementEnd'>> {
  nodes: [CursorNode];
}

export const createWhileStatementStart = ({
  condition,
  indent,
}: {
  condition: string;
  indent: number;
}): WhileStatementStart => {
  const id = uuidv4();
  return {
    id,
    _type: 'WhileStatementStart',
    nodes: [createCursorNode(id), createEditableNode(condition, id)],
    indent,
  };
};

export const createWhileStatementEnd = ({
  indent,
}: {
  indent: number;
}): WhileStatementEnd => {
  const id = uuidv4();
  return {
    id,
    _type: 'WhileStatementEnd',
    nodes: [createCursorNode(id)],
    indent,
  };
};

import { v4 as uuidv4 } from 'uuid';

import { BaseStatement, PickStatementType } from '.';
import { createCursorNode, CursorNode } from './CursorNode';
import { createEditableNode, EditableNode } from './EditableNode';

/**
 * <CursorNode> if (<EditableNode>)
 */
export interface IfStatementStart
  extends BaseStatement<PickStatementType<'IfStatementStart'>> {
  nodes: [CursorNode, EditableNode, CursorNode];
}

/**
 * endif <CursorNode>
 */
export interface IfStatementEnd
  extends BaseStatement<PickStatementType<'IfStatementEnd'>> {
  nodes: [CursorNode];
}

/**
 * endif <CursorNode>
 */
export interface IfStatementEnd
  extends BaseStatement<PickStatementType<'IfStatementEnd'>> {
  nodes: [CursorNode];
}

/**
 * else <CursorNode>
 */
export interface IfStatementElse
  extends BaseStatement<PickStatementType<'IfStatementElse'>> {
  nodes: [CursorNode];
}

export type CreateIfStatementStartParams = {
  condition: string;
  indent: number;
};

export const createIfStatementStart = ({
  condition,
  indent,
}: CreateIfStatementStartParams): IfStatementStart => {
  const id = uuidv4();
  return {
    id,
    _type: 'IfStatementStart',
    nodes: [
      createCursorNode(id),
      createEditableNode({ content: condition, parentId: id }),
      createCursorNode(id),
    ],
    indent,
  };
};

export type CreateIfStatementEndParams = {
  indent: number;
};

export const createIfStatementEnd = ({
  indent,
}: CreateIfStatementElseParams): IfStatementEnd => {
  const id = uuidv4();
  return {
    id,
    _type: 'IfStatementEnd',
    nodes: [createCursorNode(id)],
    indent: indent,
  };
};

export type CreateIfStatementElseParams = {
  indent: number;
};

export const createIfStatementElse = ({
  indent,
}: CreateIfStatementElseParams): IfStatementElse => {
  const id = uuidv4();
  return {
    id,
    _type: 'IfStatementElse',
    nodes: [createCursorNode(id)],
    indent: indent,
  };
};

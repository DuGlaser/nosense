export const nodeType = {
  EditableNode: 'EditableNode',
  CursorNode: 'CursorNode',
} as const;

export type NodeType = typeof nodeType[keyof typeof nodeType];
export type PickNodeType<T extends keyof typeof nodeType> = typeof nodeType[T];

export type Node = CursorNode | EditableNode;

export interface BaseNode<T = NodeType> {
  _type: T;
  id: string;
  parentId: BaseStatement['id'];
  ref?: HTMLElement;
  content: string;
  editable: boolean;
  deletable: boolean;
}

export const statementType = {
  LetStatement: 'LetStatement',
  AssignStatement: 'AssignStatement',
  IfStatementStart: 'IfStatementStart',
  IfStatementElse: 'IfStatementElse',
  IfStatementEnd: 'IfStatementEnd',
  NewStatement: 'NewStatement',
} as const;

export type StatementType = typeof statementType[keyof typeof statementType];
export type PickStatementType<T extends keyof typeof statementType> =
  typeof statementType[T];

export type Statement =
  | LetStatement
  | AssignStatement
  | IfStatementStart
  | IfStatementElse
  | IfStatementEnd
  | NewStatement;

interface BaseStatement<T = StatementType> {
  _type: T;
  id: string;
  nodes: Node[];
  indent: number;
}

export interface CursorNode extends BaseNode<PickNodeType<'CursorNode'>> {
  editable: false;
}

export type EditableNode = BaseNode<PickNodeType<'EditableNode'>>;

/**
 * <EditableNode>: <EditableNode>,<EditableNode>...
 */
export interface LetStatement
  extends BaseStatement<PickStatementType<'LetStatement'>> {
  nodes: [EditableNode, ...EditableNode[]];
}

/**
 * <EditableNode> <- <EditableNode>
 */
export interface AssignStatement
  extends BaseStatement<PickStatementType<'AssignStatement'>> {
  nodes: [EditableNode, EditableNode];
}

/**
 * <CursorNode> if (<EditableNode>)
 */
export interface IfStatementStart
  extends BaseStatement<PickStatementType<'IfStatementStart'>> {
  nodes: [CursorNode, EditableNode];
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

export interface NewStatement
  extends BaseStatement<PickStatementType<'NewStatement'>> {
  nodes: [CursorNode];
}

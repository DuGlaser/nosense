import { AssignStatement } from './AssignStatement';
import { CallFunctionStatement } from './CallFunctionStatement';
import { CursorNode } from './CursorNode';
import { DisplayTextNode } from './DisplayTextNode';
import { EditableNode } from './EditableNode';
import { ExpressionStatement } from './ExpressionStatement';
import {
  IfStatementElse,
  IfStatementEnd,
  IfStatementStart,
} from './IfStatement';
import { LetStatement } from './LetStatement';
import { NewStatement } from './NewStatement';
import { WhileStatementEnd, WhileStatementStart } from './WhileStatement';

export const nodeType = {
  CursorNode: 'CursorNode',
  EditableNode: 'EditableNode',
  DisplayTextNode: 'DisplayTextNode',
} as const;

export type NodeType = (typeof nodeType)[keyof typeof nodeType];
export type PickNodeType<T extends keyof typeof nodeType> =
  (typeof nodeType)[T];

export type Node = CursorNode | EditableNode | DisplayTextNode;

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
  AssignStatement: 'AssignStatement',
  CallFunctionStatement: 'CallFunctionStatement',
  ExpressionStatement: 'ExpressionStatement',
  IfStatementElse: 'IfStatementElse',
  IfStatementEnd: 'IfStatementEnd',
  IfStatementStart: 'IfStatementStart',
  LetStatement: 'LetStatement',
  NewStatement: 'NewStatement',
  WhileStatementEnd: 'WhileStatementEnd',
  WhileStatementStart: 'WhileStatementStart',
} as const;

export type StatementType = (typeof statementType)[keyof typeof statementType];
export type PickStatementType<T extends keyof typeof statementType> =
  (typeof statementType)[T];

export type Statement =
  | AssignStatement
  | CallFunctionStatement
  | ExpressionStatement
  | IfStatementElse
  | IfStatementEnd
  | IfStatementStart
  | LetStatement
  | NewStatement
  | WhileStatementEnd
  | WhileStatementStart;

export interface BaseStatement<T = StatementType> {
  _type: T;
  id: string;
  nodes: Node[];
  indent: number;
}

export * from './AssignStatement';
export * from './CallFunctionStatement';
export * from './CursorNode';
export * from './DisplayTextNode';
export * from './EditableNode';
export * from './ExpressionStatement';
export * from './IfStatement';
export * from './LetStatement';
export * from './NewStatement';
export * from './WhileStatement';

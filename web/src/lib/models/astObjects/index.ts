import { AssignStatementObject } from './AssignStatement';
import { ExpressionStatementObject } from './ExpressionStatement';
import { IfStatementObject } from './IfStatement';
import { LetStatementObject } from './LetStatement';
import { WhileStatementObject } from './WhileStatement';

export type AstObject =
  | AssignStatementObject
  | ExpressionStatementObject
  | IfStatementObject
  | LetStatementObject
  | WhileStatementObject
  | undefined;
export interface BaseAstObject<T> {
  _type: T;
}

export * from './AssignStatement';
export * from './ExpressionStatement';
export * from './IfStatement';
export * from './LetStatement';
export * from './typeIdentifier';
export * from './WhileStatement';

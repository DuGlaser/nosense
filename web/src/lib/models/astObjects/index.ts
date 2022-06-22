import { IfStatementObject } from './IfStatement';
import { LetStatementObject } from './LetStatement';
import { WhileStatementObject } from './WhileStatement';

export type AstObject =
  | LetStatementObject
  | IfStatementObject
  | WhileStatementObject
  | undefined;
export interface BaseAstObject<T> {
  _type: T;
}

export * from './IfStatement';
export * from './LetStatement';
export * from './typeIdentifier';
export * from './WhileStatement';

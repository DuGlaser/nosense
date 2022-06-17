import { IfStatementObject } from './IfStatement';
import { LetStatementObject } from './LetStatement';

export type AstObject = LetStatementObject | IfStatementObject | undefined;

export * from './IfStatement';
export * from './LetStatement';
export * from './typeIdentifier';

import { BaseAstObject } from '.';
import { TYPE_IDENTIFIER } from './typeIdentifier';

export interface LetStatementObject extends BaseAstObject<'LetStatement'> {
  typeIdentifier: TYPE_IDENTIFIER;
  expression: string;
  name: string;
}

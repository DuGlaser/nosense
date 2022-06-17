import { TYPE_IDENTIFIER } from './typeIdentifier';

export interface LetStatementObject {
  typeIdentifier: TYPE_IDENTIFIER;
  expression: string;
  name: string;
  meta: {
    indentLevel: number;
  };
}

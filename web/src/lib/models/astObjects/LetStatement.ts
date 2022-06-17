import { TYPE_IDENTIFIER } from './typeIdentifier';

export interface LetStatementObject {
  _type: 'LetStatement';
  typeIdentifier: TYPE_IDENTIFIER;
  expression: string;
  name: string;
  meta: {
    indentLevel: number;
  };
}

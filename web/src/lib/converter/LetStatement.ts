import { LetStatement, TOKEN } from '@nosense/damega';
import { match } from 'ts-pattern';

import { LetStatementObject, TYPE_IDENTIFIER } from '@/lib/models/astObjects';

export const convert2LetStatementObject = (
  stmt: LetStatement,
  indentLevel = 0
): LetStatementObject => {
  const typeIdentifier = match(stmt.type.token.type)
    .with(TOKEN.TYPE_NUMBER, () => TYPE_IDENTIFIER.NUMBER)
    .with(TOKEN.TYPE_STRING, () => TYPE_IDENTIFIER.STRING)
    .with(TOKEN.TYPE_BOOLEAN, () => TYPE_IDENTIFIER.BOOLEAN)
    .run();

  if (!typeIdentifier) {
    console.error(`typeIdentifier is invalid.`, stmt.type.token);
  }

  return {
    _type: 'LetStatement',
    typeIdentifier,
    expression: stmt.value.string(),
    name: stmt.name.string(),
    meta: {
      indentLevel,
    },
  };
};

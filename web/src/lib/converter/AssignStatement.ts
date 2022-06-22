import { AssignStatement } from '@nosense/damega';

import { AssignStatementObject } from '@/lib/models/astObjects';

export const convert2AssignStatementObject = (
  stmt: AssignStatement
): AssignStatementObject => {
  return {
    _type: 'AssignStatement',
    value: stmt.value.string(),
    name: stmt.name.string(),
  };
};

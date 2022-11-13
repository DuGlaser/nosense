import { BlockStatement } from '@nosense/damega';

import { Statement } from '@/lib/models/editorObject';

import { statementConvertor } from '.';

export const blockStatementConvertor = {
  fromDamega: (stmt: BlockStatement, indent: number): Statement[] => {
    return stmt.statements.flatMap((s) =>
      statementConvertor.fromDamega(s, indent)
    );
  },
};

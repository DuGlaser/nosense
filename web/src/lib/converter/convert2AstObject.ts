import { LetStatement, Node } from '@nosense/damega';
import { match, P } from 'ts-pattern';

import { convert2LetStatementObject } from './LetStatement';

export const convert2AstObject = (node: Node, indentLevel = 0) => {
  return match(node)
    .with(P.instanceOf(LetStatement), (n) =>
      convert2LetStatementObject(n, indentLevel)
    )
    .otherwise(() => undefined);
};

import { IfStatement, LetStatement, Node } from '@nosense/damega';
import { match, P } from 'ts-pattern';

import { AstObject } from '@/lib/models/astObjects';

import { convert2IfStatementObject } from './IfStatement';
import { convert2LetStatementObject } from './LetStatement';

export const convert2AstObject = (node: Node, indentLevel = 0): AstObject => {
  return match(node)
    .with(P.instanceOf(LetStatement), (n) =>
      convert2LetStatementObject(n, indentLevel)
    )
    .with(P.instanceOf(IfStatement), (n) =>
      convert2IfStatementObject(n, indentLevel)
    )
    .otherwise(() => undefined);
};

import { IfStatement, LetStatement, Node } from '@nosense/damega';
import { match, P } from 'ts-pattern';

import { AstObject } from '@/lib/models/astObjects';

import { convert2IfStatementObject } from './IfStatement';
import { convert2LetStatementObject } from './LetStatement';

export const convert2AstObject = (node: Node): AstObject => {
  return match(node)
    .with(P.instanceOf(LetStatement), (n) => convert2LetStatementObject(n))
    .with(P.instanceOf(IfStatement), (n) => convert2IfStatementObject(n))
    .otherwise(() => undefined);
};

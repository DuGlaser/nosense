import {
  AssignStatement,
  ExpressionStatement,
  IfStatement,
  LetStatement,
  Node,
  WhileStatement,
} from '@nosense/damega';
import { match, P } from 'ts-pattern';

import { AstObject } from '@/lib/models/astObjects';

import { convert2AssignStatementObject } from './AssignStatement';
import { convert2ExpressionStatementObject } from './ExpressionStatement';
import { convert2IfStatementObject } from './IfStatement';
import { convert2LetStatementObject } from './LetStatement';
import { convert2WhileStatementObject } from './WhileStatement';

export const convert2AstObject = (node: Node): AstObject => {
  return match(node)
    .with(P.instanceOf(LetStatement), (n) => convert2LetStatementObject(n))
    .with(P.instanceOf(IfStatement), (n) => convert2IfStatementObject(n))
    .with(P.instanceOf(WhileStatement), (n) => convert2WhileStatementObject(n))
    .with(P.instanceOf(AssignStatement), (n) =>
      convert2AssignStatementObject(n)
    )
    .with(P.instanceOf(ExpressionStatement), (n) =>
      convert2ExpressionStatementObject(n)
    )
    .otherwise(() => undefined);
};

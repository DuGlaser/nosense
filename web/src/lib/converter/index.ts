import {
  AssignStatement,
  BlockStatement,
  IfStatement,
  LetStatement,
  Program,
  Statement as DamegaStatement,
  WhileStatement,
} from '@nosense/damega';
import { match, P } from 'ts-pattern';

import { Statement, statementType } from '@/lib/models/editorObject';

import { assignStatementConvertor } from './AssignStatement';
import { blockStatementConvertor } from './BlockStatement';
import {
  ifStatemestConvertor,
  ifStatemestElseConvertor,
  ifStatemestEndConvertor,
  ifStatemestStartConvertor,
} from './IfStatement';
import { letStatementConvertor } from './LetStatement';
import {
  whileStatemestConvertor,
  whileStatemestEndConvertor,
  whileStatemestStartConvertor,
} from './WhileStatement';

export const statementConvertor = {
  fromDamega: (stmt: DamegaStatement, indent: number): Statement[] => {
    return match(stmt)
      .with(P.instanceOf(AssignStatement), (n) =>
        assignStatementConvertor.fromDamega(n, indent)
      )
      .with(P.instanceOf(BlockStatement), (n) =>
        blockStatementConvertor.fromDamega(n, indent)
      )
      .with(P.instanceOf(IfStatement), (n) =>
        ifStatemestConvertor.fromDamega(n, indent)
      )
      .with(P.instanceOf(LetStatement), (n) =>
        letStatementConvertor.fromDamega(n)
      )
      .with(P.instanceOf(WhileStatement), (n) =>
        whileStatemestConvertor.fromDamega(n, indent)
      )
      .otherwise(() => []);
  },
  toDamega: (stmt: Statement): string => {
    return match(stmt)
      .with({ _type: statementType.AssignStatement }, (n) =>
        assignStatementConvertor.toDamega(n)
      )
      .with({ _type: statementType.IfStatementStart }, (n) =>
        ifStatemestStartConvertor.toDamega(n)
      )
      .with({ _type: statementType.IfStatementElse }, () =>
        ifStatemestElseConvertor.toDamega()
      )
      .with({ _type: statementType.IfStatementEnd }, () =>
        ifStatemestEndConvertor.toDamega()
      )
      .with({ _type: statementType.LetStatement }, (n) =>
        letStatementConvertor.toDamega(n)
      )
      .with({ _type: statementType.WhileStatementStart }, (n) =>
        whileStatemestStartConvertor.toDamega(n)
      )
      .with({ _type: statementType.WhileStatementEnd }, () =>
        whileStatemestEndConvertor.toDamega()
      )
      .otherwise(() => '');
  },
};

export const programConvertor = {
  fromDamega: (program: Program): Statement[] => {
    return program.statements.flatMap((stmt) =>
      statementConvertor.fromDamega(stmt, 0)
    );
  },
  toDamega: (stmts: Statement[]) => {
    return stmts.map((stmt) => statementConvertor.toDamega(stmt)).join('\n');
  },
};

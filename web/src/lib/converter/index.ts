import {
  AssignStatement,
  BlockStatement,
  ExpressionStatement,
  IfStatement,
  LetStatement,
  Program,
  Statement as DamegaStatement,
  WhileStatement,
} from '@nosense/damega';
import { match, P } from 'ts-pattern';

import {
  createAssignStatement,
  CreateAssignStatementParams,
  createCallFunctionStatement,
  CreateCallFunctionStatementParams,
  createExpressionStatement,
  CreateExpressionStatementParams,
  createIfStatementElse,
  CreateIfStatementElseParams,
  createIfStatementEnd,
  CreateIfStatementEndParams,
  createIfStatementStart,
  CreateIfStatementStartParams,
  createLetStatement,
  CreateLetStatementParams,
  createWhileStatementEnd,
  CreateWhileStatementEndParams,
  createWhileStatementStart,
  CreateWhileStatementStartParams,
  Statement,
  StatementType,
  statementType,
  statementTypeLiteral,
} from '@/lib/models/editorObject';

import { assignStatementConvertor } from './AssignStatement';
import { blockStatementConvertor } from './BlockStatement';
import { callFunctionStatementConvertor } from './CallFunctionStatement';
import { expressionStatementConvertor } from './ExpressionStatement';
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

export type Convert2CreatorParams<T, K extends StatementType> = {
  _type: (typeof statementTypeLiteral)[K];
  params: T;
};

export type CreatorParams =
  | Convert2CreatorParams<CreateAssignStatementParams, 'AssignStatement'>
  | Convert2CreatorParams<
      CreateCallFunctionStatementParams,
      'CallFunctionStatement'
    >
  | Convert2CreatorParams<
      CreateExpressionStatementParams,
      'ExpressionStatement'
    >
  | Convert2CreatorParams<CreateIfStatementStartParams, 'IfStatementStart'>
  | Convert2CreatorParams<CreateIfStatementElseParams, 'IfStatementElse'>
  | Convert2CreatorParams<CreateIfStatementEndParams, 'IfStatementEnd'>
  | Convert2CreatorParams<CreateLetStatementParams, 'LetStatement'>
  | Convert2CreatorParams<
      CreateWhileStatementStartParams,
      'WhileStatementStart'
    >
  | Convert2CreatorParams<CreateWhileStatementEndParams, 'WhileStatementEnd'>;

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
      .with(P.instanceOf(ExpressionStatement), (n) =>
        expressionStatementConvertor.fromDamega(n, indent)
      )
      .otherwise(() => []);
  },
  fromCreatorParams: (params: CreatorParams): Statement | undefined => {
    return match(params)
      .with(
        { _type: statementTypeLiteral[statementType.AssignStatement] },
        (n) => createAssignStatement(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.CallFunctionStatement] },
        (n) => createCallFunctionStatement(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.ExpressionStatement] },
        (n) => createExpressionStatement(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.IfStatementStart] },
        (n) => createIfStatementStart(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.IfStatementElse] },
        (n) => createIfStatementElse(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.IfStatementEnd] },
        (n) => createIfStatementEnd(n.params)
      )
      .with({ _type: statementTypeLiteral[statementType.LetStatement] }, (n) =>
        createLetStatement(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.WhileStatementStart] },
        (n) => createWhileStatementStart(n.params)
      )
      .with(
        { _type: statementTypeLiteral[statementType.WhileStatementEnd] },
        (n) => createWhileStatementEnd(n.params)
      )
      .otherwise(() => undefined);
  },
  toCreatorParams: (stmt: Statement): CreatorParams | undefined => {
    return match(stmt)
      .with({ _type: statementType.AssignStatement }, (n) =>
        assignStatementConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.CallFunctionStatement }, (n) =>
        callFunctionStatementConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.ExpressionStatement }, (n) =>
        expressionStatementConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.IfStatementStart }, (n) =>
        ifStatemestStartConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.IfStatementElse }, (n) =>
        ifStatemestElseConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.IfStatementEnd }, (n) =>
        ifStatemestEndConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.LetStatement }, (n) =>
        letStatementConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.WhileStatementStart }, (n) =>
        whileStatemestStartConvertor.toCreatorParams(n)
      )
      .with({ _type: statementType.WhileStatementEnd }, (n) =>
        whileStatemestEndConvertor.toCreatorParams(n)
      )
      .otherwise(() => undefined);
  },
  toDamega: (stmt: Statement): string => {
    return match(stmt)
      .with({ _type: statementType.AssignStatement }, (n) =>
        assignStatementConvertor.toDamega(n)
      )
      .with({ _type: statementType.CallFunctionStatement }, (n) =>
        callFunctionStatementConvertor.toDamega(n)
      )
      .with({ _type: statementType.ExpressionStatement }, (n) =>
        expressionStatementConvertor.toDamega(n)
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
      .with({ _type: statementType.NewStatement }, () => '')
      .exhaustive();
  },
};

export const programConvertor = {
  fromDamega: (program: Program): Statement[] => {
    return program.statements.flatMap((stmt) =>
      statementConvertor.fromDamega(stmt, 0)
    );
  },
  fromCreatorParams: (paramsList: CreatorParams[]): Statement[] => {
    return paramsList
      .map((params) => statementConvertor.fromCreatorParams(params))
      .filter((item): item is Statement => !!item);
  },
  toCreatorParams: (stmts: Statement[]): CreatorParams[] => {
    return stmts
      .map((stmt) => statementConvertor.toCreatorParams(stmt))
      .filter((item): item is CreatorParams => !!item);
  },
  toDamega: (stmts: Statement[]) => {
    return stmts.map((stmt) => statementConvertor.toDamega(stmt)).join('\n');
  },
};

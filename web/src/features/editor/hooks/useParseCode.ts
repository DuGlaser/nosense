import {
  createAssignStatement,
  createIfStatementElse,
  createIfStatementEnd,
  createIfStatementStart,
  createLetStatement,
  Statement,
} from '@editor/lib';
import { useInsertStatement } from '@editor/store';
import { Lexer, Parser } from '@nosense/damega';
import { useEffect, useRef } from 'react';
import { match } from 'ts-pattern';

import { convert2AstObject } from '@/lib/converter';
import { AstObject } from '@/lib/models/astObjects';

const parse = (code: string): AstObject[] => {
  if (code === '') return [];

  const l = new Lexer(code);
  const p = new Parser(l);
  const program = p.parseToken();
  if (p.errors.length > 0) {
    console.error(p.errors);
    return [];
  }
  return program.statements.map((_) => convert2AstObject(_));
};

export const useParseCode = (code: string) => {
  const lastId = useRef<string | undefined>(undefined);
  const _insertStatement = useInsertStatement();

  const insertStatement = (stmt: Statement) => {
    _insertStatement(lastId.current, stmt);
    lastId.current = stmt.id;
  };

  const insertStatements = (astObjects: AstObject[], indent: number) => {
    const currentIndent = indent;
    astObjects.forEach((astObject) => {
      if (!astObject?._type) return;

      match(astObject)
        .with({ _type: 'LetStatement' }, (stmt) => {
          const letStmt = createLetStatement(stmt.typeIdentifier, stmt.name);
          insertStatement(letStmt);
        })
        .with({ _type: 'AssignStatement' }, (stmt) => {
          const assignStmt = createAssignStatement(
            stmt.name,
            stmt.value,
            currentIndent
          );
          insertStatement(assignStmt);
        })
        .with({ _type: 'IfStatement' }, (stmt) => {
          const ifStartStmt = createIfStatementStart(
            stmt.condition,
            currentIndent
          );
          insertStatement(ifStartStmt);
          insertStatements(stmt.consequence, currentIndent + 1);

          if (stmt.alternative) {
            const ifElseStmt = createIfStatementElse(currentIndent);
            insertStatement(ifElseStmt);
            insertStatements(stmt.alternative, currentIndent + 1);
          }

          const ifEndStmt = createIfStatementEnd(currentIndent);
          insertStatement(ifEndStmt);
        })
        .run();
    });
  };

  useEffect(() => {
    const parsed = parse(code);
    insertStatements(parsed, 0);
  }, [code]);
};

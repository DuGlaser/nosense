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
import { useEffect } from 'react';
import { match } from 'ts-pattern';

import { convert2AstObject } from '@/lib/converter';
import { AstObject } from '@/lib/models/astObjects';

const parse2AstObjects = (code: string): AstObject[] => {
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
  const insertStatement = useInsertStatement();

  const parse2EditorStatements = (
    astObjects: AstObject[],
    indent: number
  ): Statement[] => {
    const currentIndent = indent;
    return astObjects.reduce((statements, astObject) => {
      const parsed = match(astObject)
        .with({ _type: 'LetStatement' }, (stmt) => {
          return createLetStatement(stmt.typeIdentifier, stmt.name);
        })
        .with({ _type: 'AssignStatement' }, (stmt) => {
          return createAssignStatement(stmt.name, stmt.value, currentIndent);
        })
        .with({ _type: 'IfStatement' }, (stmt) => {
          let statements: Statement[] = [];
          statements.push(
            createIfStatementStart(stmt.condition, currentIndent)
          );
          statements = statements.concat(
            parse2EditorStatements(stmt.consequence, currentIndent + 1)
          );

          if (stmt.alternative) {
            statements.push(createIfStatementElse(currentIndent));
            statements = statements.concat(
              parse2EditorStatements(stmt.alternative, currentIndent + 1)
            );
          }

          statements.push(createIfStatementEnd(currentIndent));

          return statements;
        })
        .run();

      if (Array.isArray(parsed)) {
        return statements.concat(parsed);
      }

      return statements.concat([parsed]);
    }, [] as Statement[]);
  };

  useEffect(() => {
    const astObjects = parse2AstObjects(code);
    const editorStatemnts = parse2EditorStatements(astObjects, 0);
    insertStatement(undefined, editorStatemnts);
  }, [code]);
};

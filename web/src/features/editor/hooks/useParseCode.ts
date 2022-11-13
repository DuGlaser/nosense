import { useInsertStatement } from '@editor/store';
import { Lexer, Parser } from '@nosense/damega';
import { useEffect } from 'react';

import { programConvertor } from '@/lib/converter';
import { Statement } from '@/lib/models/editorObject';

const parse2EditorStatements = (code: string): Statement[] => {
  if (code === '') return [];

  const l = new Lexer(code);
  const p = new Parser(l);
  const program = p.parseToken();
  if (p.errors.length > 0) {
    console.error(p.errors);
    return [];
  }

  return programConvertor.fromDamega(program);
};

export const useParseCode = (code: string) => {
  const insertStatement = useInsertStatement();

  useEffect(() => {
    const editorStatemnts = parse2EditorStatements(code);
    insertStatement(undefined, editorStatemnts);
  }, [code]);
};

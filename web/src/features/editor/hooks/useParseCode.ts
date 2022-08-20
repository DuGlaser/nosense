import { Lexer, Parser } from '@nosense/damega';
import { useMemo } from 'react';

import { convert2AstObject } from '@/lib/converter';

const parse = (code: string) => {
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
  return useMemo(() => {
    return parse(code);
  }, [code]);
};

import { Lexer, Parser } from '@nosense/damega';
import { useEffect, useState } from 'react';

import { convert2AstObject } from '@/lib/converter';
import { AstObject } from '@/lib/models/astObjects';

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
  const [astObjects, setAstObjects] = useState<AstObject[]>(() => parse(code));

  useEffect(() => {
    if (code === '') return;
    setAstObjects(parse(code));
  }, [code]);

  return [astObjects, setAstObjects] as const;
};

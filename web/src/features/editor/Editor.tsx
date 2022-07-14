import { Box, Stack, styled } from '@mui/material';
import { Lexer, Parser } from '@nosense/damega';
import dynamic from 'next/dynamic';

import { convert2AstObject } from '@/lib/converter';

import { calcLinesNumber } from './calcLineNumber';

const ReactEditorJS = dynamic<any>(
  () => import('./components').then((mod) => mod.ReactEditorJS),
  { ssr: false }
);

const input = `
let x: number = 10;

while (x > 10) {
  x = x + 1;
}

let pass: bool = true;

if (x > 10) {
  pass = false;
} else {
  pass = true;
}
`;

const l = new Lexer(input);
const p = new Parser(l);
const program = p.parseToken();
const astObjects = program.statements.map((_) => convert2AstObject(_));
const lineNumber = calcLinesNumber(astObjects);

const CStack = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.background[900],
  color: theme.background.contrast[900],
  height: '100vh',
}));

const CBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.background[800],
  width: '30px',
  height: '100%',
}));

export const Editor = () => {
  return (
    <CStack direction={'row'} spacing={'8px'}>
      <CBox />
      {/* <EditorLineNumber lineNumber={lineNumber} /> */}
      {/* <BlockStatements> */}
      {/*   {astObjects.map((astObject, i) => ( */}
      {/*     <EditorStatement key={i} astObject={astObject} /> */}
      {/*   ))} */}
      {/* </BlockStatements> */}
      <ReactEditorJS />
    </CStack>
  );
};

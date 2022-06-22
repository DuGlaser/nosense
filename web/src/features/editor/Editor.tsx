import { Box, Stack } from '@mui/material';
import { Lexer, Parser } from '@nosense/damega';

import { convert2AstObject } from '@/lib/converter';

import { calcLinesNumber } from './calcLineNumber';
import {
  BlockStatements,
  EditorLineNumber,
  EditorStatement,
} from './components';

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

export const Editor = () => {
  return (
    <Stack
      direction={'row'}
      spacing={'8px'}
      sx={{
        bgcolor: '#222831',
        color: '#EEEEEE',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(57, 62, 70, 0.5)',
          width: '30px',
          height: '100%',
        }}
      />
      <EditorLineNumber lineNumber={lineNumber} />
      <BlockStatements>
        {astObjects.map((astObject, i) => (
          <EditorStatement key={i} astObject={astObject} />
        ))}
      </BlockStatements>
    </Stack>
  );
};

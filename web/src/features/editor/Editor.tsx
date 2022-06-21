import { Box, Stack } from '@mui/material';
import { Lexer, Parser } from '@nosense/damega';

import { convert2AstObject } from '@/lib/converter/convert2AstObject';

import {
  BlockStatements,
  EditorLineNumber,
  EditorLinesWrapper,
  EditorLineWrapper,
  EditorStatement,
} from './components';

const input = `
let x: number = 10;
let x: bool = true;
let x: number = 10;
let x: number = 10;
let x: number = 10;
let x: number = 10;
let x: bool = true;
let x: number = 10;
let x: number = 10;
let x: number = 10;

if (true) {
  if (false) {
    let x: number = 10;
  }
} else {
  let x: number = 10;
}
`;

const l = new Lexer(input);
const p = new Parser(l);
const program = p.parseToken();
const astObjects = program.statements.map((_) => convert2AstObject(_));

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
      <EditorLinesWrapper>
        {[...Array(17)].map((_, i) => (
          <EditorLineWrapper key={i}>
            <EditorLineNumber lineNumber={i + 1} />
          </EditorLineWrapper>
        ))}
      </EditorLinesWrapper>
      <BlockStatements>
        {astObjects.map((astObject, i) => (
          <EditorStatement key={i} astObject={astObject} />
        ))}
      </BlockStatements>
    </Stack>
  );
};

import { useParseCode } from '@editor/hooks/useParseCode';
import { Box, Stack, styled } from '@mui/material';

import { BlockStatements, EditorStatement } from './components';

const CStack = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.background[900],
  color: theme.background.contrast[900],
  height: '100%',
}));

export const Editor: React.FC<{ code: string }> = ({ code }) => {
  const [astObjects] = useParseCode(code);

  return (
    <CStack direction={'row'} spacing={'8px'}>
      <Box
        sx={{
          padding: '16px',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <BlockStatements>
          {astObjects.map((astObject, i) => (
            <EditorStatement key={i} astObject={astObject} />
          ))}
        </BlockStatements>
      </Box>
    </CStack>
  );
};

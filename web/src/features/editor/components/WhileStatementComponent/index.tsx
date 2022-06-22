import {
  BlockStatements,
  EditorLineWrapper,
  EditorStatement,
} from '@editor/components';
import { StatementProps } from '@editor/type';
import { Box, Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { WhileStatementObject } from '@/lib/models/astObjects';

const WhileLabel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        bgcolor: '#FB94FF',
        fontWeight: 'bold',
        px: '24px',
        height: '100%',
        borderRadius: '4px',
      }}
    >
      {children}
    </Box>
  );
};

export const WhileStatementComponent: FC<
  StatementProps<WhileStatementObject>
> = ({ astObject }) => {
  return (
    <BlockStatements>
      <EditorLineWrapper>
        <Stack direction={'row'} spacing={'4px'}>
          <WhileLabel>while</WhileLabel>
          <Box>({astObject.condition})</Box>
        </Stack>
      </EditorLineWrapper>
      <BlockStatements nested>
        {astObject.consequence.map((stmt, i) => (
          <EditorStatement key={i} astObject={stmt} />
        ))}
      </BlockStatements>
      <EditorLineWrapper>
        <WhileLabel>end</WhileLabel>
      </EditorLineWrapper>
    </BlockStatements>
  );
};

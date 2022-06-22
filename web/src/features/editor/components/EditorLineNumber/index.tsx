import { EditorLineWrapper } from '@editor/components';
import { Box } from '@mui/material';
import { FC } from 'react';

type EditorLineNumberProps = {
  lineNumber: number;
};

export const EditorLineNumber: FC<EditorLineNumberProps> = ({ lineNumber }) => {
  return (
    <EditorLineWrapper>
      <Box sx={{ color: '#b3b3b3', textAlign: 'end' }}>{lineNumber}</Box>
    </EditorLineWrapper>
  );
};

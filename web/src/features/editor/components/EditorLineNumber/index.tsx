import { EditorLinesWrapper, EditorLineWrapper } from '@editor/components';
import { Box } from '@mui/material';
import { FC } from 'react';

export const EditorLineNumber: FC<{ lineNumber: number }> = ({
  lineNumber,
}) => {
  return (
    <EditorLinesWrapper>
      {[...Array(lineNumber)].map((_, i) => (
        <EditorLineWrapper key={i}>
          <Box sx={{ color: '#b3b3b3', textAlign: 'end' }}>{i + 1}</Box>
        </EditorLineWrapper>
      ))}
    </EditorLinesWrapper>
  );
};

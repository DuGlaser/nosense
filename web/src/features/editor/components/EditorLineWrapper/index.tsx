import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const EditorLineWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        fontSize: '16px',
        p: 0,
        height: '24px',
      }}
    >
      {children}
    </Box>
  );
};

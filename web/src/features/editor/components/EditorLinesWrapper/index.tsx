import { Stack, SxProps, Theme } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const EditorLinesWrapper: FC<
  PropsWithChildren<{ sx?: SxProps<Theme> }>
> = ({ sx = [], children }) => {
  return (
    <Stack
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Stack>
  );
};

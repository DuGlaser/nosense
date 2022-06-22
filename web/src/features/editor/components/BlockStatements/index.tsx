import { EditorLinesWrapper } from '@editor/components';
import { SxProps, Theme } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const BlockStatements: FC<
  PropsWithChildren<{ nested?: boolean; sx?: SxProps<Theme> }>
> = ({ children, nested = false, sx = [] }) => {
  return (
    <EditorLinesWrapper
      sx={[
        {
          ml: nested ? 4 : 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </EditorLinesWrapper>
  );
};

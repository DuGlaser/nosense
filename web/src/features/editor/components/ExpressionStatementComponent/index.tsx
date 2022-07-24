import { EditorLineWrapper } from '@editor/components';
import { StatementProps } from '@editor/type';
import { Box } from '@mui/material';
import { FC } from 'react';

import { ExpressionStatementObject } from '@/lib/models/astObjects';

export const ExpressionStatementComponent: FC<
  StatementProps<ExpressionStatementObject>
> = ({ astObject }) => {
  return (
    <EditorLineWrapper>
      <Box>{astObject.expression}</Box>
    </EditorLineWrapper>
  );
};

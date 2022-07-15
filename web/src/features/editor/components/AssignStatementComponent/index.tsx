import { EditorLineWrapper } from '@editor/components';
import { StatementProps } from '@editor/type';
import { ArrowBack } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { FC } from 'react';

import { AssignStatementObject } from '@/lib/models/astObjects';

export const AssignStatementComponent: FC<
  StatementProps<AssignStatementObject>
> = ({ astObject }) => {
  return (
    <EditorLineWrapper>
      <Stack direction={'row'} spacing={'5px'} alignItems={'center'}>
        <Box>{astObject.name}</Box>
        <ArrowBack fontSize={'inherit'} />
        <Box>{astObject.value}</Box>
      </Stack>
    </EditorLineWrapper>
  );
};

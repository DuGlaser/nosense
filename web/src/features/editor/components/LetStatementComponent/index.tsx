import { Box, Stack } from '@mui/material';
import { FC } from 'react';
import { match } from 'ts-pattern';

import { EditorLineWrapper } from '@/features/editor/components';
import { StatementProps } from '@/features/editor/type';
import { LetStatementObject, TYPE_IDENTIFIER } from '@/lib/models/astObjects';

export const LetStatementComponent: FC<StatementProps<LetStatementObject>> = ({
  astObject,
}) => {
  const typeLabel = match(astObject.typeIdentifier)
    .with(TYPE_IDENTIFIER.NUMBER, () => '数値型')
    .with(TYPE_IDENTIFIER.STRING, () => '文字列型')
    .with(TYPE_IDENTIFIER.BOOLEAN, () => '論理型')
    .exhaustive();

  return (
    <EditorLineWrapper>
      <Stack direction={'row'} spacing={'4px'}>
        <Box
          sx={{
            color: '#F2CB44',
          }}
        >
          {typeLabel}
        </Box>
        <Box>:</Box>
        <Box>{astObject.name}</Box>
      </Stack>
    </EditorLineWrapper>
  );
};

import {
  AutocompleteInput,
  CompleteOption,
  EditorLineWrapper,
} from '@editor/components';
import { StatementProps } from '@editor/type';
import { Box, Stack } from '@mui/material';
import { FC } from 'react';
import { match } from 'ts-pattern';

import { LetStatementObject, TYPE_IDENTIFIER } from '@/lib/models/astObjects';

const options: CompleteOption[] = [
  { displayName: '数値型', keyword: ['number', 'すうちがた', '数値型'] },
  { displayName: '文字列型', keyword: ['string', 'もじれつがた', '文字列型'] },
  { displayName: '論理型', keyword: ['bool', 'ろんりがた', '論理型'] },
];

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
        <AutocompleteInput
          sx={{
            color: '#F2CB44',
          }}
          options={options}
          defaultValue={typeLabel}
        />
        <Box>:</Box>
        <Box>{astObject.name}</Box>
      </Stack>
    </EditorLineWrapper>
  );
};

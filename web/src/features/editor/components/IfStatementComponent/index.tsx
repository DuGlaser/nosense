import {
  BlockStatements,
  EditableCode,
  EditorLineWrapper,
  EditorStatement,
} from '@editor/components';
import { StatementProps } from '@editor/type';
import { Box, Stack } from '@mui/material';
import { FC, PropsWithChildren, useCallback } from 'react';

import { IfStatementObject } from '@/lib/models/astObjects';

const IfLabel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        bgcolor: '#EF557A',
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

export const IfStatementComponent: FC<StatementProps<IfStatementObject>> = ({
  astObject,
}) => {
  const handleValidateCondition = useCallback((value: string) => {
    const r = new RegExp(/\(.+\)/);
    return r.test(value);
  }, []);

  return (
    <BlockStatements>
      <EditorLineWrapper>
        <Stack direction={'row'} spacing={'4px'}>
          <IfLabel>if</IfLabel>
          <Box>
            <EditableCode
              defaultValue={`(${astObject.condition})`}
              validator={handleValidateCondition}
            />
          </Box>
        </Stack>
      </EditorLineWrapper>
      <BlockStatements nested>
        {astObject.consequence.map((stmt, i) => (
          <EditorStatement key={i} astObject={stmt} />
        ))}
      </BlockStatements>
      {astObject.alternative && (
        <>
          <EditorLineWrapper>
            <IfLabel>else</IfLabel>
          </EditorLineWrapper>
          <BlockStatements nested>
            {astObject.alternative.map((stmt, i) => (
              <EditorStatement key={i} astObject={stmt} />
            ))}
          </BlockStatements>
        </>
      )}
      <EditorLineWrapper>
        <IfLabel>end</IfLabel>
      </EditorLineWrapper>
    </BlockStatements>
  );
};

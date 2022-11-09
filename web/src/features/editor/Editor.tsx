import {
  AssignStatementComponent,
  IfStatementElseComponent,
  IfStatementEndComponent,
  IfStatementStartComponent,
  LetStatementComponent,
} from '@editor/components';
import { useParseCode } from '@editor/hooks/useParseCode';
import { Statement, statementType } from '@editor/lib';
import { Box, Stack, styled } from '@mui/material';
import { match } from 'ts-pattern';

import { NewStatementComponent } from './components/NewStatementComponent';
import { useStatementList } from './store';

const CStack = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.background[900],
  color: theme.background.contrast[900],
  height: '100%',
}));

const StatementComponent: React.FC<{
  id: Statement['id'];
  type: Statement['_type'];
}> = ({ id, type }) => {
  return match(type)
    .with(statementType.LetStatement, () => <LetStatementComponent id={id} />)
    .with(statementType.AssignStatement, () => (
      <AssignStatementComponent id={id} />
    ))
    .with(statementType.IfStatementStart, () => (
      <IfStatementStartComponent id={id} />
    ))
    .with(statementType.IfStatementElse, () => (
      <IfStatementElseComponent id={id} />
    ))
    .with(statementType.IfStatementEnd, () => (
      <IfStatementEndComponent id={id} />
    ))
    .with(statementType.NewStatement, () => <NewStatementComponent id={id} />)
    .exhaustive();
};

export const Editor: React.FC<{ code: string }> = ({ code }) => {
  const statementList = useStatementList();
  useParseCode(code);

  return (
    <CStack direction={'row'} spacing={'8px'}>
      <Box
        sx={{
          padding: '16px',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {statementList.map((item) => (
          <StatementComponent key={item.id} id={item.id} type={item._type} />
        ))}
      </Box>
    </CStack>
  );
};

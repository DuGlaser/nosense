import {
  AssignStatementComponent,
  CallFunctionStatementComponent,
  ExpressionStatementComponent,
  IfStatementElseComponent,
  IfStatementEndComponent,
  IfStatementStartComponent,
  LetStatementComponent,
  WhileStatementEndComponent,
  WhileStatementStartComponent,
} from '@editor/components';
import { useParseCode } from '@editor/hooks';
import { Box, Stack, styled } from '@mui/material';
import { match } from 'ts-pattern';

import { Statement, statementType } from '@/lib/models/editorObject';

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
  active: boolean;
  lineNumber: number;
}> = ({ type, ...rest }) => {
  return match(type)
    .with(statementType.LetStatement, () => <LetStatementComponent {...rest} />)
    .with(statementType.AssignStatement, () => (
      <AssignStatementComponent {...rest} />
    ))
    .with(statementType.ExpressionStatement, () => (
      <ExpressionStatementComponent {...rest} />
    ))
    .with(statementType.IfStatementStart, () => (
      <IfStatementStartComponent {...rest} />
    ))
    .with(statementType.IfStatementElse, () => (
      <IfStatementElseComponent {...rest} />
    ))
    .with(statementType.IfStatementEnd, () => (
      <IfStatementEndComponent {...rest} />
    ))
    .with(statementType.NewStatement, () => <NewStatementComponent {...rest} />)
    .with(statementType.WhileStatementEnd, () => (
      <WhileStatementEndComponent {...rest} />
    ))
    .with(statementType.WhileStatementStart, () => (
      <WhileStatementStartComponent {...rest} />
    ))
    .with(statementType.CallFunctionStatement, () => (
      <CallFunctionStatementComponent {...rest} />
    ))
    .exhaustive();
};

type Props = {
  code: string;
  activeLineNumbers: number[];
};

export const Editor: React.FC<Props> = ({ code, activeLineNumbers }) => {
  const statementList = useStatementList();
  useParseCode(code);

  return (
    <CStack direction={'row'} spacing={'8px'}>
      <Box
        sx={{
          padding: '16px 8px',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {statementList.map((item, i) => (
          <StatementComponent
            active={activeLineNumbers.includes(i + 1)}
            key={item.id}
            id={item.id}
            type={item._type}
            lineNumber={i + 1}
          />
        ))}
      </Box>
    </CStack>
  );
};

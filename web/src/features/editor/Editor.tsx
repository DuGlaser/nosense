import {
  AssignStatementComponent,
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
import { RecoilSync } from 'recoil-sync';
import { match } from 'ts-pattern';

import { Statement, statementType } from '@/lib/models/editorObject';

import { NewStatementComponent } from './components/NewStatementComponent';
import { EDITOR_MODE_STORE_KEY, useStatementList } from './store';
import { Mode } from './type';

const CStack = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.background[900],
  color: theme.background.contrast[900],
  height: '100%',
}));

const StatementComponent: React.FC<{
  id: Statement['id'];
  type: Statement['_type'];
  active: boolean;
}> = ({ id, type, active }) => {
  return match(type)
    .with(statementType.LetStatement, () => (
      <LetStatementComponent id={id} active={active} />
    ))
    .with(statementType.AssignStatement, () => (
      <AssignStatementComponent id={id} active={active} />
    ))
    .with(statementType.ExpressionStatement, () => (
      <ExpressionStatementComponent id={id} active={active} />
    ))
    .with(statementType.IfStatementStart, () => (
      <IfStatementStartComponent id={id} active={active} />
    ))
    .with(statementType.IfStatementElse, () => (
      <IfStatementElseComponent id={id} active={active} />
    ))
    .with(statementType.IfStatementEnd, () => (
      <IfStatementEndComponent id={id} active={active} />
    ))
    .with(statementType.NewStatement, () => <NewStatementComponent id={id} />)
    .with(statementType.WhileStatementEnd, () => (
      <WhileStatementEndComponent id={id} active={active} />
    ))
    .with(statementType.WhileStatementStart, () => (
      <WhileStatementStartComponent id={id} active={active} />
    ))
    .exhaustive();
};

type Props = {
  code: string;
  activeLineNumbers: number[];
  mode: Mode;
};

export const Editor: React.FC<Props> = ({ code, activeLineNumbers, mode }) => {
  const statementList = useStatementList();
  useParseCode(code);

  return (
    <RecoilSync
      storeKey={EDITOR_MODE_STORE_KEY}
      read={() => {
        return mode;
      }}
      listen={({ updateItem }) => {
        updateItem(EDITOR_MODE_STORE_KEY, mode);
      }}
    >
      <CStack direction={'row'} spacing={'8px'}>
        <Box
          sx={{
            padding: '16px',
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
            />
          ))}
        </Box>
      </CStack>
    </RecoilSync>
  );
};

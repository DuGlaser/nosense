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
import { Box, Stack, styled } from '@mui/material';
import { match } from 'ts-pattern';

import { Statement, statementType } from '@/lib/models/editorObject';

import { NewStatementComponent } from './components/NewStatementComponent';
import { useEditorStatements } from './store';

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

const SectionLabelWrapper = styled('div')(() => ({
  width: '100%',
}));

const DeclarativeSectionLabel = styled('div')(() => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  margin: '8px 16px',
  padding: '4px 8px',
}));

const ImperativeSectionLabel = styled('div')(() => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  width: 'auto',
  margin: '24px 16px 8px',
  padding: '4px 8px',
}));

type Props = {
  activeLineNumbers: number[];
};

export const Editor: React.FC<Props> = ({ activeLineNumbers }) => {
  const { declarative, imperative } = useEditorStatements();

  return (
    <CStack direction={'row'} spacing={'8px'}>
      <Box
        sx={{
          padding: '16px 8px',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <SectionLabelWrapper>
          <DeclarativeSectionLabel>宣言部</DeclarativeSectionLabel>
        </SectionLabelWrapper>
        {declarative.map(({ statement, lineNumber }) => (
          <StatementComponent
            active={activeLineNumbers.includes(lineNumber)}
            key={statement.id}
            id={statement.id}
            type={statement._type}
            lineNumber={lineNumber}
          />
        ))}
        <SectionLabelWrapper>
          <ImperativeSectionLabel>命令部</ImperativeSectionLabel>
        </SectionLabelWrapper>
        {imperative.map(({ statement, lineNumber }) => (
          <StatementComponent
            active={activeLineNumbers.includes(lineNumber)}
            key={statement.id}
            id={statement.id}
            type={statement._type}
            lineNumber={lineNumber}
          />
        ))}
      </Box>
    </CStack>
  );
};

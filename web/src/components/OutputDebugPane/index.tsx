import {
  keyframes,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { ExecDebug, useDebug } from '@/store';

const Wrapper = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  height: '100%',
}));

const ExecLineHistoryWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minWidth: '240px',
}));

const ExecLineHistoryFooter = styled('div')(({ theme }) => ({
  height: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.primary[800],
  color: theme.primary.contrast[800],
}));

const History = styled('div')<{ selected: number }>(({ theme, selected }) => ({
  display: 'flex',
  gap: '16px',
  padding: '8px 16px',
  background: selected ? theme.background[700] : theme.background[800],
  cursor: 'pointer',
}));

const Histories = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  background: theme.background[800],
  overflowY: 'auto',
}));

const ExecResultTag = styled('div')(({ theme }) => ({
  padding: '4px 8px',
  background: theme.primary[600],
  color: theme.primary.contrast[600],
  fontSize: '12px',
  borderRadius: '4px',
}));

const ExecLineInfo = styled('div')(() => ({
  flex: 1,
}));

const DebugContent = styled('div')(({ theme }) => ({
  background: theme.background[800],
  margin: '0 32px',
}));

const UpdateValueAnimation = keyframes(`
  0% { opacity: 0; }
  100% { opacity: 1; }
`);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.background[600]}`,
  color: theme.background.contrast[800],
  animation: `${UpdateValueAnimation} 0.4s`,

  [`&.${tableCellClasses.head}`]: {
    background: theme.primary[800],
    color: theme.primary.contrast[800],
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  background: theme.background[800],
  color: theme.background.contrast[800],
  border: 'none',
}));

const convertToRows = (env: ExecDebug['enviroment']) => {
  if (!env) return [];

  return Object.entries(env).map(([key, value]) => ({ key, value }));
};

export const OutputDebugPane = () => {
  const { debugState } = useDebug();

  return (
    <Wrapper>
      <ExecLineHistoryWrapper>
        <Histories>
          {debugState?.histories.map((history, i) => (
            <History selected={0} key={i}>
              <ExecResultTag>実行</ExecResultTag>
              <ExecLineInfo>{history.position.line}行目</ExecLineInfo>
            </History>
          ))}
        </Histories>
        <ExecLineHistoryFooter>実行履歴</ExecLineHistoryFooter>
      </ExecLineHistoryWrapper>
      <TableContainer component={DebugContent}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>変数名</StyledTableCell>
              <StyledTableCell align="right">値</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {convertToRows(debugState?.enviroment).map((row) => (
              <StyledTableRow key={row.key}>
                <StyledTableCell>{row.key}</StyledTableCell>
                <StyledTableCell align="right" key={row.value.toString()}>
                  {row.value}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  );
};

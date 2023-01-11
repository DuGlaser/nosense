import { styled } from '@mui/material';

import { useExecResult } from '@/store';

const OutputLines = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  background: theme.background[900],
  color: theme.background.contrast[900],
  overflow: 'auto',
}));

export const OutputResultPane = () => {
  const { execResult } = useExecResult();

  return (
    <OutputLines>
      {execResult.map((row, i) => (
        <div key={i}>{row}</div>
      ))}
    </OutputLines>
  );
};

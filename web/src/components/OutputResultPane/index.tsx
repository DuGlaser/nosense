import { styled } from '@mui/material';

import { useExecResultState } from '@/store/exec';

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
  const [outputLines] = useExecResultState();

  return (
    <OutputLines>
      {outputLines.map((outputLine, i) => (
        <div key={i}>{outputLine}</div>
      ))}
    </OutputLines>
  );
};

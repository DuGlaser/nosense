import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LastPageIcon from '@mui/icons-material/LastPage';
import StopIcon from '@mui/icons-material/Stop';
import { IconButton, styled, Tooltip } from '@mui/material';
import { MouseEventHandler, useMemo } from 'react';

import { useDebug } from '@/store';
import { hexToRgba } from '@/styles/utils';

const StyledDiv = styled('div')(({ theme }) => ({
  background: hexToRgba(theme.background[900], 0.4),
  display: 'flex',
}));

const StyledIconButton = styled(IconButton)<{ iconColor: string }>(
  ({ iconColor }) => ({
    color: iconColor,
    '&:disabled': {
      color: hexToRgba(iconColor, 0.5),
    },
  })
);

const TooltipButton: React.FC<
  React.PropsWithChildren<{
    title: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    color: string;
  }>
> = ({ title, onClick, disabled = false, color, children }) => {
  return (
    <Tooltip title={title}>
      <StyledIconButton disabled={disabled} onClick={onClick} iconColor={color}>
        {children}
      </StyledIconButton>
    </Tooltip>
  );
};

export const DebugTools = () => {
  const { next, stop, finish, debugState } = useDebug();
  const isDebugMode = useMemo(() => {
    if (!debugState) return false;

    return !!debugState.generator;
  }, [debugState]);

  return (
    <StyledDiv>
      <TooltipButton
        disabled={!isDebugMode}
        title={'次の行を実行する'}
        color={'#5ad6f3'}
        onClick={next}
      >
        <ArrowDownwardIcon />
      </TooltipButton>

      <TooltipButton
        disabled={!isDebugMode}
        title={'最後の行まで実行する'}
        color={'#5bf35a'}
        onClick={finish}
      >
        <LastPageIcon />
      </TooltipButton>

      <TooltipButton
        disabled={!isDebugMode}
        title={'デバッグを停止する'}
        color={'#f35a5a'}
        onClick={stop}
      >
        <StopIcon />
      </TooltipButton>
    </StyledDiv>
  );
};

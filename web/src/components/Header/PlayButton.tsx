import BugReportIcon from '@mui/icons-material/BugReport';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

import { useExecCode } from '@/hooks';
import { useDebug, useEditorMode } from '@/store';
import { EditorMode } from '@/type';

const buttonColorMixin = (background: string, color: string) => ({
  background,
  color,

  '&:disabled': {
    background,
    color,
    opacity: 0.5,
  },

  '&:hover': {
    background,
    color,
    opacity: 0.8,
  },
});

const Wrapper = styled('div')<{ mode: EditorMode }>(({ theme, mode }) => ({
  display: 'flex',
  width: '120px',
  borderRadius: '4px',

  button: {
    ...(mode === 'NORMAL'
      ? buttonColorMixin(theme.primary[700], theme.primary.contrast[700])
      : buttonColorMixin('#f00', '#fff')),
  },
}));

const StyledButton = styled(Button)(() => ({
  flex: 1,
  borderRadius: '4px 0px 0px 4px',
}));

const OpenMenuButton = styled(Button)(() => ({
  paddingLeft: '2px',
  paddingRight: '2px',
  minWidth: 0,
  borderRadius: '0px 4px 4px 0px',
}));

export const PlayButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { start: startDebug } = useDebug();
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const { editorMode } = useEditorMode();
  const { execCode, cancelExecCode } = useExecCode();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Wrapper mode={editorMode}>
      <StyledButton
        variant="contained"
        disableElevation
        startIcon={editorMode === 'NORMAL' ? <PlayArrowIcon /> : <StopIcon />}
        onClick={() => {
          editorMode === 'NORMAL' ? execCode() : cancelExecCode();
        }}
      >
        {editorMode === 'NORMAL' ? '実行' : '中断'}
      </StyledButton>
      <OpenMenuButton
        variant="contained"
        disableElevation
        disabled={editorMode !== 'NORMAL'}
        onClick={handleClick}
      >
        <KeyboardArrowDownIcon />
      </OpenMenuButton>
      <Menu
        anchorEl={anchorEl}
        id="play-option-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            overflow: 'visible',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            startDebug();
          }}
        >
          <ListItemIcon sx={{ color: theme.primary['400'] }}>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText>ステップ実行</ListItemText>
        </MenuItem>
      </Menu>
    </Wrapper>
  );
};

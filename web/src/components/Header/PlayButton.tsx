import BugReportIcon from '@mui/icons-material/BugReport';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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
import { useDebug } from '@/store';

const Wrapper = styled('div')(({ theme }) => ({
  background: theme.primary[700],
  color: theme.primary.contrast[700],
  borderRadius: '4px',
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
  const execCode = useExecCode();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      <Button
        variant="contained"
        disableElevation
        startIcon={<PlayArrowIcon />}
        onClick={execCode}
        sx={{
          borderRadius: '4px 0 0 4px',
        }}
      >
        実行
      </Button>
      <OpenMenuButton
        variant="contained"
        disableElevation
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

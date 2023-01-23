import FileCopyIcon from '@mui/icons-material/FileCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import LinkIcon from '@mui/icons-material/Link';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';

import { useStatements } from '@/features/editor/store';
import { programConvertor } from '@/lib/converter';
import { generateShareUrl } from '@/utils/generateShareUrl';
import { saveFile } from '@/utils/saveFile';
import { shareCode } from '@/utils/shareCode';

const PopoverWrapper = styled(IconButton)(() => ({
  width: '40px',
  height: '40px',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const useGetCode = () => {
  const getStatements = useStatements();

  return useCallback(async () => {
    const statements = await getStatements();
    return programConvertor.toDamega(statements);
  }, [getStatements]);
};

type MenuItemProps = {
  onClose: () => void;
};

const ShareUrlMenuItem: React.FC<MenuItemProps> = ({ onClose }) => {
  const getStatements = useStatements();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyShareUrl = async () => {
    const statements = await getStatements();
    const params = shareCode.toUrlParams(statements);
    navigator.clipboard.writeText(generateShareUrl(params));
  };

  return (
    <MenuItem
      onClick={async () => {
        handleCopyShareUrl();
        enqueueSnackbar('URLをコピーしました', {
          autoHideDuration: 3000,
        });
        onClose();
      }}
    >
      <ListItemIcon sx={{ color: theme.primary['400'] }}>
        <LinkIcon />
      </ListItemIcon>
      <ListItemText>URLで共有</ListItemText>
    </MenuItem>
  );
};

const SAVE_FILE_NAME = '新規ファイル.dam' as const;

const SaveFileMenuItem: React.FC<MenuItemProps> = ({ onClose }) => {
  const getCode = useGetCode();
  const theme = useTheme();

  const handleSaveAsFile = async () => {
    const code = await getCode();
    saveFile(code, SAVE_FILE_NAME);
  };

  return (
    <MenuItem
      onClick={() => {
        handleSaveAsFile();
        onClose();
      }}
    >
      <ListItemIcon sx={{ color: theme.primary['400'] }}>
        <FileCopyIcon />
      </ListItemIcon>
      <ListItemText>ファイルで保存</ListItemText>
    </MenuItem>
  );
};

export const SharePopover = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title={'共有'}>
        <PopoverWrapper onClick={handleClick}>
          <IosShareIcon />
        </PopoverWrapper>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <ShareUrlMenuItem onClose={handleClose} />
        <SaveFileMenuItem onClose={handleClose} />
      </Menu>
    </div>
  );
};

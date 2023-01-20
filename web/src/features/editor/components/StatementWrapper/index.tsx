import {
  useDeleteStatement,
  useGetCurrentScope,
  useInsertStatement,
} from '@editor/store';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';
import { PropsWithChildren, useState } from 'react';

import { BaseStatement, createNewStatement } from '@/lib/models/editorObject';
import { hexToRgba } from '@/styles/utils';

const Wrapper = styled('div')<{
  active: number;
}>(({ theme, active }) => {
  const heightRate = 1.75;

  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    fontSize: '20px',
    lineHeight: `${heightRate}em`,
    maxHeight: `${heightRate}em`,
    height: `${heightRate}em`,
    minHeight: `${heightRate}em`,
    backgroundColor: active
      ? hexToRgba(theme.primary[300], 0.15)
      : 'transparent',
    '& :focus': {
      backgroundColor: hexToRgba(theme.background[300], 0.25),
    },
    '&:has(:focus)': {
      backgroundColor: hexToRgba(theme.background[300], 0.15),
      '& .editor-statement-gutter-linenumber': {
        color: theme.primary[300],
        opacity: 1,
        fontWeight: 'bold',
      },
    },
  };
});

const StyledMenu = styled(Menu)(({ theme }) => ({
  overflow: 'visible',
  mt: '2em',
  '& .MuiPaper-root': {
    background: theme.background[800],
    color: theme.background.contrast[800],
    '& .MuiMenu-list': {},
    '& .MuiMenuItem-root': {
      display: 'flex',
      gap: '24px',
      '& .MuiSvgIcon-root': {},
      '&:active': {},
    },
  },
}));

const ShortcutText = styled('div')(({ theme }) => ({
  fontSize: '0.7em',
  opacity: 0.7,
  kbd: {
    padding: '4px 8px',
    margin: '0px 4px',
    fontWeight: 'bold',
    color: hexToRgba(theme.background.contrast[900], 0.8),
    background: theme.background[900],
    border: `1px solid ${theme.background[500]}`,
    borderRadius: '4px',
  },
}));

const EditMenu: React.FC<{
  onClose: () => void;
  onOpen: () => void;
  showEditButton: boolean;
  createNewStatement: () => void;
  deleteCurrentStatement: () => void;
}> = ({
  onClose,
  onOpen,
  showEditButton,
  createNewStatement,
  deleteCurrentStatement,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onOpen();
  };
  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  return (
    <>
      {showEditButton && (
        <IconButton
          sx={{ fontSize: '0.5em', color: 'white', padding: 0 }}
          onClick={handleClick}
        >
          <ExpandMoreIcon />
        </IconButton>
      )}
      <StyledMenu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            overflow: 'visible',
            mt: '2em',
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            createNewStatement();
          }}
        >
          <ListItemText>文を追加</ListItemText>
          <ShortcutText>
            行末で<kbd>Enter</kbd>
          </ShortcutText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            deleteCurrentStatement();
          }}
        >
          <ListItemText>この文を削除</ListItemText>
          <ShortcutText>
            <kbd>Ctrl</kbd>+<kbd>Backspace</kbd>
          </ShortcutText>
        </MenuItem>
      </StyledMenu>
    </>
  );
};

const Gutter = styled('div')(() => ({
  width: '50px',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
}));

const EditButtonWrapper = styled('div')(() => ({
  minWidth: '24px',
  width: '10px',
  height: '100%',
}));

const LineNumber = styled('div')(() => ({
  flex: 1,
  fontSize: '0.8em',
  opacity: 0.5,
  textAlign: 'right',
}));

const Content = styled('div')<{ indent: number }>(({ indent }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: `${1 * indent}em`,
  // 先頭にCursorNodeが来る文と来ない文の先頭の位置が同じになるように調整している
  '> :first-child:not(:has(div[data-node-label="cursor"]))': {
    marginLeft: '0.5em',
  },
}));

export const StatementWrapper: React.FC<
  PropsWithChildren<{
    statementId: BaseStatement['id'];
    indent: number;
    active: boolean;
    lineNumber: number;
  }>
> = ({ statementId, indent, active, lineNumber, children }) => {
  const getCurrentScopeIds = useGetCurrentScope();
  const deleteStatement = useDeleteStatement();
  const insertStatement = useInsertStatement();

  const [isShowEditButton, setIsShowEditButton] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <Wrapper
      active={+active}
      onMouseEnter={() => {
        setIsShowEditButton(true);
      }}
      onMouseLeave={() => {
        if (!isOpenMenu) {
          setIsShowEditButton(false);
        }
      }}
    >
      <Gutter>
        <EditButtonWrapper>
          <EditMenu
            onClose={() => {
              setIsShowEditButton(false);
              setIsOpenMenu(false);
            }}
            onOpen={() => setIsOpenMenu(true)}
            showEditButton={isShowEditButton}
            createNewStatement={() =>
              insertStatement(statementId, [createNewStatement({ indent })])
            }
            deleteCurrentStatement={async () => {
              const ids = await getCurrentScopeIds(statementId);
              ids.forEach(deleteStatement);
            }}
          />
        </EditButtonWrapper>
        <LineNumber className="editor-statement-gutter-linenumber">
          {lineNumber}
        </LineNumber>
      </Gutter>
      <Content className="editor-statement-content" indent={indent}>
        {children}
      </Content>
    </Wrapper>
  );
};

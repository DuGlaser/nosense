import HelpIcon from '@mui/icons-material/Help';
import {
  Box,
  IconButton,
  Modal,
  styled,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import { PropsWithChildren, useState } from 'react';

import { hexToRgba } from '@/styles/utils';

type TabPanelProps = {
  index: number;
  value: number;
};

const StyledDiv = styled('div')(() => ({
  overflow: 'auto',
  maxHeight: '90%',
}));

const TabPanel: React.FC<PropsWithChildren<TabPanelProps>> = ({
  value,
  index,
  children,
}) => {
  return (
    <StyledDiv role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </StyledDiv>
  );
};

const PopoverWrapper = styled(IconButton)(() => ({
  width: '40px',
  height: '40px',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: theme.background[800],
  color: theme.background.contrast[800],
  borderRadius: '8px',
  width: '80%',
  height: '80%',
  maxHeight: '80%',
  padding: '48px',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.primary[600],
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: hexToRgba(theme.primary.contrast[600], 0.7),
  '&.Mui-selected': {
    color: theme.primary.contrast[600],
  },
}));

export const HelpModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectTab, setSelectTab] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectTab(newValue);
  };

  return (
    <>
      <Tooltip title={'ヘルプ'}>
        <PopoverWrapper onClick={handleOpen}>
          <HelpIcon />
        </PopoverWrapper>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
      >
        <ModalWrapper>
          <Box>
            <StyledTabs onChange={handleChange} value={selectTab}>
              <StyledTab label={'ショートカット'} />
              <StyledTab label={'FAQ'} />
            </StyledTabs>
          </Box>
          <TabPanel value={selectTab} index={0}>
            <ShortCutHelp />
          </TabPanel>
          <TabPanel value={selectTab} index={1}>
            <FAQHelp />
          </TabPanel>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const Section = styled('section')(() => ({
  margin: '16px 0',

  '& + section': {
    marginTop: '80px',
  },
}));

const SectionHeader = styled('h2')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.background.contrast[600],
}));

const Grid = styled('div')(() => ({
  display: 'grid',
  gap: '1em 5em',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
}));

const GridItem = styled('div')(() => ({
  display: 'flex',
  gap: '1em',
  alignItems: 'center',
}));

const ShortCutKey = styled('div')(({ theme }) => ({
  flex: 1,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  kbd: {
    padding: '4px 8px',
    fontWeight: 'bold',
    color: hexToRgba(theme.background.contrast[900], 0.8),
    background: theme.background[900],
    border: `1px solid ${theme.background[500]}`,
    borderRadius: '4px',
  },
}));

const shortCutList: {
  key: React.ReactNode;
  description: string;
}[] = [
  {
    key: <kbd>Enter</kbd>,
    description: '次のノードに移動する',
  },
  {
    key: (
      <>
        <kbd>Ctrl</kbd>+<kbd>Backspace</kbd>
      </>
    ),
    description: '現在の文を削除する',
  },
  {
    key: (
      <>
        <kbd>Ctrl</kbd>+<kbd>Enter</kbd>
      </>
    ),
    description: '直後に文を追加',
  },
  {
    key: (
      <>
        <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd>
      </>
    ),
    description: '直前に文を追加',
  },
  {
    key: <kbd>Tab</kbd>,
    description: '次の入力欄に移動する',
  },
  {
    key: <kbd>↓</kbd>,
    description: '次の行の入力欄に移動する',
  },
  {
    key: <kbd>↑</kbd>,
    description: '前の行の入力欄に移動する',
  },
  {
    key: <kbd>→</kbd>,
    description: '次の入力欄に移動する',
  },
  {
    key: <kbd>←</kbd>,
    description: '前の入力欄に移動する',
  },
];

const completeMenuShortCutList: {
  key: React.ReactNode;
  description: string;
}[] = [
  {
    key: <kbd>Enter</kbd>,
    description: '選択中のアイテムで補完する',
  },
  {
    key: <kbd>ESC</kbd>,
    description: '補完メニューを閉じる',
  },
  {
    key: <kbd>↓</kbd>,
    description: '次のアイテムを選択する',
  },
  {
    key: <kbd>↑</kbd>,
    description: '前のアイテムを選択する',
  },
  {
    key: <kbd>→</kbd>,
    description: '選択中のアイテムの子メニューに移動する',
  },
  {
    key: <kbd>←</kbd>,
    description: '選択中のアイテムの親メニューに移動する',
  },
];

const ShortCutHelp = () => {
  return (
    <div>
      <Section>
        <SectionHeader>エディター編集中</SectionHeader>
        <Grid>
          {shortCutList.map(({ key, description }, i) => (
            <GridItem key={i}>
              <ShortCutKey>{key}</ShortCutKey>
              <div>{description}</div>
            </GridItem>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionHeader>補完メニューを開いているとき</SectionHeader>
        <Grid>
          {completeMenuShortCutList.map(({ key, description }, i) => (
            <GridItem key={i}>
              <ShortCutKey>{key}</ShortCutKey>
              <div>{description}</div>
            </GridItem>
          ))}
        </Grid>
      </Section>
    </div>
  );
};

const SectionContent = styled('div')(({ theme }) => ({
  color: hexToRgba(theme.background.contrast[600], 0.8),
  padding: '0 8px',
}));

const FAQHelp = () => {
  return (
    <div>
      <Section>
        <SectionHeader>
          入力欄をクリックしてもフォーカスが合わないことがある
        </SectionHeader>
        <SectionContent>
          Deeplなどのブラウザの拡張機能を使っている場合、予期せぬ動作をすることがあります。
          <br />
          問題がある場合は拡張機能を無効にしてください。
        </SectionContent>
      </Section>
    </div>
  );
};

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, styled } from '@mui/material';
import { usePane } from '@split-pane';
import { AnimatePresence, motion } from 'framer-motion';
import { ComponentProps, PropsWithChildren, useMemo, useState } from 'react';

const TabWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  height: '40px',
  width: '100%',
  padding: '2px 10px',
  color: theme.background.contrast[900],
}));

const TabItemWrapper = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: '40px',
  width: '100%',
  padding: '0 2px',
  margin: 0,
  gap: '10px',
  color: theme.background.contrast[900],
}));

const TabItemInner = styled('li')<{ active: number }>(() => ({
  cursor: 'pointer',
  fontSize: '20px',
  lineHeight: '20px',
  padding: '6px 16px',
  transition: 'all 0.3s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

const TabItemUnderline = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: '-1px',
  left: 0,
  right: 0,
  height: '2px',
  background: theme.primary[400],
}));

const TabContentWrapper = styled(motion.div)(() => ({
  flex: 1,
  padding: '16px',
  color: 'white',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
}));

const CloseButtonWrapper = styled(motion.div)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
}));

const Flex = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
}));

type Props = {
  tabs: JSX.Element[];
  children: JSX.Element[];
};

const TabItem: React.FC<
  PropsWithChildren<
    {
      active: boolean;
    } & ComponentProps<'li'>
  >
> = ({ active, children, ...props }) => {
  return (
    <TabItemInner active={+active} {...props}>
      {children}
      {active && <TabItemUnderline layoutId={'tab-item-underline'} />}
    </TabItemInner>
  );
};

export const OutputPane: React.FC<Props> = ({ tabs, children }) => {
  const [selectTabIndex, setSelectTabIndex] = useState<number>(0);
  const { setSize, paneState } = usePane('output-pane');
  const isClose = useMemo(() => {
    return paneState.height === paneState.minHeight;
  }, [paneState.height, paneState.minHeight]);

  return (
    <Flex>
      <TabWrapper>
        <TabItemWrapper>
          {tabs.map((tab, i) => (
            <TabItem
              key={i}
              active={i === selectTabIndex}
              onClick={() => setSelectTabIndex(i)}
            >
              {tab}
            </TabItem>
          ))}
        </TabItemWrapper>
        <IconButton aria-label="toggle-output-pane">
          <AnimatePresence initial={false} mode={'wait'}>
            <CloseButtonWrapper
              key={`toggle-button-${isClose ? 'close' : 'open'}`}
              initial={{ rotate: isClose ? 0 : 180 }}
              exit={{ rotate: isClose ? 180 : 360 }}
              transition={{ duration: 0.15 }}
            >
              <KeyboardArrowUpIcon
                fontSize={'large'}
                onClick={() => (isClose ? setSize('max') : setSize('min'))}
              />
            </CloseButtonWrapper>
          </AnimatePresence>
        </IconButton>
      </TabWrapper>
      {!isClose && (
        <TabContentWrapper>
          <AnimatePresence initial={false} mode={'wait'}>
            <motion.div
              key={selectTabIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {children[selectTabIndex]}
            </motion.div>
          </AnimatePresence>
        </TabContentWrapper>
      )}
    </Flex>
  );
};

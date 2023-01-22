import { Editor } from '@editor';
import { EditorProvider } from '@editor/providers';
import BugReportIcon from '@mui/icons-material/BugReport';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { Box, styled } from '@mui/material';
import { Pane, SplitPane } from '@split-pane';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { RecoilSync } from 'recoil-sync';

import {
  Header,
  OutputDebugPane,
  OutputPane,
  OutputResultPane,
} from '@/components';
import { useDebugInfo } from '@/store';
import { EDIT_MODE_STORE_KEY, EDITOR_MODE_STORE_KEY } from '@/store/mode';
import { EDIT_MODE, EDITOR_MODE } from '@/type';
import { decodeUrl } from '@/utils/decodeUrl';

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.background[900],
  position: 'relative',
}));

const TabItemWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  ['> svg']: {
    color: theme.primary['400'],
  },
}));

const IndexPage: NextPage = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const debugState = useDebugInfo();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCode(decodeUrl(window.location.href).code);
    }
  }, []);

  if (code === undefined) return null;

  return (
    <EditorProvider defaultCode={code}>
      <RecoilSync
        storeKey={EDITOR_MODE_STORE_KEY}
        read={() => {
          return EDITOR_MODE.NORMAL;
        }}
      >
        <RecoilSync
          storeKey={EDIT_MODE_STORE_KEY}
          read={() => {
            return EDIT_MODE.WRITABLE;
          }}
        >
          <Wrapper>
            <Header />
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
              }}
            >
              <SplitPane>
                <Pane id={'editor'}>
                  <Editor
                    activeLineNumbers={
                      debugState?.position ? [debugState.position.line] : []
                    }
                  />
                </Pane>
                <Pane
                  id={'output-pane'}
                  defaultHeight={400}
                  maxHeight={600}
                  minHeight={48}
                >
                  <OutputPane
                    tabs={[
                      <TabItemWrapper key="output-result">
                        <InsertCommentIcon />
                        <span>出力</span>
                      </TabItemWrapper>,
                      <TabItemWrapper key="output-debug">
                        <BugReportIcon />
                        <span>デバッグログ</span>
                      </TabItemWrapper>,
                    ]}
                  >
                    <OutputResultPane />
                    <OutputDebugPane />
                  </OutputPane>
                </Pane>
              </SplitPane>
            </Box>
          </Wrapper>
        </RecoilSync>
      </RecoilSync>
    </EditorProvider>
  );
};

export default IndexPage;

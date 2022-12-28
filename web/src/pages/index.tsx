import { Editor } from '@editor';
import BugReportIcon from '@mui/icons-material/BugReport';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { Box, styled } from '@mui/material';
import { Pane, SplitPane } from '@split-pane';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Header, OutputPane, OutputResultPane } from '@/components';
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
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCode(decodeUrl(window.location.href).code);
    }
  }, []);

  return (
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
            <Editor code={code} />
          </Pane>
          <Pane
            id={'output-pane'}
            defaultHeight={400}
            maxHeight={400}
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
              <div>デバッグログpane</div>
            </OutputPane>
          </Pane>
        </SplitPane>
      </Box>
    </Wrapper>
  );
};

export default IndexPage;

import { Editor } from '@editor';
import { Box, styled } from '@mui/material';
import { OutputPane } from '@output-pane';
import { Pane, SplitPane } from '@split-pane';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

import { Header } from '@/components';
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
            defaultHeight={300}
            maxHeight={400}
            minHeight={100}
          >
            <OutputPane />
          </Pane>
        </SplitPane>
      </Box>
    </Wrapper>
  );
};

export default IndexPage;

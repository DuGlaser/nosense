import { Editor } from '@editor';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, styled } from '@mui/material';
import { ErrorObject } from '@nosense/damega';
import { NextPage } from 'next';

import { useDamega } from '@/hooks/useDamega';
import { useDamegaInput } from '@/hooks/useDamegaInput';
import { useDamegaOutput } from '@/hooks/useDamegaOutput';

const code = `
let x: number = 0;
let y: string = "x";
let z: bool = true;
x = 10;
if (x) {
  y = 20;
  if (y > 10) {
    z = true;
  } else {
    z = false;
  }
}
`;

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.background[900],
  position: 'relative',
}));

const Header = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '8px 24px',
  maxHeight: '40px',
  display: 'flex',
  flexDirection: 'row-reverse',
  background: theme.background[800],
  zIndex: 10,
}));

const FooterPanel = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,

  height: '20vh',
  width: '100%',
  background: theme.background[900],
  borderTop: `1px solid ${theme.background[800]}`,
  boxShadow: `0px 5.1px 8.6px rgba(0, 0, 0, 0.347),
  0px 10.3px 19.2px rgba(0, 0, 0, 0.439),
  0px 24px 65px rgba(0, 0, 0, 0.6)`,
}));

const OutputLines = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  background: theme.background[900],
  color: theme.background.contrast[900],
  overflow: 'auto',
}));

const IndexPage: NextPage = () => {
  const { getInputEventCallback } = useDamegaInput();
  const { getOutputEventCallback, outputs } = useDamegaOutput();

  const execCode = useDamega({
    returnInputEventFn: getInputEventCallback,
    returnOutputEventFn: getOutputEventCallback,
  });

  return (
    <Wrapper>
      <Header>
        <Button
          sx={{
            borderRadius: 0,
          }}
          variant={'contained'}
          startIcon={<PlayArrowIcon />}
          onClick={async () => {
            const { evaluated } = execCode(code);
            const result = await evaluated;

            if (result instanceof ErrorObject) {
              alert(result.message);
            }
          }}
        >
          実行
        </Button>
      </Header>
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        <Editor code={code} />
      </Box>
      <FooterPanel>
        <OutputLines>
          {outputs.map((output, i) => (
            <Box key={i}>{output}</Box>
          ))}
        </OutputLines>
      </FooterPanel>
    </Wrapper>
  );
};

export default IndexPage;

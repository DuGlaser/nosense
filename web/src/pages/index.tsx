import { Editor } from '@editor';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Drawer, styled } from '@mui/material';
import { ErrorObject } from '@nosense/damega';
import { NextPage } from 'next';

import { useDamega } from '@/hooks/useDamega';
import { useDamegaInput } from '@/hooks/useDamegaInput';
import { useDamegaOutput } from '@/hooks/useDamegaOutput';

const code = `
let x: number = 10;
let y: number = Input();
let z: number = 20;

Println(x + y * (-z * x));
`;

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.background[900],
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

const FooterPanel = styled(Drawer)(({ theme }) => ({
  height: '20vh',
  background: theme.background[900],

  boxShadow: `0px 5.1px 8.6px rgba(0, 0, 0, 0.347),
  0px 10.3px 19.2px rgba(0, 0, 0, 0.439),
  0px 24px 65px rgba(0, 0, 0, 0.6)`,

  '>div': {
    background: theme.background[900],
    height: '20vh',
    borderTop: `1px solid ${theme.background[800]}`,
  },
}));

const OutputLines = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  background: theme.background[900],
  color: theme.background.contrast[900],
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
      <FooterPanel variant="persistent" anchor="bottom" open={true}>
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

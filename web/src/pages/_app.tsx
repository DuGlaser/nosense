import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';

import { theme } from '@/styles/theme';

const SCROLLBAR_WIDTH = '16px';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <CssBaseline />
          <GlobalStyles
            styles={(theme) => {
              const thumb = theme.background[700];
              const track = theme.background[900];
              return {
                scrollbarWidth: 'thin',
                scrollbarColor: `${thumb} ${track}`,
                '::-webkit-scrollbar': {
                  width: SCROLLBAR_WIDTH,
                  height: SCROLLBAR_WIDTH,
                },
                '::-webkit-scrollbar-track': {
                  backgroundColor: track,
                },
                '::-webkit-scrollbar-thumb': {
                  border: '4px solid transparent',
                  borderRadius: SCROLLBAR_WIDTH,
                  backgroundClip: 'content-box',
                  backgroundColor: thumb,
                },
                '::-webkit-scrollbar-corner': {
                  backgroundColor: track,
                },
              };
            }}
          />
          <Component {...pageProps} />
        </SnackbarProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default MyApp;

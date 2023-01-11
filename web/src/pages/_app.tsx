import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';

import { theme } from '@/styles/theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <CssBaseline />
          <Component {...pageProps} />
        </SnackbarProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default MyApp;

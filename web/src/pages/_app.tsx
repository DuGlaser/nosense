import { CssBaseline, ThemeProvider } from '@mui/material';
import { RecoilRoot } from 'recoil';

import { theme } from '@/styles/theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <CssBaseline />
        <Component {...pageProps} />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default MyApp;

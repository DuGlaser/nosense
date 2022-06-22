import { CssBaseline } from '@mui/material';

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

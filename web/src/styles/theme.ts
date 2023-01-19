import { createTheme } from '@mui/material';

const level = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const;

type CustomTheme = {
  [key in (typeof level)[number]]: string;
} & {
  contrast: {
    [key in (typeof level)[number]]: string;
  };
};

const background: CustomTheme = {
  '50': '#ecedf0',
  '100': '#ced3da',
  '200': '#afb6c1',
  '300': '#8f99a9',
  '400': '#788496',
  '500': '#616f84',
  '600': '#546173',
  '700': '#434e5d',
  '800': '#343c48',
  '900': '#222831',
  contrast: {
    50: '#000000',
    100: '#000000',
    200: '#000000',
    300: '#eeeeee',
    400: '#eeeeee',
    500: '#eeeeee',
    600: '#eeeeee',
    700: '#eeeeee',
    800: '#eeeeee',
    900: '#eeeeee',
  },
};

const primary: CustomTheme = {
  '50': '#E5F3FD',
  '100': '#BFDFFB',
  '200': '#99CDF9',
  '300': '#73B8F5',
  '400': '#5AA9F3',
  '500': '#479BF0',
  '600': '#428CE2',
  '700': '#3B7ACF',
  '800': '#3669BD',
  '900': '#2C4B9D',
  contrast: {
    50: '#000000',
    100: '#000000',
    200: '#000000',
    300: '#000000',
    400: '#000000',
    500: '#000000',
    600: '#ffffff',
    700: '#ffffff',
    800: '#ffffff',
    900: '#ffffff',
  },
};

const SCROLLBAR_SIZE = '16px';

export const theme = createTheme({
  background,
  primary,
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => {
        const thumb = theme.background[700];
        const track = theme.background[900];
        return {
          body: {
            scrollbarColor: `${thumb} ${track}`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: track,
              width: SCROLLBAR_SIZE,
              height: SCROLLBAR_SIZE,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              border: '4px solid transparent',
              borderRadius: SCROLLBAR_SIZE,
              backgroundClip: 'content-box',
              backgroundColor: thumb,
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: track,
            },
          },
        };
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    background: CustomTheme;
    primary: CustomTheme;
  }
  interface ThemeOptions {
    background: CustomTheme;
    primary: CustomTheme;
  }
}

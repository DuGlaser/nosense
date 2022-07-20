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
  [key in typeof level[number]]: string;
} & {
  contrast: {
    [key in typeof level[number]]: string;
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

export const theme = createTheme({
  background,
});

declare module '@mui/material/styles' {
  interface Theme {
    background: CustomTheme;
  }
  interface ThemeOptions {
    background: CustomTheme;
  }
}
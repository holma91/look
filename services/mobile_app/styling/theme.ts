import { createTheme } from '@shopify/restyle';

const palette = {
  purple: '#5A31F4',
  green: '#099C77',
  black: '#101010',
  white: '#FFF',
};

export const theme = createTheme({
  colors: {
    primary: palette.purple,
    secondary: palette.green,
    background: palette.white,
    title: palette.black,
    text: palette.black,
    textOnBackground: palette.white,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    defaults: {
      color: 'text',
    },
    header: {
      fontSize: 48,
      fontWeight: 'bold',
      color: 'title',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'title',
    },
    body: {
      fontSize: 16,
    },
    onBackground: {
      color: 'textOnBackground',
      fontSize: 16,
    },
  },
  cardVariants: {
    defaults: {
      padding: 'm',
      borderRadius: 10,
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'secondary',
    },
  },
  buttonVariants: {
    defaults: {
      padding: 'm',
      borderRadius: 10,
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'secondary',
    },
  },
});

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.black,
    title: palette.white,
  },
};

export type Theme = typeof theme;

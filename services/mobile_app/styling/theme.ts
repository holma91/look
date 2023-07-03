import { createTheme } from '@shopify/restyle';

const palette = {
  purple: '#5A31F4',
  green: '#099C77',
  black: '#101010',
  white: '#FFF',
  grey: '#DDDFE9',
  darkGrey: '#A4A6B3',
};

export const theme = createTheme({
  colors: {
    primary: palette.purple,
    secondary: palette.green,
    background: palette.white,
    secondaryBackground: palette.grey,
    title: palette.black,
    text: palette.black,
    textOnBackground: palette.white,
    grey: palette.grey,
    darkGrey: palette.darkGrey,
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 6,
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
      fontSize: 20,
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
  inputVariants: {
    defaults: {},
    primary: {
      backgroundColor: 'secondaryBackground',
      color: 'text',
      borderRadius: 20,
      height: 36,
      width: '92%',
    },
    secondary: {
      backgroundColor: 'secondaryBackground',
      color: 'text',
      borderRadius: 20,
      height: 36,
      width: '100%',
      paddingLeft: 'l',
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
    tertiary: {
      borderRadius: 10,
      backgroundColor: 'text',
      color: 'textOnBackground',
      fontSize: 3,
      padding: 's',
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

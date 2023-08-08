import { Platform, PlatformColor } from 'react-native';
import { createTheme } from '@shopify/restyle';

const ios = {
  light: {
    gray: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
  },
  dark: {
    gray: 'rgb(142, 142, 147)',
    gray2: 'rgb(99, 99, 102)',
    gray3: 'rgb(72, 72, 74)',
    gray4: 'rgb(58, 58, 60)',
    gray5: 'rgb(44, 44, 46)',
    gray6: 'rgb(28, 28, 30)',
  },
};

const palette = {
  purple: '#5A31F4',
  green: '#099C77',
  // black: '#101010',
  black: '#000',
  white: '#FFF',
  grey: '#DDDFE9',
  darkGrey: '#A4A6B3',
  lightGrey: '#fafafa',
  iosGray: ios.light['gray'],
  iosGray2: ios.light['gray2'],
  iosGray3: ios.light['gray3'],
  iosGray4: ios.light['gray4'],
  iosGray5: ios.light['gray5'],
  iosGray6: ios.light['gray6'],
};

export const lightTheme = createTheme({
  colors: {
    primary: palette.purple,
    secondary: palette.green,
    background: palette.white,
    textOnBackground: palette.white,
    secondaryBackground: palette.grey,
    lightBackground: palette.iosGray6,
    textOnLightBackground: palette.black,
    title: palette.black, // remove
    text: palette.black,
    grey: palette.grey,
    darkGrey: palette.darkGrey,
    gray4: palette.iosGray4,
    gray5: palette.iosGray5,
    gray6: palette.iosGray6,
    red: '#FF3B30',
    searchBackground: palette.iosGray5,
    searchText: palette.black,
  },
  spacing: {
    none: 0,
    xxxs: 1,
    xxs: 2,
    temporary_xxs: 4,
    xs: 6,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    ll: 34,
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
    smallTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: 'title',
    },
    body: {
      fontSize: 16,
    },
    onBackground: {
      color: 'textOnBackground',
      fontSize: 18,
      fontWeight: 'bold',
    },
    buttonText: {
      color: 'textOnBackground',
      fontSize: 17,
      fontWeight: 'bold',
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
      backgroundColor: 'searchBackground',
      color: 'searchText',
      borderRadius: 20,
      height: 36,
      width: '100%',
      paddingLeft: 'l',
    },
  },
  buttonVariants: {
    defaults: {
      padding: 'm',
      borderRadius: 10,
    },
    primary: {
      padding: 'm',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
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
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: palette.black,
    title: palette.white,
    text: palette.white,
    textOnBackground: palette.black,
    lightBackground: palette.white,
    textOnLightBackground: palette.black,
    searchBackground: ios.dark['gray6'],
    searchText: ios.light['gray2'],
  },
};

export type Theme = typeof lightTheme;

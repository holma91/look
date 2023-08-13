import { ExpoConfig, ConfigContext } from 'expo/config';
require('dotenv').config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'look',
  slug: 'look',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist',
    bundleIdentifier: 'com.anonymous.look', // added when doing npx expo prebuild
    supportsTablet: true,
  },
  android: {
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    package: 'com.anonymous.look', // added when doing npx expo prebuild
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    replicateApiKey: process.env.REPLICATE_API_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    eas: {
      projectId: '8b699122-7a5d-4951-b108-046ab0b92a44',
    },
  },
  scheme: 'look', // don't really know what this does
});

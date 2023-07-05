import 'react-native-gesture-handler'; // might need to do more than this on android
import { LogBox, SafeAreaView } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { theme } from './styling/theme';
import { tokenCache } from './utils/tokenCache';
import Navigation from './navigation';

LogBox.ignoreLogs([
  'Did not receive response to shouldStartLoad in time, defaulting to YES', // https://github.com/react-native-webview/react-native-webview/issues/124
  'shouldStartLoad',
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={Constants?.expoConfig?.extra?.clerkApiKey}
      >
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            {/* <SafeAreaView style={{ flex: 1 }}> */}
            <Navigation />
            {/* </SafeAreaView> */}
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}

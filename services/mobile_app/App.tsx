import 'react-native-gesture-handler'; // might need to do more than this on android
import React from 'react';
import { LogBox } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { theme } from './styling/theme';
import { tokenCache } from './utils/tokenCache';
import Navigation from './navigation';
import { TrainingProvider } from './context/Training';
import { DemoProvider } from './context/Demo';
import { DarkModeProvider } from './context/DarkMode';

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
        <ActionSheetProvider>
          <HoldMenuProvider
            theme="light"
            safeAreaInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <DarkModeProvider>
                  <DemoProvider>
                    <TrainingProvider>
                      <Navigation />
                    </TrainingProvider>
                  </DemoProvider>
                </DarkModeProvider>
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </HoldMenuProvider>
        </ActionSheetProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}

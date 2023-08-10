import 'react-native-gesture-handler'; // might need to do more than this on android
import React, { useContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { lightTheme, darkTheme } from './styling/theme';
import { tokenCache } from './utils/storage/tokenCache';
import Navigation from './navigation';
import { TrainingProvider } from './context/Training';
import { DemoProvider } from './context/Demo';
import { DarkModeContext } from './context/DarkMode';

LogBox.ignoreLogs([
  'Did not receive response to shouldStartLoad in time, defaulting to YES', // https://github.com/react-native-webview/react-native-webview/issues/124
  'shouldStartLoad',
]);

const queryClient = new QueryClient();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  console.log('App:isDarkMode', isDarkMode);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={Constants?.expoConfig?.extra?.clerkApiKey}
        >
          <ActionSheetProvider>
            <HoldMenuProvider
              theme={isDarkMode ? 'dark' : 'light'}
              safeAreaInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
            >
              <QueryClientProvider client={queryClient}>
                <BottomSheetModalProvider>
                  <DemoProvider>
                    <TrainingProvider>
                      <Navigation />
                    </TrainingProvider>
                  </DemoProvider>
                </BottomSheetModalProvider>
              </QueryClientProvider>
            </HoldMenuProvider>
          </ActionSheetProvider>
        </ClerkProvider>
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
}

import 'react-native-gesture-handler'; // might need to do more than this on android
import React, { useState } from 'react';
import { LogBox } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { lightTheme, darkTheme } from './styling/theme';
import Navigation from './navigation';
import { TrainingProvider } from './context/Training';
import { DemoProvider } from './context/Demo';
import { DarkModeContext } from './context/DarkMode';
import { ExperimentingProvider } from './context/Experimenting';

LogBox.ignoreLogs([
  'Did not receive response to shouldStartLoad in time, defaulting to YES', // https://github.com/react-native-webview/react-native-webview/issues/124
  'shouldStartLoad',
  'startLoadWithResult invoked with invalid lockIdentifier',
  'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead',
]);

const queryClient = new QueryClient();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <ActionSheetProvider>
          <HoldMenuProvider
            theme={isDarkMode ? 'dark' : 'light'}
            safeAreaInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <DemoProvider>
                  <ExperimentingProvider>
                    <TrainingProvider>
                      <Navigation />
                    </TrainingProvider>
                  </ExperimentingProvider>
                </DemoProvider>
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </HoldMenuProvider>
        </ActionSheetProvider>
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
}

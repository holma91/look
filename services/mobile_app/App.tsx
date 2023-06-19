import 'react-native-gesture-handler'; // might need to do more than this on android
import { Button, LogBox, SafeAreaView } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from './styling/theme';
import TabNavigator from './screens/Tabs.navigator';
import Browser from './screens/Browser.screen';
import { Text } from './styling/Text';
import SignInWithOAuth from './components/SignInWithOAuth';
import { tokenCache } from './utils/tokenCache';
import { Box } from './styling/Box';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'Did not receive response to shouldStartLoad in time, defaulting to YES', // https://github.com/react-native-webview/react-native-webview/issues/124
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={Constants?.expoConfig?.extra?.clerkApiKey}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <SignedIn>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Home" component={TabNavigator} />
                <Stack.Screen name="Browser" component={Browser} />
              </Stack.Navigator>
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            <Box flex={1} alignItems="center" justifyContent="center">
              <SignInWithOAuth />
            </Box>
          </SignedOut>
        </SafeAreaView>
      </ClerkProvider>
    </ThemeProvider>
  );
}

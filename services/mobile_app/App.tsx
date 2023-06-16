import 'react-native-gesture-handler'; // might need to do more than this on android
import { ThemeProvider } from '@shopify/restyle';
import { theme } from './styling/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './screens/Tabs.navigator';
import Details from './screens/Details.screen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

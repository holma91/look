import 'react-native-gesture-handler'; // might need to do more than this on android
import { ThemeProvider } from '@shopify/restyle';
import { theme } from './styling/theme';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './screens/Tabs.navigator';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

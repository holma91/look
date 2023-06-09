import { ThemeProvider } from '@shopify/restyle';
import { theme } from './theme';
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

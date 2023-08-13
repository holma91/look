import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './Tabs.navigator';
import Browser from '../screens/Browser.screen';
import SignUpOrIn from '../screens/SignUpOrIn.screen';
import Create from '../screens/demo/Create.screen';
import Creating from '../screens/demo/Creating.screen';
import { useFirebaseUser } from '../hooks/useFirebaseUser';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useFirebaseUser();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen
            name="Browser"
            component={Browser}
            // options={{ animation: 'none' }}
          />
          <Stack.Screen
            name="Create"
            component={Create}
            options={{ animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="Creating"
            component={Creating}
            options={{ animation: 'fade_from_bottom' }}
          />
        </>
      ) : (
        <Stack.Screen name="SignUpOrIn" component={SignUpOrIn} />
      )}
    </Stack.Navigator>
  );
}

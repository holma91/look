import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClerkLoaded, useUser } from '@clerk/clerk-expo';

import TabNavigator from './Tabs.navigator';
import Browser from '../screens/Browser.screen';
import SignUpOrIn from '../screens/SignUpOrIn.screen';
import Create from '../screens/demo/Create.screen';
import Creating from '../screens/demo/Creating.screen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isSignedIn } = useUser();

  return (
    <ClerkLoaded>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSignedIn ? (
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
    </ClerkLoaded>
  );
}

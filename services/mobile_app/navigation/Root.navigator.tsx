import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClerkLoaded, useUser } from '@clerk/clerk-expo';

import TabNavigator from './Tabs.navigator';
import Browser from '../screens/Browser.screen';
import SignUpOrIn from '../screens/SignUpOrIn.screen';

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
            <Stack.Screen name="Browser" component={Browser} />
          </>
        ) : (
          <Stack.Screen name="SignUpOrIn" component={SignUpOrIn} />
        )}
      </Stack.Navigator>
    </ClerkLoaded>
  );
}

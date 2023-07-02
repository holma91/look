import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClerkLoaded, useUser } from '@clerk/clerk-expo';

import TabNavigator from './Tabs.navigator';
import Browser from '../screens/Browser.screen';
import SignUpOrIn from '../screens/SignUpOrIn.screen';
import Search from '../screens/Search.screen';
import Product from '../screens/Product.screen';
import Shop from '../screens/Shop.screen';
import Likes from '../screens/Likes.screen';
import Studio from '../screens/Studio.screen';
import { Screen1, Screen2 } from '../screens/Testing.screen';
import Home from '../screens/Home.screen';
import CarDetails from '../screens/CarDetails.screen';

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
              options={{ animation: 'none' }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{ animation: 'none' }}
            />
            {/* <Stack.Screen name="Studio" component={Studio} /> */}
            <Stack.Screen name="Screen1" component={Screen1} />
            <Stack.Screen name="Screen2" component={Screen2} />
          </>
        ) : (
          <Stack.Screen name="SignUpOrIn" component={SignUpOrIn} />
        )}
      </Stack.Navigator>
    </ClerkLoaded>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Likes from '../screens/Likes.screen';
import Product from '../screens/Product.screen';
import CarDetails from '../screens/CarDetails.screen';
import Home from '../screens/Home.screen';
import Studio from '../screens/Studio.screen';

// Individual stack navigator for the Shop tab
const ShopStack = createNativeStackNavigator();

export default function LikesNavigator() {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <ShopStack.Screen name="Home2" component={Home} /> */}
      {/* <ShopStack.Screen name="CarDetails" component={CarDetails} /> */}
      <ShopStack.Screen name="Likes" component={Likes} />
      <ShopStack.Screen name="Product" component={Product} />
      <ShopStack.Screen name="Studio" component={Studio} />
    </ShopStack.Navigator>
  );
}

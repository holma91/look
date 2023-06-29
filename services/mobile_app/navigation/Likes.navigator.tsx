import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Likes from '../screens/Likes.screen';
import Product from '../screens/Product.screen';

// Individual stack navigator for the Shop tab
const ShopStack = createNativeStackNavigator();

export default function LikesNavigator() {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopStack.Screen name="Likes" component={Likes} />
      <ShopStack.Screen name="Product" component={Product} />
    </ShopStack.Navigator>
  );
}

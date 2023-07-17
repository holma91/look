import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Product from '../screens/Product.screen';
import Products from '../screens/Products.screen';

// Individual stack navigator for the Shop tab
const ShopStack = createNativeStackNavigator();

export default function ProductsNavigator() {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopStack.Screen name="Products" component={Products} />
      <ShopStack.Screen name="Product" component={Product} />
    </ShopStack.Navigator>
  );
}

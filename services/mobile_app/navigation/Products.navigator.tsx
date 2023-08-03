import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Product from '../screens/Product.screen';
import Products from '../screens/Products.screen';
import { useLayoutEffect, useState } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Individual stack navigator for the Shop tab
const ShopStack = createNativeStackNavigator();

export default function ProductsNavigator({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [selectMode, setSelectMode] = useState(false);

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Products';
    if (routeName === 'Products' && selectMode === true) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route, selectMode]);

  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopStack.Screen name="Products">
        {(props) => (
          <Products
            {...props}
            selectMode={selectMode}
            setSelectMode={setSelectMode}
          />
        )}
      </ShopStack.Screen>

      <ShopStack.Screen name="Product" component={Product} />
    </ShopStack.Navigator>
  );
}

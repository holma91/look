import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Product from '../screens/Product.screen';
import Explore from '../screens/demo/Explore.screen';

// Individual stack navigator for the Shop tab
const ExploreStack = createNativeStackNavigator();

export default function ExploreNavigator() {
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ExploreStack.Screen name="Explore" component={Explore} />
      <ExploreStack.Screen name="Product" component={Product} />
    </ExploreStack.Navigator>
  );
}

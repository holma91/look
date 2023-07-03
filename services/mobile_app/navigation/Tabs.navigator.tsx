import { useTheme } from '@shopify/restyle';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Shop from '../screens/Shop.screen';
import Profile from '../screens/Profile.screen';
import LikesNavigator from './Likes.navigator';
import CreateOld from '../screens/CreateOld.screen';
import ModelPicker from '../screens/ModelPicker.screen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const activeTheme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = '';

          if (route.name === 'Shop') {
            iconName = focused ? 'shopping' : 'shopping-outline';
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'ModelPicker') {
            iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
            return <Ionicons name={iconName} size={size * 1.1} color={color} />;
          } else if (route.name === 'LikesNavigator') {
            iconName = focused ? 'heart' : 'heart-outline';
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Testing') {
            iconName = focused ? 'compass' : 'compass-outline';
            return <Ionicons name={iconName} size={size * 1.1} color={color} />;
          }
        },
        tabBarActiveTintColor: activeTheme.colors.text,
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: () => null,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Testing" component={CreateOld} />
      <Tab.Screen name="ModelPicker" component={ModelPicker} />
      <Tab.Screen name="LikesNavigator" component={LikesNavigator} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

import { useTheme } from '@shopify/restyle';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Create from '../screens/Create.screen';
import Shop from '../screens/Shop.screen';
import Profile from '../screens/Profile.screen';
import Likes from '../screens/Likes.screen';
import Testing from '../screens/Testing.screen';

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
          } else if (route.name === 'Create') {
            iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Likes') {
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
            iconName = focused ? 'hammer' : 'hammer-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: activeTheme.colors.text,
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: () => null,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Shop" component={Shop} />
      {/* <Tab.Screen name="Create" component={Create} /> */}
      <Tab.Screen name="Likes" component={Likes} />
      <Tab.Screen name="Testing" component={Testing} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

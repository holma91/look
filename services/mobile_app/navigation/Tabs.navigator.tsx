import { useTheme } from '@shopify/restyle';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Shop from '../screens/Shop.screen';
import Profile from '../screens/Profile.screen';
import LikesNavigator from './Products.navigator';
import ModelPickerV2 from '../screens/demo/ModelPickerV2';
import Create from '../screens/demo/Create.screen';
import Testing from '../screens/Testing.screen';
import Explore from '../screens/demo/Explore.screen';
import ExploreNavigator from './Explore.navigator';
import { useContext } from 'react';
import { DemoContext } from '../context/Demo';
import ProductsNavigator from './Products.navigator';
import ThemedIcon from '../components/ThemedIcon';
import { View } from 'react-native';
import { ExperimentingContext } from '../context/Experimenting';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { isDemo } = useContext(DemoContext);
  const { isExperimenting } = useContext(ExperimentingContext);
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
          } else if (route.name === 'ProductsNavigator') {
            iconName = focused ? 'heart' : 'heart-outline';
            return <ThemedIcon name={iconName} size={size} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
            return <ThemedIcon name={iconName} size={size} />;
          } else if (route.name === 'ExploreNavigator') {
            iconName = focused ? 'compass' : 'compass-outline';
            return <ThemedIcon name={iconName} size={size * 1.1} />;
          } else if (route.name === 'Testing') {
            iconName = focused ? 'build' : 'build-outline';
            return <ThemedIcon name={iconName} size={size} />;
          }
        },
        tabBarActiveTintColor: activeTheme.colors.text,
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: () => null,
        headerShown: false,
        tabBarBackground: () => (
          <View
            style={{ flex: 1, backgroundColor: activeTheme.colors.background }}
          />
        ),
      })}
    >
      {isExperimenting ? (
        <>
          <Tab.Screen name="Testing" component={Testing} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      ) : isDemo ? (
        <>
          <Tab.Screen name="Shop" component={Shop} />
          <Tab.Screen name="ExploreNavigator" component={ExploreNavigator} />
          <Tab.Screen name="ModelPicker" component={ModelPickerV2} />
          <Tab.Screen name="ProductsNavigator" component={ProductsNavigator} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      ) : (
        <>
          <Tab.Screen name="Shop" component={Shop} />
          <Tab.Screen name="ProductsNavigator" component={ProductsNavigator} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      )}
    </Tab.Navigator>
  );
}

const Tabs = () => {
  const { isDemo } = useContext(DemoContext);

  return (
    <>
      <Tab.Screen name="Shop" component={Shop} />
      {isDemo ? (
        <>
          <Tab.Screen name="ExploreNavigator" component={ExploreNavigator} />
          <Tab.Screen name="ModelPicker" component={ModelPickerV2} />
        </>
      ) : null}
      <Tab.Screen name="ProductsNavigator" component={ProductsNavigator} />
      <Tab.Screen name="Profile" component={Profile} />
      {/* <Tab.Screen name="Testing" component={Testing} /> */}
    </>
  );
};

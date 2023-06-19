import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import RootNavigator from './Root.navigator';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

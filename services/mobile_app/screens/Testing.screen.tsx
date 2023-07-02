import * as React from 'react';
import { View, Button } from 'react-native';
import Animated from 'react-native-reanimated';

export function Screen1({ navigation }: { navigation: any }) {
  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{ width: 150, height: 150, backgroundColor: 'green' }}
        sharedTransitionTag="sharedTag"
      />
      <Button title="Screen2" onPress={() => navigation.navigate('Screen2')} />
    </View>
  );
}

export function Screen2({ navigation }: { navigation: any }) {
  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <Animated.View
        style={{ width: 100, height: 100, backgroundColor: 'green' }}
        sharedTransitionTag="sharedTag"
      />
      <Button title="Screen1" onPress={() => navigation.navigate('Screen1')} />
    </View>
  );
}

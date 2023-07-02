import { View, Button } from 'react-native';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../utils/SharedElementTransition';

export default function CarDetails({ navigation }: any) {
  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <Animated.View
        style={{ width: 100, height: 100, backgroundColor: 'green' }}
        sharedTransitionTag="sharedTag!!!"
        sharedTransitionStyle={sharedElementTransition}
      />
      <Button title="Go back" onPress={() => navigation.navigate('Home2')} />
    </View>
  );
}

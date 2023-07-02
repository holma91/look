import { View, Button } from 'react-native';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../utils/SharedElementTransition';

export default function Home({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{ width: 150, height: 150, backgroundColor: 'green' }}
        sharedTransitionTag="sharedTag!!!"
        sharedTransitionStyle={sharedElementTransition}
      />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('CarDetails')}
      />
    </View>
  );
}

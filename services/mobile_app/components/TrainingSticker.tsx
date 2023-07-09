import { View, Image, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { Text } from '../styling/Text';
import { TrainingContext } from '../context/Training';
import { useContext } from 'react';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function TrainingSticker({ navigation }: { navigation: any }) {
  const { remainingTime } = useContext(TrainingContext);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onDrag = useAnimatedGestureHandler({
    onStart: (event: any, context: any) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = withSpring(event.translationX + context.translateX);
      translateY.value = withSpring(event.translationY + context.translateY);
    },
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView
        style={[containerStyle, { position: 'absolute', right: 20, top: 50 }]}
      >
        <AnimatedTouchableOpacity
          onPress={() => {
            navigation.navigate('Creating');
          }}
          style={{
            borderWidth: 5,
            borderColor: 'white',
            width: 75,
            height: 75,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            borderRadius: 280,
          }}
        >
          <Text variant="title" color="textOnBackground">
            {remainingTime}
          </Text>
          <Text color="textOnBackground" fontSize={12}>
            min left
          </Text>
        </AnimatedTouchableOpacity>
      </AnimatedView>
    </PanGestureHandler>
  );
}

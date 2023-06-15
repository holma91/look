import {
  FlatList,
  Image,
  SafeAreaView,
  TextInput as TextInputRN,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { TextInput } from '../styling/TextInput';

export default function Browse() {
  const [url, setUrl] = useState(
    'https://github.com/react-native-webview/react-native-webview'
  );
  const [search, setSearch] = useState('');
  const webviewRef = useRef<WebView>(null);

  // Create a shared value to hold the height of the bottom sheet
  const bottomSheetHeight = useSharedValue(0);

  // The minimum and maximum heights for our bottom sheet
  const MIN_HEIGHT = 0;
  const MAX_HEIGHT = 300; // You can adjust this value as needed

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // isPressed.value = true;
      // bottomSheetHeight.value = 0;
    })
    .onUpdate((e) => {
      // translation is the distance moved since the gesture started
      console.log('onUpdate', e.translationY);
      bottomSheetHeight.value = MAX_HEIGHT - e.translationY;
    })
    .onEnd((e) => {
      console.log('onEnd v', e.velocityY);
      console.log('onEnd t', e.translationY);

      if (e.translationY > 150) {
        bottomSheetHeight.value = withTiming(MIN_HEIGHT);
      } else {
        bottomSheetHeight.value = withTiming(MAX_HEIGHT);
      }

      // const shouldOpen = e.velocityY < 0;
      // bottomSheetHeight.value = withTiming(
      // shouldOpen ? MAX_HEIGHT : MIN_HEIGHT
      // );
    })
    .onFinalize(() => {
      // isPressed.value = false;
    });

  // The animated style for the bottom sheet
  const animatedStyle = useAnimatedStyle(() => {
    // I think this is running in the UI thread

    return {
      height: bottomSheetHeight.value,
    };
  });

  const handleSearch = () => {
    console.log('searching for', search);
    let finalUrl = search;
    if (!search.startsWith('http://') && !search.startsWith('https://')) {
      finalUrl = 'http://' + search;
    }

    setUrl(finalUrl);
  };

  const navigate = (direction: 'back' | 'forward') => {
    if (!webviewRef.current) return;

    if (direction === 'back') {
      webviewRef.current.goBack();
    } else if (direction === 'forward') {
      webviewRef.current.goForward();
    }
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          <Box
            flex={0}
            flexDirection="row"
            alignItems="center"
            gap="s"
            paddingHorizontal="s"
          >
            <Box flex={1}>
              <TextInput
                onChangeText={setSearch}
                value={search}
                autoCapitalize="none"
                autoComplete="off"
                variant="primary"
                onSubmitEditing={handleSearch}
              />
            </Box>
            <Ionicons name="close" flex={0} size={28} color="black" />
          </Box>
          <Box flex={1}>
            <WebView
              ref={webviewRef}
              source={{
                uri: url,
              }}
            />
          </Box>
          <GestureDetector gesture={gesture}>
            <Animated.View
              style={[{ backgroundColor: 'white' }, animatedStyle]}
            >
              {/* Your bottom sheet content goes here */}
            </Animated.View>
          </GestureDetector>
          <Box
            flex={0}
            borderWidth={0}
            flexDirection="row"
            padding="s"
            justifyContent="space-between"
          >
            <Box flex={0} flexDirection="row" gap="m" alignItems="center">
              <Ionicons
                name="arrow-back"
                size={28}
                color="black"
                onPress={() => navigate('back')}
              />
              <Ionicons
                name="arrow-forward"
                size={28}
                color="black"
                onPress={() => navigate('forward')}
              />
            </Box>
            <Box flex={0} flexDirection="row" alignItems="center">
              <Ionicons
                name="arrow-up-circle"
                size={28}
                color="black"
                onPress={() => {
                  if (bottomSheetHeight.value === MAX_HEIGHT) {
                    bottomSheetHeight.value = withTiming(MIN_HEIGHT);
                  } else {
                    bottomSheetHeight.value = withTiming(MAX_HEIGHT);
                  }
                }}
              />
            </Box>
            <Box flex={0} flexDirection="row" gap="m" alignItems="center">
              <Ionicons name="md-star-outline" size={24} color="black" />
              <Ionicons
                name="md-ellipsis-horizontal-sharp"
                size={24}
                color="black"
              />
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}

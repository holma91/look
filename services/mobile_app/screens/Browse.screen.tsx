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
  runOnJS,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { TextInput } from '../styling/TextInput';

// The minimum and maximum heights for our bottom sheet
const MIN_HEIGHT = 0;
const MEDIUM_HEIGHT = 250;
const MAX_HEIGHT = 500;

export default function Browse() {
  const [url, setUrl] = useState(
    'https://github.com/react-native-webview/react-native-webview'
  );
  const [search, setSearch] = useState('');
  const [expandedMenu, setExpandedMenu] = useState(false);
  const webviewRef = useRef<WebView>(null);

  // Create a shared value to hold the height of the bottom sheet
  const bottomSheetHeight = useSharedValue(0);
  const start = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      start.value = bottomSheetHeight.value;
    })
    .onUpdate((e) => {
      if (start.value === MAX_HEIGHT) {
        bottomSheetHeight.value = MAX_HEIGHT - e.translationY;
      } else if (start.value === MEDIUM_HEIGHT) {
        bottomSheetHeight.value = MEDIUM_HEIGHT - e.translationY;
      }
    })
    .onEnd((e) => {
      if (start.value === MAX_HEIGHT) {
        if (e.translationY > 150) {
          bottomSheetHeight.value = withTiming(MIN_HEIGHT);
          runOnJS(setExpandedMenu)(false);
        } else if (e.translationY > 50) {
          bottomSheetHeight.value = withTiming(MEDIUM_HEIGHT);
        } else {
          bottomSheetHeight.value = withTiming(MAX_HEIGHT);
        }
      } else if (start.value === MEDIUM_HEIGHT) {
        if (e.translationY > 50) {
          bottomSheetHeight.value = withTiming(MIN_HEIGHT);
          runOnJS(setExpandedMenu)(false);
        } else if (e.translationY < -50) {
          bottomSheetHeight.value = withTiming(MAX_HEIGHT);
        } else {
          bottomSheetHeight.value = withTiming(MEDIUM_HEIGHT);
        }
      }
    })
    .onFinalize(() => {});

  const animatedStyle = useAnimatedStyle(() => {
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
              style={[
                {
                  backgroundColor: 'white',
                  borderWidth: 2,
                  borderColor: 'black',
                },
                animatedStyle,
              ]}
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
              {expandedMenu ? (
                <Ionicons
                  name="close-circle"
                  size={28}
                  color="black"
                  onPress={() => {
                    setExpandedMenu(false);
                    bottomSheetHeight.value = withTiming(MIN_HEIGHT);
                  }}
                />
              ) : (
                <Ionicons
                  name="arrow-up-circle"
                  size={28}
                  color="black"
                  onPress={() => {
                    setExpandedMenu(true);
                    bottomSheetHeight.value = withTiming(MEDIUM_HEIGHT);
                  }}
                />
              )}
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

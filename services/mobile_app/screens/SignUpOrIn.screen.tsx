import { SignInWithGoogle } from '../hooks/SignInWithOAuth';
import { Box, Text } from '../styling/RestylePrimitives';
import { Image as ExpoImage } from 'expo-image';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { FlatList, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const { width } = Dimensions.get('window');

GoogleSignin.configure({
  webClientId: Constants?.expoConfig?.extra?.googleClientId,
});

export default function SignUpOrIn() {
  return (
    <Box backgroundColor="background" flex={1}>
      <Gallery />
      <Box flex={2} alignItems="center">
        <Box padding="l" alignItems="center" gap="s">
          <Text variant="title" fontSize={38}>
            Look!
          </Text>
          <Text variant="body" fontSize={18} textAlign="center">
            Unifying physical and digital shopping into one experience.
          </Text>
        </Box>

        {/* <SignInWithApple /> */}
        <SignInWithGoogle />
      </Box>
    </Box>
  );
}

function Gallery() {
  const [imageIndices, setImageIndices] = useState(
    new Array(originalImages.length).fill(0)
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setActiveIndex(viewableItems[0].index);
    }
  ).current;

  useEffect(() => {
    const timers: any[] = [];

    originalImages.forEach((_, i) => {
      const timer = setInterval(() => {
        setImageIndices((prevIndices) =>
          prevIndices.map((prevIndex, j) => {
            if (j === i) {
              return (prevIndex + 1) % originalImages[j].length;
            } else {
              return prevIndex;
            }
          })
        );
      }, intervals[i]);

      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <Box flex={5}>
      <Box flex={1}>
        <FlatList
          data={originalImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <Box style={{ width: width }}>
              <ExpoImage
                // sharedTransitionTag={`image-${product.url}`}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                contentFit="cover"
                source={originalImages[index][imageIndices[index]]}
              />
              <LinearGradient
                // Transparent for the first half of the image, then transition to white
                colors={['transparent', 'transparent', 'rgba(255,255,255,1)']}
                locations={[0, 0.5, 1]}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '100%',
                }}
              />
            </Box>
          )}
        />
      </Box>
      <Carousel images={originalImages} activeIndex={activeIndex} />
    </Box>
  );
}

function Carousel({
  images,
  activeIndex,
}: {
  images: any[];
  activeIndex: number;
}) {
  if (images.length <= 1) return null;

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      position="absolute"
      bottom={17}
      width="100%"
      zIndex={0}
    >
      {images.map((_, i) => (
        <Box
          key={i}
          width={7}
          height={7}
          borderRadius={40}
          backgroundColor={i === activeIndex ? 'text' : 'background'}
          marginHorizontal="s"
        />
      ))}
    </Box>
  );
}

const originalImages = [
  [
    require('../assets/generations/demo/login_screen/softgoat1/1.png'),
    require('../assets/generations/demo/login_screen/softgoat1/2.png'),
    require('../assets/generations/demo/login_screen/softgoat1/3.png'),
    require('../assets/generations/demo/login_screen/softgoat1/4.png'),
    require('../assets/generations/demo/login_screen/softgoat1/5.png'),
    require('../assets/generations/demo/login_screen/softgoat1/6.png'),
    require('../assets/generations/demo/login_screen/softgoat1/7.png'),
    require('../assets/generations/demo/login_screen/softgoat1/8.png'),
    require('../assets/generations/demo/login_screen/softgoat1/9.png'),
    require('../assets/generations/demo/login_screen/softgoat1/10.png'),
  ],
  [
    require('../assets/generations/demo/login_screen/softgoat3/1.png'),
    require('../assets/generations/demo/login_screen/softgoat3/2.png'),
    require('../assets/generations/demo/login_screen/softgoat3/3.png'),
    require('../assets/generations/demo/login_screen/softgoat3/4.png'),
  ],
  [
    require('../assets/generations/demo/login_screen/adaysmarch1/1.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/2.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/3.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/4.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/5.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/6.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/7.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/8.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/9.png'),
    require('../assets/generations/demo/login_screen/adaysmarch1/10.png'),
  ],
];
const intervals = [750, 750, 500];

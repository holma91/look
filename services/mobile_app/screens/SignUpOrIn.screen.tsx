import {
  SignInWithApple,
  SignInWithGoogle,
} from '../components/SignInWithOAuth';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { AppleButton, GoogleButton } from '../components/Button';

const { width, height } = Dimensions.get('window');

const originalImages = [
  [
    require('../assets/generations/demo/me/stepbystep/1.png'),
    require('../assets/generations/demo/me/stepbystep/2.png'),
    require('../assets/generations/demo/me/stepbystep/3.png'),
    require('../assets/generations/demo/me/stepbystep/4.png'),
    require('../assets/generations/demo/me/stepbystep/5.png'),
    require('../assets/generations/demo/me/stepbystep/6.png'),
    require('../assets/generations/demo/me/stepbystep/7.png'),
    require('../assets/generations/demo/me/stepbystep/8.png'),
    require('../assets/generations/demo/me/stepbystep/9.png'),
    require('../assets/generations/demo/me/stepbystep/10.png'),
    require('../assets/generations/demo/me/stepbystep/11.png'),
    require('../assets/generations/demo/me/stepbystep/12.png'),
    require('../assets/generations/demo/me/stepbystep/13.png'),
    require('../assets/generations/demo/me/stepbystep/14.png'),
    require('../assets/generations/demo/me/stepbystep/15.png'),
    require('../assets/generations/demo/me/stepbystep/20.png'),
    require('../assets/generations/demo/me/stepbystep/25.png'),
    require('../assets/generations/demo/me/stepbystep/30.png'),
  ],
  [
    require('../assets/products/adaysmarch1/gen2.png'),
    require('../assets/products/softgoat1/gen1.png'),
    require('../assets/products/softgoat3/gen1.png'),
  ],
];

const intervals = [250, 3000];

export default function SignUpOrIn() {
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
    // Create an array to store all the timers
    const timers: any[] = [];

    originalImages.forEach((_, i) => {
      const timer = setInterval(() => {
        setImageIndices((prevIndices) =>
          prevIndices.map((prevIndex, j) => {
            // If this is the current spot
            if (j === i) {
              // Return the index of the next image, or 0 if we're at the end of the sub-array
              return (prevIndex + 1) % originalImages[j].length;
            }
            // For other spots, just return the previous index
            else {
              return prevIndex;
            }
          })
        );
      }, intervals[i]); // Use the desired interval for this spot

      // Add this timer to the timers array
      timers.push(timer);
    });

    // Clean up the timers when the component unmounts
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <Box backgroundColor="background" flex={1}>
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
      <Box flex={2} alignItems="center">
        <Box padding="l" alignItems="center" gap="s">
          <Text variant="title" fontSize={38}>
            Look!
          </Text>
          <Text variant="body" fontSize={18} textAlign="center">
            Unifying physical and digital shopping into one experience.
          </Text>
        </Box>

        <SignInWithApple />
      </Box>
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

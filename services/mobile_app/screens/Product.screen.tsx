import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../components/Button';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import { useRef, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Product({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const randomNumber = useSharedValue(525);

  const { product }: { product: UserProduct } = route.params;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible if 50% of its area is showing
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setActiveIndex(viewableItems[0].index);
    }
  ).current;

  const style = useAnimatedStyle(() => {
    return { width: width, height: withTiming(randomNumber.value) };
  });

  const handleStudioPress = () => {
    console.log('Studio Pressed');
    randomNumber.value = expanded ? 525 : 615;
    setExpanded(!expanded);
    // image height should increase with animation
    // some of the in the lowest box should change
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 50, left: 20, zIndex: 1 }}
      >
        <Ionicons name="chevron-back" size={30} color="black" />
      </TouchableOpacity>
      <Box>
        <Box>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <Animated.Image
                sharedTransitionTag={`image-${product.url}`}
                style={style}
                source={{ uri: item }}
              />
            )}
          />
          <TouchableOpacity
            onPress={handleStudioPress}
            style={{
              position: 'absolute',
              bottom: 25,
              right: 25,
              zIndex: 2,
              backgroundColor: 'rgba(256, 256, 256, 0.5)',
              borderRadius: 50,
              borderWidth: expanded ? 2 : 0,
              width: 42,
              height: 42,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="human-handsdown"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="center"
          position="absolute"
          bottom={17}
          width="100%"
          zIndex={0}
        >
          {!expanded && product.images.length > 1
            ? product.images.map((_, i) => (
                <Box
                  key={i}
                  width={7}
                  height={7}
                  borderRadius={40}
                  backgroundColor={i === activeIndex ? 'text' : 'background'}
                  marginHorizontal="s"
                />
              ))
            : null}
        </Box>
      </Box>
      <Box padding="m" flex={1} justifyContent="space-between">
        {!expanded ? (
          <>
            <Box alignContent="space-between" justifyContent="space-between">
              <Text variant="title" fontSize={22} marginBottom="s">
                {product.name}
              </Text>
              <Text variant="body" fontSize={18} marginBottom="s">
                {product.brand}
              </Text>
              <Text variant="body" fontSize={18} marginBottom="s">
                {`${product.price} ${product.currency}`}
              </Text>
              <Text variant="body" fontSize={18} marginBottom="m">
                {product.domain}
              </Text>
            </Box>
            <Box>
              <Button
                label={`Buy on ${product.domain}`}
                onPress={() =>
                  navigation.navigate('Browser', { url: product.url })
                }
                variant="tertiary"
                fontSize={17}
                paddingVertical="s"
                color="textOnBackground"
              ></Button>
            </Box>
          </>
        ) : (
          <Box
            alignContent="space-between"
            justifyContent="space-between"
            gap="m"
          >
            <Box
              marginTop="none"
              padding="m"
              borderWidth={1}
              borderRadius={10}
              borderColor="grey"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text variant="body" fontWeight="bold">
                Selected Model:
              </Text>
              <Text variant="body" fontWeight="bold">
                White man
              </Text>
            </Box>
            <Button
              label={`Test on model`}
              variant="tertiary"
              fontSize={17}
              paddingVertical="s"
              color="textOnBackground"
            ></Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

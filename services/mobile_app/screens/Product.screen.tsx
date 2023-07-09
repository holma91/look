import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';
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

const { width, height } = Dimensions.get('window');

const demoImages: { [key: string]: any } = {
  basic: [
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
  other: [
    require('../assets/generations/demo/kitchen.png'),
    require('../assets/generations/demo/park.png'),
    require('../assets/generations/demo/timessquare.png'),
    require('../assets/generations/demo/villa.png'),
  ],
};

const determineImage = (image: string | number) => {
  if (typeof image === 'string') {
    // this means it's a URI
    return { uri: image };
  }
  // if it's not a string, we'll assume it's a local image
  return image;
};

export default function Product({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [originalImages, setOriginalImages] = useState<string[]>(
    route.params.product.images
  );
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const imageHeight = useSharedValue(height * 0.6);

  const { product }: { product: UserProduct } = route.params;
  console.log('product', product);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setActiveIndex(viewableItems[0].index);
    }
  ).current;

  const animatedStyle = useAnimatedStyle(() => {
    return { width: width, height: withTiming(imageHeight.value) };
  });

  const handleStudioPress = () => {
    imageHeight.value = expanded ? height * 0.6 : height * 0.68;
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
          // marginTop: 8,
        }}
      >
        {!expanded ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 2,
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderRadius: 5,
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 2,
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderRadius: 5,
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={product?.liked ? 'heart' : 'heart-outline'}
                size={26}
                color="white"
                style={{ marginTop: 2, marginLeft: 1 }}
              />
            </TouchableOpacity>
          </>
        ) : null}
        <Box>
          <Box>
            <FlatList
              data={hasGenerated && expanded ? generatedImages : originalImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item }) => (
                <Animated.Image
                  // sharedTransitionTag={`image-${product.url}`}
                  style={animatedStyle}
                  source={determineImage(item)}
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
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderRadius: 5,
                borderWidth: expanded ? 2 : 0,
                borderColor: 'white',
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="human-handsdown"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </Box>
          <Carousel
            images={hasGenerated && expanded ? generatedImages : originalImages}
            activeIndex={activeIndex}
          />
        </Box>
        <TextBox
          {...{
            product,
            expanded,
            navigation,
            setHasGenerated,
            hasGenerated,
            setGeneratedImages,
            setOriginalImages,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type TextBoxProps = {
  product: UserProduct;
  expanded: boolean;
  navigation: any;
  setHasGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  hasGenerated: boolean;
  setGeneratedImages: React.Dispatch<React.SetStateAction<any[]>>;
  setOriginalImages: React.Dispatch<React.SetStateAction<string[]>>;
};

function TextBox({
  product,
  expanded,
  navigation,
  setHasGenerated,
  hasGenerated,
  setGeneratedImages,
  setOriginalImages,
}: TextBoxProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setHasGenerated(true);
    for (let i = 0; i < demoImages['basic'].length; i++) {
      setGeneratedImages([demoImages['basic'][i]]);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    setIsGenerating(false);

    setGeneratedImages([demoImages['basic'][demoImages['basic'].length - 1]]);

    setOriginalImages((prev) => [
      ...prev,
      demoImages['basic'][demoImages['basic'].length - 1],
    ]);
  };

  return (
    <Box padding="m" flex={1} justifyContent="space-between">
      {!expanded ? (
        <>
          <Box alignContent="space-between" justifyContent="space-between">
            <Text variant="title" fontSize={24} marginBottom="s">
              {product.name}
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              gap="s"
              marginBottom="s"
            >
              <Text variant="body" fontSize={20} fontWeight="600">
                {product.brand}
              </Text>
              <Ionicons name="checkmark-circle" size={26} color="black" />
            </Box>
            <Text variant="body" fontSize={18} marginBottom="s">
              {`${product.price} ${product.currency}`}
            </Text>
          </Box>
          <Box gap="m">
            {product?.creator ? (
              <Box flexDirection="row" alignItems="center" gap="s">
                <Box flexDirection="row" alignItems="center">
                  <Text variant="body" fontSize={20} marginRight="xxxs">
                    Generated by
                  </Text>
                  <Text fontSize={20} fontWeight="600" marginLeft="xxs">
                    @{product.creator}
                  </Text>
                </Box>
              </Box>
            ) : null}
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
              me
            </Text>
          </Box>
          <Button
            label={
              hasGenerated && !isGenerating
                ? 'Generated'
                : isGenerating
                ? 'is generating...'
                : `Test on model`
            }
            onPress={handleGenerate}
            variant="tertiary"
            fontSize={17}
            paddingVertical="s"
            color="textOnBackground"
          ></Button>
        </Box>
      )}
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

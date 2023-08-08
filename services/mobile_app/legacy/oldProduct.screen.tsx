import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle';

import { Box, ScrollBox } from '../styling/Box';
import { Text } from '../styling/Text';
import { Theme } from '../styling/theme';
import { FilterType, UserProduct } from '../utils/types';
import { useContext, useRef, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TrainingContext } from '../context/Training';
import { DemoContext } from '../context/Demo';
import { useLikeProductMutation } from '../hooks/useLikeProductMutation';
import { PrimaryButton } from '../components/Button';

const { width, height } = Dimensions.get('window');

const demoImages: { [key: string]: any } = {
  stepbystep: [
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
  stepbystep2: [
    require('../assets/generations/demo/me/stepbystep2/1.png'),
    require('../assets/generations/demo/me/stepbystep2/2.png'),
    require('../assets/generations/demo/me/stepbystep2/3.png'),
    require('../assets/generations/demo/me/stepbystep2/4.png'),
    require('../assets/generations/demo/me/stepbystep2/5.png'),
    require('../assets/generations/demo/me/stepbystep2/6.png'),
    require('../assets/generations/demo/me/stepbystep2/7.png'),
    require('../assets/generations/demo/me/stepbystep2/8.png'),
    require('../assets/generations/demo/me/stepbystep2/9.png'),
    require('../assets/generations/demo/me/stepbystep2/10.png'),
    require('../assets/generations/demo/me/stepbystep2/11.png'),
    require('../assets/generations/demo/me/stepbystep2/12.png'),
    require('../assets/generations/demo/me/stepbystep2/13.png'),
    require('../assets/generations/demo/me/stepbystep2/14.png'),
    require('../assets/generations/demo/me/stepbystep2/15.png'),
    require('../assets/generations/demo/me/stepbystep2/20.png'),
    require('../assets/generations/demo/me/stepbystep2/25.png'),
    require('../assets/generations/demo/me/stepbystep2/30.png'),
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
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const imageHeight = useSharedValue(height * 0.6);

  const { product }: { product: UserProduct } = route.params;
  const { filter }: { filter: FilterType } = route.params;

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

  const likeProductMutation = useLikeProductMutation(filter);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
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
              onPress={() => {
                // likeMutation.mutate(product);
                likeProductMutation.mutate(product);
              }}
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
              data={
                (isGenerating || hasGenerated) && expanded
                  ? generatedImages
                  : originalImages
              }
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
        <Box flex={1}>
          <TextBox
            {...{
              product,
              expanded,
              navigation,
              setHasGenerated,
              hasGenerated,
              setIsGenerating,
              isGenerating,
              setGeneratedImages,
              setOriginalImages,
              activeIndex,
            }}
          />
        </Box>
      </View>
    </SafeAreaView>
  );
}

type TextBoxProps = {
  product: UserProduct;
  expanded: boolean;
  navigation: any;
  setHasGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  hasGenerated: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  setGeneratedImages: React.Dispatch<React.SetStateAction<any[]>>;
  setOriginalImages: React.Dispatch<React.SetStateAction<string[]>>;
  activeIndex: number;
};

function TextBox({
  product,
  expanded,
  navigation,
  setHasGenerated,
  hasGenerated,
  setIsGenerating,
  isGenerating,
  setGeneratedImages,
  setOriginalImages,
  activeIndex,
}: TextBoxProps) {
  const { activeModel, setActiveModel } = useContext(TrainingContext);
  const { isDemo } = useContext(DemoContext);
  const [isShared, setIsShared] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating || !isDemo) return;

    setIsGenerating(true);

    console.log('product', product);

    const imageSerie =
      product.domain === 'softgoat.com' ? 'stepbystep2' : 'stepbystep';

    for (let i = 0; i < demoImages[imageSerie].length; i++) {
      setGeneratedImages([demoImages[imageSerie][i]]);
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
    setIsGenerating(false);

    setGeneratedImages([
      demoImages[imageSerie][demoImages[imageSerie].length - 1],
    ]);

    setOriginalImages((prev) => [
      ...prev,
      demoImages[imageSerie][demoImages[imageSerie].length - 1],
    ]);
    setHasGenerated(true);
  };

  const handleTestOnModel = async () => {
    console.log('test on model');
    // get active image
    const image = product.images[activeIndex];
    console.log('image:', image);

    // send active image and active model to server
  };

  const handleShare = () => {
    setIsShared(true);
  };

  const handleExplore = () => {
    navigation.navigate('ExploreNavigator');
  };

  return (
    <ScrollBox flex={1}>
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
              {product?.generatedBy ? (
                <Box flexDirection="row" alignItems="center" gap="s">
                  <Box flexDirection="row" alignItems="center">
                    <Text variant="body" fontSize={20} marginRight="xxxs">
                      Generated by
                    </Text>
                    <Text fontSize={20} fontWeight="600" marginLeft="xxs">
                      @{product.generatedBy[activeIndex] || 'me'}
                    </Text>
                  </Box>
                </Box>
              ) : null}
              <Box marginTop={product?.generatedBy ? 'xs' : 'l'}>
                <PrimaryButton
                  label={`Buy on ${product.domain}`}
                  onPress={() => {
                    console.log('navigate to ', product.url);

                    navigation.navigate('Browser', {
                      url: product.url,
                      product,
                      baseProductUrl: product.url,
                    });
                  }}
                ></PrimaryButton>
              </Box>
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
                {activeModel.name}
              </Text>
            </Box>
            <PrimaryButton label="Test on model" onPress={handleTestOnModel} />
            {/* {!hasGenerated ? (
              <LegacyButton
                label={isGenerating ? 'is generating...' : `Test on model`}
                onPress={handleGenerate}
                variant="tertiary"
                fontSize={17}
                paddingVertical="s"
                color="textOnBackground"
              ></LegacyButton>
            ) : !isShared ? (
              <LegacyButton
                label={'Share image'}
                onPress={handleShare}
                variant="tertiary"
                fontSize={17}
                paddingVertical="s"
                color="textOnBackground"
              ></LegacyButton>
            ) : (
              <LegacyButton
                label={'Go to explore'}
                onPress={handleExplore}
                variant="tertiary"
                fontSize={17}
                paddingVertical="s"
                color="textOnBackground"
              ></LegacyButton>
            )} */}
          </Box>
        )}
      </Box>
    </ScrollBox>
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

const buttonVariant: any = createVariant({ themeKey: 'buttonVariants' });
const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([buttonVariant], Box);

type Props = {
  onPress: () => void;
  label: string;
  variant: 'primary' | 'secondary' | 'tertiary';
};

const LegacyButton = ({ label, onPress, variant, ...rest }: Props | any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonContainer variant={variant}>
        <Text textAlign="center" fontWeight="bold" {...rest}>
          {label}
        </Text>
      </ButtonContainer>
    </TouchableOpacity>
  );
};

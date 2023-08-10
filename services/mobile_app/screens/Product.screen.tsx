import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Box, ScrollBox, Text } from '../styling/RestylePrimitives';
import { FilterType, UserProduct } from '../utils/types';
import { useContext, useRef, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TrainingContext } from '../context/Training';
import { useLikeProductMutation } from '../hooks/mutations/useLikeProductMutation';
import { PrimaryButton } from '../components/Button';
import { useProductQuery } from '../hooks/queries/useProductQuery';

const { width, height } = Dimensions.get('window');

const determineImage = (image: string | number) => {
  if (typeof image === 'string') {
    // this means it's a URI
    return { uri: image };
  }
  // if it's not a string, we'll assume it's a local image
  return image;
};

type ProductProps = {
  navigation: any;
  route: any;
};

export default function Product({ navigation, route }: ProductProps) {
  const { filter }: { filter: FilterType } = route.params;
  const { data: activeProduct } = useProductQuery(route.params.product);
  const likeProductMutation = useLikeProductMutation(filter);

  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const imageHeight = useSharedValue(height * 0.6);

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
      <Box flex={1} backgroundColor="background">
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
                likeProductMutation.mutate(activeProduct);
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
                name={activeProduct?.liked ? 'heart' : 'heart-outline'}
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
              data={activeProduct.images}
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
          <Carousel images={activeProduct.images} activeIndex={activeIndex} />
        </Box>
        <Box flex={1}>
          <TextBox
            product={activeProduct}
            expanded={expanded}
            navigation={navigation}
            activeIndex={activeIndex}
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
}

type TextBoxProps = {
  product: UserProduct;
  expanded: boolean;
  navigation: any;
  activeIndex: number;
};

function TextBox({ product, expanded, navigation, activeIndex }: TextBoxProps) {
  const { activeModel, setActiveModel } = useContext(TrainingContext);

  const handleTestOnModel = async () => {
    const image = product.images[activeIndex];
    console.log('test with image:', image);

    // send active image and active model to server
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
              <Box marginTop="l">
                <PrimaryButton
                  label={`Buy on ${product.domain}`}
                  onPress={() => {
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

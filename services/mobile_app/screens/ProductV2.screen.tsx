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
import { useLikeProductMutation } from '../hooks/mutations/products/useLikeProductMutation';
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

export default function ProductV2({ navigation, route }: ProductProps) {
  const { filter }: { filter: FilterType } = route.params;
  const { data: activeProduct } = useProductQuery(route.params.product);
  const likeProductMutation = useLikeProductMutation(filter);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('base');
  const [fittingMode, setFittingMode] = useState(false);
  const imageHeight = useSharedValue(height * 0.6);

  const animatedStyle = useAnimatedStyle(() => {
    return { width: width, height: withTiming(imageHeight.value) };
  });

  const handleStudioPress = () => {
    // imageHeight.value = fittingMode ? height * 0.6 : height * 0.68;
    setFittingMode(!fittingMode);
  };

  const images: { [key: string]: string[] } = {
    base: [
      'https://img01.ztat.net/article/spp-media-p1/e821827b5b3e4af3900008c9050696a8/a7ee6fbed5764b85839ed9c05ec2eeaa.jpg',
      'https://img01.ztat.net/article/spp-media-p1/3c6c70ef26804275b82b0b0814a08317/84a7df03e65e419297acc827847fe28a.jpg',
      'https://img01.ztat.net/article/spp-media-p1/0e36a35018d64ace8104794b4b93e909/e75ddafe5ce647a0aff95dbdc1b605dc.jpg',
      'https://img01.ztat.net/article/spp-media-p1/ef6d4f19d80442e0add96dc2bf82672a/c40f4e82ba6546f69b76a9e3dc7641a1.jpg',
      'https://img01.ztat.net/article/spp-media-p1/e03c271f870649a58f7e6f96b94e9a9b/0202ecddfb4d4af29c47eb2fd20f7498.jpg',
    ],
    black: [
      'https://img01.ztat.net/article/spp-media-p1/f8baacffcfee40d69c1bf0667023c112/c56d781b37bf42dbbf0b5d07070598de.jpg',
      'https://img01.ztat.net/article/spp-media-p1/74dc1f4906e2432d9d2d9e461d91636a/f78b98bfcdf74f0fa90cf40ccabcc798.jpg',
      'https://img01.ztat.net/article/spp-media-p1/52d0541ee0c94af89270f9f1834db20f/85819b7eb0b24f049b3a1500150f5271.jpg',
      'https://img01.ztat.net/article/spp-media-p1/2a9c4849763449949589cb64fb311188/8307b6719c574788894380e1a8a34a07.jpg',
    ],
    white: [
      'https://img01.ztat.net/article/spp-media-p1/a39f5ff3c6ba47d3b6027ab22a434a1d/56aec90d2ce44ee4ae032a51655ecc0e.jpg',
      'https://img01.ztat.net/article/spp-media-p1/121bd65302454550b556b24622b99c7d/3bd9c6eb543d4253874deac42061ca4c.jpg',
      'https://img01.ztat.net/article/spp-media-p1/cb568d55d7614e51b1569e7be8fe3f06/49b827ddeaa8406fb7c77c9e075a800a.jpg',
      'https://img01.ztat.net/article/spp-media-p1/54e5c31071e54fb5b4ef678b2476f9ad/e8987984d0ca43e0b6302757f5baa8c9.jpg',
      'https://img01.ztat.net/article/spp-media-p1/364c46545edc4fdab4b27afa2f750cd1/aeff3b982a8a409cab11e7b7e16eb484.jpg',
      'https://img01.ztat.net/article/spp-media-p1/cd5246725ac648fd8bd072af8f224832/5feb6e099f1243e7a28d7250bacee1fd.jpg',
      'https://img01.ztat.net/article/spp-media-p1/a52d1339bb604d4bae56627a80ae00b9/6630241dc2314c0fb875cef857baee41.jpg',
    ],
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleVerticalViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        // setActiveCategory(viewableItems[0].item);
        setActiveCategoryIndex(viewableItems[0].index);
        setActiveImageIndex(0);
      }
    }
  ).current;

  const handleHorizontalViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        setActiveImageIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="background">
        {!fittingMode ? (
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
          <Box height={imageHeight.value}>
            <FlatList
              data={Object.keys(images)}
              keyExtractor={(item) => item}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              scrollEnabled={!fittingMode}
              onViewableItemsChanged={handleVerticalViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item: category }) => {
                return (
                  <FlatList
                    data={images[category]}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    scrollEnabled={!fittingMode}
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={
                      handleHorizontalViewableItemsChanged
                    }
                    viewabilityConfig={viewabilityConfig}
                    renderItem={({ item }) => (
                      <Animated.Image
                        style={animatedStyle}
                        source={determineImage(item)}
                      />
                    )}
                  />
                );
              }}
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
                borderWidth: fittingMode ? 2 : 0,
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
          {!fittingMode ? (
            <>
              <VerticalCarousel
                images={Object.keys(images)}
                activeIndex={activeCategoryIndex}
              />
              <Carousel
                images={images[activeCategory]}
                activeIndex={activeImageIndex}
              />
            </>
          ) : null}
        </Box>
        <TextBox
          product={activeProduct}
          fittingMode={fittingMode}
          navigation={navigation}
          activeIndex={activeImageIndex}
        />
      </Box>
    </SafeAreaView>
  );
}

type TextBoxProps = {
  product: UserProduct;
  fittingMode: boolean;
  navigation: any;
  activeIndex: number;
};

function TextBox({
  product,
  fittingMode,
  navigation,
  activeIndex,
}: TextBoxProps) {
  const { activeModel, setActiveModel } = useContext(TrainingContext);

  const handleTestOnModel = async () => {
    const image = product.images[activeIndex];
    console.log('test with image:', image);

    // send active image and active model to server
  };

  // console.log('product', product);

  return (
    <ScrollBox flex={1}>
      <Box padding="m" flex={1} justifyContent="space-between">
        {!fittingMode ? (
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
function VerticalCarousel({
  images,
  activeIndex,
}: {
  images: any[];
  activeIndex: number;
}) {
  if (images.length <= 1) return null;

  return (
    <Box
      // alignItems="center"
      position="absolute"
      gap="sm"
      left={12}
      top={240}
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

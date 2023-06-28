import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import { useRef, useState } from 'react';

type RootStackParamList = {
  Product: { product: UserProduct };
};

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

interface Props {
  navigation: any;
  route: ProductScreenRouteProp;
}

const { width } = Dimensions.get('window');

export default function Product({
  navigation,
  route,
}: {
  navigation: any;
  route: ProductScreenRouteProp;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { product } = route.params;
  console.log(product);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible if 50% of its area is showing
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setActiveIndex(viewableItems[0].index);
    }
  ).current;

  return (
    <Box>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
      >
        <Ionicons name="chevron-back" size={30} color="black" />
      </TouchableOpacity>
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
            <ExpoImage
              source={{ uri: item }}
              style={{ width: width, height: 550 }}
              resizeMode="cover"
            />
          )}
        />
        <Box
          flexDirection="row"
          justifyContent="center"
          position="absolute"
          bottom={35}
          width="100%"
        >
          {product.images.length > 1
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
      <Box padding="m">
        <Text variant="title" fontSize={22} marginBottom="s">
          {product.name}
        </Text>
        <Text variant="body" fontSize={18} marginBottom="s">
          {product.brand}
        </Text>
        <Text variant="body" fontSize={18} marginBottom="s">
          {`${product.price} ${product.currency}`}
        </Text>
        <Text variant="body" fontSize={18} marginBottom="s">
          {product.domain}
        </Text>
      </Box>
    </Box>
  );
}

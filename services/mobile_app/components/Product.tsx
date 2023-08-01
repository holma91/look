import { TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import { useLikeMutation } from '../hooks/useLikeMutation';

export function ProductBig({
  navigation,
  product,
  height,
}: {
  navigation: any;
  product: UserProduct;
  height: number;
}) {
  const likeMutation = useLikeMutation();

  const HoldProductList = [
    {
      text: product.liked ? 'Unlike' : 'Like',
      icon: () => (
        <Ionicons name={product.liked ? 'heart' : 'heart-outline'} size={18} />
      ),
      onPress: () => {
        likeMutation.mutate(product);
      },
    },
    {
      text: 'Delete from list',
      icon: () => <Ionicons name="remove" size={18} />,
      isDestructive: true,
      onPress: () => {},
    },
  ];

  const handleProductClick = () => {
    navigation.navigate('Product', { product: product });
  };

  return (
    <TouchableOpacity onPress={handleProductClick} style={{ flex: 1 }}>
      <Box flex={1} margin="s" gap="s" marginBottom="m">
        <HoldItem items={HoldProductList} containerStyles={{ flex: 1 }}>
          <Animated.Image
            // sharedTransitionTag={`image-${product.url}`}
            style={{
              width: '100%',
              height: height,
              // borderRadius: 10,
            }}
            source={{ uri: product.images[0] }}
          />
        </HoldItem>
        <Box gap="xxs" backgroundColor="background">
          <Text variant="body" fontWeight="600">
            {product.brand}
          </Text>
          <Text fontSize={14} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text>{`${product.price} ${product.currency}`}</Text>
          <Text>{product.domain}</Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
export function ProductSmall({
  product,
  height,
}: {
  product: UserProduct;
  height: number;
}) {
  console.log('product', product);

  const handleProductClick = () => {
    console.log('click!');
  };

  return (
    <TouchableOpacity onPress={handleProductClick} style={{ flex: 1 }}>
      <Box flex={1} margin="s" gap="s" marginBottom="m">
        <Animated.Image
          style={{
            width: '100%',
            height: height,
          }}
          source={{ uri: product.images[0] }}
        />
        <Box gap="xxs" backgroundColor="background">
          <Text
            variant="body"
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.brand}
          </Text>
          <Text fontSize={14} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

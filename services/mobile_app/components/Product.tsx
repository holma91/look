import { TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import React, { useMemo, useState } from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FilterType, UserProduct } from '../utils/types';
import { useLikeMutation } from '../hooks/useLikeMutation';
import { useDeleteProductMutation } from '../hooks/useDeleteProductMutation';

export function ProductBig({
  navigation,
  product,
  filter,
}: {
  navigation: any;
  product: UserProduct;
  filter: FilterType;
}) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const likeMutation = useLikeMutation();
  const deleteProductMutation = useDeleteProductMutation(filter);

  const listId = filter?.list && filter.list[0];

  const HoldProductList = useMemo(() => {
    if (listId === 'likes') {
      return [
        {
          text: (Math.random() * 100).toString(), //product.liked ? 'Unlike' : 'Like',
          icon: () => (
            <Ionicons
              name={product.liked ? 'heart' : 'heart-outline'}
              size={18}
            />
          ),
          onPress: () => {
            // for debugging
            console.log('currentProduct:', currentProduct.url);
            console.log('like:', product.name);
            likeMutation.mutate(product);
          },
        },
        {
          text: 'Add to list',
          icon: () => <Ionicons name="add" size={18} />,
          onPress: () => {},
        },
      ];
    } else {
      return [
        {
          text: (Math.random() * 100).toString(), //product.liked ? 'Unlike' : 'Like',
          icon: () => (
            <Ionicons
              name={product.liked ? 'heart' : 'heart-outline'}
              size={18}
            />
          ),
          onPress: () => {
            // for debugging
            console.log('currentProduct:', currentProduct.url);
            console.log('like:', product.name);
            likeMutation.mutate(product);
          },
        },
        {
          text: `Delete from ${listId}`,
          icon: () => <Ionicons name="remove" size={18} />,
          isDestructive: true,
          withSeparator: true,
          onPress: () => {
            if (listId !== 'likes' && listId !== 'history') {
              deleteProductMutation.mutate(product);
            }
          },
        },
        {
          text: 'Add to list',
          icon: () => <Ionicons name="add" size={18} />,
          onPress: () => {},
        },
      ];
    }
  }, [listId]);

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
              height: 225,
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
  handleProductSelection,
}: {
  product: UserProduct;
  height: number;
  handleProductSelection: (product: UserProduct, isSelected: boolean) => void;
}) {
  const [isSelected, setIsSelected] = useState(false);

  const handleProductClick = () => {
    setIsSelected(!isSelected);
    handleProductSelection(product, !isSelected);
  };

  return (
    <TouchableOpacity onPress={handleProductClick} style={{ flex: 1 }}>
      <Box flex={1} margin="s" gap="s" marginBottom="m">
        <Box>
          <Animated.Image
            style={{
              width: '100%',
              height: height,
              opacity: isSelected ? 0.25 : 1,
            }}
            source={{ uri: product.images[0] }}
          />
          {isSelected && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="black"
              style={{
                position: 'absolute',
                right: 5,
                bottom: 5,
              }}
            />
          )}
        </Box>
        <Box
          gap="xxs"
          backgroundColor="background"
          opacity={isSelected ? 0.25 : 1}
        >
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

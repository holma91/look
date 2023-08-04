import { TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import React, { useEffect, useMemo, useState } from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FilterType, UserProduct } from '../utils/types';
import { useDeleteProductMutation } from '../hooks/useDeleteProductMutation';
import { useLikeProductMutation } from '../hooks/useLikeProductMutation';

export function ProductBig({
  navigation,
  product,
  filter,
  selectMode,
  handleProductSelection,
}: {
  navigation: any;
  product: UserProduct;
  filter: FilterType;
  selectMode?: boolean;
  handleProductSelection?: (product: UserProduct, isSelected: boolean) => void;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const likeProductMutation = useLikeProductMutation(filter);
  const deleteProductMutation = useDeleteProductMutation(filter);

  const listId = filter?.list && filter.list[0];

  const HoldProductListLikes = [
    {
      text: product.liked ? 'Unlike' : 'Like',
      icon: () => (
        <Ionicons name={product.liked ? 'heart' : 'heart-outline'} size={18} />
      ),
      onPress: () => {
        console.log('like:', product.name);
        likeProductMutation.mutate(product);
      },
      actionParams: {
        key: product.url,
      },
    },
    {
      text: 'Add to list',
      icon: () => <Ionicons name="add" size={18} />,
      onPress: () => {},
      actionParams: {
        key: product.url,
      },
    },
  ];

  const HoldProductListOthers = [
    {
      text: product.liked ? 'Unlike' : 'Like',
      icon: () => (
        <Ionicons name={product.liked ? 'heart' : 'heart-outline'} size={18} />
      ),
      onPress: () => {
        console.log('like:', product.name);
        likeProductMutation.mutate(product);
      },
      actionParams: {
        key: product.url,
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
      actionParams: {
        key: product.url,
      },
    },
    {
      text: 'Add to list',
      icon: () => <Ionicons name="add" size={18} />,
      onPress: () => {},
    },
  ];

  const handleProductClick = () => {
    if (selectMode) {
      setIsSelected(!isSelected);
      handleProductSelection!(product, !isSelected);
    } else {
      navigation.navigate('Product', { product: product });
    }
  };

  useEffect(() => {
    if (!selectMode) {
      setIsSelected(false);
    }
  }, [selectMode]);

  return (
    <TouchableOpacity onPress={handleProductClick} style={{ flex: 1 }}>
      <Box flex={1} margin="s" gap="s" marginBottom="m">
        {selectMode ? (
          <Box>
            <Animated.Image
              style={{
                width: '100%',
                height: 225,
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
        ) : (
          <HoldItem
            items={
              listId === 'likes' ? HoldProductListLikes : HoldProductListOthers
            }
            containerStyles={{ flex: 1 }}
          >
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
        )}
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

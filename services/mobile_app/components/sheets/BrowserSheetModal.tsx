import { LayoutAnimation, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { Image as ExpoImage } from 'expo-image';

import { Box, Text } from '../../styling/RestylePrimitives';
import { UserProduct } from '../../utils/types';
import { PrimaryButton } from '../../components/Button';
import ThemedIcon from '../../components/ThemedIcon';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../styling/theme';
import { useRemoveImagesMutation } from '../../hooks/mutations/products/useRemoveImagesMutation';
import Animated from 'react-native-reanimated';

const defaultImage =
  'https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1';

type BrowserSheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  setExpandedMenu: React.Dispatch<React.SetStateAction<boolean>>;
  activeProduct: UserProduct;
  products: UserProduct[];
  selectMode: boolean;
};

export function BrowserSheetModal({
  bottomSheetModalRef,
  setExpandedMenu,
  activeProduct,
  products,
  selectMode,
}: BrowserSheetModalProps) {
  const theme = useTheme<Theme>();
  const [expandedContent, setExpandedContent] = useState(false);
  const snapPoints = useMemo(() => ['46%', '100%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (index === -1) {
      setExpandedContent(false);
      setExpandedMenu(false);
    } else if (index === 0) {
      setExpandedContent(false);
      setExpandedMenu(true);
    } else if (index === 1) {
      setExpandedContent(true);
      setExpandedMenu(true);
    }
  }, []);

  return (
    <BottomSheetModal
      style={{}}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={(props) => (
        <CustomBackdrop
          {...props}
          dismiss={() => bottomSheetModalRef.current?.dismiss()}
        />
      )}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.text,
      }}
      bottomInset={86}
    >
      <BottomSheetContent
        activeProduct={activeProduct}
        expandedContent={expandedContent}
        products={products}
        selectMode={selectMode}
      />
    </BottomSheetModal>
  );
}

type BottomSheetContentProps = {
  activeProduct: UserProduct;
  expandedContent: boolean;
  products: UserProduct[];
  selectMode: boolean;
};

const BottomSheetContent = ({
  activeProduct,
  expandedContent,
  products,
  selectMode,
}: BottomSheetContentProps) => {
  const theme = useTheme<Theme>();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const removeImagesMutation = useRemoveImagesMutation();

  const handleTestOnModel = async () => {
    console.log('test on model');
  };

  const handleRemoveImage = (image: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    removeImagesMutation.mutate({
      product: activeProduct,
      images: [image],
    });
    setCurrentImageIndex(0);
  };

  const img = activeProduct.images[currentImageIndex];

  if (activeProduct.url === '') {
    return (
      <Box justifyContent="center" alignItems="center" marginTop="l" gap="m">
        <Text variant="title">We can't find a product!</Text>
        <Text>Go to a product page, and you'll see it right here. </Text>
        <Text>Or, you can go to some of your earlier viewed products:</Text>
        <FlatList
          style={{ gap: 10, marginTop: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={products.slice().reverse()}
          contentContainerStyle={{ paddingLeft: 5 }}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 6,
              }}
            >
              <ExpoImage
                style={{
                  height: 125,
                  width: 90,
                }}
                source={item.images[0]}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}
        />
      </Box>
    );
  }

  if (expandedContent) {
    return (
      <Box
        margin="m"
        marginBottom="l"
        flexDirection="column"
        justifyContent="space-between"
        gap="m"
        flex={1}
        backgroundColor="background"
      >
        <Box flex={1} borderWidth={0}>
          <ExpoImage
            style={{
              width: '100%',
              height: '100%',
            }}
            source={img ? img : defaultImage}
            contentFit="cover"
          />
        </Box>
        <Box flex={0} justifyContent="space-between" gap="m" marginVertical="m">
          <Box
            padding="m"
            borderWidth={1}
            borderRadius={10}
            borderColor="text"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text variant="body" fontWeight="bold">
              Selected Model:
            </Text>
            <Text variant="body" fontWeight="bold">
              active model
            </Text>
          </Box>
          <Box flex={0}>
            <PrimaryButton label="Test on model" onPress={() => {}} />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box margin="m" gap="l">
        <Box flexDirection="row" justifyContent="space-between" gap="m">
          <Box flex={1} position="relative">
            <ExpoImage
              style={{
                aspectRatio: 0.75,
              }}
              source={img ? img : defaultImage}
              contentFit="cover"
            />
            {img && selectMode ? (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(150,150,150,0.6)',
                  padding: 2,
                  borderRadius: 5,
                }}
                onPress={() => handleRemoveImage(img)}
              >
                <ThemedIcon name="close" size={20} color="background" />
              </TouchableOpacity>
            ) : null}
          </Box>
          <Box flex={1} justifyContent="space-between">
            <Box gap="s" flex={1}>
              <Text
                variant="body"
                fontWeight="bold"
                fontSize={20}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {activeProduct.name}
              </Text>
              <Text variant="body" fontSize={17}>
                {activeProduct.brand}
              </Text>

              <Text
                variant="body"
                fontSize={17}
              >{`${activeProduct.price} ${activeProduct.currency}`}</Text>
            </Box>

            <Box flex={0} gap="l">
              <FlatList
                style={{ gap: 10, marginTop: 20 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={activeProduct.images}
                contentContainerStyle={{ paddingLeft: 5 }}
                keyExtractor={(item, index) => `category-${index}`}
                renderItem={({ item, index }) => (
                  <Box position="relative">
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentImageIndex(index);
                      }}
                      style={{
                        marginRight: 6,
                      }}
                    >
                      <ExpoImage
                        style={{
                          height: 60,
                          width: 60,
                          borderWidth: item === img ? 2 : 0,
                          borderColor: theme.colors.text,
                        }}
                        source={item}
                        contentFit="cover"
                      />
                    </TouchableOpacity>
                  </Box>
                )}
              />
            </Box>
          </Box>
        </Box>
        <PrimaryButton label="Test on model" onPress={handleTestOnModel} />
      </Box>
    );
  }
};

type CustomBackdropProps = {
  animatedIndex: Animated.SharedValue<number>;
  dismiss: () => void;
};

const CustomBackdrop: React.FC<CustomBackdropProps> = ({
  animatedIndex,
  dismiss,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      onTouchStart={dismiss}
      style={{
        position: 'absolute',
        bottom: 86, // height of the NavBar
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: theme.colors.backdropColor || 'rgba(0,0,0,0.5)',
        opacity: 1, // todo: make this animated
      }}
    />
  );
};

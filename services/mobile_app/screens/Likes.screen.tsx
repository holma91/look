import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  // Button,
  View,
  StyleSheet,
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import React, { useCallback, useMemo, useRef } from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetFlatList,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { fetchHistory, fetchLikes, fetchPurchased } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import { Button } from '../components/NewButton';

type ViewTypes = 'Likes' | 'History' | 'Purchases';

export default function Likes({ navigation }: { navigation: any }) {
  const [view, setView] = useState<ViewTypes>('Likes');
  const [showFilter, setShowFilter] = useState(false);
  const { user } = useUser();
  const {
    data: likes,
    refetch,
    isFetching,
  } = useQuery<UserProduct[]>({
    queryKey: ['likes', user?.id],
    queryFn: () => fetchLikes(user?.id as string),
    enabled: !!user?.id,
  });

  const { data: history } = useQuery<UserProduct[]>({
    queryKey: ['history', user?.id],
    queryFn: () => fetchHistory(user?.id as string),
    enabled: !!user?.id,
  });

  const { data: purchases } = useQuery<UserProduct[]>({
    queryKey: ['purchased', user?.id],
    queryFn: () => fetchPurchased(user?.id as string),
    enabled: !!user?.id,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <BottomSheetModalProvider>
      <Box backgroundColor="background" flex={1}>
        <SafeAreaView style={{ flex: 1 }}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingTop="s"
            paddingBottom="m"
            paddingHorizontal="m"
            gap="s"
          >
            <Ionicons
              name={showFilter ? 'options' : 'options-outline'}
              size={24}
              color="black"
              onPress={handleFilter}
            />
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Text variant="title" fontSize={18}>
                {view}
              </Text>
              <Ionicons name="chevron-down" size={26} color="black" />
            </TouchableOpacity>
            <Ionicons name="link" size={24} color="black" />
          </Box>
          {showFilter ? (
            <Box paddingVertical="s">
              <Filter />
            </Box>
          ) : null}
          <Box flex={1} paddingHorizontal="xs">
            <FlatList
              data={
                view === 'Likes'
                  ? likes?.slice().reverse()
                  : view === 'History'
                  ? history?.slice().reverse()
                  : purchases?.slice().reverse()
              }
              numColumns={2}
              keyExtractor={(item) => item.url}
              renderItem={({ item }) => (
                <Product navigation={navigation} product={item} />
              )}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={refetch} />
              }
              showsVerticalScrollIndicator={false}
            />
          </Box>
          <SheetModal
            bottomSheetModalRef={bottomSheetModalRef}
            view={view}
            setView={setView}
          />
        </SafeAreaView>
      </Box>
    </BottomSheetModalProvider>
  );
}

function Filter() {
  return (
    <FlatList
      style={{ gap: 10 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={[
        { label: 'Category' },
        { label: 'Brand' },
        { label: 'Website' },
        { label: 'Price' },
        { label: 'On sale' },
        { label: 'Sort by' },
      ]}
      contentContainerStyle={{ paddingLeft: 12 }}
      keyExtractor={(item, index) => `category-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {}}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            marginRight: 8,
            borderWidth: 2,
            borderRadius: 10,
            padding: 8,
            borderColor: 'black',
          }}
        >
          <Text variant="body" fontWeight="600" fontSize={13} color="text">
            {item.label}
          </Text>
          <Ionicons
            name="chevron-down"
            size={15}
            color="black"
            paddingTop={1}
          />
        </TouchableOpacity>
      )}
    />
  );
}

function Product({
  navigation,
  product,
}: {
  navigation: any;
  product: UserProduct;
}) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Product', { product: product })}
      style={{ flex: 1 }}
    >
      <Box flex={1} margin="s" gap="s" marginBottom="m">
        <Animated.Image
          // sharedTransitionTag={`image-${product.url}`}
          style={{
            width: '100%',
            height: 225,
            // borderRadius: 10,
          }}
          source={{ uri: product.images[0] }}
        />
        {/* <ExpoImage
          style={{
            width: '100%',
            height: 225,
            // borderRadius: 10,
          }}
          source={{ uri: product.images[0] }}
        /> */}
        <Box gap="xxs">
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

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  view: ViewTypes;
  setView: React.Dispatch<React.SetStateAction<ViewTypes>>;
};

const SheetModal = ({
  bottomSheetModalRef,
  view,
  setView,
}: SheetModalProps) => {
  const snapPoints = useMemo(() => ['50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const data = useMemo(() => ['Likes', 'History', 'Purchases'], []);

  const renderListItem = useCallback(
    ({ item }: { item: any }) => (
      <Button
        onPress={() => setView(item)}
        variant="new"
        backgroundColor={item === view ? 'text' : 'background'}
        margin="temporary_xxs"
      >
        <Text
          variant="body"
          fontWeight="bold"
          fontSize={16}
          color={item === view ? 'background' : 'text'}
        >
          {item}
        </Text>
        {item === view ? (
          <Ionicons name="checkmark" size={20} color="white" />
        ) : null}
      </Button>
    ),
    [view]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
    >
      <Box justifyContent="center" alignItems="center" marginBottom="m">
        <Text variant="title" fontSize={22}>
          View
        </Text>
      </Box>
      <BottomSheetFlatList
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ backgroundColor: 'white' }}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheetModal>
  );
};

import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import React, { useCallback, useMemo, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { fetchBrands, fetchHistory, fetchLikes, fetchPurchased } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import SheetModal from '../components/SheetModal';
import Filter from '../components/Filter';

type ViewTypes = 'Likes' | 'History' | 'Purchases';

export default function Likes({ navigation }: { navigation: any }) {
  const [view, setView] = useState<ViewTypes>('Likes');
  const [outerChoice, setOuterChoice] = useState<string>('Category');
  const [choice, setChoice] = useState<string>('');
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

  const { data: brands } = useQuery<string[]>({
    queryKey: ['brands', user?.id],
    queryFn: () => fetchBrands(user?.id as string),
    enabled: !!user?.id,
    select: (data) => data.map((brand: any) => brand.brand),
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  const displayedProducts = useMemo(() => {
    let list: any = [];
    if (view === 'Likes') {
      list = likes;
    } else if (view === 'History') {
      list = history;
    } else {
      list = purchases;
    }

    if (outerChoice === 'Website' && choice !== '') {
      list = list.filter((product: UserProduct) => product.domain === choice);
    }

    if (outerChoice === 'Brand' && choice !== '') {
      list = list.filter((product: UserProduct) => product.brand === choice);
    }

    return list;
  }, [view, likes, history, purchases, outerChoice, choice]);

  return (
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
        <Filter
          outerChoice={outerChoice}
          setOuterChoice={setOuterChoice}
          choice={choice}
          setChoice={setChoice}
          showFilter={showFilter}
          brands={brands || []}
        />
        <Box flex={1} paddingHorizontal="xs">
          <FlatList
            data={displayedProducts?.slice().reverse()}
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
          choice={view}
          setChoice={setView}
          choicesList={['Likes', 'History', 'Purchases', 'New List']}
          sheetHeader="View"
        />
      </SafeAreaView>
    </Box>
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

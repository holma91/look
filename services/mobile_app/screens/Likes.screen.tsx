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
import { fetchHistory, fetchLikes, fetchPurchased } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Filters, UserProduct } from '../utils/types';
import SheetModal from '../components/SheetModal';
import Filter from '../components/Filter';

type ViewTypes = 'Likes' | 'History' | 'Purchases';

export default function Likes({ navigation }: { navigation: any }) {
  const [view, setView] = useState<ViewTypes>('Likes');
  // const [outerChoice, setOuterChoice] = useState<string>('category');
  const [choice, setChoice] = useState<string>('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  const { user } = useUser();
  const likesQuery = useQuery({
    queryKey: ['likes', user?.id, filters],
    queryFn: () => fetchLikes(user?.id as string, filters),
    enabled: !!user?.id,
  });

  const historyQuery = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => fetchHistory(user?.id as string),
    enabled: !!user?.id,
  });

  const purchasesQuery = useQuery({
    queryKey: ['purchased', user?.id],
    queryFn: () => fetchPurchased(user?.id as string),
    enabled: !!user?.id,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFilter = (filter: { [key: string]: string }) => {
    console.log('setting filter', filter);

    setFilters({ ...filters, ...filter });
  };

  const handleFilterSelection = useCallback(
    (
      filterType: 'view' | 'category' | 'website' | 'brand',
      filterValue: string
    ) => {
      setFilters((prevFilters) => {
        const currentFilterValues = [...(prevFilters[filterType] || [])];
        const filterIndex = currentFilterValues.indexOf(filterValue);

        if (filterIndex === -1) {
          currentFilterValues.push(filterValue);
        } else {
          currentFilterValues.splice(filterIndex, 1);
        }

        return {
          ...prevFilters,
          [filterType]: currentFilterValues,
        };
      });
    },
    [setFilters]
  );

  const displayedProducts = useMemo(() => {
    let list: any = [];
    if (view === 'Likes') {
      list = likesQuery.data;
    } else if (view === 'History') {
      list = historyQuery.data;
    } else {
      list = purchasesQuery.data;
    }

    return list;
  }, [view, likesQuery.data, historyQuery.data, purchasesQuery.data, choice]);

  const choices: Filters = {
    view: ['Likes', 'History', 'Purchases', 'New List'],
  };

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
            onPress={() => setShowFilter(!showFilter)}
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
          filters={filters}
          setFilters={setFilters}
          showFilter={showFilter}
          handleFilterSelection={handleFilterSelection}
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
              <RefreshControl
                refreshing={
                  likesQuery.isFetching ||
                  historyQuery.isFetching ||
                  purchasesQuery.isFetching
                }
                onRefresh={() => {
                  Promise.all([
                    likesQuery.refetch(),
                    historyQuery.refetch(),
                    purchasesQuery.refetch(),
                  ]);
                }}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </Box>
        <SheetModal
          bottomSheetModalRef={bottomSheetModalRef}
          choices={choices}
          outerChoice="view"
          handleFilterSelection={handleFilterSelection}
          filters={filters}
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

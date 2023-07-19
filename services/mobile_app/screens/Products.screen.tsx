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
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { fetchProducts } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Filters, UserProduct } from '../utils/types';
import SheetModal from '../components/SheetModal';
import Filter from '../components/Filter';

export default function Products({ navigation }: { navigation: any }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({ view: ['likes'] });

  const { user } = useUser();

  const productsQuery = useQuery({
    queryKey: ['products', user?.id, filters],
    queryFn: () => fetchProducts(user?.id as string, filters),
    enabled: !!user?.id,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const pasteLinkSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentPasteLinkSheetPress = useCallback(() => {
    pasteLinkSheetRef.current?.present();
  }, []);

  const handleFilterSelection = useCallback(
    (
      filterType: 'view' | 'category' | 'website' | 'brand',
      filterValue: string
    ) => {
      setFilters((prevFilters) => {
        if (filterType === 'view') {
          // we only allow single selection for the view
          return {
            ...prevFilters,
            [filterType]: [filterValue],
          };
        }

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
    let list = productsQuery.data || [];
    return list;
  }, [productsQuery.data]);

  const viewChoices: Filters = {
    view: ['likes', 'history', 'purchases', 'New List'],
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
          <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
            <Ionicons
              name={showFilter ? 'options' : 'options-outline'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
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
              {filters['view']?.[0] || 'likes'}
            </Text>
            <Ionicons name="chevron-down" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePresentPasteLinkSheetPress}>
            <Ionicons name="link" size={24} color="black" />
          </TouchableOpacity>
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
                refreshing={productsQuery.isFetching}
                onRefresh={() => {
                  productsQuery.refetch();
                }}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </Box>
        <SheetModal
          bottomSheetModalRef={bottomSheetModalRef}
          choices={viewChoices}
          outerChoice="view"
          handleFilterSelection={handleFilterSelection}
          filters={filters}
        />
        <PasteLinkSheet pasteLinkSheetRef={pasteLinkSheetRef} />
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

type PasteLinkSheetProps = {
  pasteLinkSheetRef: React.RefObject<BottomSheetModal>;
};

function PasteLinkSheet({ pasteLinkSheetRef }: PasteLinkSheetProps) {
  const snapPoints = useMemo(() => ['45%', '100%'], []);

  return (
    <BottomSheetModal
      ref={pasteLinkSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      <Box flex={1}>
        <Text>Hey</Text>
      </Box>
    </BottomSheetModal>
  );
}

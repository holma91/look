import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import React, { useCallback, useMemo, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { HoldItem } from 'react-native-hold-menu';

import { fetchProducts } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FilterType, OuterChoiceFilterType, UserProduct } from '../utils/types';
import Filter from '../components/Filter';
import { capitalizeFirstLetter } from '../utils/helpers';
import { ProductBig, ProductSmall } from '../components/Product';
import { PasteLinkSheet } from '../components/PasteLinkSheet';
import { useNavigation } from '@react-navigation/native';

type ProductsProps = {
  navigation: any;
  selectMode: boolean;
  setSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Products({
  navigation,
  selectMode,
  setSelectMode,
}: ProductsProps) {
  const [filter, setFilter] = useState<FilterType>({ list: ['likes'] });

  const { user } = useUser();

  const productsQuery = useQuery({
    queryKey: ['products', user?.id, filter],
    queryFn: () => fetchProducts(user?.id as string, filter),
    enabled: !!user?.id,
  });

  const displayedProducts = useMemo(() => {
    let list = productsQuery.data || [];
    return list;
  }, [productsQuery.data]);

  if (selectMode) {
    // so, stuff here should be selectable
    return (
      <SelectMode
        selectMode={selectMode}
        setSelectMode={setSelectMode}
        productsQuery={productsQuery}
        displayedProducts={displayedProducts}
      />
    );
  }

  return (
    <NormalMode
      navigation={navigation}
      filter={filter}
      setFilter={setFilter}
      selectMode={selectMode}
      setSelectMode={setSelectMode}
    >
      <Box flex={1} paddingHorizontal="xs">
        <FlatList
          data={displayedProducts?.slice().reverse()}
          numColumns={2}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <ProductBig
              navigation={navigation}
              product={item}
              filter={filter}
            />
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
    </NormalMode>
  );
}

type NormalModeProps = {
  navigation: any;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  selectMode: boolean;
  setSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

function NormalMode({
  navigation,
  filter,
  setFilter,
  selectMode,
  setSelectMode,
  children,
}: NormalModeProps) {
  const [outerChoice, setOuterChoice] =
    useState<OuterChoiceFilterType>('brand');
  const [showFilter, setShowFilter] = useState(false);
  const [sheetNavStack, setSheetNavStack] = useState<OuterChoiceFilterType[]>(
    []
  );
  const MenuList = [
    {
      text: 'Upload', // + Math.floor(Math.random() * 1000).toString(),
      icon: () => <Ionicons name="link" size={18} />,
      onPress: () => {
        console.log('upload!');

        handlePresentPasteLinkSheetPress();
      },
    },
    {
      text: 'New list',
      icon: () => <Ionicons name="add" size={18} />,
      onPress: () => {
        newListSheetModalRef.current?.present();
      },
    },
    {
      text: 'Select',
      icon: () => <Ionicons name="checkmark" size={18} />,
      onPress: () => {
        // toggle something that changes the screen to select mode
        console.log('set select mode');
        setSelectMode((prev) => !prev);
      },
    },
    {
      text: 'Delete',
      icon: () => <Ionicons name="remove" size={18} />,
      isDestructive: true,
      onPress: () => {},
    },
  ];

  const pasteLinkSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentPasteLinkSheetPress = useCallback(() => {
    pasteLinkSheetRef.current?.present();
  }, []);

  const handleFilterSelection = useCallback(
    (filterType: OuterChoiceFilterType, filterValue: string) => {
      setFilter((prevFilter) => {
        if (filterType === 'list') {
          // we only allow single selection for the view
          return {
            ...prevFilter,
            [filterType]: [filterValue],
          };
        }

        const currentFilterValues = [...(prevFilter[filterType] || [])];
        const filterIndex = currentFilterValues.indexOf(filterValue);

        if (filterIndex === -1) {
          currentFilterValues.push(filterValue);
        } else {
          currentFilterValues.splice(filterIndex, 1);
        }

        return {
          ...prevFilter,
          [filterType]: currentFilterValues,
        };
      });
    },
    [setFilter]
  );

  const resetFilter = useCallback(() => {
    setFilter({ list: ['likes'] });
  }, []);

  const filterSheetModalRef = useRef<BottomSheetModal>(null);
  const newListSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentFilterSheetModal = useCallback(
    (label: OuterChoiceFilterType) => {
      setOuterChoice(label);
      setSheetNavStack((prev) => [...prev, label]);

      filterSheetModalRef.current?.present();
    },
    []
  );

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
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
            onPress={() => {
              Haptics.selectionAsync();
              handlePresentFilterSheetModal('list');
            }}
          >
            <Text variant="title" fontSize={18}>
              {capitalizeFirstLetter(filter['list']?.[0] || 'likes')}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="black"
              style={{ paddingTop: 1 }}
            />
          </TouchableOpacity>
          <HoldItem
            items={MenuList}
            activateOn="tap"
            menuAnchorPosition="top-right"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </HoldItem>
        </Box>
        <Filter
          filter={filter}
          setFilter={setFilter}
          resetFilter={resetFilter}
          showFilter={showFilter}
          handleFilterSelection={handleFilterSelection}
          sheetNavStack={sheetNavStack}
          setSheetNavStack={setSheetNavStack}
          newListSheetModalRef={newListSheetModalRef}
          filterSheetModalRef={filterSheetModalRef}
          handlePresentFilterSheetModal={handlePresentFilterSheetModal}
          outerChoice={outerChoice}
          setOuterChoice={setOuterChoice}
        />
        {children}
        <PasteLinkSheet
          navigation={navigation}
          pasteLinkSheetRef={pasteLinkSheetRef}
        />
      </SafeAreaView>
    </Box>
  );
}

type SelectModeProps = {
  selectMode: boolean;
  setSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  productsQuery: UseQueryResult<UserProduct[]>;
  displayedProducts: UserProduct[];
};

function SelectMode({
  selectMode,
  setSelectMode,
  productsQuery,
  displayedProducts,
}: SelectModeProps) {
  const [selectedProducts, setSelectedProducts] = useState<UserProduct[]>([]);

  const handleProductSelection = (
    product: UserProduct,
    isSelected: boolean
  ) => {
    setSelectedProducts((prevProducts) => {
      if (isSelected) {
        if (!prevProducts.includes(product)) {
          return [...prevProducts, product];
        }
      } else {
        return prevProducts.filter((p) => p !== product);
      }

      return prevProducts;
    });
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingTop="s"
          paddingBottom="xs"
          paddingHorizontal="m"
        >
          <Text variant="title">Select products</Text>
          <TouchableOpacity onPress={() => setSelectMode(!selectMode)}>
            <Text variant="body">Stop</Text>
          </TouchableOpacity>
        </Box>
        <Box flex={1} paddingHorizontal="xs">
          <FlatList
            data={displayedProducts?.slice().reverse()}
            numColumns={2}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <ProductSmall
                product={item}
                height={225}
                handleProductSelection={handleProductSelection}
              />
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
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="m"
          paddingVertical="s"
        >
          <TouchableOpacity>
            <Ionicons name="share" size={24} color="black" />
          </TouchableOpacity>
          <Text variant="smallTitle" textAlign="center" paddingVertical="s">
            {selectedProducts.length} products selected
          </Text>
          <Box flexDirection="row" gap="s">
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="black" />
            </TouchableOpacity>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}

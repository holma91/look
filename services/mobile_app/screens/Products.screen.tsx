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
import * as Haptics from 'expo-haptics';
import { HoldItem } from 'react-native-hold-menu';
import { FlashList } from '@shopify/flash-list';

import { fetchProducts } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FilterType, OuterChoiceFilterType, UserProduct } from '../utils/types';
import Filter from '../components/Filter';
import { capitalizeFirstLetter } from '../utils/helpers';
import { ProductBig } from '../components/Product';
import { PasteLinkSheet } from '../components/PasteLinkSheet';

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
  const [selectedProducts, setSelectedProducts] = useState<UserProduct[]>([]);

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          navigation={navigation}
          selectMode={selectMode}
          setSelectMode={setSelectMode}
          setSelectedProducts={setSelectedProducts}
          filter={filter}
          setFilter={setFilter}
        />
        <Content
          navigation={navigation}
          selectMode={selectMode}
          filter={filter}
          setSelectedProducts={setSelectedProducts}
        />
        <Footer selectMode={selectMode} selectedProducts={selectedProducts} />
      </SafeAreaView>
    </Box>
  );
}

type ContentProps = {
  navigation: any;
  selectMode: boolean;
  filter: FilterType;
  setSelectedProducts: React.Dispatch<React.SetStateAction<UserProduct[]>>;
};

function Content({
  navigation,
  selectMode,
  filter,
  setSelectedProducts,
}: ContentProps) {
  const { user } = useUser();

  const productsQuery = useQuery({
    queryKey: ['products', user?.id, filter],
    queryFn: () => fetchProducts(user?.id as string, filter),
    enabled: !!user?.id,
  });

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
    <Box flex={1} paddingHorizontal="xs">
      <FlatList
        data={productsQuery.data?.slice().reverse() || []}
        numColumns={2}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <ProductBig
            navigation={navigation}
            product={item}
            filter={filter}
            selectMode={selectMode}
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
        // estimatedItemSize={310}
      />
    </Box>
  );
}

type HeaderProps = {
  navigation: any;
  selectMode: boolean;
  setSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<UserProduct[]>>;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

function Header({
  navigation,
  selectMode,
  setSelectMode,
  setSelectedProducts,
  filter,
  setFilter,
}: HeaderProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [outerChoice, setOuterChoice] =
    useState<OuterChoiceFilterType>('brand');
  const [sheetNavStack, setSheetNavStack] = useState<OuterChoiceFilterType[]>(
    []
  );

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

  const handleStopSelecting = () => {
    console.log('stop selecting');
    setSelectMode(false);
    setSelectedProducts([]);
  };

  const handlePresentFilterSheetModal = useCallback(
    (label: OuterChoiceFilterType) => {
      setOuterChoice(label);
      setSheetNavStack((prev) => [...prev, label]);

      filterSheetModalRef.current?.present();
    },
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

  const filterSheetModalRef = useRef<BottomSheetModal>(null);
  const newListSheetModalRef = useRef<BottomSheetModal>(null);
  const pasteLinkSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentPasteLinkSheetPress = useCallback(() => {
    pasteLinkSheetRef.current?.present();
  }, []);

  if (selectMode) {
    return (
      <Box
        flexDirection="row"
        justifyContent="space-between"
        paddingTop="s"
        paddingBottom="xs"
        paddingHorizontal="m"
      >
        <Text variant="title">Select products</Text>
        <TouchableOpacity onPress={handleStopSelecting}>
          <Text variant="body">Stop</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  return (
    <>
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
      <PasteLinkSheet
        navigation={navigation}
        pasteLinkSheetRef={pasteLinkSheetRef}
      />
    </>
  );
}

type FooterProps = {
  selectMode: boolean;
  selectedProducts: UserProduct[];
};

function Footer({ selectMode, selectedProducts }: FooterProps) {
  const handleShareProducts = async () => {
    // do something to share the selected products
  };

  const handleTrashProducts = async () => {
    // throw up an action sheet that lets you delete the selected products
  };

  const handleAddProducts = async () => {
    // throw up a pretty advanced sheet that lets you choose a list to add to : TODO
  };

  if (selectMode) {
    return (
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="s"
        position="relative"
      >
        <TouchableOpacity
          onPress={handleShareProducts}
          style={{ position: 'absolute', left: 20 }}
        >
          <Ionicons name="share-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text variant="smallTitle" textAlign="center" paddingVertical="s">
          {selectedProducts.length} products selected
        </Text>
        <Box flexDirection="row" gap="m" position="absolute" right={20}>
          <TouchableOpacity onPress={handleTrashProducts}>
            <Ionicons name="trash-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddProducts}>
            <Ionicons name="albums-outline" size={24} color="black" />
          </TouchableOpacity>
        </Box>
      </Box>
    );
  }

  return null;
}

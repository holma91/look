import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import React, { useCallback, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { HoldItem } from 'react-native-hold-menu';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Box, Text } from '../styling/RestylePrimitives';
import { FilterType, OuterChoiceFilterType, UserProduct } from '../utils/types';
import Filter from '../components/Filter';
import { capitalizeFirstLetter } from '../utils/helpers';
import { ProductBig } from '../components/Product';
import { PasteLinkSheetModal } from '../components/sheets/PasteLinkSheetModal';
import { useDeleteProductsMutation } from '../hooks/mutations/useDeleteProductsMutation';
import { useLikeProductsMutation } from '../hooks/mutations/useLikeProductsMutation';
import ThemedIcon from '../components/ThemedIcon';
import { AddProductsSheetModal } from '../components/sheets/AddProductsSheetModal';
import { useProductsQuery } from '../hooks/queries/useProductsQuery';

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

  const resetSelection = () => {
    setSelectedProducts([]);
    setSelectMode(false);
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          navigation={navigation}
          selectMode={selectMode}
          setSelectMode={setSelectMode}
          resetSelection={resetSelection}
          setSelectedProducts={setSelectedProducts}
          filter={filter}
          setFilter={setFilter}
          handleFilterSelection={handleFilterSelection}
        />
        <Content
          navigation={navigation}
          selectMode={selectMode}
          filter={filter}
          setSelectedProducts={setSelectedProducts}
        />
        <Footer
          selectMode={selectMode}
          resetSelection={resetSelection}
          selectedProducts={selectedProducts}
          handleFilterSelection={handleFilterSelection}
          filter={filter}
        />
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
  const productsQuery = useProductsQuery(filter);

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

  // console.log('productsQuery', productsQuery.data);

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
  resetSelection: () => void;
  setSelectedProducts: React.Dispatch<React.SetStateAction<UserProduct[]>>;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
};

function Header({
  navigation,
  selectMode,
  setSelectMode,
  resetSelection,
  setSelectedProducts,
  filter,
  setFilter,
  handleFilterSelection,
}: HeaderProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [outerChoice, setOuterChoice] =
    useState<OuterChoiceFilterType>('brand');
  const [sheetNavStack, setSheetNavStack] = useState<OuterChoiceFilterType[]>(
    []
  );

  const resetFilter = useCallback(() => {
    setFilter({ list: ['likes'] });
  }, []);

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
      icon: () => <ThemedIcon name="link" size={18} />,
      onPress: () => {
        console.log('upload!');

        handlePresentPasteLinkSheetPress();
      },
    },
    {
      text: 'New list',
      icon: () => <ThemedIcon name="add" size={18} />,
      onPress: () => {
        newListSheetModalRef.current?.present();
      },
    },
    {
      text: 'Select',
      icon: () => <ThemedIcon name="checkmark" size={18} />,
      onPress: () => {
        // toggle something that changes the screen to select mode
        console.log('set select mode');
        setSelectMode((prev) => !prev);
      },
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
        <TouchableOpacity onPress={resetSelection}>
          <Text variant="body">Cancel</Text>
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
          <ThemedIcon
            name={showFilter ? 'options' : 'options-outline'}
            size={24}
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
          <ThemedIcon name="chevron-down" size={20} style={{ paddingTop: 1 }} />
        </TouchableOpacity>
        <HoldItem
          items={MenuList}
          activateOn="tap"
          menuAnchorPosition="top-right"
        >
          <ThemedIcon name="ellipsis-horizontal" size={24} />
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
      <PasteLinkSheetModal
        navigation={navigation}
        pasteLinkSheetRef={pasteLinkSheetRef}
      />
    </>
  );
}

type FooterProps = {
  selectMode: boolean;
  resetSelection: () => void;
  selectedProducts: UserProduct[];
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filter: FilterType;
};

function Footer({
  selectMode,
  resetSelection,
  selectedProducts,
  handleFilterSelection,
  filter,
}: FooterProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const addProductsSheetRef = useRef<BottomSheetModal>(null);
  const deleteProductsMutation = useDeleteProductsMutation(filter);
  const likeProductsMutation = useLikeProductsMutation(filter);

  const listId = filter?.list && filter.list[0];

  const handleShareProducts = async () => {
    // do something to share the selected products
  };

  const handleDeleteProducts = () => {
    const options = [
      listId === 'likes' ? 'Unlike products' : `Delete from ${listId}`,
      'Cancel',
    ];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    const message = 'Are you sure you want to delete these products?';

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        message,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 1:
            // Save
            break;
          case destructiveButtonIndex:
            if (listId === 'likes') {
              likeProductsMutation.mutate({
                products: selectedProducts,
                like: false,
              });
            } else {
              deleteProductsMutation.mutate(selectedProducts);
            }
            resetSelection();
            break;
          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  const handleAddProducts = async () => {
    addProductsSheetRef.current?.present();
  };

  if (selectMode) {
    return (
      <>
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
            <ThemedIcon name="share-outline" size={24} />
          </TouchableOpacity>
          <Text variant="smallTitle" textAlign="center" paddingVertical="s">
            {selectedProducts.length} products selected
          </Text>
          <Box flexDirection="row" gap="m" position="absolute" right={20}>
            <TouchableOpacity onPress={handleDeleteProducts}>
              <ThemedIcon
                name={listId === 'likes' ? 'heart' : 'trash-outline'}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddProducts}>
              <ThemedIcon name="albums-outline" size={24} />
            </TouchableOpacity>
          </Box>
        </Box>
        <AddProductsSheetModal
          addProductsSheetRef={addProductsSheetRef}
          selectedProducts={selectedProducts}
          handleFilterSelection={handleFilterSelection}
          resetSelection={resetSelection}
          filter={filter}
        />
      </>
    );
  }

  return null;
}

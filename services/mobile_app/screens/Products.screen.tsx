import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import React, { useCallback, useMemo, useRef } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { HoldItem } from 'react-native-hold-menu';
import { FlashList } from '@shopify/flash-list';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import { fetchPlists, fetchProducts } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FilterType, OuterChoiceFilterType, UserProduct } from '../utils/types';
import Filter from '../components/Filter';
import { capitalizeFirstLetter } from '../utils/helpers';
import { ProductBig } from '../components/Product';
import { PasteLinkSheet } from '../components/PasteLinkSheet';
import { AddToListButton, PrimaryButton } from '../components/Button';
import { useDeleteProductsMutation } from '../hooks/useDeleteProductsMutation';
import { useAddProductsMutation } from '../hooks/useAddProductsMutation';
import { useLikeProductsMutation } from '../hooks/useLikeProductsMutation';
import ThemedIcon from '../components/ThemedIcon';

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
      <PasteLinkSheet
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
        <AddProductsSheet
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

type AddProductsSheetProps = {
  addProductsSheetRef: React.RefObject<BottomSheetModal>;
  selectedProducts: UserProduct[];
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  resetSelection: () => void;
  filter: FilterType;
};

function AddProductsSheet({
  addProductsSheetRef,
  selectedProducts,
  handleFilterSelection,
  resetSelection,
  filter,
}: AddProductsSheetProps) {
  const snapPoints = useMemo(() => ['85%'], []);

  const { user } = useUser();

  const addProductsMutation = useAddProductsMutation();
  const likeProductsMutation = useLikeProductsMutation(filter);

  const listId = filter?.list && filter.list[0];

  const { data: plists } = useQuery<string[]>({
    queryKey: ['plists', user?.id],
    queryFn: () => fetchPlists(user?.id as string),
    enabled: !!user?.id,
    select: (data) =>
      data.map((plist: any) => plist.id).filter((id) => id !== listId),
  });

  const handleAddToList = async (listId: string) => {
    console.log('add to list', listId);
    if (listId === 'likes') {
      likeProductsMutation.mutate({ products: selectedProducts, like: true });
    } else {
      addProductsMutation.mutate({ products: selectedProducts, listId });
    }
    addProductsSheetRef?.current?.close();
    handleFilterSelection('list', listId);
    resetSelection();
  };

  const handleCreateAndAddToList = async () => {
    console.log('create and add to list');
    // just go to new list sheet
  };

  return (
    <BottomSheetModal
      ref={addProductsSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      <Box flex={1} paddingHorizontal="m">
        <Box
          justifyContent="center"
          alignItems="center"
          marginBottom="m"
          position="relative"
        >
          <Box flexDirection="row" gap="s">
            <Text variant="smallTitle">Add to list</Text>
          </Box>
          <TouchableOpacity
            onPress={() => {
              addProductsSheetRef?.current?.close();
            }}
            style={{
              position: 'absolute',
              right: 5,
            }}
          >
            <ThemedIcon name="close" size={24} />
          </TouchableOpacity>
        </Box>
        <Box flexDirection="row" marginVertical="s" alignItems="center" gap="m">
          <ThemedIcon name="folder" size={34} />
          <Text variant="body" fontWeight="600">
            {selectedProducts.length} products
          </Text>
        </Box>
        <Box paddingTop="sm" gap="s">
          <Box
            height={150}
            width={150}
            justifyContent="center"
            alignItems="center"
            backgroundColor="gray6"
          >
            <TouchableOpacity onPress={handleCreateAndAddToList}>
              <Ionicons name="add" size={40} color="#8E8E93" />
            </TouchableOpacity>
          </Box>
          <Text>New list...</Text>
        </Box>
        <Box paddingTop="xl" flex={1}>
          <Text variant="smallTitle" paddingBottom="m">
            My Lists
          </Text>
          <FlatList
            data={['likes'].concat(plists ?? [])}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 10, paddingBottom: 32 }}
            renderItem={({ item }) => (
              <AddToListButton
                onPress={() => handleAddToList(item)}
                label={item}
                item={item}
                isSelected={false}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </Box>
      </Box>
    </BottomSheetModal>
  );
}

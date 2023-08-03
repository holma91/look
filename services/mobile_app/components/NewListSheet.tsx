import React, { useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { OuterChoiceFilterType, UserProduct } from '../utils/types';
import { PrimaryButton } from './Button';
import { TextInput, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { createPlist, fetchProducts } from '../api';
import { ProductSmall } from './Product';

type NewListSheetProps = {
  newListSheetModalRef: React.RefObject<BottomSheetModal>;
  filterSheetModalRef: React.RefObject<BottomSheetModal>;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
};

export function NewListSheet({
  newListSheetModalRef,
  filterSheetModalRef,
  handleFilterSelection,
}: NewListSheetProps) {
  const [listName, setListName] = useState('New List');
  const [selectedProducts, setSelectedProducts] = useState<UserProduct[]>([]);
  const { user } = useUser();

  const { data: history } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: () => fetchProducts(user?.id as string, { list: ['history'] }),
    enabled: !!user?.id,
  });

  const queryClient = useQueryClient();

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

  const handleCreateList = async () => {
    newListSheetModalRef?.current?.close();
    const listId = listName.toLowerCase();
    const userId = user?.id;

    if (!userId) return;

    try {
      await createPlist(userId, listId, selectedProducts);
      queryClient.invalidateQueries({ queryKey: ['plists', userId] });
      handleFilterSelection('list', listId);
      filterSheetModalRef?.current?.dismiss();
    } catch (e) {
      console.error(e);
    }
  };

  console.log('selectedProducts:', selectedProducts.length);

  return (
    <Box flex={1}>
      <Box
        justifyContent="center"
        alignItems="center"
        marginBottom="m"
        position="relative"
      >
        <Box flexDirection="row" gap="s">
          <TextInput
            style={{ fontSize: 22, fontWeight: 'bold' }} // Replace this with your preferred styles
            onChangeText={(text) => setListName(text)}
            value={listName}
            selectTextOnFocus
          />
          <Ionicons name="pencil" size={22} color="black" />
        </Box>
        <TouchableOpacity
          onPress={() => {
            newListSheetModalRef?.current?.close();
          }}
          style={{
            position: 'absolute',
            right: 15,
          }}
        >
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </Box>
      <Box
        marginTop="s"
        marginBottom="xl"
        marginHorizontal="m"
        gap="l"
        justifyContent="space-between"
        flex={1}
      >
        <Text variant="smallTitle" textAlign="center">
          Do you want to add any of your products to your new list?
        </Text>
        <FlashList
          data={history || []}
          renderItem={({ item }) => (
            <ProductSmall
              product={item}
              height={150}
              handleProductSelection={handleProductSelection}
            />
          )}
          estimatedItemSize={200}
          numColumns={3}
        />
        <PrimaryButton label="Create list" onPress={handleCreateList} />
      </Box>
    </Box>
  );
}

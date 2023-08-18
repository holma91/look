import React, { useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';

import { Box, Text } from '../../styling/RestylePrimitives';
import { OuterChoiceFilterType, UserProduct } from '../../utils/types';
import { PrimaryButton } from '../Button';
import { TextInput, TouchableOpacity } from 'react-native';
import { useFirebaseUser } from '../../hooks/useFirebaseUser';
import { createPlist } from '../../api';
import { ProductSmall } from '../Product';
import { useProductsQuery } from '../../hooks/queries/useProductsQuery';
import { useCreatePListMutation } from '../../hooks/mutations/useCreatePListMutation';

type NewListSheetModalProps = {
  newListSheetModalRef: React.RefObject<BottomSheetModal>;
  filterSheetModalRef: React.RefObject<BottomSheetModal>;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
};

export function NewListSheetModal({
  newListSheetModalRef,
  filterSheetModalRef,
  handleFilterSelection,
}: NewListSheetModalProps) {
  const [listName, setListName] = useState('New List');
  const [selectedProducts, setSelectedProducts] = useState<UserProduct[]>([]);
  const { user } = useFirebaseUser();

  const { data: products } = useProductsQuery({ list: ['history'] });
  const createPlistMutation = useCreatePListMutation();

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
    const userId = user?.uid;

    if (!userId) return;

    try {
      // await createPlist(userId, listId, selectedProducts);
      // queryClient.invalidateQueries({ queryKey: ['plists', userId] });
      createPlistMutation.mutate({
        listId: listId,
        products: selectedProducts,
      });
      handleFilterSelection('list', listId);
      filterSheetModalRef?.current?.dismiss();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BottomSheetModal
      ref={newListSheetModalRef}
      snapPoints={['65%']}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
    >
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
            data={products ?? []}
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
    </BottomSheetModal>
  );
}

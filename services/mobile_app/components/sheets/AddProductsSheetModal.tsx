import { FlatList, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Box, Text } from '../../styling/RestylePrimitives';
import {
  FilterType,
  OuterChoiceFilterType,
  UserProduct,
} from '../../utils/types';
import { AddToListButton } from '../../components/Button';
import { useAddProductsMutation } from '../../hooks/mutations/useAddProductsMutation';
import { useLikeProductsMutation } from '../../hooks/mutations/useLikeProductsMutation';
import ThemedIcon from '../../components/ThemedIcon';
import { useTheme } from '@shopify/restyle';
import { usePlistsQuery } from '../../hooks/queries/usePlistsQuery';

type AddProductsSheetModalProps = {
  addProductsSheetRef: React.RefObject<BottomSheetModal>;
  selectedProducts: UserProduct[];
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  resetSelection: () => void;
  filter: FilterType;
};

export function AddProductsSheetModal({
  addProductsSheetRef,
  selectedProducts,
  handleFilterSelection,
  resetSelection,
  filter,
}: AddProductsSheetModalProps) {
  const snapPoints = useMemo(() => ['85%'], []);
  const theme = useTheme();

  const addProductsMutation = useAddProductsMutation();
  const likeProductsMutation = useLikeProductsMutation(filter);

  const listId = filter?.list && filter.list[0];

  const { data: plists } = usePlistsQuery();

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
      handleIndicatorStyle={{ backgroundColor: theme.colors.background }}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
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
            data={['likes'].concat(
              plists?.map((plist) => plist.id).filter((id) => id !== listId) ??
                []
            )}
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

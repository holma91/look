import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Button } from './Buttons';
import { Filters } from '../utils/types';

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: 'view' | 'category' | 'website' | 'brand';
  handleFilterSelection: (
    filterType: 'view' | 'category' | 'website' | 'brand',
    filterValue: string
  ) => void;
  filters: Filters;
};

export default function SheetModal({
  bottomSheetModalRef,
  choices,
  outerChoice,
  handleFilterSelection,
  filters,
}: SheetModalProps) {
  const snapPoints = useMemo(() => ['50%'], []);

  const renderListItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = filters[outerChoice]?.includes(item);

      return (
        <Button
          onPress={() => {
            handleFilterSelection(outerChoice, item);
          }}
          variant="new"
          backgroundColor={isSelected ? 'text' : 'grey'}
          margin="xs"
        >
          <Text
            variant="body"
            fontWeight="bold"
            fontSize={16}
            color={isSelected ? 'background' : 'text'}
          >
            {item}
          </Text>
          {isSelected ? (
            <Ionicons name="checkmark" size={20} color="white" />
          ) : null}
          {item === 'New List' ? (
            <Ionicons name="add" size={20} color="black" />
          ) : null}
        </Button>
      );
    },
    [outerChoice, filters, handleFilterSelection]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
    >
      <Box justifyContent="center" alignItems="center" marginBottom="m">
        <Text variant="title" fontSize={22}>
          {outerChoice}
        </Text>
      </Box>
      <BottomSheetFlatList
        data={choices[outerChoice]}
        renderItem={renderListItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ backgroundColor: 'white' }}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheetModal>
  );
}

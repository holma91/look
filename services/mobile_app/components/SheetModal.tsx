import React, { useCallback, useMemo, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Filters, OuterChoiceFilterType } from '../utils/types';
import { PrimaryButton, SecondaryButton, FilterListButton } from './Button';

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: OuterChoiceFilterType;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filters: Filters;
};

export default function SheetModal({
  bottomSheetModalRef,
  choices,
  outerChoice,
  handleFilterSelection,
  resetFilter,
  filters,
}: SheetModalProps) {
  const snapPoints = useMemo(() => ['65%'], []);

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
      <BottomSheetContent
        bottomSheetModalRef={bottomSheetModalRef}
        choices={choices}
        outerChoice={outerChoice}
        resetFilter={resetFilter}
        handleFilterSelection={handleFilterSelection}
        filters={filters}
      />
    </BottomSheetModal>
  );
}

type BottomSheetContentProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: OuterChoiceFilterType;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filters: Filters;
};

function BottomSheetContent({
  outerChoice,
  choices,
  filters,
  handleFilterSelection,
  resetFilter,
  bottomSheetModalRef,
}: BottomSheetContentProps) {
  const renderListItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = filters[outerChoice]?.includes(item);

      return (
        <FilterListButton
          label={item}
          onPress={() => {
            handleFilterSelection(outerChoice, item);
          }}
          isSelected={isSelected || false}
          item={item}
        />
      );
    },
    [outerChoice, filters, handleFilterSelection]
  );

  // here we wanna do different shit depending on the values
  // implement a super basic nav system

  return (
    <>
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

      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        marginBottom="xl"
        gap="s"
        paddingTop="m"
        paddingHorizontal="m"
      >
        <SecondaryButton
          label="Reset"
          flex={1}
          onPress={() => {
            resetFilter();
            bottomSheetModalRef?.current?.close();
          }}
        />

        <PrimaryButton
          label="Done"
          flex={1}
          onPress={() => {
            bottomSheetModalRef?.current?.close();
          }}
        />
      </Box>
    </>
  );
}

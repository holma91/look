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
  setOuterChoice?: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
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
  setOuterChoice,
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
        setOuterChoice={setOuterChoice}
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
  setOuterChoice?: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filters: Filters;
};

function BottomSheetContent({
  outerChoice,
  setOuterChoice,
  choices,
  filters,
  handleFilterSelection,
  resetFilter,
  bottomSheetModalRef,
}: BottomSheetContentProps) {
  // I want this to be different depending on the outerChoice
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

  console.log('outerChoice:', outerChoice);
  console.log('choices:', choices);

  const relevantChoices = choices[outerChoice];

  // if all we show this

  // if brand we show that

  return (
    <>
      <Box justifyContent="center" alignItems="center" marginBottom="m">
        <Text variant="title" fontSize={22}>
          {outerChoice}
        </Text>
      </Box>
      {outerChoice === 'all' ? (
        <AllList
          bottomSheetModalRef={bottomSheetModalRef}
          choices={choices}
          outerChoice={outerChoice}
          setOuterChoice={setOuterChoice}
          resetFilter={resetFilter}
          handleFilterSelection={handleFilterSelection}
          filters={filters}
        />
      ) : (
        <BottomSheetFlatList
          data={relevantChoices}
          renderItem={renderListItem}
          keyExtractor={(item) => item}
          contentContainerStyle={{ backgroundColor: 'white' }}
          style={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}

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

function AllList({
  outerChoice,
  setOuterChoice,
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
            // handleFilterSelection(outerChoice, item);
            console.log('setOuterChoice:', setOuterChoice);
            console.log('item:', item);

            setOuterChoice?.(item as OuterChoiceFilterType);
          }}
          isSelected={isSelected || false}
          item={item}
        />
      );
    },
    [outerChoice, filters, handleFilterSelection]
  );

  console.log('outerChoice:', outerChoice);
  console.log('choices:', choices);

  const relevantChoices = choices[outerChoice];
  return (
    <BottomSheetFlatList
      data={relevantChoices}
      renderItem={renderListItem}
      keyExtractor={(item) => item}
      contentContainerStyle={{ backgroundColor: 'white' }}
      style={{ paddingHorizontal: 10 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
